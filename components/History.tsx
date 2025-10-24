
import React from 'react';
import type { ChatSession } from '../types';
import { MessageSquare, Trash2 } from 'lucide-react';

interface HistoryProps {
  sessions: ChatSession[];
  loadSession: (session: ChatSession) => void;
  setHistory: React.Dispatch<React.SetStateAction<ChatSession[]>>;
}

export const History: React.FC<HistoryProps> = ({ sessions, loadSession, setHistory }) => {
  const clearHistory = () => {
    if (window.confirm("Are you sure you want to delete all chat history? This action cannot be undone.")) {
      setHistory([]);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Chat History</h2>
        {sessions.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => loadSession(session)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-sky-500 border-2 border-transparent"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Chat from {new Date(session.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    "{session.summary || 'No summary available'}"
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(session.startTime).toLocaleTimeString()}
                  </p>
                  <div className="flex items-center justify-end mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <MessageSquare size={14} className="mr-1.5" />
                    <span>{session.messages.length} messages</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <MessageSquare size={48} className="mb-4" />
          <h3 className="text-xl font-semibold">No Chat History</h3>
          <p>Your past conversations will appear here.</p>
        </div>
      )}
    </div>
  );
};
