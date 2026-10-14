import React, { useState, useRef } from 'react';
import {
  Mic,
  Square,
  Volume2,
  X,
  Sparkles,
  Loader2,
  BookPlus,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { speechController } from '../utils/audio';
import { WordEntry } from '../types';
import { lookupWord } from '../data/dictionary';

interface AudioTranscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWordClick: (word: WordEntry) => void;
  onSaveAsStory: (title: string, content: string) => void;
}

export const AudioTranscribeModal: React.FC<AudioTranscribeModalProps> = ({
  isOpen,
  onClose,
  onWordClick,
  onSaveAsStory,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  if (!isOpen) return null;

  const startRecording = async () => {
    try {
      setError(null);
      setTranscript(null);
      setAudioUrl(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert blob to base64 and transcribe
        await handleTranscribeBlob(audioBlob, mediaRecorder.mimeType || 'audio/webm');

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200); // 200ms chunks
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setError('לא ניתן לגשת למיקרופון. אנא ודא שהענקת הרשאות שימוש במיקרופון בדפדפן.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleTranscribeBlob = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: mimeType,
          }),
        });

        const data = await response.json();
        if (response.ok && data.transcript) {
          setTranscript(data.transcript);
        } else {
          setError(data.error || 'שגיאה בתמלול השמע. נסה שוב.');
        }
        setIsTranscribing(false);
      };
    } catch (err: any) {
      console.error('Transcription API error:', err);
      setError(err?.message || 'שגיאה בתקשורת עם השרת');
      setIsTranscribing(false);
    }
  };

  const renderClickableWords = (text: string) => {
    const tokens = text.split(/([ \t\n\r]+|[.,;!?:()«»""])/);
    return tokens.map((token, i) => {
      const clean = token.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/g, '');
      if (!clean) return <span key={i}>{token}</span>;

      return (
        <span
          key={i}
          onClick={() => {
            const entry = lookupWord(clean);
            onWordClick(entry);
          }}
          className="inline-block py-0.5 px-1 mx-0.5 rounded-sm hover:bg-amber-100 hover:text-slate-900 cursor-pointer font-latin transition-colors"
          title="גע במילה לתרגום"
        >
          {token}
        </span>
      );
    });
  };

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
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                תמלול ותרגול שמע עם AI
              </h3>
              <p className="text-[11px] text-slate-500">
                דבר בספרדית וה-AI יתמלל ויתרגם בדיוק מרבי (gemini-3.5-transcribe)
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

        {/* Body Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Record Control Stage */}
          <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200/80 flex flex-col items-center justify-center">
            {isRecording ? (
              <div className="space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg animate-pulse mx-auto">
                    <Mic className="w-9 h-9" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-rose-300 animate-ping pointer-events-none" />
                </div>
                <div>
                  <div className="text-xl font-mono font-bold text-rose-600">
                    {Math.floor(recordingSeconds / 60)}:
                    {(recordingSeconds % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">מקליט... דבר בספרדית</p>
                </div>
                <button
                  onClick={stopRecording}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-sm active:scale-95 transition-all"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>עצור הקלטה ותמלל</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={startRecording}
                  disabled={isTranscribing}
                  className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all mx-auto disabled:opacity-50"
                  title="התחל הקלטה"
                >
                  <Mic className="w-7 h-7" />
                </button>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    לחץ על המיקרופון כדי להקליט
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    לדוגמה: "Hola, me llamo David y estoy aprendiendo español con historias"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Loading Indicator */}
          {isTranscribing && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center space-y-2">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-indigo-900">
                מעבד ומתמלל שמע באמצעות gemini-3.5-transcribe...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Audio Playback If Recorded */}
          {audioUrl && !isRecording && (
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-600">ההקלטה שלך:</span>
              <audio src={audioUrl} controls className="h-8 max-w-xs" />
            </div>
          )}

          {/* Transcript Results */}
          {transcript && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>תוצאת התמלול (לחץ על כל מילה לתרגום):</span>
                </div>
                <button
                  onClick={() => speechController.speak(transcript, { rate: 0.88 })}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="השמע את התמלול"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div
                dir="ltr"
                className="bg-slate-50 p-4 rounded-xl text-slate-900 text-base leading-relaxed border border-slate-100 font-latin text-left select-text"
              >
                {renderClickableWords(transcript)}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    onSaveAsStory('תרגול שמע מוקלט', transcript);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <BookPlus className="w-3.5 h-3.5" />
                  <span>שמור כסיפור לתרגול קריאה</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
