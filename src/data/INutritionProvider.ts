import type { NutritionData } from '../types/nutrition';
import type { ManualNutritionInput, MealType } from '../types/ui';

export interface AnalysisOptions {
  file?: File;
  manual?: ManualNutritionInput;
  mealName?: string;
  mealType?: MealType;
}

export interface INutritionProvider {
  simulateAnalysis(
    options: AnalysisOptions,
    onProgress?: (progress: number) => void
  ): Promise<NutritionData>;
}
