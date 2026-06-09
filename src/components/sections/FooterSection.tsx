import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNutritionStore } from '../../stores/useNutritionStore';

export function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const updatedAt = useNutritionStore((s) => s.data.updatedAt);

  return (
    <footer ref={ref} className="section section-footer">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <p className="section-footer-text">
          最後更新 · {new Date(updatedAt).toLocaleString('zh-TW')}
        </p>
        <p className="section-footer-credit">Nutrient Dreamscape · Web Showcase</p>
      </motion.div>
    </footer>
  );
}
