
// Add custom type definitions for the Web Speech API to avoid TypeScript errors
// as this API is not yet part of the standard TypeScript DOM library.
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}


const SpeechRecognition: SpeechRecognitionStatic | undefined = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: SpeechRecognition | null = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

export const isSpeechRecognitionSupported = (): boolean => !!SpeechRecognition;

export const startRecognition = (
    onResult: (transcript: string) => void,
    onEnd: () => void,
    onError: (event: SpeechRecognitionErrorEvent) => void
): void => {
    if (!recognition) {
        console.error("Speech recognition not supported.");
        return;
    }
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
    };

    recognition.onend = () => {
        onEnd();
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        onError(event);
    };
    
    recognition.start();
};

export const stopRecognition = (): void => {
    if (recognition) {
        recognition.stop();
    }
};

export const speak = (text: string, onEnd?: () => void): void => {
    if (!('speechSynthesis' in window)) {
        console.error("Speech synthesis not supported.");
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    if (onEnd) {
        utterance.onend = onEnd;
    }
    window.speechSynthesis.speak(utterance);
};
