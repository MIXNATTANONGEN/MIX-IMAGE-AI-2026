
import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  setRatio: (ratio: AspectRatio) => void;
}

const RATIOS: { id: AspectRatio; label: string }[] = [
  { id: '1:1', label: '1:1' },
  { id: '3:4', label: '3:4' },
  { id: '4:3', label: '4:3' },
  { id: '2:3', label: '2:3' },
  { id: '3:2', label: '3:2' },
  { id: '9:16', label: '9:16' },
  { id: '16:9', label: '16:9' },
  { id: '21:9', label: '21:9' },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, setRatio }) => {
  return (
    <div>
       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        Ratio
      </label>
      <div className="flex flex-wrap gap-1.5">
        {RATIOS.map(ratio => (
          <button
            key={ratio.id}
            onClick={() => setRatio(ratio.id)}
            className={`beatpad-btn text-[9px] px-2 py-1.5 min-w-[44px] ${selectedRatio === ratio.id ? 'active' : ''}`}
          >
            <span>{ratio.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
