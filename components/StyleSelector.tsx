
import React, { useState, useCallback } from 'react';
import { CATEGORIES, STYLES } from '../constants';
import type { SelectedStyles, StyleCategory, SavedPreset, Gender, Style, SavedClothing } from '../types';
import ColorPicker from './ColorPicker';

interface StyleSelectorProps {
  selectedStyles: SelectedStyles;
  onStyleSelect: (category: StyleCategory, value: string, payload?: any) => void;
  onDeletePreset: (presetName: string) => void;
  isOutfitUploaded: boolean;
  savedPresets: SavedPreset[];
  analyzedGender: Gender | null;
  savedClothes: SavedClothing[];
  onToggleSavedClothing: (style: Style, gender: Gender) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ 
  selectedStyles, 
  onStyleSelect, 
  onDeletePreset, 
  isOutfitUploaded, 
  savedPresets, 
  analyzedGender, 
  savedClothes,
  onToggleSavedClothing
}) => {
  const [activeCategory, setActiveCategory] = useState<StyleCategory>('clothes');

  const handleTabClick = useCallback((category: StyleCategory) => {
    const isGenderDependent = ['clothes', 'hairstyle', 'retouching', 'saved_clothes'].includes(category);
    const isClothesAndUploaded = category === 'clothes' && isOutfitUploaded;
    
    if(isClothesAndUploaded || (isGenderDependent && !analyzedGender)) {
        return;
    }
    setActiveCategory(category);
  }, [isOutfitUploaded, analyzedGender]);

  const handleStyleClick = useCallback((category: StyleCategory, value: string, payload?: any) => {
    onStyleSelect(category, value, payload);
  }, [onStyleSelect]);

  const isSelected = (category: StyleCategory, prompt: string): boolean => {
    if (category === 'retouching' || category === 'lighting') {
      return selectedStyles[category]?.includes(prompt) ?? false;
    }
    return selectedStyles[category as keyof Omit<SelectedStyles, 'retouching'|'lighting'|'clothes_color'>] === prompt;
  };

  const renderStyleButtons = (category: StyleCategory): React.ReactNode => {
    const genderKey = analyzedGender === 'ชาย' ? 'male' : 'female';
    let stylesToRender: Style[] = [];

    switch (category) {
        case 'clothes':
        case 'retouching':
        case 'hairstyle':
            if (analyzedGender) stylesToRender = STYLES[category][genderKey];
            else return <p className="col-span-full text-center text-slate-400 py-4 font-medium italic">กรุณาอัปโหลดรูปภาพเพื่อดูสไตล์</p>;
            break;
        default:
            stylesToRender = STYLES[category as keyof typeof STYLES] as Style[];
            break;
    }

    return stylesToRender.map(style => {
        const selected = isSelected(category, style.prompt);
        return (
            <div key={style.label} className="relative group">
              <button 
                  className={`beatpad-btn w-full p-3 text-xs sm:text-sm ${selected ? 'active' : ''}`}
                  onClick={() => handleStyleClick(category, style.prompt)}
              >
                  {style.label}
              </button>
            </div>
        );
    });
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-8 px-2">
        {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button 
                key={cat.id}
                className={`px-4 py-2 text-xs font-bold transition-all rounded-full nm-button
                  ${isActive ? 'nm-inset text-indigo-600' : 'text-slate-500'}`}
                onClick={() => handleTabClick(cat.id)}
              >
                {cat.label}
              </button>
            );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 nm-inset rounded-3xl min-h-[200px]">
        {renderStyleButtons(activeCategory)}
      </div>
    </>
  );
};

export default StyleSelector;
