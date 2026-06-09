import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { MiniPlanetCanvas } from '../scene/MiniPlanetCanvas.tsx';
import type { IslandCardData } from '../layout/IslandCard.tsx';
import { AnimatedGramsPair, AnimatedNumber } from '../ui/AnimatedNumber.tsx';

const SECTION_TINT: Record<string, string> = {
  protein: 'rgba(140, 190, 235, 0.12)',
  nebula: 'rgba(235, 170, 120, 0.14)',
  oasis: 'rgba(160, 150, 220, 0.14)',
};

interface Props {
  data: IslandCardData;
  sectionIndex: string;
}

export function IslandScrollSection({ data, sectionIndex }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const planetX = useTransform(scrollYProgress, [0, 1], [-40, 0]);
  const contentX = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const tint = SECTION_TINT[data.id] ?? 'transparent';

  return (
    <section
      ref={ref}
      className={`section section-island section-island-${data.id}`}
      aria-label={data.title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="section-island-tint" style={{ backgroundColor: tint }} />

      <div className="section-island-inner">
        <motion.div
          className="section-island-visual"
          style={{ x: planetX }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <MiniPlanetCanvas
            variant={data.variant}
            metric={data.metric}
            hovered={hovered}
          />
        </motion.div>

        <motion.div
          className="section-island-content"
          style={{ x: contentX }}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-index">{sectionIndex}</span>
          <h2 className="section-title">{data.title}</h2>
          <p className="section-subtitle">{data.subtitle}</p>
          <p className="section-desc">{data.description}</p>

          <div className="island-card-metric">
            <span className="island-card-metric-label">{data.metricLabel}</span>
            <AnimatedNumber
              className="island-card-metric-value"
              value={data.metricValue}
              format="percent"
            />
            {data.metricIntake != null && data.metricTarget != null && (
              <AnimatedGramsPair
                className="island-card-metric-detail"
                intake={data.metricIntake}
                target={data.metricTarget}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
