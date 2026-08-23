import { LanguageCode } from "./i18n";

export interface SpeechHandler {
  startListening: (
    language: LanguageCode,
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) => void;
  stopListening: () => void;
  speak: (text: string, language: LanguageCode, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  isSupported: () => boolean;
}

const LANG_BCP47_MAP: Record<LanguageCode, string> = {
  en: "en-US",
  te: "te-IN",
  hi: "hi-IN",
};

let currentRecognition: any = null;

export const speech: SpeechHandler = {
  isSupported: () => {
    if (typeof window === "undefined") return false;
    return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  },

  startListening: (language, onResult, onError, onEnd) => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError("Speech Recognition not supported in this browser.");
      return;
    }

    if (currentRecognition) {
      try {
        currentRecognition.stop();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LANG_BCP47_MAP[language] || "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      onError(event.error || "Speech recognition error");
      onEnd();
    };

    recognition.onend = () => {
      onEnd();
    };

    currentRecognition = recognition;
    try {
      recognition.start();
    } catch (e) {
      onError("Could not access microphone.");
      onEnd();
    }
  },

  stopListening: () => {
    if (currentRecognition) {
      try {
        currentRecognition.stop();
      } catch (e) {}
      currentRecognition = null;
    }
  },

  speak: (text, language, onEnd) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    // Clean markdown headings & symbols before speaking
    const cleanText = text
      .replace(/[#*`_~[\]()]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = LANG_BCP47_MAP[language] || "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  },

  stopSpeaking: () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  },
};
