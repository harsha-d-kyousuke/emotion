
import React from 'react';
import { Phone } from 'lucide-react';
import { HELPLINE_INFO } from '../constants';

export const Helpline: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Mental Health Helplines</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        If you are in distress, please reach out. Help is available.
      </p>
      <div className="max-w-2xl mx-auto space-y-4">
        {HELPLINE_INFO.map(line => (
          <div key={line.country} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{line.country}</p>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{line.name}</h3>
            </div>
            <a 
              href={`tel:${line.number}`} 
              className="flex items-center gap-2 px-5 py-3 font-bold text-sky-600 bg-sky-100 dark:bg-sky-900/50 dark:text-sky-300 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-900/80 transition-colors"
            >
              <Phone size={18} />
              <span>{line.number}</span>
            </a>
          </div>
        ))}
      </div>
      <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
        <p>In case of an emergency, please contact your local emergency services immediately.</p>
      </div>
    </div>
  );
};
