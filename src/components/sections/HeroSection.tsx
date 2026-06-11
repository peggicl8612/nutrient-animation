import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
import { HeroThreePlanets } from './HeroThreePlanets.tsx';

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // 開場標題：隨捲動下移，至 section 底時垂直置中
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.65, 1],
    ['calc(-50% - 26vh)', 'calc(-50% - 14vh)', 'calc(-50% - 4vh)', '-50%']
  );
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5, 0.82, 1], [1, 1, 0.45, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // 星球：先發光放大，再被光影穿透
  const planetScale = useTransform(scrollYProgress, [0, 0.35, 0.75], [1, 1.15, 2]);
  const planetGlow = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 2, 2.8]);
  const planetsOpacity = useTransform(scrollYProgress, [0.55, 0.88], [1, 0]);
  const planetsBlur = useTransform(scrollYProgress, [0.4, 0.85], [0, 28]);
  const planetsFilter = useMotionTemplate`blur(${planetsBlur}px) brightness(1.2)`;

  // 光束：一往下捲就出現
  const beamOpacity = useTransform(scrollYProgress, [0.08, 0.3, 0.8], [0, 0.9, 0]);
  const beamY = useTransform(scrollYProgress, [0.05, 0.75], ['-15%', '95%']);
  const beamScale = useTransform(scrollYProgress, [0.08, 0.5], [0.5, 1.35]);

  // 環境光：承接下一 section
  const ambientLight = useTransform(
    scrollYProgress,
    [0.35, 0.7, 1],
    ['rgba(255, 252, 245, 0)', 'rgba(255, 252, 245, 0.8)', 'rgba(250, 250, 247, 1)']
  );

  // 過渡文案
  const labelOpacity = useTransform(scrollYProgress, [0.22, 0.38, 0.72], [0, 1, 0]);
  const labelY = useTransform(scrollYProgress, [0.22, 0.42], [24, 0]);

  return (
    <section ref={ref} className="section section-hero-scroll" aria-label="營養食刻首頁">
      <div className="hero-sticky">
        <motion.div className="hero-ambient" style={{ backgroundColor: ambientLight }} />

        <div className="light-beam-anchor" aria-hidden>
          <motion.div
            className="light-beam"
            style={{ opacity: beamOpacity, y: beamY, scale: beamScale }}
          >
            <div className="light-beam-core" />
            <div className="light-beam-halo" />
          </motion.div>
        </div>

        <motion.div className="hero-copy-anchor" style={{ y: titleY, opacity: titleOpacity }}>
          <div className="hero-copy">
            <p className="hero-eyebrow">Nutrient Landscape</p>
            <h1 className="hero-title">營養食刻</h1>
            <p className="hero-lead">
              三顆星球映照你的巨量與微量營養<br/>
              向下捲動，光影將穿透星體。
            </p>
          </div>
        </motion.div>

        <motion.div
          className="hero-planets-stage"
          style={{
            scale: planetScale,
            opacity: planetsOpacity,
            filter: planetsFilter,
          }}
        >
          <HeroThreePlanets glowIntensity={planetGlow} />
        </motion.div>

        <motion.div
          className="hero-transition-label"
          style={{ opacity: labelOpacity, y: labelY }}
        >
          <span className="hero-transition-index">00</span>
          <p className="hero-transition-text">光影穿透星體，進入營養分析層</p>
        </motion.div>

        <motion.p className="scroll-hint" style={{ opacity: hintOpacity }}>
          Scroll
        </motion.p>
      </div>
    </section>
  );
}
