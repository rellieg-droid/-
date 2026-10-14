import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '30mb' }));

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('GEMINI_API_KEY is not defined in environment variables.');
}

// POST /api/transcribe - Transcribes audio using model "gemini-3.5-transcribe"
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Missing audioBase64 data' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API is not initialized. Please ensure GEMINI_API_KEY is configured.',
      });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioBase64,
      },
    };

    const promptText = `Please transcribe this audio accurately. If it is spoken in Spanish, output the Spanish transcript, followed by a Hebrew translation and a brief pronunciation tip. Keep the response organized and friendly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [audioPart, { text: promptText }],
      },
    });

    const transcript = response.text || '';
    return res.json({ transcript });
  } catch (err: any) {
    console.error('Transcription error:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to transcribe audio with gemini-3.5-transcribe',
    });
  }
});

// POST /api/translate-word - AI-powered Spanish word and phrase translation for words not in local dictionary
app.post('/api/translate-word', async (req, res) => {
  try {
    const { word, contextSentence } = req.body;
    if (!word) {
      return res.status(400).json({ error: 'Missing word parameter' });
    }

    if (!ai) {
      return res.json({
        word,
        translation: word,
        explanation: 'מילה בספרדית',
        phonetic: word.toLowerCase(),
        sentence: contextSentence || `La palabra "${word}".`,
        sentenceHe: `המילה "${word}".`,
      });
    }

    const prompt = `You are a Spanish-Hebrew language teacher. Analyze this Spanish word or short phrase: "${word}".
Context sentence: "${contextSentence || ''}".
Return ONLY a valid JSON object (no markdown, no backticks) with this structure:
{
  "word": "${word}",
  "translation": "Concise Hebrew translation (e.g. 'חווה' or 'חיה / גר')",
  "explanation": "Short Hebrew grammatical or usage explanation (1-2 sentences in Hebrew)",
  "phonetic": "Simple phonetic pronunciation guide (e.g. 'GRAHN-khah')",
  "sentence": "A natural short Spanish example sentence using this word",
  "sentenceHe": "Hebrew translation of that example sentence"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Word translation error:', err);
    return res.json({
      word: req.body.word,
      translation: req.body.word,
      explanation: 'מילה בספרדית',
      phonetic: req.body.word,
      sentence: req.body.word,
    });
  }
});

// POST /api/generate-story - Generates a new custom Spanish story based on words the user struggled with
app.post('/api/generate-story', async (req, res) => {
  try {
    const { words, genre = 'חיי יומיום והרפתקה', level = 'A1 - מתחילים' } = req.body;

    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one word to practice' });
    }

    const wordsListStr = words
      .map((w: any) => typeof w === 'string' ? w : `${w.word} (${w.translation || ''})`)
      .join(', ');

    if (!ai) {
      // Fallback generator when AI key is unavailable
      const storyTitle = `Aventura con ${words[0]?.word || 'palabras'}`;
      const storyContent = `Un día especial en España, un estudiante descubrió el significado de ${words.map((w: any) => w.word || w).join(', ')}. Con paciencia y alegría, practicó cada palabra en una conversación divertida con amigos locales. Ahora comprende el texto con gran facilidad.`;
      return res.json({
        title: storyTitle,
        titleHe: `הרפתקה עם מילים חדשות`,
        descriptionHe: `סיפור מותאם אישית שנוצר כדי לתרגל את המילים שבחרת.`,
        paragraphs: [
          {
            spanish: storyContent,
            hebrew: `יום מיוחד בספרד שבו תורגלו המילים החדשות בשיחה נעימה. עכשיו ההבנה קלה ומהנה הרבה יותר!`
          }
        ],
        quiz: [
          {
            question: `מהי המטרה של הלימוד בסיפור?`,
            options: [`הבנת המילים החדשות`, `לקנות כרטיס רכבת`, `לבשל ארוחה`, `לרוץ מרתון`],
            answer: 0,
            explanation: `הסיפור נכתב במיוחד כדי לתרגל את המילים שנבחרו.`
          }
        ]
      });
    }

    const prompt = `You are an expert Spanish language educator for Hebrew speakers.
The student has marked the following Spanish words that they did not understand and need to practice:
${wordsListStr}

Please compose an engaging, natural, and encouraging short Spanish story (Level: ${level}, Genre/Theme: ${genre}) that naturally weaves in ALL or most of these specific target words.
The story must be divided into 2 or 3 coherent paragraphs.
For each paragraph, provide the Spanish text and an accurate Hebrew translation.
Also provide 2 or 3 multiple-choice comprehension questions in Hebrew with 4 options and the 0-based correct answer index and explanation.

Return ONLY a valid JSON object (no markdown, no backticks, just raw json):
{
  "title": "Spanish title (e.g. Un Día Inolvidable)",
  "titleHe": "Hebrew title (e.g. יום בלתי נשכח)",
  "descriptionHe": "Brief 1-sentence Hebrew summary mentioning the words practiced",
  "paragraphs": [
    {
      "spanish": "Spanish paragraph containing some of the target words naturally...",
      "hebrew": "תרגום מדויק וטבעי של הפסקה לעברית..."
    }
  ],
  "quiz": [
    {
      "question": "שאלה בעברית על התוכן או על משמעות אחת המילים בסיפור",
      "options": ["תשובה א", "תשובה ב", "תשובה ג", "תשובה ד"],
      "answer": 0,
      "explanation": "הסבר מנומק בעברית"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Story generation error:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate story from words',
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Español 10 server running on http://0.0.0.0:${port}`);
  });
}

startServer();
