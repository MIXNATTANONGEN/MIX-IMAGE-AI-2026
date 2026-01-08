
import React from 'react';
import type { ColorOption } from '../types';

interface ColorPickerProps {
  colors: ColorOption[];
  selectedColor?: string;
  onSelect: (colorValue: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, selectedColor, onSelect }) => {
  const activeLabel = colors.find(c => c.value === selectedColor)?.label || 'เลือกสี';

  return (
    <div className="relative -mt-[1px] p-3 bg-stone-50 border border-stone-200 border-t-0 rounded-b-xl shadow-sm w-full animate-fade-in-up z-10 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs px-1">
            <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Color Palette</span>
            <span className="text-amber-700 font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-stone-100 text-[10px]">
                {activeLabel}
            </span>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
            {colors.map((color) => {
                const isSelected = selectedColor === color.value;
                // Determine contrast text color for checkmark
                const isWhiteOrLight = ['#ffffff', '#fef3c7', '#fce7f3', '#e5e7eb'].includes(color.hex.toLowerCase());
                const checkmarkColor = isWhiteOrLight ? 'text-stone-600' : 'text-white';

                return (
                    <button
                        key={color.value}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(color.value);
                        }}
                        className={`
                            group relative w-7 h-7 rounded-full 
                            flex items-center justify-center
                            transition-all duration-200
                            ${isSelected 
                                ? 'ring-2 ring-offset-1 ring-amber-500 scale-110 z-10' 
                                : 'hover:scale-110 ring-1 ring-stone-200 ring-offset-0 opacity-90 hover:opacity-100'
                            }
                        `}
                        style={{ backgroundColor: color.hex }}
                        title={color.label}
                        type="button"
                    >
                        {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${checkmarkColor}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default ColorPicker;
