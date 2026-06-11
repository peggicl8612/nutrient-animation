import { useState } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { HeroPlanetVisual } from '../planets/HeroPlanetVisual.tsx';
import type { PlanetVariant } from '../planets/Planet.tsx';

const PLANETS = [
  { variant: 'ice' as const, label: '蛋白質' },
  { variant: 'gas' as const, label: '碳水' },
  { variant: 'terran' as const, label: '纖維' },
];

interface Props {
  scale?: MotionValue<number>;
  glowIntensity?: MotionValue<number>;
}

export function HeroThreePlanets({ scale, glowIntensity }: Props) {
  const [hoveredVariant, setHoveredVariant] = useState<PlanetVariant | null>(null);

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
          onMouseEnter={() => setHoveredVariant(planet.variant)}
          onMouseLeave={() => setHoveredVariant(null)}
        >
          <HeroPlanetVisual
            variant={planet.variant}
            hovered={hoveredVariant === planet.variant}
            glowOpacity={glowIntensity}
          />
          <span className="hero-planet-label">{planet.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
