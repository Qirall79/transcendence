import React from 'react';
import { ArrowLeft, History } from 'lucide-react';

type GameHeaderProps = {
  title: string;
  onBack: () => void;
  onViewHistory: () => void;
};

const Header = ({ title, onBack, onViewHistory }: GameHeaderProps) => {
  return (
    <div className="p-4 flex items-center relative border-b border-gray-800">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>BACK</span>
      </button>
      
      <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-white">
        {title}
      </h1>
      
      <button 
        onClick={onViewHistory}
        className="ml-auto flex items-center gap-2 text-gray-400 hover:text-white"
      >
        <History className="w-5 h-5" />
        <span className="hidden sm:inline">HISTORY</span>
      </button>
    </div>
  );
};

export default Header;