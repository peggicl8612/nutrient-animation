import type { ManualNutritionInput } from '../../types/ui';
import { estimateCalories } from '../../utils/nutritionCalc';
import { parseIntInput } from '../../utils/numericInput';

interface Props {
  values: ManualNutritionInput;
  disabled?: boolean;
  onChange: (values: ManualNutritionInput) => void;
}

const MACRO_ROWS: {
  label: string;
  intakeKey: keyof ManualNutritionInput;
  targetKey: keyof ManualNutritionInput;
}[] = [
  { label: '蛋白質', intakeKey: 'proteinIntake', targetKey: 'proteinTarget' },
  { label: '碳水化合物', intakeKey: 'carbsIntake', targetKey: 'carbsTarget' },
  { label: '膳食纖維', intakeKey: 'fiberIntake', targetKey: 'fiberTarget' },
  { label: '脂質', intakeKey: 'fatIntake', targetKey: 'fatTarget' },
];

function NumberField({
  label,
  value,
  disabled,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  disabled?: boolean;
  onChange: (v: number) => void;
  unit: string;
}) {
  return (
    <label className="manual-field">
      <span className="manual-field-label">{label}</span>
      <div className="manual-field-input-wrap">
        <input
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={String(value)}
          onChange={(e) => onChange(parseIntInput(e.target.value))}
        />
        <span className="manual-field-unit">{unit}</span>
      </div>
    </label>
  );
}

export function ManualInputForm({ values, disabled, onChange }: Props) {
  const estimatedKcal = estimateCalories(
    values.proteinIntake,
    values.carbsIntake,
    values.fatIntake,
    values.fiberIntake
  );

  const update = (patch: Partial<ManualNutritionInput>) => onChange({ ...values, ...patch });

  return (
    <div className="manual-form">
      <label className="manual-meal-name">
        <span>餐點名稱</span>
        <input
          type="text"
          placeholder="例：雞胸沙拉、日式便當"
          disabled={disabled}
          value={values.mealName}
          onChange={(e) => update({ mealName: e.target.value })}
        />
      </label>

      <div className="manual-table">
        <div className="manual-table-head">
          <span className="manual-table-head-nutrient">營養素</span>
          <span>攝取</span>
          <span>目標</span>
        </div>

        {MACRO_ROWS.map(({ label, intakeKey, targetKey }) => (
          <div key={label} className="manual-table-row">
            <span className="manual-table-nutrient">{label}</span>
            <div className="manual-field-input-wrap">
              <input
                type="text"
                inputMode="numeric"
                disabled={disabled}
                value={String(values[intakeKey] as number)}
                onChange={(e) =>
                  update({ [intakeKey]: parseIntInput(e.target.value) } as Partial<ManualNutritionInput>)
                }
              />
              <span className="manual-field-unit">g</span>
            </div>
            <div className="manual-field-input-wrap">
              <input
                type="text"
                inputMode="numeric"
                disabled={disabled}
                value={String(values[targetKey] as number)}
                onChange={(e) =>
                  update({ [targetKey]: parseIntInput(e.target.value) } as Partial<ManualNutritionInput>)
                }
              />
              <span className="manual-field-unit">g</span>
            </div>
          </div>
        ))}
      </div>

      <div className="manual-extra-grid">
        <NumberField
          label="糖"
          unit="g"
          value={values.sugarIntake}
          disabled={disabled}
          onChange={(v) => update({ sugarIntake: v })}
        />
        <NumberField
          label="鈉"
          unit="mg"
          value={values.sodiumIntake}
          disabled={disabled}
          onChange={(v) => update({ sodiumIntake: v })}
        />
      </div>

      <div className="manual-kcal-estimate">
        <span>本餐估算熱量</span>
        <strong>{estimatedKcal} kcal</strong>
        <small>（蛋白質×4 + 碳水×4 + 脂質×9 + 纖維×2）</small>
      </div>
    </div>
  );
}
