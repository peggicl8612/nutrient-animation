import type { NutritionData } from '../types/nutrition';
import type { ManualNutritionInput } from '../types/ui';

export const initialMockData: NutritionData = {
  mealName: '今日累計',
  calories: { intake: 1680, target: 2000, achievementRate: 0.84 },
  protein: { intake: 85, target: 100, achievementRate: 0.85 },
  carbs: {
    intake: 220,
    target: 250,
    achievementRate: 0.88,
    bloodSugarStability: 0.7,
    sugar: 42,
  },
  fat: { intake: 58, target: 65, achievementRate: 0.89 },
  fiber: { intake: 18, target: 25, achievementRate: 0.72 },
  sodium: { intake: 1680, target: 2300 },
  updatedAt: new Date().toISOString(),
  source: 'initial',
};

export const DEFAULT_MANUAL_INPUT: ManualNutritionInput = {
  mealName: '',
  proteinIntake: 85,
  proteinTarget: 100,
  carbsIntake: 220,
  carbsTarget: 250,
  fiberIntake: 18,
  fiberTarget: 25,
  fatIntake: 58,
  fatTarget: 65,
  sugarIntake: 42,
  sodiumIntake: 1680,
  caloriesTarget: 2000,
};
