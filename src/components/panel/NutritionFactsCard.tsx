import { useNutritionStore } from '../../stores/useNutritionStore';
import { macroPercentages } from '../../utils/nutritionCalc';
import { AnimatedNumber } from '../ui/AnimatedNumber.tsx';

function MacroBar({
  label,
  intake,
  target,
  unit,
  color,
}: {
  label: string;
  intake: number;
  target: number;
  unit: string;
  color: string;
}) {
  const pct = target > 0 ? Math.min(100, (intake / target) * 100) : 0;

  return (
    <div className="facts-macro-row">
      <div className="facts-macro-head">
        <span>{label}</span>
        <span className="facts-macro-values">
          <AnimatedNumber value={intake} format="integer" suffix={unit} />
          {' / '}
          <AnimatedNumber value={target} format="integer" suffix={unit} />
        </span>
      </div>
      <div className="facts-macro-bar">
        <div
          className="facts-macro-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="facts-macro-pct">{Math.round(pct)}%</span>
    </div>
  );
}

export function NutritionFactsCard() {
  const data = useNutritionStore((s) => s.data);
  const macros = macroPercentages(data);
  const caloriePct = data.calories.target > 0
    ? Math.min(100, (data.calories.intake / data.calories.target) * 100)
    : 0;

  return (
    <div className="nutrition-facts">
      <div className="nutrition-facts-header">
        <div>
          <p className="nutrition-facts-eyebrow">Nutrition Facts</p>
          <h3 className="nutrition-facts-meal">{data.mealName}</h3>
        </div>
        <div className="nutrition-facts-calories">
          <AnimatedNumber
            className="nutrition-facts-kcal"
            value={data.calories.intake}
            format="integer"
          />
          <span className="nutrition-facts-kcal-unit">kcal</span>
          <span className="nutrition-facts-kcal-target">
            / 目標 {data.calories.target} kcal
          </span>
        </div>
      </div>

      <div className="nutrition-facts-calorie-bar">
        <div
          className="nutrition-facts-calorie-fill"
          style={{ width: `${caloriePct}%` }}
        />
      </div>

      <div className="nutrition-facts-macros">
        <MacroBar label="蛋白質" intake={data.protein.intake} target={data.protein.target} unit="g" color="#6a9fd4" />
        <MacroBar label="碳水化合物" intake={data.carbs.intake} target={data.carbs.target} unit="g" color="#e8a060" />
        <MacroBar label="脂質" intake={data.fat.intake} target={data.fat.target} unit="g" color="#c4a8e8" />
        <MacroBar label="膳食纖維" intake={data.fiber.intake} target={data.fiber.target} unit="g" color="#88b888" />
      </div>

      <div className="nutrition-facts-secondary">
        <div className="facts-secondary-item">
          <span>糖</span>
          <AnimatedNumber value={data.carbs.sugar} format="integer" suffix=" g" />
        </div>
        <div className="facts-secondary-item">
          <span>鈉</span>
          <AnimatedNumber value={data.sodium.intake} format="integer" suffix=" mg" />
        </div>
        <div className="facts-secondary-item">
          <span>血糖穩定指數</span>
          <AnimatedNumber value={data.carbs.bloodSugarStability} format="percent" />
        </div>
      </div>

      <div className="nutrition-facts-distribution">
        <span className="nutrition-facts-dist-label">巨量營養素熱量佔比</span>
        <div className="nutrition-facts-dist-bar">
          <div className="dist-segment dist-protein" style={{ width: `${macros.protein}%` }} />
          <div className="dist-segment dist-carbs" style={{ width: `${macros.carbs}%` }} />
          <div className="dist-segment dist-fat" style={{ width: `${macros.fat}%` }} />
        </div>
        <div className="nutrition-facts-dist-legend">
          <span><i className="dist-dot dist-protein" />蛋白質 {macros.protein}%</span>
          <span><i className="dist-dot dist-carbs" />碳水 {macros.carbs}%</span>
          <span><i className="dist-dot dist-fat" />脂質 {macros.fat}%</span>
        </div>
      </div>
    </div>
  );
}
