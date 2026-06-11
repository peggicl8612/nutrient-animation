import { create } from 'zustand';
import type { MealType, TarotCard } from '../types/ui';

interface UIStore {
  isAnalyzing: boolean;
  analyzeProgress: number;
  previewImage: string | null;
  selectedMeal: MealType;
  drawnTarotCard: TarotCard | null;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalyzeProgress: (progress: number) => void;
  setPreviewImage: (url: string | null) => void;
  setSelectedMeal: (meal: MealType) => void;
  setDrawnTarotCard: (card: TarotCard | null) => void;
  resetAnalysis: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isAnalyzing: false,
  analyzeProgress: 0,
  previewImage: null,
  selectedMeal: 'breakfast',
  drawnTarotCard: null,
  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setAnalyzeProgress: (progress) => set({ analyzeProgress: progress }),
  setPreviewImage: (url) => set({ previewImage: url }),
  setSelectedMeal: (meal) => set({ selectedMeal: meal }),
  setDrawnTarotCard: (card) => set({ drawnTarotCard: card }),
  resetAnalysis: () => set({ isAnalyzing: false, analyzeProgress: 0 }),
}));
