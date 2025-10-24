
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { ChatMessage } from '../types';

let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
    console.error("API_KEY environment variable not set.");
}


let chat: Chat | null = null;

export const startChatSession = (history: ChatMessage[]) => {
  if (!ai) {
    console.error("GoogleGenAI not initialized. Check API Key.");
    return;
  }
  
  const formattedHistory = history.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: formattedHistory,
    config: {
      systemInstruction: "You are Lumera, a caring, empathetic, and supportive mental wellness chatbot. Your tone should always be comforting, non-judgmental, and encouraging. Never give medical advice, but provide helpful, positive conversation. Keep your responses concise and gentle.",
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chat) {
    startChatSession([]);
  }
  if (!chat) {
     return "I'm having trouble connecting right now. Please try again in a moment.";
  }

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "I'm sorry, I encountered an error. Could you please rephrase that?";
  }
};
