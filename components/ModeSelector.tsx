
import React from 'react';
import type { OperatingMode } from '../types';

interface ModeSelectorProps {
  activeMode: OperatingMode;
  onModeChange: (mode: OperatingMode) => void;
}

const MODES: { id: OperatingMode; label: string; icon: React.ReactNode }[] = [
  { 
    id: 'studio', 
    label: 'Studio', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
  },
  { 
    id: 'repair', 
    label: 'Repair', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 2.293a1 1 0 011.414 0l-1 1a1 1 0 01-1.414-1.414l1-1zM15.586 5.586a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 0zM12.293 9.293a1 1 0 011.414 0l-1 1a1 1 0 01-1.414-1.414l1-1zM5.586 15.586a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 0zM11 5a1 1 0 01-1.414-1.414l1-1a1 1 0 011.414 1.414l-1 1zM4.293 2.293a1 1 0 011.414 0l-1 1a1 1 0 01-1.414-1.414l1-1zM10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 14a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm14 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"/></svg>
  },
  {
    id: 'headshot',
    label: 'Headshot',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
  },
  {
    id: 'editor',
    label: 'Editor',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.046A4.993 4.993 0 0116.954 8H18a1 1 0 110 2h-1.046A4.993 4.993 0 0112 16.954V18a1 1 0 11-2 0v-1.046A4.993 4.993 0 013.046 12H2a1 1 0 110-2h1.046A4.993 4.993 0 018 3.046V2a1 1 0 011.414-.924l.434.217a1 1 0 011.452 0l.434-.217zM12 4.569a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-3.82 5.68a1.5 1.5 0 10-2.836 1.414 6.493 6.493 0 002.836-1.414zm7.64 0a6.493 6.493 0 002.836 1.414 1.5 1.5 0 10-2.836-1.414zM12 15.431a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" /></svg>
  }
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="flex justify-center mb-8 bg-[#e0e5ec] p-2 rounded-2xl nm-inset max-w-lg mx-auto">
      {MODES.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-all duration-300 rounded-xl
            ${activeMode === mode.id
              ? 'nm-inset text-indigo-600'
              : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          {mode.icon}
          <span>{mode.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
