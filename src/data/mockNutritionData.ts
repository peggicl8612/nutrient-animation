import type { NutritionData } from '../types/nutrition';
import type { ManualNutritionInput } from '../types/ui';

export const initialMockData: NutritionData = {
  mealName: '待分析',
  calories: { intake: 0, target: 2000, achievementRate: 0 },
  protein: { intake: 0, target: 100, achievementRate: 0 },
  carbs: {
    intake: 0,
    target: 250,
    achievementRate: 0,
    bloodSugarStability: 0,
    sugar: 0,
  },
  fat: { intake: 0, target: 65, achievementRate: 0 },
  fiber: { intake: 0, target: 25, achievementRate: 0 },
  sodium: { intake: 0, target: 2300 },
  updatedAt: new Date().toISOString(),
  source: 'initial',
};

export const DEFAULT_MANUAL_INPUT: ManualNutritionInput = {
  mealName: '',
  proteinIntake: 0,
  proteinTarget: 100,
  carbsIntake: 0,
  carbsTarget: 250,
  fiberIntake: 0,
  fiberTarget: 25,
  fatIntake: 0,
  fatTarget: 65,
  sugarIntake: 0,
  sodiumIntake: 0,
  caloriesTarget: 2000,
};
