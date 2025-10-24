
import React, { useState } from 'react';
import type { SettingsType } from '../types';

interface SettingsProps {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
}

export const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const [notification, setNotification] = useState('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };

  const handleToggleChange = (key: keyof SettingsType) => {
    setSettings(prev => {
        const newState = !prev[key];
        const message = `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${newState ? 'enabled' : 'disabled'}`;
        showNotification(message);
        return { ...prev, [key]: newState };
    });
  };

  const handleThemeChange = () => {
    setSettings(prev => {
        const newTheme = prev.theme === 'light' ? 'dark' : 'light';
        showNotification(`Theme set to ${newTheme}`);
        return { ...prev, theme: newTheme };
    });
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setSettings(prev => ({ ...prev, fontSize: newSize }));
  };

  const resetPreferences = () => {
    const defaultSettings = {
        theme: 'light' as 'light' | 'dark',
        fontSize: 16,
        voiceReply: false,
        autoEmotionDetection: true,
        compactView: false,
        privacyMode: false,
    };
    setSettings(defaultSettings);
    localStorage.removeItem('lumera-settings');
    showNotification('Preferences reset to default');
  };

  const Toggle: React.FC<{label: string, checked: boolean, onChange: () => void, description: string}> = ({label, checked, onChange, description}) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
        <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">{label}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-sky-500"></div>
      </label>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h2>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        
        <Toggle label="Dark Theme" checked={settings.theme === 'dark'} onChange={handleThemeChange} description="Switch between light and dark mode." />
        <Toggle label="Voice Reply" checked={settings.voiceReply} onChange={() => handleToggleChange('voiceReply')} description="Enable chatbot to reply with voice." />
        <Toggle label="Auto Emotion Detection" checked={settings.autoEmotionDetection} onChange={() => handleToggleChange('autoEmotionDetection')} description="Automatically detect emotions from your messages." />
        <Toggle label="Compact View" checked={settings.compactView} onChange={() => handleToggleChange('compactView')} description="Reduce spacing for a more compact chat view." />
        <Toggle label="Privacy Mode" checked={settings.privacyMode} onChange={() => handleToggleChange('privacyMode')} description="Blur sensitive content in chat history." />

        <div className="py-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Font Size</h4>
            <div className="flex items-center gap-4">
                <span className="text-sm">A</span>
                <input type="range" min="12" max="20" step="1" value={settings.fontSize} onChange={handleFontSizeChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                <span className="text-xl">A</span>
            </div>
        </div>

        <div className="mt-8 text-center">
            <button onClick={resetPreferences} className="px-6 py-2 text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/80 transition-colors">
                Reset Preferences
            </button>
        </div>
      </div>
      
      {notification && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg animate-fade-in-out">
          {notification}
        </div>
      )}
      <style>{`
        @keyframes fade-in-out {
            0% { opacity: 0; transform: translateY(10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in-out { animation: fade-in-out 2s ease-in-out forwards; }
      `}</style>
    </div>
  );
};
