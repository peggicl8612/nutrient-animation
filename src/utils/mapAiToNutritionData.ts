import { achievementRate, buildFromManual } from './nutritionCalc';
import { DEFAULT_MANUAL_INPUT } from '../data/mockNutritionData';
import type { NutritionData } from '../types/nutrition';
import type { AiFoodResult } from '../hooks/useNutrientAI';
import type { ManualNutritionInput } from '../types/ui';

export function mapAiToNutritionData(
  ai: AiFoodResult,
  targets: Pick<
    ManualNutritionInput,
    | 'proteinTarget'
    | 'carbsTarget'
    | 'fiberTarget'
    | 'fatTarget'
    | 'caloriesTarget'
  > = DEFAULT_MANUAL_INPUT,
): NutritionData {
  const data = buildFromManual({
    mealName: ai.foodName?.trim() || '辨識餐點',
    proteinIntake: ai.protein,
    proteinTarget: targets.proteinTarget,
    carbsIntake: ai.carbs,
    carbsTarget: targets.carbsTarget,
    fiberIntake: ai.fiber ?? 0,
    fiberTarget: targets.fiberTarget,
    fatIntake: ai.fat,
    fatTarget: targets.fatTarget,
    sugarIntake: ai.sugar ?? 0,
    sodiumIntake: ai.sodium ?? 0,
    caloriesTarget: targets.caloriesTarget,
  });

  if (ai.calories > 0) {
    data.calories.intake = ai.calories;
    data.calories.achievementRate = achievementRate(ai.calories, targets.caloriesTarget);
  }

  return { ...data, source: 'ai' };
}
