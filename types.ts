export interface WordEntry {
  word: string;
  translation: string;
  explanation: string;
  phonetic: string;
  sentence: string;
  sentenceHe: string;
  category?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Story {
  id: string;
  title: string;
  titleHe: string;
  author: string;
  level: 'A1 - מתחילים' | 'A2 - בסיסי' | 'B1 - בינוני';
  coverImage: string;
  descriptionHe: string;
  content: string; // Spanish text with paragraphs separated by \n\n
  paragraphs: {
    spanish: string;
    hebrew: string;
  }[];
  quiz: QuizQuestion[];
}

export interface LearnedWord {
  word: string;
  translation: string;
  status: 'known' | 'learning';
  dateAdded: string;
  phonetic?: string;
  sentence?: string;
  sentenceHe?: string;
}
