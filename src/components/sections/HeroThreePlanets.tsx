import { motion, type MotionValue } from 'framer-motion';
import { MiniPlanetCanvas } from '../scene/MiniPlanetCanvas.tsx';

const PLANETS = [
  { variant: 'ice' as const, metric: 0.85, label: '蛋白質' },
  { variant: 'gas' as const, metric: 0.7, label: '碳水' },
  { variant: 'terran' as const, metric: 0.72, label: '纖維' },
];

interface Props {
  scale?: MotionValue<number>;
  glowIntensity?: MotionValue<number>;
}

export function HeroThreePlanets({ scale, glowIntensity }: Props) {
  return (
    <motion.div
      className="hero-planets"
      style={scale ? { scale } : undefined}
    >
      {PLANETS.map((planet, i) => (
        <motion.div
          key={planet.variant}
          className={`hero-planet hero-planet-${planet.variant}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="hero-planet-glow"
            aria-hidden
            style={glowIntensity ? { opacity: glowIntensity } : undefined}
          />
          <MiniPlanetCanvas
            variant={planet.variant}
            metric={planet.metric}
            hovered={false}
          />
          <span className="hero-planet-label">{planet.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
