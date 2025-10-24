
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WELLNESS_TIPS } from '../constants';

type Tip = typeof WELLNESS_TIPS[0];

export const WellnessTips: React.FC = () => {
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  const TipCard: React.FC<{ tip: Tip }> = ({ tip }) => (
    <div
      onClick={() => setSelectedTip(tip)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:bg-sky-50 dark:hover:bg-sky-900/40"
    >
      <div className="text-5xl mb-4">{tip.icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{tip.title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{tip.benefit}</p>
    </div>
  );

  const TipModal: React.FC<{ tip: Tip; onClose: () => void }> = ({ tip, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative transform transition-transform animate-scale-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <X />
        </button>
        <div className="text-6xl text-center mb-4">{tip.icon}</div>
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">{tip.title}</h2>
        <div className="text-center mb-6">
          <span className="bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">{tip.duration}</span>
        </div>
        <p className="text-lg mb-4 text-gray-600 dark:text-gray-300">{tip.description}</p>
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-200">Benefits:</h4>
          <p className="text-gray-600 dark:text-gray-300">{tip.benefit}</p>
        </div>
      </div>
       <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes scale-in { 0% { transform: scale(0.95); } 100% { transform: scale(1); } }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Wellness Tips</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Here are some simple activities you can try to improve your mental well-being.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {WELLNESS_TIPS.map(tip => (
          <TipCard key={tip.title} tip={tip} />
        ))}
      </div>
      {selectedTip && <TipModal tip={selectedTip} onClose={() => setSelectedTip(null)} />}
    </div>
  );
};
