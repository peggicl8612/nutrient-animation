import type { INutritionProvider, AnalysisOptions } from './INutritionProvider';
import type { NutritionData } from '../types/nutrition';
import { pickScenarioFromFile } from './mockScenarios';
import { buildFromManual } from '../utils/nutritionCalc';

const ANALYSIS_DURATION_MS = 2000;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockNutritionProvider implements INutritionProvider {
  async simulateAnalysis(
    options: AnalysisOptions,
    onProgress?: (progress: number) => void
  ): Promise<NutritionData> {
    const steps = 20;
    const stepMs = ANALYSIS_DURATION_MS / steps;

    for (let i = 1; i <= steps; i++) {
      await delay(stepMs);
      onProgress?.(Math.round((i / steps) * 100));
    }

    if (options.manual) {
      return buildFromManual(options.manual);
    }

    if (options.file || options.mealName) {
      return pickScenarioFromFile(
        options.file ?? new File([''], options.mealName ?? 'default.jpg'),
        options.mealName
      );
    }

    return pickScenarioFromFile(new File([''], 'default.jpg'));
  }
}

export const nutritionProvider = new MockNutritionProvider();
