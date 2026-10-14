import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Layers,
  GraduationCap,
  Sparkles,
  Plus,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { Story, WordEntry, LearnedWord } from './types';
import { STORIES } from './data/stories';
import { DICTIONARY, fetchWordTranslation } from './data/dictionary';
import { StoryReader } from './components/StoryReader';
import { VocabularyView } from './components/VocabularyView';
import { PracticeView } from './components/PracticeView';
import { WordModal } from './components/WordModal';
import { CustomStoryModal } from './components/CustomStoryModal';
import { StorySummaryStats } from './components/StorySummaryStats';
import { AudioTranscribeModal } from './components/AudioTranscribeModal';
import { GenerateStoryFromWordsModal } from './components/GenerateStoryFromWordsModal';

const STORAGE_KEY = 'es10_learned_words';
const STREAK_KEY = 'es10_streak_info';

export default function App() {
  const [activeTab, setActiveTab] = useState<'stories' | 'vocab' | 'practice'>('stories');
  const [stories, setStories] = useState<Story[]>(STORIES);
  const [selectedStory, setSelectedStory] = useState<Story>(STORIES[0]);
  const [modalWord, setModalWord] = useState<WordEntry | null>(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isTranscribeModalOpen, setIsTranscribeModalOpen] = useState(false);
  const [isGenerateStoryModalOpen, setIsGenerateStoryModalOpen] = useState(false);

  // Track learning streak
  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STREAK_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.streak || 3;
      }
    } catch (e) {}
    return 3;
  });

  // Initialize learned words from localStorage or initial seed
  const [learnedWords, setLearnedWords] = useState<Record<string, LearnedWord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage learned words:', e);
    }

    // Default starter words from the prototype
    const initial: Record<string, LearnedWord> = {};
    const seedKeys = ['granja', 'vacas', 'huevos', 'vida'];
    seedKeys.forEach((key) => {
      const entry = DICTIONARY[key];
      if (entry) {
        initial[key] = {
          word: entry.word,
          translation: entry.translation,
          status: 'learning',
          dateAdded: new Date().toLocaleDateString('he-IL'),
          phonetic: entry.phonetic,
          sentence: entry.sentence,
          sentenceHe: entry.sentenceHe,
        };
      }
    });
    return initial;
  });

  // Sync learnedWords to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(learnedWords));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [learnedWords]);

  // Handle word modal interactions with dynamic translation fallback
  const handleOpenWordModal = async (entry: WordEntry) => {
    setModalWord(entry);
    setIsWordModalOpen(true);

    // If word has generic fallback, enrich with AI translation in background
    if (entry.translation === "מילה בספרדית") {
      try {
        const enriched = await fetchWordTranslation(entry.word, entry.sentence);
        if (enriched && enriched.translation && enriched.translation !== "מילה בספרדית") {
          setModalWord(enriched);
        }
      } catch (err) {
        console.warn('Word translation error:', err);
      }
    }
  };

  const handleMarkWord = (status: 'known' | 'learning') => {
    if (!modalWord) return;
    const key = modalWord.word.toLowerCase();
    setLearnedWords((prev) => ({
      ...prev,
      [key]: {
        word: modalWord.word,
        translation: modalWord.translation,
        status,
        dateAdded: new Date().toLocaleDateString('he-IL'),
        phonetic: modalWord.phonetic,
        sentence: modalWord.sentence,
        sentenceHe: modalWord.sentenceHe,
      },
    }));

    // Increment streak if not yet saved today
    try {
      const today = new Date().toDateString();
      const rawStreak = localStorage.getItem(STREAK_KEY);
      const parsed = rawStreak ? JSON.parse(rawStreak) : { streak: 3, lastDate: '' };
      if (parsed.lastDate !== today) {
        const nextStreak = (parsed.streak || 0) + 1;
        setStreakDays(nextStreak);
        localStorage.setItem(STREAK_KEY, JSON.stringify({ streak: nextStreak, lastDate: today }));
      }
    } catch (e) {}

    setIsWordModalOpen(false);
  };

  const handleUpdateWordStatus = (wordKey: string, status: 'known' | 'learning') => {
    const lower = wordKey.toLowerCase();
    setLearnedWords((prev) => {
      const existing = prev[lower] || prev[wordKey];
      if (!existing) return prev;
      return {
        ...prev,
        [lower]: {
          ...existing,
          status,
        },
      };
    });
  };

  const handleRemoveWord = (wordKey: string) => {
    const lower = wordKey.toLowerCase();
    setLearnedWords((prev) => {
      const next = { ...prev };
      delete next[lower];
      delete next[wordKey];
      return next;
    });
  };

  const handleAddCustomStory = (newStory: Story) => {
    setStories((prev) => [newStory, ...prev]);
    setSelectedStory(newStory);
    setActiveTab('stories');
  };

  // Compute metrics
  const learnedCount = Object.keys(learnedWords).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs font-latin">
              ES
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Español 10</span>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  ספרדית בכיף
                </span>
              </h1>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('stories')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'stories'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>סיפורים</span>
            </button>
            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'vocab'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>אוצר מילים ({learnedCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'practice'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>תרגול הבנה</span>
            </button>
          </nav>

          {/* Quick Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">הוסף טקסט</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-8">
        {activeTab === 'stories' && (
          <div className="space-y-4">
            {/* Summary stats card at the top of the stories tab */}
            <StorySummaryStats
              learnedWords={learnedWords}
              streakDays={streakDays}
              dailyGoal={5}
              todayCount={Math.min(Object.keys(learnedWords).length, 5)}
              onOpenTranscribe={() => setIsTranscribeModalOpen(true)}
              onGoToVocab={() => setActiveTab('vocab')}
              onOpenGenerateStory={() => setIsGenerateStoryModalOpen(true)}
            />

            <StoryReader
              story={selectedStory}
              allStories={stories}
              onSelectStory={setSelectedStory}
              learnedWords={learnedWords}
              onWordClick={handleOpenWordModal}
              onOpenCustomModal={() => setIsCustomModalOpen(true)}
              onOpenGenerateStory={() => setIsGenerateStoryModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'vocab' && (
          <VocabularyView
            learnedWords={learnedWords}
            onUpdateStatus={handleUpdateWordStatus}
            onRemoveWord={handleRemoveWord}
            onGoToStories={() => setActiveTab('stories')}
            onOpenGenerateStory={() => setIsGenerateStoryModalOpen(true)}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeView
            currentStory={selectedStory}
            allStories={stories}
            onSelectStory={setSelectedStory}
            onGoToStoryReader={() => setActiveTab('stories')}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (<15% sticky cap) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
        <div className="grid grid-cols-3 items-center h-16">
          <button
            onClick={() => setActiveTab('stories')}
            className={`flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors ${
              activeTab === 'stories' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[11px]">סיפורים</span>
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors relative ${
              activeTab === 'vocab' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <div className="relative">
              <Layers className="w-5 h-5" />
              {learnedCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                  {learnedCount}
                </span>
              )}
            </div>
            <span className="text-[11px]">אוצר מילים</span>
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-colors ${
              activeTab === 'practice' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="text-[11px]">תרגול</span>
          </button>
        </div>
      </nav>

      {/* Word Details Modal */}
      <WordModal
        word={modalWord}
        isOpen={isWordModalOpen}
        onClose={() => setIsWordModalOpen(false)}
        onMarkWord={handleMarkWord}
        currentStatus={
          modalWord ? learnedWords[modalWord.word.toLowerCase()]?.status : undefined
        }
      />

      {/* Custom Story Importer Modal */}
      <CustomStoryModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddStory={handleAddCustomStory}
      />

      {/* Generate Story from Unknown Words Modal */}
      <GenerateStoryFromWordsModal
        isOpen={isGenerateStoryModalOpen}
        onClose={() => setIsGenerateStoryModalOpen(false)}
        learnedWords={learnedWords}
        onStoryCreated={(newStory) => {
          handleAddCustomStory(newStory);
        }}
      />

      {/* Audio Transcription Modal using gemini-3.5-transcribe */}
      <AudioTranscribeModal
        isOpen={isTranscribeModalOpen}
        onClose={() => setIsTranscribeModalOpen(false)}
        onWordClick={handleOpenWordModal}
        onSaveAsStory={(title, content) => {
          handleAddCustomStory({
            id: `transcribed-${Date.now()}`,
            title: title || 'Audio Práctica',
            titleHe: 'תרגול שמע מוקלט',
            author: 'הקלטה קולית AI',
            level: 'A1 - מתחילים',
            coverImage: '/src/assets/images/cover_maria_farm_1792007358059.jpg',
            descriptionHe: 'טקסט שתומלל מתוך הקלטת המיקרופון שלך באמצעות מודל gemini-3.5-transcribe.',
            content,
            paragraphs: [{ spanish: content, hebrew: 'טקסט מתומלל באמצעות AI (גע בכל מילה לתרגום)' }],
            quiz: [
              {
                question: 'האם התמלול הצליח לקלוט את הדיבור שלך?',
                options: ['כן, במדויק', 'בחלוקה חלקית', 'דרוש אימון נוסף', 'טקסט קצר'],
                answer: 0,
                explanation: 'תמלול קולי באמצעות מודל gemini-3.5-transcribe.',
              },
            ],
          });
        }}
      />
    </div>
  );
}
