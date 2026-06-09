import { create } from 'zustand';
import type { NutritionData } from '../types/nutrition';
import { initialMockData } from '../data/mockNutritionData';

interface NutritionStore {
  data: NutritionData;
  previousData: NutritionData;
  setData: (data: NutritionData) => void;
}

export const useNutritionStore = create<NutritionStore>((set, get) => ({
  data: initialMockData,
  previousData: initialMockData,
  setData: (data) => set({ previousData: get().data, data }),
}));
