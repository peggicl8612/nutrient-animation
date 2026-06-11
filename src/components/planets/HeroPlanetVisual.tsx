import { motion, type MotionValue } from 'framer-motion';
import { PlanetVisual } from './PlanetVisual.tsx';
import type { PlanetVariant } from './Planet.tsx';
import { HERO_PLANET_METRICS } from '../../constants/planetVisuals.ts';

interface Props {
  variant: PlanetVariant;
  hovered?: boolean;
  glowClassName?: string;
  glowOpacity?: MotionValue<number>;
  visualClassName?: string;
}

/** Section 1 與卡片共用的星球視覺結構，確保顏色與光暈一致 */
export function HeroPlanetVisual({
  variant,
  hovered = false,
  glowClassName = '',
  glowOpacity,
  visualClassName = '',
}: Props) {
  const hoverClass = hovered ? 'hero-planet-visual-hover' : '';

  return (
    <div
      className={`hero-planet-visual hero-planet-${variant} ${hoverClass} ${visualClassName}`.trim()}
    >
      {glowOpacity ? (
        <motion.div
          className={`hero-planet-glow ${glowClassName}`.trim()}
          aria-hidden
          style={{ opacity: glowOpacity }}
        />
      ) : (
        <div className={`hero-planet-glow ${glowClassName}`.trim()} aria-hidden />
      )}
      <PlanetVisual
        variant={variant}
        metric={0}
        fixedMetric={HERO_PLANET_METRICS[variant]}
        hovered={hovered}
        withGlow={false}
      />
    </div>
  );
}
