export type NutritionSource = 'initial' | 'manual' | 'ai-mock' | 'ai';


export interface MacroNutrient {
  intake: number;
  target: number;
  achievementRate: number;
}

export interface NutritionData {
  mealName: string;
  calories: MacroNutrient;
  protein: MacroNutrient;
  carbs: MacroNutrient & { bloodSugarStability: number; sugar: number };
  fat: MacroNutrient;
  fiber: MacroNutrient;
  sodium: { intake: number; target: number };
  updatedAt: string;
  source: NutritionSource;
}

