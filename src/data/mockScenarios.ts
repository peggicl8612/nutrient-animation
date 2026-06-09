import type { NutritionData } from '../types/nutrition';

const SCENARIOS: Record<string, Omit<NutritionData, 'updatedAt' | 'source'>> = {
  salad: {
    mealName: '綜合蔬菜沙拉',
    calories: { intake: 420, target: 2000, achievementRate: 0.21 },
    protein: { intake: 28, target: 100, achievementRate: 0.28 },
    carbs: { intake: 32, target: 250, achievementRate: 0.13, bloodSugarStability: 0.91, sugar: 8 },
    fat: { intake: 18, target: 65, achievementRate: 0.28 },
    fiber: { intake: 12, target: 25, achievementRate: 0.48 },
    sodium: { intake: 320, target: 2300 },
  },
  dessert: {
    mealName: '草莓千層蛋糕',
    calories: { intake: 580, target: 2000, achievementRate: 0.29 },
    protein: { intake: 8, target: 100, achievementRate: 0.08 },
    carbs: { intake: 72, target: 250, achievementRate: 0.29, bloodSugarStability: 0.28, sugar: 48 },
    fat: { intake: 28, target: 65, achievementRate: 0.43 },
    fiber: { intake: 2, target: 25, achievementRate: 0.08 },
    sodium: { intake: 280, target: 2300 },
  },
  bento: {
    mealName: '日式雞腿便當',
    calories: { intake: 720, target: 2000, achievementRate: 0.36 },
    protein: { intake: 32, target: 100, achievementRate: 0.32 },
    carbs: { intake: 88, target: 250, achievementRate: 0.35, bloodSugarStability: 0.74, sugar: 12 },
    fat: { intake: 22, target: 65, achievementRate: 0.34 },
    fiber: { intake: 6, target: 25, achievementRate: 0.24 },
    sodium: { intake: 980, target: 2300 },
  },
  default: {
    mealName: '辨識餐點',
    calories: { intake: 520, target: 2000, achievementRate: 0.26 },
    protein: { intake: 35, target: 100, achievementRate: 0.35 },
    carbs: { intake: 48, target: 250, achievementRate: 0.19, bloodSugarStability: 0.72, sugar: 18 },
    fat: { intake: 20, target: 65, achievementRate: 0.31 },
    fiber: { intake: 8, target: 25, achievementRate: 0.32 },
    sodium: { intake: 640, target: 2300 },
  },
};

function resolveScenarioKey(hints: string): keyof typeof SCENARIOS {
  const name = hints.toLowerCase();
  if (name.includes('salad') || name.includes('蔬菜') || name.includes('沙拉')) return 'salad';
  if (name.includes('cake') || name.includes('dessert') || name.includes('甜') || name.includes('蛋糕')) return 'dessert';
  if (name.includes('bento') || name.includes('便當')) return 'bento';
  return 'default';
}

export function pickScenarioFromHints(hints: {
  fileName?: string;
  mealName?: string;
}): NutritionData {
  const combined = [hints.fileName, hints.mealName].filter(Boolean).join(' ');
  const key = resolveScenarioKey(combined);
  const scenario = SCENARIOS[key] ?? SCENARIOS.default;
  const customMealName = hints.mealName?.trim();

  return {
    ...scenario,
    mealName: customMealName || scenario.mealName,
    updatedAt: new Date().toISOString(),
    source: 'ai-mock',
  };
}

export function pickScenarioFromFile(file: File, mealName?: string): NutritionData {
  return pickScenarioFromHints({ fileName: file.name, mealName });
}
