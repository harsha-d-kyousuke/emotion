
export type Emotion = 'Happy' | 'Sad' | 'Anxious' | 'Angry' | 'Calm' | 'Neutral';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  emotion?: Emotion;
  timestamp: number;
}

export interface MoodEntry {
  emotion: Emotion;
  timestamp: number;
}

export interface SettingsType {
  theme: 'light' | 'dark';
  fontSize: number;
  voiceReply: boolean;
  autoEmotionDetection: boolean;
  compactView: boolean;
  privacyMode: boolean;
}

export type ViewType = 'Home' | 'Mood Tracking' | 'Tips' | 'Resources' | 'Account' | 'Settings' | 'History' | 'Helpline';

export interface ChatSession {
  id: number;
  startTime: number;
  messages: ChatMessage[];
  summary?: string;
}
