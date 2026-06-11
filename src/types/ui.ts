export type AnalysisState = 'idle' | 'analyzing' | 'done' | 'error';

export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'night';

export interface MealColorToken {
  primary: string;
  glow: string;
  label: string;
}

export const MEAL_COLORS: Record<MealType, MealColorToken> = {
  breakfast: { primary: '#F3E7C4', glow: 'rgba(243, 231, 196, 0.6)', label: '早餐' },
  lunch: { primary: '#E8F0D8', glow: 'rgba(232, 240, 216, 0.6)', label: '午餐' },
  snack: { primary: '#F5E6DC', glow: 'rgba(245, 230, 220, 0.6)', label: '點心' },
  dinner: { primary: '#E4E0F0', glow: 'rgba(228, 224, 240, 0.6)', label: '晚餐' },
  night: { primary: '#D8E4F0', glow: 'rgba(216, 228, 240, 0.6)', label: '宵夜' },
};

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner', 'night'];

export interface TarotCard {
  id: number;
  cardName: string;
  zhName: string;
  themeColor: string;
  /** Iconify 圖示名稱，如 lucide:sparkles */
  icon: string;
  dailyMindset: string;
  nutritionAction: string;
  keywords: string[];
}

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
