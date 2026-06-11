import type { TarotCard } from '../types/ui';
import type { NutritionData } from '../types/nutrition';

export const TAROT_CARDS: TarotCard[] = [
  {
    id: 0,
    cardName: 'The Fool',
    zhName: '愚者',
    themeColor: '#FDE68A',
    icon: 'game-icons:tarot-00-the-fool',
    dailyMindset: '放下對完美數字的執著，每一次的嘗試都是滋養身體的新旅程。',
    nutritionAction:
      '給腸胃一點新鮮的刺激！今天試著在菜單中加入一種你平時很少吃，甚至從沒吃過的原型蔬菜或水果，讓腸道菌群更多樣化。',
    keywords: ['default', 'variety', 'new', 'low'],
  },
  {
    id: 1,
    cardName: 'The Magician',
    zhName: '魔術師',
    themeColor: '#FCA5A5',
    icon: 'game-icons:tarot-01-the-magician',
    dailyMindset: '你擁有轉化能量的魔法，你吃進去的每一口都在塑造未來的你。',
    nutritionAction:
      '今天是發揮創意的好時機！不要依賴外送，嘗試自己動手將冰箱裡的剩餘食材，變化成一道少油少鹽的健康輕食吧。',
    keywords: ['creative', 'balanced', 'moderate'],
  },
  {
    id: 8,
    cardName: 'Strength',
    zhName: '力量',
    themeColor: '#FDBA74',
    icon: 'game-icons:tarot-08-strength',
    dailyMindset: '真正的強大不是對抗身體的渴望，而是用溫柔的方式引導它。',
    nutritionAction:
      '穩定的蛋白質是你最佳的後盾。今天請確保攝取足夠的優質蛋白質（如豆腐、雞肉、魚肉），幫助修復身體疲勞，維持長效的飽足感。',
    keywords: ['protein', 'muscle', 'repair'],
  },
  {
    id: 9,
    cardName: 'The Hermit',
    zhName: '隱者',
    themeColor: '#94A3B8',
    icon: 'game-icons:tarot-09-the-hermit',
    dailyMindset: '在喧囂的生活中，留一頓飯的時間給自己，傾聽身體最真實的聲音。',
    nutritionAction:
      '練習「正念飲食」。今天挑選一餐，放下手機、關掉螢幕，每一口食物都咀嚼至少 20 下，感受食材原始的甜味與質地，這能大幅減少消化不良與過度進食。',
    keywords: ['mindful', 'slow', 'reflect'],
  },
  {
    id: 10,
    cardName: 'Wheel of Fortune',
    zhName: '命運之輪',
    themeColor: '#A78BFA',
    icon: 'arcticons:pakwheels',
    dailyMindset: '身體有自己的四季與週期，順應它的節奏，不需要永遠保持在最高頻。',
    nutritionAction:
      '選擇當季的食物！順應時令的蔬菜和水果不僅營養價值最高，還能順應身體在當下氣候所需的能量變化。',
    keywords: ['seasonal', 'cycle', 'stable'],
  },
  {
    id: 14,
    cardName: 'Temperance',
    zhName: '節制',
    themeColor: '#6EE7B7',
    icon: 'iconoir:balance-scale',
    dailyMindset: '健康是一場長期的動態平衡，不需要極端的剝奪，只需要剛好的調和。',
    nutritionAction:
      '水分是你今天最好的調和劑。如果下午突然嘴饞，先喝一杯溫開水或無糖花草茶，有時候身體發出的假性飢餓，只是因為輕微缺水而已。',
    keywords: ['balance', 'hydration', 'water', 'sweet'],
  },
  {
    id: 17,
    cardName: 'The Star',
    zhName: '星星',
    themeColor: '#93C5FD',
    icon: 'arcticons:tarot-stars',
    dailyMindset: '對自己的身體保持希望，每一次微小的健康選擇，都會匯聚成明亮的星光。',
    nutritionAction:
      '今天請為自己準備一份色彩豐富的餐點。確保盤子裡有三種以上不同顏色的植化素（如紅番茄、綠花椰、紫洋蔥），讓抗氧化能量點亮你的細胞。',
    keywords: ['fiber', 'greens', 'colorful', 'salad'],
  },
  {
    id: 19,
    cardName: 'The Sun',
    zhName: '太陽',
    themeColor: '#FEF08A',
    icon: 'glyphs:sun-outline',
    dailyMindset: '讓溫暖的能量流過全身，為充滿活力的一天歡呼。',
    nutritionAction:
      '碳水化合物是驅動大腦與身體的快樂泉源！今天不用害怕澱粉，選擇優質的複合性碳水（如燕麥、地瓜、糙米），它們會提供你像陽光般穩定持久的能量。',
    keywords: ['carbs', 'energy', 'stable'],
  },
];

