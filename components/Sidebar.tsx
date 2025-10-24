
import React, { useState } from 'react';
import type { ViewType } from '../types';
import { Sparkles, PlusCircle, Menu, X } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface SidebarItem {
    name: ViewType;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

interface SidebarProps {
  items: SidebarItem[];
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, activeView, setActiveView, onNewChat }) => {
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-8 px-2">
        <Sparkles className="w-8 h-8 mr-2 text-sky-500" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">LumeraGPT</h1>
      </div>
      
      <button 
        onClick={onNewChat}
        className="flex items-center justify-center w-full px-4 py-3 mb-6 text-md font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        <PlusCircle className="w-5 h-5 mr-2"/>
        New Chat
      </button>

      <nav className="flex-1 space-y-2">
        {items.map(({ name, icon: Icon }) => (
          <a
            key={name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView(name);
              if (isOpen) setIsOpen(false);
            }}
            className={`flex items-center px-4 py-3 text-md rounded-lg transition-all duration-200 ${
              activeView === name
                ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="w-5 h-5 mr-4" />
            {name}
          </a>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent />
      </div>
       {isOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setIsOpen(false)}></div>}


      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:w-1/5 lg:w-1/6 xl:w-[280px] flex-shrink-0">
        <NavContent />
      </aside>
    </>
  );
};
