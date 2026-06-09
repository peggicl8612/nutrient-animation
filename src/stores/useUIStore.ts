import { create } from 'zustand';

interface UIStore {
  isAnalyzing: boolean;
  analyzeProgress: number;
  previewImage: string | null;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalyzeProgress: (progress: number) => void;
  setPreviewImage: (url: string | null) => void;
  resetAnalysis: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isAnalyzing: false,
  analyzeProgress: 0,
  previewImage: null,
  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setAnalyzeProgress: (progress) => set({ analyzeProgress: progress }),
  setPreviewImage: (url) => set({ previewImage: url }),
  resetAnalysis: () => set({ isAnalyzing: false, analyzeProgress: 0 }),
}));
