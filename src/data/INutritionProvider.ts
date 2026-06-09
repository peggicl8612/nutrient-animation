import type { NutritionData } from '../types/nutrition';
import type { ManualNutritionInput } from '../types/ui';

export interface AnalysisOptions {
  file?: File;
  manual?: ManualNutritionInput;
}

export interface INutritionProvider {
  simulateAnalysis(
    options: AnalysisOptions,
    onProgress?: (progress: number) => void
  ): Promise<NutritionData>;
}
