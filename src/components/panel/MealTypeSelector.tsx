import type { CSSProperties } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { MEAL_COLORS, MEAL_TYPES } from '../../types/ui';

interface Props {
  disabled?: boolean;
}

export function MealTypeSelector({ disabled }: Props) {
  const selectedMeal = useUIStore((s) => s.selectedMeal);
  const setSelectedMeal = useUIStore((s) => s.setSelectedMeal);

  return (
    <div className="meal-type-selector" role="group" aria-label="選擇餐別">
      {MEAL_TYPES.map((meal) => {
        const token = MEAL_COLORS[meal];
        const isActive = selectedMeal === meal;
        return (
          <button
            key={meal}
            type="button"
            className={isActive ? 'meal-type-btn meal-type-btn-active' : 'meal-type-btn'}
            disabled={disabled}
            style={
              isActive
                ? ({
                    '--meal-color': token.primary,
                    '--meal-glow': token.glow,
                  } as CSSProperties)
                : undefined
            }
            onClick={() => setSelectedMeal(meal)}
          >
            {token.label}
          </button>
        );
      })}
    </div>
  );
}
