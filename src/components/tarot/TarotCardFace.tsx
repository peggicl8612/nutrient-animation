import type { ReactNode } from 'react';
import type { TarotCard } from '../../types/ui';

const ART: Record<string, ReactNode> = {
  comet: (
    <svg viewBox="0 0 200 280" className="tarot-art-svg" aria-hidden>
      <circle cx="100" cy="140" r="70" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
      <ellipse cx="100" cy="140" rx="90" ry="28" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" transform="rotate(-25 100 140)" />
      <path d="M40 180 Q100 60 160 100" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="148" cy="108" r="6" fill="currentColor" opacity="0.8" />
    </svg>
  ),
  crystal: (
    <svg viewBox="0 0 200 280" className="tarot-art-svg" aria-hidden>
      <polygon points="100,50 145,120 100,230 55,120" fill="none" stroke="currentColor" strokeWidth="1" />
      <polygon points="100,80 125,120 100,180 75,120" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <line x1="55" y1="120" x2="145" y2="120" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  ),
  nebula: (
    <svg viewBox="0 0 200 280" className="tarot-art-svg" aria-hidden>
      <circle cx="100" cy="140" r="55" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="80" cy="125" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <circle cx="120" cy="155" r="22" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <path d="M60 170 Q100 90 140 170" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
    </svg>
  ),
  oasis: (
    <svg viewBox="0 0 200 280" className="tarot-art-svg" aria-hidden>
      <path d="M100 220 Q70 160 100 100 Q130 160 100 220" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M100 200 Q85 150 100 120 Q115 150 100 200" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <circle cx="100" cy="90" r="12" fill="none" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  ),
  mirror: (
    <svg viewBox="0 0 200 280" className="tarot-art-svg" aria-hidden>
      <rect x="60" y="70" width="80" height="140" rx="40" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="100" y1="70" x2="100" y2="210" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
      <circle cx="100" cy="140" r="25" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    </svg>
  ),
};

interface Props {
  card: TarotCard;
}

export function TarotCardFace({ card }: Props) {
  return (
    <article className="tarot-card-face">
      <div className="tarot-card-border" />
      <div className="tarot-card-art">{ART[card.image] ?? ART.mirror}</div>
      <p className="tarot-card-name">{card.title}</p>
    </article>
  );
}
