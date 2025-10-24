
import React from 'react';
import { Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center h-screen w-screen bg-gradient-to-br from-sky-200 to-blue-400 overflow-hidden">
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/20 animate-pulse"
          style={{
            width: `${Math.random() * 80 + 20}px`,
            height: `${Math.random() * 80 + 20}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            animationName: `float`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>

      <div className="z-10 flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl bg-white/30 backdrop-blur-xl border border-white/20 animate-fade-in-scale">
        <div className="flex items-center text-white mb-4">
          <Sparkles className="w-16 h-16 mr-4 text-white drop-shadow-lg" />
          <h1 className="text-6xl font-bold tracking-tight drop-shadow-lg">LumeraGPT</h1>
        </div>
        <p className="text-xl text-white/90 drop-shadow-md">Your Caring Digital Companion</p>
      </div>

      <style>{`
        @keyframes fade-in-scale {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
