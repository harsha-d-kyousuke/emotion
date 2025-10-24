import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic, MicOff, Volume2, File, MoreVertical, AlertTriangle, ChevronDown, X } from 'lucide-react';
import { startChatSession, sendMessageToGemini } from '../services/geminiService';
import { detectEmotion, containsDistressKeywords } from '../services/emotionService';
import { isSpeechRecognitionSupported, startRecognition, speak } from '../services/speechService';
import type { ChatMessage, SettingsType, MoodEntry, Emotion, ChatSession } from '../types';
import { HELPLINE_INFO } from '../constants';

interface ChatViewProps {
  settings: SettingsType;
  addMoodEntry: (entry: Omit<MoodEntry, 'timestamp'>) => void;
  saveChatSession: (session: ChatSession) => void;
  existingSession?: ChatSession;
}

export const ChatView: React.FC<ChatViewProps> = ({ settings, addMoodEntry, saveChatSession, existingSession }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(existingSession?.messages || []);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showDistressAlert, setShowDistressAlert] = useState(false);
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startChatSession(messages);
    if(messages.length === 0) {
       // Send initial welcome message
        const welcomeMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          text: "Hello! I'm Lumera, your caring digital companion. How are you feeling today?",
          sender: 'bot',
          timestamp: Date.now(),
        };
        setMessages([welcomeMessage]);
        if (settings.voiceReply) {
          speak(welcomeMessage.text);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingSession]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 1) { // more than just the welcome message
      const sessionData: ChatSession = {
        id: existingSession?.id || Date.now(),
        startTime: existingSession?.startTime || Date.now(),
        messages: messages,
        summary: messages.find(m => m.sender === 'user')?.text.substring(0, 50) + '...'
      };
      saveChatSession(sessionData);
    }
  }, [messages, saveChatSession, existingSession]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsTitleDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isBotTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: Date.now(),
    };
    
    if (settings.autoEmotionDetection) {
      const detected = detectEmotion(text);
      if (detected !== 'Neutral') {
        userMessage.emotion = detected;
        addMoodEntry({ emotion: detected });
      }
    }
    
    if (containsDistressKeywords(text)) {
      setShowDistressAlert(true);
    } else {
      setShowDistressAlert(false);
    }

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsBotTyping(true);

    const botResponseText = await sendMessageToGemini(text);
    
    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      text: botResponseText,
      sender: 'bot',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsBotTyping(false);

    if (settings.voiceReply) {
      speak(botResponseText);
    }
  }, [isBotTyping, settings, addMoodEntry]);

  const handleMicClick = () => {
    if (!isSpeechRecognitionSupported()) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) return;

    setIsRecording(true);
    startRecognition(
      (transcript) => {
        setUserInput(transcript);
        handleSendMessage(transcript);
      },
      () => setIsRecording(false),
      (error) => {
        console.error("Speech recognition error:", error);
        setIsRecording(false);
      }
    );
  };
  
  const getEmotionColor = (emotion?: Emotion) => {
    switch(emotion) {
      case 'Happy': return 'text-yellow-500';
      case 'Sad': return 'text-blue-500';
      case 'Anxious': return 'text-purple-500';
      case 'Angry': return 'text-red-500';
      case 'Calm': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full p-2 sm:p-4 md:p-6 bg-slate-100 dark:bg-gray-900">
      {/* Top Navbar */}
      <header className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-sm mb-4">
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsTitleDropdownOpen(!isTitleDropdownOpen)} className="flex items-center gap-2 text-xl font-semibold cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                LumeraGPT
                <ChevronDown size={20} className={`transition-transform duration-200 ${isTitleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isTitleDropdownOpen && (
                <div className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl py-2 z-10 animate-fade-in-fast">
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowAboutModal(true); setIsTitleDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">About Us</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowContactModal(true); setIsTitleDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">Contact Info</a>
                </div>
            )}
        </div>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <MoreVertical size={20} />
        </button>
      </header>
      
      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-sky-500 flex-shrink-0"></div>}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-sky-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 rounded-bl-none'}`}>
              <p style={{ overflowWrap: 'break-word' }}>{msg.text}</p>
              {msg.sender === 'user' && msg.emotion && (
                <span className={`text-xs mt-2 flex items-center ${getEmotionColor(msg.emotion)}`}>
                  Detected: {msg.emotion}
                </span>
              )}
            </div>
          </div>
        ))}
        {isBotTyping && (
          <div className="flex items-end gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-sky-500 flex-shrink-0"></div>
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-700 rounded-bl-none">
              <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
              </div>
            </div>
          </div>
        )}
         {showDistressAlert && (
          <div className="p-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-r-lg my-4">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
              <div>
                <p className="font-bold">It sounds like you're going through a tough time.</p>
                <p>Please remember, help is available. You can reach out to a professional who can support you.</p>
                <div className="mt-2 text-sm">
                  {HELPLINE_INFO.map(line => <p key={line.country}>{line.country}: <strong>{line.number}</strong></p>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="mt-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <File size={20} />
          </button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(userInput)}
            placeholder="Type your message or use the mic..."
            className="flex-1 p-3 bg-transparent focus:outline-none"
            disabled={isBotTyping}
          />
          <button onClick={handleMicClick} className={`p-2 rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button className={`p-3 rounded-full text-white transition-colors ${userInput.trim() ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-400 cursor-not-allowed'}`} disabled={!userInput.trim() || isBotTyping} onClick={() => handleSendMessage(userInput)}>
            <Send size={20} />
          </button>
        </div>
      </div>
      
      {/* Modals */}
      {showAboutModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAboutModal(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-scale-in" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setShowAboutModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                      <X />
                  </button>
                  <h3 className="text-2xl font-bold mb-4">About LumeraGPT</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                      LumeraGPT is your personalized mental wellness companion, designed to offer a supportive and empathetic space for you to express yourself. Using advanced AI, Lumera engages in caring conversations, helps you track your mood, and provides resources to support your well-being journey.
                  </p>
              </div>
          </div>
      )}

      {showContactModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowContactModal(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-scale-in" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setShowContactModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                      <X />
                  </button>
                  <h3 className="text-2xl font-bold mb-4">Contact Info</h3>
                  <div className="text-gray-600 dark:text-gray-300 space-y-2">
                      <p><strong>For support:</strong> support@lumeragpt.app</p>
                      <p><strong>For inquiries:</strong> contact@lumeragpt.app</p>
                      <p className="mt-4 text-sm">Please note: LumeraGPT is not a substitute for professional medical advice. If you are in crisis, please contact a helpline.</p>
                  </div>
              </div>
          </div>
      )}
      <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes fade-in-fast { 0% { opacity: 0; transform: translateY(-5px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
        @keyframes scale-in { 0% { transform: scale(0.95); } 100% { transform: scale(1); } }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};