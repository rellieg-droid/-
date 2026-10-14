import React from 'react';
import { Volume2, X, Check, BookOpen } from 'lucide-react';
import { WordEntry, LearnedWord } from '../types';
import { speechController } from '../utils/audio';

interface WordModalProps {
  word: WordEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkWord: (status: 'known' | 'learning') => void;
  currentStatus?: 'known' | 'learning';
}

export const WordModal: React.FC<WordModalProps> = ({
  word,
  isOpen,
  onClose,
  onMarkWord,
  currentStatus,
}) => {
  if (!isOpen || !word) return null;

  const handleSpeak = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    speechController.speak(word.word, { rate: 0.85 });
  };

  const handleSpeakSentence = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    speechController.speak(word.sentence, { rate: 0.88 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-slate-100 shadow-2xl transition-all animate-in zoom-in-95 duration-200 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
        dir="ltr"
      >
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-4 pt-3 text-slate-400">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>מילון ספרדית-עברית</span>
            {currentStatus && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  currentStatus === 'known'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentStatus === 'known' ? 'ידוע ✓' : 'בלמידה 📖'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="סגור"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Display Section */}
        <div className="p-5 text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <button
              onClick={handleSpeak}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-indigo-600 shadow-md hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-transform"
              title="השמע מילה"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-extrabold text-slate-900 font-latin tracking-tight">
              {word.word}
            </h3>
          </div>

          <div className="text-xs font-mono text-slate-500 mb-2">
            | {word.phonetic} |
          </div>

          <div
            className="text-xl font-bold text-slate-800 mb-3"
            dir="rtl"
          >
            {word.translation}
          </div>

          {word.explanation && (
            <p
              className="text-xs text-slate-600 mb-4 bg-white/70 p-2.5 rounded-xl text-right leading-relaxed border border-slate-200/60"
              dir="rtl"
            >
              {word.explanation}
            </p>
          )}

          {/* Example Sentence */}
          <div className="bg-white rounded-xl p-3 text-left border border-slate-200/80 mb-1 shadow-xs">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-medium text-slate-800 font-latin leading-snug">
                {word.sentence}
              </p>
              <button
                onClick={handleSpeakSentence}
                className="shrink-0 p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                title="השמע משפט"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 text-right leading-relaxed" dir="rtl">
              {word.sentenceHe}
            </p>
          </div>
        </div>

        {/* Action Buttons: I Know It / Learn */}
        <div className="grid grid-cols-2 text-center border-t border-slate-200">
          <button
            onClick={() => onMarkWord('known')}
            className={`py-3.5 px-4 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors ${
              currentStatus === 'known'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>I know it (יודע)</span>
          </button>
          <button
            onClick={() => onMarkWord('learning')}
            className={`py-3.5 px-4 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors ${
              currentStatus === 'learning'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Learn (ללמוד)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
