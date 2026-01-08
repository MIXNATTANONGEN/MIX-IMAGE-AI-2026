
import React from 'react';

interface ThinkingToggleProps {
  enabled: boolean;
  onToggle: (val: boolean) => void;
}

const ThinkingToggle: React.FC<ThinkingToggleProps> = ({ enabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between nm-inset p-3 rounded-xl">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${enabled ? 'text-indigo-600' : 'text-slate-400'}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.535 5.354a1 1 0 001.415 0 3.5 3.5 0 014.24 0 1 1 0 101.415-1.414 5.5 5.5 0 00-7.07 0 1 1 0 000 1.414z" clipRule="evenodd" />
        </svg>
        <span className={`text-[10px] font-black uppercase tracking-widest ${enabled ? 'text-indigo-600' : 'text-slate-500'}`}>
          Thinking Mode
        </span>
      </div>
      <button 
        onClick={() => onToggle(!enabled)}
        className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-5' : ''}`}></div>
      </button>
    </div>
  );
};

export default ThinkingToggle;
