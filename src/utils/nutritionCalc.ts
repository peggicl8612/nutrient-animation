import type { NutritionData } from '../types/nutrition';
import type { ManualNutritionInput } from '../types/ui';

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function achievementRate(intake: number, target: number) {
  if (target <= 0) return 0;
  return clamp01(intake / target);
}

export function estimateCalories(protein: number, carbs: number, fat: number, fiber: number) {
  return Math.round(protein * 4 + carbs * 4 + fat * 9 + fiber * 2);
}

export function bloodSugarStabilityFromCarbs(intake: number, target: number, sugar: number) {
  const ratio = target > 0 ? intake / target : 1;
  const sugarPenalty = sugar > 25 ? 0.15 : sugar > 15 ? 0.08 : 0;
  let base = 0.7;
  if (ratio <= 0.85) base = 0.92;
  else if (ratio <= 1.0) base = 0.78;
  else if (ratio <= 1.2) base = 0.55;
  else base = 0.35;
  return clamp01(base - sugarPenalty);
}

export function buildFromManual(input: ManualNutritionInput): NutritionData {
  const calorieIntake = estimateCalories(
    input.proteinIntake,
    input.carbsIntake,
    input.fatIntake,
    input.fiberIntake
  );

  return {
    mealName: input.mealName || '自訂餐點',
    calories: {
      intake: calorieIntake,
      target: input.caloriesTarget,
      achievementRate: achievementRate(calorieIntake, input.caloriesTarget),
    },
    protein: {
      intake: input.proteinIntake,
      target: input.proteinTarget,
      achievementRate: achievementRate(input.proteinIntake, input.proteinTarget),
    },
    carbs: {
      intake: input.carbsIntake,
      target: input.carbsTarget,
      achievementRate: achievementRate(input.carbsIntake, input.carbsTarget),
      bloodSugarStability: bloodSugarStabilityFromCarbs(
        input.carbsIntake,
        input.carbsTarget,
        input.sugarIntake
      ),
      sugar: input.sugarIntake,
    },
    fat: {
      intake: input.fatIntake,
      target: input.fatTarget,
      achievementRate: achievementRate(input.fatIntake, input.fatTarget),
    },
    fiber: {
      intake: input.fiberIntake,
      target: input.fiberTarget,
      achievementRate: achievementRate(input.fiberIntake, input.fiberTarget),
    },
    sodium: {
      intake: input.sodiumIntake,
      target: 2300,
    },
    updatedAt: new Date().toISOString(),
    source: 'manual',
  };
}

export function macroPercentages(data: NutritionData) {
  const total = data.protein.intake * 4 + data.carbs.intake * 4 + data.fat.intake * 9;
  if (total <= 0) return { protein: 0, carbs: 0, fat: 0 };
  return {
    protein: Math.round((data.protein.intake * 4 / total) * 100),
    carbs: Math.round((data.carbs.intake * 4 / total) * 100),
    fat: Math.round((data.fat.intake * 9 / total) * 100),
  };
}
