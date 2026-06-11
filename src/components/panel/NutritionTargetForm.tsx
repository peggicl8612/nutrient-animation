import type { ManualNutritionInput } from '../../types/ui';
import { parseIntInput } from '../../utils/numericInput';

interface Props {
  values: ManualNutritionInput;
  disabled?: boolean;
  onChange: (values: ManualNutritionInput) => void;
}

const TARGET_ROWS: {
  label: string;
  key: keyof Pick<
    ManualNutritionInput,
    'proteinTarget' | 'carbsTarget' | 'fiberTarget' | 'fatTarget'
  >;
}[] = [
  { label: '蛋白質', key: 'proteinTarget' },
  { label: '碳水化合物', key: 'carbsTarget' },
  { label: '膳食纖維', key: 'fiberTarget' },
  { label: '脂質', key: 'fatTarget' },
];

export function NutritionTargetForm({ values, disabled, onChange }: Props) {
  const update = (patch: Partial<ManualNutritionInput>) =>
    onChange({ ...values, ...patch });

  return (
    <div className="nutrition-target-form">
      <p className="nutrition-target-heading">每日目標</p>
      <p className="nutrition-target-desc">AI 辨識攝取量後，將依此目標計算達成率</p>

      <div className="manual-table nutrition-target-table">
        {TARGET_ROWS.map(({ label, key }) => (
          <div key={key} className="nutrition-target-row">
            <span className="manual-table-nutrient">{label}</span>
            <div className="manual-field-input-wrap">
              <input
                type="text"
                inputMode="numeric"
                disabled={disabled}
                value={String(values[key])}
                onChange={(e) =>
                  update({ [key]: parseIntInput(e.target.value) } as Partial<ManualNutritionInput>)
                }
              />
              <span className="manual-field-unit">g</span>
            </div>
          </div>
        ))}

        <div className="nutrition-target-row">
          <span className="manual-table-nutrient">熱量</span>
          <div className="manual-field-input-wrap">
            <input
              type="text"
              inputMode="numeric"
              disabled={disabled}
              value={String(values.caloriesTarget)}
              onChange={(e) => update({ caloriesTarget: parseIntInput(e.target.value) })}
            />
            <span className="manual-field-unit">kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
