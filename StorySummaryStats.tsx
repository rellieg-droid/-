import React from 'react';
import { Flame, BookOpen, Mic, Trophy, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { LearnedWord } from '../types';

interface StorySummaryStatsProps {
  learnedWords: Record<string, LearnedWord>;
  streakDays: number;
  dailyGoal?: number;
  todayCount?: number;
  onOpenTranscribe: () => void;
  onGoToVocab: () => void;
  onOpenGenerateStory?: () => void;
}

export const StorySummaryStats: React.FC<StorySummaryStatsProps> = ({
  learnedWords,
  streakDays,
  dailyGoal = 5,
  todayCount = 3,
  onOpenTranscribe,
  onGoToVocab,
  onOpenGenerateStory,
}) => {
  const words = Object.values(learnedWords);
  const totalCount = words.length;
  const learningCount = words.filter((w) => w.status === 'learning').length;
  const knownCount = words.filter((w) => w.status === 'known').length;
  const goalProgress = Math.min(100, Math.round((Math.min(todayCount, dailyGoal) / dailyGoal) * 100));

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-indigo-800/40 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-800/60 border border-indigo-700/50 text-amber-300">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-indigo-200">
              ההתקדמות שלך בספרדית
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Generate Story from Words Button */}
            {onOpenGenerateStory && (
              <button
                onClick={onOpenGenerateStory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm border border-indigo-400/30"
                title="צור סיפור חדש מילים שלא הבנת עם AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>צור סיפור מהמילים שלי</span>
              </button>
            )}

            {/* Quick Voice / Transcribe Button */}
            <button
              onClick={onOpenTranscribe}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="הקלט שמע לתמלול ותרגול בספרדית עם AI"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">תמלול AI</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Card 1: Total Learned Words */}
          <div
            onClick={onGoToVocab}
            className="bg-white/10 hover:bg-white/15 cursor-pointer backdrop-blur-md rounded-xl p-3 border border-white/10 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-indigo-200 text-xs font-medium">
              <span>אוצר מילים שנלמד</span>
              <BookOpen className="w-3.5 h-3.5 opacity-70" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
                {totalCount}
              </span>
              <span className="text-[11px] text-indigo-300">מילים</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-300">
              <span className="text-amber-300 font-semibold">{learningCount} בלמידה</span>
              <span>·</span>
              <span className="text-emerald-300 font-semibold">{knownCount} ידועים</span>
            </div>
          </div>

          {/* Card 2: Current Learning Streak */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-200 text-xs font-medium">
              <span>רצף ימי למידה</span>
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums tracking-tight">
                {streakDays}
              </span>
              <span className="text-xs text-amber-200/90 font-medium">ימים רצופים!</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-300">
              המשך כך כדי לשמור על הרצף
            </div>
          </div>

          {/* Card 3: Daily Goal & Touch Tip */}
          <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-200 text-xs font-medium">
              <span>יעד יומי</span>
              <span className="text-[11px] font-bold text-amber-300 tabular-nums">
                {todayCount} / {dailyGoal}
              </span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 w-full bg-black/30 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
              <span>גע בכל מילה בסיפור לתרגום מיידי</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