interface NutritionSignals {
  proteinGap: number;
  fiberGap: number;
  carbsRate: number;
  caloriesRate: number;
  fatRate: number;
  proteinLow: boolean;
  fiberLow: boolean;
  carbsLow: boolean;
  carbsStable: boolean;
  bloodSugarLow: boolean;
  sugarHigh: boolean;
  sodiumHigh: boolean;
  calorieHigh: boolean;
  fatHigh: boolean;
  overallLow: boolean;
  wellBalanced: boolean;
  mealName: string;
}

function analyzeNutritionSignals(data: NutritionData): NutritionSignals {
  const proteinGap = Math.max(0, 1 - data.protein.achievementRate);
  const fiberGap = Math.max(0, 1 - data.fiber.achievementRate);
  const carbsRate = data.carbs.achievementRate;
  const caloriesRate = data.calories.achievementRate;
  const fatRate = data.fat.achievementRate;
  const macroRates = [data.protein.achievementRate, carbsRate, data.fiber.achievementRate];

  return {
    proteinGap,
    fiberGap,
    carbsRate,
    caloriesRate,
    fatRate,
    proteinLow: data.protein.achievementRate < 0.45,
    fiberLow: data.fiber.achievementRate < 0.4,
    carbsLow: carbsRate < 0.5,
    carbsStable: data.carbs.bloodSugarStability >= 0.65,
    bloodSugarLow: data.carbs.bloodSugarStability < 0.5,
    sugarHigh:
      data.carbs.sugar >= 20 ||
      (carbsRate > 0.75 && data.carbs.bloodSugarStability < 0.55),
    sodiumHigh: data.sodium.intake > data.sodium.target * 0.45,
    calorieHigh: caloriesRate > 1.05,
    fatHigh: fatRate > 0.9,
    overallLow: macroRates.every((rate) => rate < 0.3),
    wellBalanced: macroRates.every((rate) => rate >= 0.4 && rate <= 0.85),
    mealName: data.mealName.toLowerCase(),
  };
}

function scoreCardByNutrition(card: TarotCard, signals: NutritionSignals): number {
  const { mealName } = signals;
  let score = 0;

  switch (card.id) {
    case 0:
      if (signals.overallLow) score += 10;
      if (signals.proteinGap + signals.fiberGap > 1) score += 5;
      if (/沙拉|蔬|菜|果|salad|fruit|veg/.test(mealName)) score += 3;
      score += 1;
      break;

    case 1:
      if (signals.wellBalanced) score += 10;
      if (!signals.bloodSugarLow && !signals.calorieHigh && !signals.fatHigh) score += 4;
      if (/便當|輕食|bento|bowl/.test(mealName)) score += 4;
      break;

    case 8:
      if (signals.proteinLow) score += 8 + signals.proteinGap * 6;
      if (signals.proteinGap > signals.fiberGap && signals.proteinGap >= 0.25) score += 5;
      if (/肉|雞|魚|蛋|豆腐|海鮮|protein|chicken|fish|tofu/.test(mealName)) score += 4;
      break;

    case 9:
      if (signals.calorieHigh) score += 10;
      if (signals.fatHigh) score += 7;
      if (signals.caloriesRate > 0.95) score += 4;
      if (/炸|油|快餐|fried|burger/.test(mealName)) score += 5;
      break;

    case 10:
      if (signals.carbsStable && signals.wellBalanced) score += 10;
      if (signals.carbsStable) score += 5;
      if (signals.proteinGap < 0.35 && signals.fiberGap < 0.35) score += 3;
      break;

    case 14:
      if (signals.bloodSugarLow) score += 9;
      if (signals.sugarHigh) score += 8;
      if (signals.sodiumHigh) score += 5;
      if (/甜|糖|蛋糕|奶茶|dessert|cake|sweet/.test(mealName)) score += 6;
      break;

    case 17:
      if (signals.fiberLow) score += 8 + signals.fiberGap * 6;
      if (signals.fiberGap > signals.proteinGap && signals.fiberGap >= 0.25) score += 5;
      if (/沙拉|蔬|菜|綠|salad|green|fiber/.test(mealName)) score += 5;
      break;

    case 19:
      if (signals.carbsLow && signals.carbsStable) score += 9;
      if (signals.carbsStable && signals.carbsRate >= 0.4 && signals.carbsRate <= 0.9) score += 7;
      if (!signals.bloodSugarLow && signals.carbsLow) score += 4;
      if (/飯|麵|燕麥|地瓜|糙米|rice|oat|potato/.test(mealName)) score += 3;
      break;

    default:
      break;
  }

  return score;
}

export function pickTarotCard(data?: NutritionData): TarotCard {
  if (!data) {
    return TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
  }

  const signals = analyzeNutritionSignals(data);
  const ranked = TAROT_CARDS.map((card) => ({
    card,
    score: scoreCardByNutrition(card, signals),
  })).sort((a, b) => b.score - a.score);

  const topScore = ranked[0]?.score ?? 0;
  const candidates = ranked.filter((entry) => topScore - entry.score <= 0.75);

  if (candidates.length === 0 || topScore <= 0) {
    return TAROT_CARDS.find((card) => card.id === 0) ?? TAROT_CARDS[0];
  }

  return candidates[Math.floor(Math.random() * candidates.length)].card;
}
