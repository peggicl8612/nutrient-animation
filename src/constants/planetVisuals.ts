import type { PlanetVariant } from '../components/planets/Planet.tsx';

/** Section 1 Hero 區的展示用 metric，作為卡片星球的視覺基準 */
export const HERO_PLANET_METRICS: Record<PlanetVariant, number> = {
  ice: 0.1,
  gas: 0.6,
  terran: 0.99,
};

/**
 * mini canvas 場景縮放：以 ice 星軌外徑 (2.75) 為基準，
 * gas / terran 本體或星軌較大，需額外縮小以免被裁切。
 */
export const MINI_PLANET_SCENE_SCALE: Record<PlanetVariant, number> = {
  ice: 0.58,
  gas: 0.54,
  terran: 0.54,
};

/** 卡片星球：未分析時對齊 Hero 色調，有數據時仍保留 Hero 基準亮度 */
export function getPlanetVisualMetric(variant: PlanetVariant, metric: number): number {
  const baseline = HERO_PLANET_METRICS[variant];
  if (metric <= 0) return baseline;
  return Math.max(baseline * 0.88, baseline * 0.18 + Math.min(metric, 1) * 0.82);
}
