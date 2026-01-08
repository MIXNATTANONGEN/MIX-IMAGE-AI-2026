import type { SavedPreset, SavedClothing } from '../types';

const PRESETS_KEY = 'miximage_presets';
const CLOTHES_KEY = 'miximage_saved_clothes';

export const storage = {
  getPresets: (): SavedPreset[] => {
    try {
      const data = localStorage.getItem(PRESETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load presets", e);
      return [];
    }
  },
  savePresets: (presets: SavedPreset[]) => {
    try {
      localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    } catch (e) {
      console.error("Failed to save presets", e);
      throw new Error("Storage full or unavailable");
    }
  },
  getClothes: (): SavedClothing[] => {
    try {
      const data = localStorage.getItem(CLOTHES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load clothes", e);
      return [];
    }
  },
  saveClothes: (clothes: SavedClothing[]) => {
    try {
      localStorage.setItem(CLOTHES_KEY, JSON.stringify(clothes));
    } catch (e) {
      console.error("Failed to save clothes", e);
      throw new Error("Storage full or unavailable");
    }
  }
};