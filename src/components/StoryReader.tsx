import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Square,
  Languages,
  BookOpen,
  Sparkles,
  Type,
  CheckCircle,
  HelpCircle,
  Share2
} from 'lucide-react';
import { Story, LearnedWord, WordEntry } from '../types';
import { speechController } from '../utils/audio';
import { lookupWord } from '../data/dictionary';

interface StoryReaderProps {
  story: Story;
  allStories: Story[];
  onSelectStory: (story: Story) => void;
  learnedWords: Record<string, LearnedWord>;
  onWordClick: (word: WordEntry) => void;
  onOpenCustomModal: () => void;
  onOpenGenerateStory?: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  allStories,
  onSelectStory,
  learnedWords,
  onWordClick,
  onOpenCustomModal,
  onOpenGenerateStory,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [showTranslations, setShowTranslations] = useState(false);
  const [highlightVocab, setHighlightVocab] = useState(true);
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);

  // Stop audio if story changes or component unmounts
  useEffect(() => {
    speechController.stop();
    setIsPlaying(false);
    return () => {
      speechController.stop();
    };
  }, [story.id]);

  const togglePlayStory = () => {
    if (isPlaying) {
      speechController.stop();
      setIsPlaying(false);
      setActiveCharIndex(null);
    } else {
      setIsPlaying(true);
      speechController.speak(story.content, {
        rate: speechRate,
        onBoundary: (charIndex) => {
          setActiveCharIndex(charIndex);
        },
        onEnd: () => {
          setIsPlaying(false);
          setActiveCharIndex(null);
        },
        onError: () => {
          setIsPlaying(false);
          setActiveCharIndex(null);
        },
      });
    }
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    if (isPlaying) {
      // restart at new speed
      speechController.stop();
      speechController.speak(story.content, {
        rate,
        onBoundary: (charIndex) => setActiveCharIndex(charIndex),
        onEnd: () => {
          setIsPlaying(false);
          setActiveCharIndex(null);
        },
      });
    }
  };

  const fontSizeClasses = {
    sm: 'text-base leading-relaxed',
    md: 'text-lg leading-loose',
    lg: 'text-xl leading-[2.2]',
    xl: 'text-2xl leading-[2.4]',
  };

  // Render clickable tokens for a paragraph
  const renderParagraphTokens = (text: string) => {
    // Split by whitespace and punctuation while keeping delimiters
    const tokens = text.split(/([ \t\n\r]+|[.,;!?:()«»""])/);

    return tokens.map((token, idx) => {
      // If token is only punctuation or whitespace, render directly
      const cleanWord = token.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/g, '');
      if (!cleanWord) {
        return <span key={idx}>{token}</span>;
      }

      const lower = cleanWord.toLowerCase();
      const isLearning = learnedWords[lower]?.status === 'learning' || learnedWords[cleanWord]?.status === 'learning';
      const isKnown = learnedWords[lower]?.status === 'known' || learnedWords[cleanWord]?.status === 'known';

      let highlightClass = 'hover:bg-amber-100 hover:text-slate-900 rounded-sm cursor-pointer transition-colors';
      if (isLearning) {
        highlightClass = 'bg-amber-100 text-amber-950 font-medium rounded px-0.5 border-b-2 border-amber-400 cursor-pointer shadow-2xs';
      } else if (isKnown) {
        highlightClass = 'bg-emerald-50 text-emerald-950 font-medium rounded px-0.5 border-b-2 border-emerald-400 cursor-pointer shadow-2xs';
      } else if (highlightVocab) {
        highlightClass = 'bg-yellow-50/80 hover:bg-yellow-200 text-slate-900 rounded px-0.5 cursor-pointer';
      }

      return (
        <span
          key={idx}
          onClick={(e) => {
            e.stopPropagation();
            const entry = lookupWord(cleanWord);
            onWordClick(entry);
          }}
          className={`inline-block py-0.5 px-0.5 mx-0.5 select-none touch-manipulation active:scale-95 transition-all ${highlightClass}`}
          title="לחץ או גע במילה לתרגום והשמעה"
        >
          {token}
        </span>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Story Carousel / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {allStories.map((s) => {
          const isActive = s.id === story.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectStory(s)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{s.titleHe}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-sans ${
                  isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {s.level.split(' - ')[0]}
              </span>
            </button>
          );
        })}
        <button
          onClick={onOpenCustomModal}
          className="px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition-all bg-white hover:bg-indigo-50 text-indigo-600 border border-dashed border-indigo-300 flex items-center gap-1.5 shrink-0"
        >
          <span>+ טקסט אישי</span>
        </button>
        {onOpenGenerateStory && (
          <button
            onClick={onOpenGenerateStory}
            className="px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition-all bg-gradient-to-r from-amber-50 to-indigo-50 hover:from-amber-100 hover:to-indigo-100 text-indigo-950 border border-amber-300/80 flex items-center gap-1.5 shrink-0 shadow-2xs"
            title="צור סיפור מותאם אישית מהמילים שלא הבנת"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>צור סיפור ממילים</span>
          </button>
        )}
      </div>

      {/* Hero Cover Banner */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-md group">
        <img
          src={story.coverImage}
          alt={story.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
          onError={(e) => {
            // Fallback gradient if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Measured Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-5 text-white">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-300 mb-1">
            <span>{story.level}</span>
            <span>·</span>
            <span>{story.author}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide font-latin text-white drop-shadow-sm mb-1">
            {story.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-xl">
            {story.descriptionHe}
          </p>
        </div>
      </div>

      {/* Reader Controls Toolbar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left / Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayStory}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-xs ${
              isPlaying
                ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current animate-pulse" />
                <span>עצור הקראה</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>השמע סיפור</span>
              </>
            )}
          </button>

          {/* Speed selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold text-slate-600">
            {[0.75, 0.85, 1.0].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRateChange(rate)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  speechRate === rate
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
                title={`מהירות הקראה ${rate}x`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Right / Reading Preferences */}
        <div className="flex items-center gap-2 mr-auto text-xs text-slate-600">
          {/* Font Size Adjuster */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-1 rounded-md font-bold ${fontSize === 'sm' ? 'bg-white text-slate-900 shadow-xs' : ''}`}
              title="טקסט קטן"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 rounded-md font-bold ${fontSize === 'lg' ? 'bg-white text-slate-900 shadow-xs' : ''}`}
              title="טקסט רגיל"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`px-2 py-1 rounded-md font-bold ${fontSize === 'xl' ? 'bg-white text-slate-900 shadow-xs' : ''}`}
              title="טקסט גדול"
            >
              A+
            </button>
          </div>

          {/* Toggle Hebrew paragraph translations */}
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              showTranslations
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="הצג או הסתר תרגום עברית"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">תרגום עברית</span>
          </button>
        </div>
      </div>

      {/* Reader Tip Banner */}
      <div className="flex items-center justify-between text-xs bg-amber-50/70 border border-amber-200/60 rounded-xl px-3.5 py-2 text-amber-900">
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>טיפ: לחץ על כל מילה בסיפור להשמעה, תרגום עברי ופירוט דקדוקי מלא!</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            בלמידה
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            ידוע
          </span>
        </div>
      </div>

      {/* Main Reader Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        {story.paragraphs.map((para, pIdx) => (
          <div key={pIdx} className="space-y-2">
            {/* Spanish Paragraph */}
            <div
              dir="ltr"
              className={`font-latin text-slate-900 tracking-normal ${fontSizeClasses[fontSize]}`}
            >
              {renderParagraphTokens(para.spanish)}
            </div>

            {/* Optional Hebrew Paragraph Translation */}
            {showTranslations && (
              <div
                dir="rtl"
                className="bg-slate-50 border-r-2 border-indigo-400 p-3 rounded-lg text-sm text-slate-600 leading-relaxed animate-in fade-in duration-200"
              >
                {para.hebrew}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Comprehension Reminder */}
      <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-950">
            סיימת לקרוא? בדוק את הבנת הסיפור בתרגול!
          </span>
        </div>
        <span className="text-xs font-bold text-indigo-600">
          {story.quiz.length} שאלות
        </span>
      </div>
    </div>
  );
};
