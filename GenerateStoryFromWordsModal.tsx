import React, { useState } from 'react';
import {
  Sparkles,
  X,
  BookOpen,
  CheckSquare,
  Square,
  Wand2,
  Loader2,
  AlertCircle,
  Flame,
  Check
} from 'lucide-react';
import { LearnedWord, Story } from '../types';

interface GenerateStoryFromWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnedWords: Record<string, LearnedWord>;
  onStoryCreated: (story: Story) => void;
}

export const GenerateStoryFromWordsModal: React.FC<GenerateStoryFromWordsModalProps> = ({
  isOpen,
  onClose,
  learnedWords,
  onStoryCreated,
}) => {
  // Only words in 'learning' or words that the user struggled with
  const learningList = Object.values(learnedWords).filter(
    (w) => w.status === 'learning'
  );
  // If none in learning, fallback to all words
  const candidateWords =
    learningList.length > 0 ? learningList : Object.values(learnedWords);

  const [selectedWordKeys, setSelectedWordKeys] = useState<string[]>(() =>
    candidateWords.map((w) => w.word)
  );
  const [genre, setGenre] = useState<string>('חיי יומיום והרפתקה');
  const [level, setLevel] = useState<'A1 - מתחילים' | 'A2 - בסיסי' | 'B1 - בינוני'>('A1 - מתחילים');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleWord = (word: string) => {
    setSelectedWordKeys((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleSelectAll = () => {
    if (selectedWordKeys.length === candidateWords.length) {
      setSelectedWordKeys([]);
    } else {
      setSelectedWordKeys(candidateWords.map((w) => w.word));
    }
  };

  const handleGenerate = async () => {
    if (selectedWordKeys.length === 0) {
      setError('אנא בחר לפחות מילה אחת ליצירת הסיפור');
      return;
    }

    setIsLoading(true);
    setError(null);

    const wordsPayload = selectedWordKeys.map((wKey) => {
      const match = learnedWords[wKey.toLowerCase()] || learnedWords[wKey];
      return {
        word: wKey,
        translation: match?.translation || '',
      };
    });

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: wordsPayload,
          genre,
          level,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.paragraphs) {
        throw new Error(data.error || 'שגיאה ביצירת הסיפור');
      }

      // Pick an appropriate cover image from our existing generated artwork
      const coverImages = [
        '/src/assets/images/cover_maria_farm_1792007358059.jpg',
        '/src/assets/images/cover_el_principito_1792007357705.jpg',
        '/src/assets/images/cover_animal_farm_1792007357182.jpg',
        '/src/assets/images/cover_don_quijote_1792007357483.jpg',
      ];
      const randomCover = coverImages[Math.floor(Math.random() * coverImages.length)];

      const fullContent = data.paragraphs
        .map((p: any) => p.spanish)
        .join('\n\n');

      const newStory: Story = {
        id: `ai-story-${Date.now()}`,
        title: data.title || 'Mi Nueva Historia',
        titleHe: data.titleHe || 'סיפור מותאם אישית',
        author: 'נוצר במיוחד עבורך עם AI',
        level: level,
        coverImage: randomCover,
        descriptionHe:
          data.descriptionHe ||
          `סיפור אישי המתרגל את המילים: ${selectedWordKeys.slice(0, 4).join(', ')}...`,
        content: fullContent,
        paragraphs: data.paragraphs,
        quiz: data.quiz || [
          {
            question: 'האם הבנת את משמעות המילים החדשות בסיפור?',
            options: ['כן, בבירור', 'בחלוקה חלקית', 'נדרשת חזרה נוספת', 'טקסט מעניין'],
            answer: 0,
            explanation: 'הסיפור נוצר על מנת לחזק את המילים שבחרת.',
          },
        ],
      };

      onStoryCreated(newStory);
      onClose();
    } catch (err: any) {
      console.error('Error generating story:', err);
      setError(err?.message || 'שגיאה ביצירת הסיפור. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  const genres = [
    'חיי יומיום והרפתקה',
    'בית קפה ואוכל בספרד',
    'טבע ובעלי חיים',
    'תעלומה ובלשים',
    'טיול בעיר מדריד',
  ];

  const levels = [
    'A1 - מתחילים',
    'A2 - בסיסי',
    'B1 - בינוני',
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in zoom-in-95 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                צור סיפור חדש מהמילים שלא הבנתי
              </h3>
              <p className="text-[11px] text-slate-500">
                ה-AI יכתוב סיפור מקורי השוזר בתוכו בדיוק את המילים שבחרת
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-800">
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Choose Words */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>בחר את המילים שתרצה לשלב בסיפור:</span>
                <span className="text-indigo-600">
                  ({selectedWordKeys.length} מתוך {candidateWords.length})
                </span>
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {selectedWordKeys.length === candidateWords.length
                  ? 'בטל הכל'
                  : 'בחר הכל'}
              </button>
            </div>

            {candidateWords.length === 0 ? (
              <div className="bg-slate-50 p-4 rounded-xl text-center text-xs text-slate-500 border border-slate-200">
                עדיין לא סימנת מילים ללמידה. קרא סיפור ולחץ על מילים שלא הבנת כדי להוסיף אותן!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                {candidateWords.map((item) => {
                  const isChecked = selectedWordKeys.includes(item.word);
                  return (
                    <button
                      key={item.word}
                      type="button"
                      onClick={() => toggleWord(item.word)}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-1.5 text-xs ${
                        isChecked
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-latin text-sm truncate" dir="ltr">
                          {item.word}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {item.translation}
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isChecked ? (
                          <Check className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-sm border border-slate-300" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Story Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              נושא או אווירת הסיפור:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    genre === g
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Difficulty Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              רמת קושי:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold text-center border transition-all ${
                    level === lvl
                      ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            ביטול
          </button>

          <button
            type="button"
            disabled={isLoading || selectedWordKeys.length === 0}
            onClick={handleGenerate}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ה-AI מחבר סיפור...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>צור סיפור חדש עכשיו</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
