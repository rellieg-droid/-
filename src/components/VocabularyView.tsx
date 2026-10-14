import React, { useState } from 'react';
import {
  Volume2,
  Trash2,
  Search,
  BookOpen,
  Layers,
  RotateCw,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { LearnedWord } from '../types';
import { speechController } from '../utils/audio';

interface VocabularyViewProps {
  learnedWords: Record<string, LearnedWord>;
  onUpdateStatus: (wordKey: string, status: 'known' | 'learning') => void;
  onRemoveWord: (wordKey: string) => void;
  onGoToStories: () => void;
  onOpenGenerateStory?: () => void;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  learnedWords,
  onUpdateStatus,
  onRemoveWord,
  onGoToStories,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'flashcards'>('list');
  const [filter, setFilter] = useState<'all' | 'learning' | 'known'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const wordList = Object.values(learnedWords);

  // Filter words
  const filteredWords = wordList.filter((item) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'learning'
        ? item.status === 'learning'
        : item.status === 'known';

    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  const learningCount = wordList.filter((w) => w.status === 'learning').length;
  const knownCount = wordList.filter((w) => w.status === 'known').length;

  const handleSpeak = (word: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    speechController.speak(word, { rate: 0.85 });
  };

  // Flashcard controls
  const activeCard = filteredWords[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentCardIndex < filteredWords.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  const handleFlashcardResult = (markAs: 'known' | 'learning') => {
    if (activeCard) {
      onUpdateStatus(activeCard.word, markAs);
      handleNextCard();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Stats Strip */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xl sm:text-2xl font-bold text-slate-800 tabular-nums">
            {wordList.length}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">סך הכל מילים</div>
        </div>
        <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60 shadow-xs">
          <div className="text-xl sm:text-2xl font-bold text-amber-700 tabular-nums">
            {learningCount}
          </div>
          <div className="text-xs text-amber-700 font-medium mt-0.5">בלמידה (Learn)</div>
        </div>
        <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/60 shadow-xs">
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 tabular-nums">
            {knownCount}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-0.5">ידועים (Mastered)</div>
        </div>
      </div>

      {/* Mode Switcher & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white p-2.5 rounded-2xl border border-slate-200">
        {/* Toggle Mode: List vs Flashcards */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>רשימת מילים</span>
          </button>
          <button
            onClick={() => {
              setViewMode('flashcards');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              viewMode === 'flashcards'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>כרטיסיות זיכרון</span>
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {(['all', 'learning', 'known'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilter(tab);
                setCurrentCardIndex(0);
              }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                filter === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'all' && 'כל המילים'}
              {tab === 'learning' && 'בלמידה'}
              {tab === 'known' && 'ידוע'}
            </button>
          ))}
        </div>
      </div>

      {/* AI Generate Story Banner if user has words */}
      {onOpenGenerateStory && wordList.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 border border-indigo-200/80 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                רוצה לתרגל את המילים האלו בסיפור חדש?
              </div>
              <div className="text-[11px] text-slate-500">
                ה-AI יכול לחבר סיפור שלם שמשלב בדיוק את המילים שלא הבנת
              </div>
            </div>
          </div>
          <button
            onClick={onOpenGenerateStory}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span>צור סיפור מהמילים</span>
          </button>
        </div>
      )}

      {/* FLASHCARDS MODE */}
      {viewMode === 'flashcards' ? (
        <div className="space-y-4">
          {filteredWords.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">אין כרטיסיות להצגה</h3>
              <p className="text-xs text-slate-500 mb-4">
                {filter !== 'all'
                  ? 'לא נמצאו מילים בסינון זה. נסה לשנות את הסינון ל"כל המילים".'
                  : 'הוסף מילים מרשימת הסיפורים כדי לתרגל אותן בכרטיסיות זיכרון.'}
              </p>
              <button
                onClick={onGoToStories}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
              >
                עבור לסיפורים והוסף מילים
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Card Counter & Progress */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-2">
                <span>
                  כרטיסייה <span className="font-bold text-slate-800">{currentCardIndex + 1}</span> מתוך{' '}
                  <span className="font-bold text-slate-800">{filteredWords.length}</span>
                </span>
                <span className="text-[11px] font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                  לחץ על הכרטיסייה כדי להפוך
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{
                    width: `${((currentCardIndex + 1) / filteredWords.length) * 100}%`,
                  }}
                />
              </div>

              {/* Flashcard Box */}
              {activeCard && (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`min-h-[260px] cursor-pointer rounded-2xl p-6 text-center border transition-all duration-300 flex flex-col items-center justify-center relative shadow-sm ${
                    isFlipped
                      ? 'bg-slate-900 text-white border-slate-800'
                      : 'bg-white text-slate-900 border-slate-200 hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={(e) => handleSpeak(activeCard.word, e)}
                    className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-indigo-600 transition-colors shadow-xs"
                    title="השמע מילה"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  <div className="text-[11px] uppercase tracking-wider font-semibold opacity-60 mb-2">
                    {isFlipped ? 'תרגום ומשמעות' : 'ספרדית (Spanish)'}
                  </div>

                  {!isFlipped ? (
                    <>
                      <div className="text-3xl sm:text-4xl font-extrabold font-latin tracking-tight mb-2">
                        {activeCard.word}
                      </div>
                      {activeCard.phonetic && (
                        <div className="text-xs font-mono text-slate-400">
                          | {activeCard.phonetic} |
                        </div>
                      )}
                      <div className="mt-6 text-xs text-indigo-600 font-medium flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-full">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>לחץ להפיכת הכרטיסייה לתרגום בעברית</span>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3" dir="rtl">
                      <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                        {activeCard.translation}
                      </div>
                      {activeCard.sentence && (
                        <div className="text-xs opacity-80 max-w-sm mx-auto bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                          <div className="font-latin text-left mb-1 text-slate-200">
                            {activeCard.sentence}
                          </div>
                          <div className="text-right text-slate-400">
                            {activeCard.sentenceHe}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Flashcard Actions */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => handleFlashcardResult('learning')}
                  className="py-3 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 border border-amber-300 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-amber-700" />
                  <span>עדיין לומד (חזור שוב)</span>
                </button>
                <button
                  onClick={() => handleFlashcardResult('known')}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>זכרתי מצוין! (ידוע)</span>
                </button>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrevCard}
                  disabled={currentCardIndex === 0}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>הקודם</span>
                </button>
                <button
                  onClick={handleNextCard}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
                >
                  <span>הבא</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש מילה בספרדית או בעברית..."
              className="w-full bg-white pr-9 pl-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {filteredWords.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">
                {searchQuery ? 'לא נמצאו מילים מתאימות' : 'עדיין לא הוספת מילים'}
              </h3>
              <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
                {searchQuery
                  ? 'נסה לחפש מילה אחרת או אפס את הסינון.'
                  : 'לחץ על מילים בסיפורים כדי ללמוד אותן, לשמוע הגייה ולשמור לאוצר המילים!'}
              </p>
              {!searchQuery && (
                <button
                  onClick={onGoToStories}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                >
                  פתח סיפור והתחל ללמוד
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredWords.map((item) => (
                <div
                  key={item.word}
                  className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  {/* Left: Speaker audio */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleSpeak(item.word, e)}
                      className="p-2 rounded-full bg-slate-100 hover:bg-indigo-50 text-indigo-600 transition-colors"
                      title="השמע הגייה"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="text-base font-bold text-slate-900 font-latin" dir="ltr">
                        {item.word}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{item.translation}</div>
                    </div>
                  </div>

                  {/* Right: Status toggle & Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateStatus(
                          item.word,
                          item.status === 'known' ? 'learning' : 'known'
                        )
                      }
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        item.status === 'known'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {item.status === 'known' ? 'ידוע ✓' : 'בלמידה 📖'}
                    </button>

                    <button
                      onClick={() => onRemoveWord(item.word)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      title="הסר מילה"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
