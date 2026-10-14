import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  BookOpen,
  Check
} from 'lucide-react';
import { Story, QuizQuestion } from '../types';

interface PracticeViewProps {
  currentStory: Story;
  allStories: Story[];
  onSelectStory: (story: Story) => void;
  onGoToStoryReader: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  currentStory,
  allStories,
  onSelectStory,
  onGoToStoryReader,
}) => {
  // Answers state: map question index to selected option index
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [activeStoryId, setActiveStoryId] = useState(currentStory.id);

  const activeStory = allStories.find((s) => s.id === activeStoryId) || currentStory;
  const questions = activeStory.quiz;

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (selectedAnswers[qIdx] !== undefined) return; // already answered
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
  };

  const handleStorySwitch = (story: Story) => {
    setActiveStoryId(story.id);
    onSelectStory(story);
    setSelectedAnswers({});
  };

  // Score calculation
  const totalAnswered = Object.keys(selectedAnswers).length;
  const correctCount = questions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.answer ? acc + 1 : acc;
  }, 0);
  const isComplete = totalAnswered === questions.length && questions.length > 0;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Story Filter Selector */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200">
        <div className="text-xs font-semibold text-slate-500 mb-2">בחר סיפור לתרגול הבנה:</div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {allStories.map((s) => {
            const isCurrent = s.id === activeStory.id;
            return (
              <button
                key={s.id}
                onClick={() => handleStorySwitch(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s.titleHe}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quiz Header Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            שאלות הבנה: {activeStory.titleHe}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            בדוק כמה הבנת מתוך קריאת הסיפור והאוצר המילים
          </p>
        </div>
        <div className="text-left shrink-0">
          <span className="text-xs font-bold text-slate-500">ענית על</span>
          <div className="text-lg font-extrabold text-indigo-600 tabular-nums">
            {totalAnswered} / {questions.length}
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {isComplete && (
        <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl p-5 border border-indigo-100 text-center space-y-3 animate-in zoom-in-95 duration-300">
          <div className="inline-flex p-3 rounded-full bg-white shadow-sm text-amber-500">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">
              {scorePercent >= 80 ? 'כל הכבוד! ציון מעולה 🎉' : 'סיימת את התרגול! 💪'}
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              ענית נכון על {correctCount} מתוך {questions.length} שאלות ({scorePercent}%)
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={handleResetQuiz}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>נסה שוב</span>
            </button>
            <button
              onClick={onGoToStoryReader}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>חזור לקרוא בסיפור</span>
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const userChoice = selectedAnswers[qIdx];
          const hasAnswered = userChoice !== undefined;
          const isCorrect = userChoice === q.answer;

          return (
            <div
              key={qIdx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              {/* Question text */}
              <div className="flex items-start justify-between gap-3">
                <div className="text-base font-bold text-slate-900 leading-snug">
                  <span className="text-indigo-600 ml-1.5">{qIdx + 1}.</span>
                  {q.question}
                </div>
                {hasAnswered && (
                  <span
                    className={`shrink-0 flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> נכון!
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> טעות
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let btnStyle =
                    'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';

                  if (hasAnswered) {
                    if (optIdx === q.answer) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                    } else if (optIdx === userChoice) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through opacity-80';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`w-full text-right p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {hasAnswered && optIdx === q.answer && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when answered */}
              {hasAnswered && (
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed animate-in fade-in ${
                    isCorrect
                      ? 'bg-emerald-50/70 border border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/70 border border-amber-200 text-amber-900'
                  }`}
                >
                  <span className="font-bold">הסבר: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
