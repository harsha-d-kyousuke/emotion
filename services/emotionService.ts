
import type { Emotion } from '../types';

const emotionKeywords: Record<Emotion, string[]> = {
  Happy: ['happy', 'joyful', 'excited', 'great', 'amazing', 'wonderful', 'fantastic', 'good'],
  Sad: ['sad', 'unhappy', 'crying', 'miserable', 'down', 'depressed', 'hopeless'],
  Anxious: ['anxious', 'worried', 'nervous', 'stressed', 'scared', 'panicked'],
  Angry: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated'],
  Calm: ['calm', 'relaxed', 'peaceful', 'serene', 'content'],
  Neutral: [],
};

export const distressKeywords = ['suicide', 'kill myself', 'depressed', 'hopeless', 'end it all', 'can\'t go on'];

export const detectEmotion = (text: string): Emotion => {
  const lowerCaseText = text.toLowerCase();
  for (const emotion in emotionKeywords) {
    if (emotionKeywords[emotion as Emotion].some(keyword => lowerCaseText.includes(keyword))) {
      return emotion as Emotion;
    }
  }
  return 'Neutral';
};

export const containsDistressKeywords = (text: string): boolean => {
  const lowerCaseText = text.toLowerCase();
  return distressKeywords.some(keyword => lowerCaseText.includes(keyword));
};
