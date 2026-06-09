import type { TarotCard } from '../types/ui';
import type { NutritionData } from '../types/nutrition';

export const TAROT_CARDS: TarotCard[] = [
  {
    id: 'comet-overflow',
    title: '逆位 · 溢能彗星',
    image: 'comet',
    description:
      '糖與碳水像未收束的彗星尾跡，在體內劃出短暫的光，卻留下疲憊的餘溫。今日不妨讓節奏慢半拍，用一口溫水把能量收回來。',
    keywords: ['dessert', 'sweet', 'unstable'],
  },
  {
    id: 'crystal-peak',
    title: '正位 · 晶峰守護',
    image: 'crystal',
    description:
      '蛋白質如冰晶山脈，穩穩撑起今日的骨架。你的修復力正在結晶，肌肉與意志同時變得清澈而堅定。',
    keywords: ['protein', 'salad', 'balanced'],
  },
  {
    id: 'nebula-drift',
    title: '正位 · 星雲漂流',
    image: 'nebula',
    description:
      '能量在氣態星球間緩緩流動，血糖像被風梳理過的雲層。這是一張「剛剛好」的牌——不滿溢，也不匱乏。',
    keywords: ['bento', 'moderate', 'stable'],
  },
  {
    id: 'oasis-whisper',
    title: '正位 · 綠洲低語',
    image: 'oasis',
    description:
      '纖維是腸道裡的細雨，潤澤而無聲。星球的大氣層因你而明亮，身體正悄悄感謝這份溫柔的照料。',
    keywords: ['fiber', 'greens', 'vitality'],
  },
  {
    id: 'void-mirror',
    title: '逆位 · 空鏡倒影',
    image: 'mirror',
    description:
      '今日攝取像一面霧化的鏡子，數字模糊卻誠實。不必苛責，先看見自己——明天可以從更小的一步開始。',
    keywords: ['default', 'low', 'uncertain'],
  },
];

function scoreCard(card: TarotCard, data: NutritionData): number {
  let score = 0;
  const name = data.mealName.toLowerCase();

  if (data.carbs.bloodSugarStability < 0.5 && card.keywords.includes('sweet')) score += 3;
  if (data.protein.achievementRate >= 0.3 && card.keywords.includes('protein')) score += 2;
  if (data.carbs.bloodSugarStability >= 0.7 && card.keywords.includes('stable')) score += 2;
  if (data.fiber.achievementRate >= 0.35 && card.keywords.includes('fiber')) score += 2;
  if (name.includes('沙拉') || name.includes('salad')) {
    if (card.keywords.includes('salad')) score += 3;
  }
  if (name.includes('蛋糕') || name.includes('甜') || name.includes('dessert')) {
    if (card.keywords.includes('sweet')) score += 3;
  }
  if (name.includes('便當') || name.includes('bento')) {
    if (card.keywords.includes('bento')) score += 3;
  }
  if (card.keywords.includes('default')) score += 0.5;

  return score + Math.random() * 0.8;
}

export function pickTarotCard(data?: NutritionData): TarotCard {
  if (!data) {
    return TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
  }

  const ranked = [...TAROT_CARDS].sort((a, b) => scoreCard(b, data) - scoreCard(a, data));
  return ranked[0];
}
