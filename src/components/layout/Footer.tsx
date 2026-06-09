import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNutritionStore } from '../../stores/useNutritionStore';
import appleIcon from '../../assets/icons/apple.svg';
import googleIcon from '../../assets/icons/google.svg';

function AppStoreBadge() {
  return (
    <a
      href="https://apps.apple.com"
      target="_blank"
      rel="noopener noreferrer"
      className="store-badge"
      aria-label="在 App Store 下載"
    >
      <img src={appleIcon} alt="" className="store-badge-svg" />
    </a>
  );
}

function GooglePlayBadge() {
  return (
    <a
      href="https://play.google.com"
      target="_blank"
      rel="noopener noreferrer"
      className="store-badge"
      aria-label="在 Google Play 下載"
    >
      <img src={googleIcon} alt="" className="store-badge-svg" />
    </a>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const updatedAt = useNutritionStore((s) => s.data.updatedAt);

  return (
    <footer ref={ref} className="section section-footer">
      <motion.div
        className="section-footer-inner"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="store-badges">
          <AppStoreBadge />
          <GooglePlayBadge />
        </div>

        <p className="section-footer-text">
          最後更新 · {new Date(updatedAt).toLocaleString('zh-TW')}
        </p>
        <p className="section-footer-credit">Nutrient Dreamscape · Web Showcase</p>
      </motion.div>
    </footer>
  );
}
