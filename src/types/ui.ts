export type AnalysisState = 'idle' | 'analyzing' | 'done' | 'error';

export interface ManualNutritionInput {
  mealName: string;
  proteinIntake: number;
  proteinTarget: number;
  carbsIntake: number;
  carbsTarget: number;
  fiberIntake: number;
  fiberTarget: number;
  fatIntake: number;
  fatTarget: number;
  sugarIntake: number;
  sodiumIntake: number;
  caloriesTarget: number;
}
