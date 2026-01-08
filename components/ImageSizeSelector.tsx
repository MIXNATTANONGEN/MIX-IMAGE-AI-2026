
import React from 'react';
import type { ImageSize } from '../types';

interface ImageSizeSelectorProps {
  selectedSize: ImageSize;
  setSize: (size: ImageSize) => void;
}

const SIZES: { id: ImageSize; label: string }[] = [
  { id: '1K', label: '1K (Standard)' },
  { id: '2K', label: '2K (HD)' },
  { id: '4K', label: '4K (Ultra)' },
];

const ImageSizeSelector: React.FC<ImageSizeSelectorProps> = ({ selectedSize, setSize }) => {
  return (
    <div className="mt-3">
       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        Resolution
      </label>
      <div className="flex flex-wrap gap-2">
        {SIZES.map(size => (
          <button
            key={size.id}
            onClick={() => setSize(size.id)}
            className={`beatpad-btn text-[10px] px-3 py-1.5 flex-1 ${selectedSize === size.id ? 'active' : ''}`}
          >
            <span>{size.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSizeSelector;
