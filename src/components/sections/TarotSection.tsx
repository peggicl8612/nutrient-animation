import { useRef, type CSSProperties } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useUIStore } from '../../stores/useUIStore';
import { TarotCardFace } from '../tarot/TarotCardFace.tsx';

export function TarotSection() {
  const ref = useRef<HTMLElement>(null);
  const card = useUIStore((s) => s.drawnTarotCard);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    ['#fafaf7', '#f5f5f5', '#f0f0f0']
  );

  const mistOpacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 0.65]);

  return (
    <section ref={ref} className="section section-tarot" aria-label="營養塔羅">
      <motion.div className="section-tarot-bg" style={{ backgroundColor: bgColor }} />
      <motion.div className="section-tarot-mist" style={{ opacity: mistOpacity }} />

      <div className="section-tarot-inner">
        <motion.header
          className="section-header section-header-center"
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-index">02</span>
          <h2 className="section-title">營養塔羅 · 星際解讀</h2>
          <p className="section-desc">
            分析完成後，宇宙為你抽出一張專屬牌面<br />
            翻開它，閱讀今日營養的詩意註腳。
          </p>
        </motion.header>

        <div className="tarot-stage">
          {card ? (
            <motion.div
              className="tarot-card-flip"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={isInView ? { rotateY: 0, opacity: 1 } : { rotateY: 180, opacity: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <TarotCardFace card={card} />
            </motion.div>
          ) : (
            <div className="tarot-card-placeholder">
              <p>完成第二層分析後 <br/>塔羅牌將在此翻開</p>
            </div>
          )}

          {card && (
            <motion.div
              className="tarot-reading"
              style={{ '--tarot-theme': card.themeColor } as CSSProperties}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="tarot-reading-title">
                {card.zhName}
                <span className="tarot-reading-subtitle">{card.cardName}</span>
              </h3>
              <div className="tarot-reading-block">
                <span className="tarot-reading-label">今日心態</span>
                <p className="tarot-reading-text">{card.dailyMindset}</p>
              </div>
              <div className="tarot-reading-block">
                <span className="tarot-reading-label">營養行動</span>
                <p className="tarot-reading-text">{card.nutritionAction}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
