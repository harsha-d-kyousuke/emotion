
import React, { useMemo } from 'react';
import type { MoodEntry, Emotion } from '../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid } from 'recharts';
import { Smile, Frown, Meh, Angry, Annoyed, LucideProps } from 'lucide-react';

interface MoodTrackerProps {
  moods: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'timestamp'>) => void;
}

// FIX: Use a more specific type for the icon elements to allow props like `size` to be added via cloneElement.
const emotionIcons: Record<Emotion, React.ReactElement<LucideProps>> = {
  Happy: <Smile className="text-yellow-500" />,
  Sad: <Frown className="text-blue-500" />,
  Anxious: <Annoyed className="text-purple-500" />,
  Angry: <Angry className="text-red-500" />,
  Calm: <Meh className="text-green-500" />,
  Neutral: <Meh className="text-gray-500" />,
};

const emotionColors: Record<Emotion, string> = {
    Happy: '#FBBF24',
    Sad: '#3B82F6',
    Anxious: '#8B5CF6',
    Angry: '#EF4444',
    Calm: '#22C55E',
    Neutral: '#6B7280',
};


export const MoodTracker: React.FC<MoodTrackerProps> = ({ moods, addMoodEntry }) => {
  const manualMoods: Emotion[] = ['Happy', 'Sad', 'Angry', 'Anxious', 'Calm'];
  
  const chartData = useMemo(() => {
    // FIX: Add a specific type for the accumulator to ensure type safety.
    const emotionCounts = moods.reduce((acc, entry) => {
        const date = new Date(entry.timestamp).toLocaleDateString('en-CA'); // YYYY-MM-DD format
        if (!acc[date]) {
            acc[date] = { date, Happy: 0, Sad: 0, Anxious: 0, Angry: 0, Calm: 0, Neutral: 0 };
        }
        acc[date][entry.emotion]++;
        return acc;
    }, {} as Record<string, { date: string; Happy: number; Sad: number; Anxious: number; Angry: number; Calm: number; Neutral: number; }>);

    // FIX: Use `emotionCounts` here instead of `chartData` which is not yet defined.
    return Object.values(emotionCounts).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [moods]);

  const recentMoods = useMemo(() => {
    return [...moods].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [moods]);

  return (
    <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Mood Tracking</h2>
      
      {/* Manual Entry */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">How are you feeling right now?</h3>
        <div className="flex flex-wrap gap-4">
          {manualMoods.map(emotion => (
            <button
              key={emotion}
              onClick={() => addMoodEntry({ emotion })}
              className="flex-1 min-w-[80px] flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2 border-transparent transition-all duration-200 hover:shadow-md hover:-translate-y-1"
              style={{ backgroundColor: `${emotionColors[emotion]}20`, color: emotionColors[emotion] }}
            >
              {/* FIX: Remove unnecessary cast as the type of `emotionIcons` is now correctly defined. */}
              {React.cloneElement(emotionIcons[emotion], { size: 24 })}
              <span className="font-semibold">{emotion}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Chart */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg h-[400px]">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Your Mood Over Time</h3>
        {moods.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(5px)',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {manualMoods.map(emotion => (
                 <Bar key={emotion} dataKey={emotion} stackId="a" fill={emotionColors[emotion]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p>No mood data yet. Start a conversation or log your mood manually!</p>
            </div>
        )}
      </div>

      {/* Recent Entries */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Recent Moods</h3>
        {recentMoods.length > 0 ? (
          <ul className="space-y-3">
            {recentMoods.map((mood, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {/* FIX: Remove unnecessary cast as the type of `emotionIcons` is now correctly defined. */}
                  {React.cloneElement(emotionIcons[mood.emotion], { size: 20 })}
                  <span className="font-medium" style={{color: emotionColors[mood.emotion]}}>{mood.emotion}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(mood.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
            <p className="text-gray-500 dark:text-gray-400">No recent moods recorded.</p>
        )}
      </div>
    </div>
  );
};
