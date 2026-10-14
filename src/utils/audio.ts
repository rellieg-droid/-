// Web Speech API wrapper for Spanish pronunciation & narration

class SpeechController {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private spanishVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prefer European Spanish or Latin American Spanish
    this.spanishVoice =
      voices.find(v => v.lang.startsWith('es-ES')) ||
      voices.find(v => v.lang.startsWith('es-')) ||
      null;
  }

  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      onBoundary?: (charIndex: number) => void;
      onEnd?: () => void;
      onError?: () => void;
    } = {}
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = options.rate ?? 0.88;
    utterance.pitch = options.pitch ?? 1.0;

    if (this.spanishVoice) {
      utterance.voice = this.spanishVoice;
    }

    if (options.onBoundary) {
      utterance.onboundary = (e) => {
        options.onBoundary?.(e.charIndex);
      };
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      options.onError?.();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }
}

export const speechController = new SpeechController();
