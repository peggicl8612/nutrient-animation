import { MiniPlanetCanvas } from '../scene/MiniPlanetCanvas.tsx';
import type { PlanetVariant } from './Planet.tsx';
import { getPlanetVisualMetric } from '../../constants/planetVisuals.ts';

interface Props {
  variant: PlanetVariant;
  metric: number;
  hovered?: boolean;
  className?: string;
  /** Hero 區使用固定 metric，不套用 getPlanetVisualMetric */
  fixedMetric?: number;
  /** 外圈光暈（Hero 捲動動畫需自行包 motion 層時設 false） */
  withGlow?: boolean;
}

export function PlanetVisual({
  variant,
  metric,
  hovered = false,
  className = '',
  fixedMetric,
  withGlow = true,
}: Props) {
  const visualMetric = fixedMetric ?? getPlanetVisualMetric(variant, metric);

  return (
    <div className={`planet-visual planet-visual-${variant} ${className}`.trim()}>
      {withGlow && <div className="planet-visual-glow" aria-hidden />}
      <MiniPlanetCanvas variant={variant} metric={visualMetric} hovered={hovered} />
    </div>
  );
}
