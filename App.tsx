
import React, { useState, useEffect, useCallback } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { MoodTracker } from './components/MoodTracker';
import { WellnessTips } from './components/WellnessTips';
import { Resources } from './components/Resources';
import { Account } from './components/Account';
import { Settings } from './components/Settings';
import { History } from './components/History';
import { Helpline } from './components/Helpline';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { SettingsType, MoodEntry, ViewType, ChatSession } from './types';
import { Bell, Home, Smile, BookOpen, Heart, User, Settings as SettingsIcon, Clock, Phone } from 'lucide-react';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('Home');
  const [chatKey, setChatKey] = useState(Date.now());

  const [settings, setSettings] = useLocalStorage<SettingsType>('lumera-settings', {
    theme: 'light',
    fontSize: 16,
    voiceReply: false,
    autoEmotionDetection: true,
    compactView: false,
    privacyMode: false,
  });

  const [moods, setMoods] = useLocalStorage<MoodEntry[]>('lumera-moods', []);
  const [chatHistory, setChatHistory] = useLocalStorage<ChatSession[]>('lumera-chat-history', []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    document.body.style.fontSize = `${settings.fontSize}px`;
  }, [settings]);

  const addMoodEntry = useCallback((entry: Omit<MoodEntry, 'timestamp'>) => {
    const newEntry: MoodEntry = { ...entry, timestamp: Date.now() };
    setMoods(prevMoods => [...prevMoods, newEntry]);
  }, [setMoods]);

  const saveChatSession = (session: ChatSession) => {
    setChatHistory(prev => [session, ...prev.filter(s => s.id !== session.id)]);
  };
  
  const startNewChat = () => {
    setChatKey(Date.now());
    setActiveView('Home');
  };

  const loadChatSession = (session: ChatSession) => {
    setChatKey(session.id);
    setActiveView('Home');
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'Home':
        return <ChatView key={chatKey} settings={settings} addMoodEntry={addMoodEntry} saveChatSession={saveChatSession} existingSession={chatHistory.find(s => s.id === chatKey)} />;
      case 'Mood Tracking':
        return <MoodTracker moods={moods} addMoodEntry={addMoodEntry} />;
      case 'Tips':
        return <WellnessTips />;
      case 'Resources':
        return <Resources />;
      case 'Account':
        return <Account />;
      case 'Settings':
        return <Settings settings={settings} setSettings={setSettings} />;
      case 'History':
        return <History sessions={chatHistory} loadSession={loadChatSession} setHistory={setChatHistory} />;
      case 'Helpline':
        return <Helpline />;
      default:
        return <ChatView key={chatKey} settings={settings} addMoodEntry={addMoodEntry} saveChatSession={saveChatSession} />;
    }
  };
  
  const sidebarItems = [
      { name: 'Home' as ViewType, icon: Home },
      { name: 'Mood Tracking' as ViewType, icon: Smile },
      { name: 'Tips' as ViewType, icon: Heart },
      { name: 'Resources' as ViewType, icon: BookOpen },
      { name: 'Account' as ViewType, icon: User },
      { name: 'Settings' as ViewType, icon: SettingsIcon },
      { name: 'History' as ViewType, icon: Clock },
      { name: 'Helpline' as ViewType, icon: Phone },
  ];

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className={`flex h-screen w-full bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300`}>
      <Sidebar 
        items={sidebarItems}
        activeView={activeView} 
        setActiveView={setActiveView} 
        onNewChat={startNewChat}
      />
      <main className="flex-1 flex flex-col h-screen overflow-y-hidden">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default App;
