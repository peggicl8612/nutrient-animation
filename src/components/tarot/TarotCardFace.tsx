import type { CSSProperties } from 'react';
import { Icon } from '@iconify/react';
import type { TarotCard } from '../../types/ui';

interface Props {
  card: TarotCard;
}

export function TarotCardFace({ card }: Props) {
  const style = {
    '--tarot-theme': card.themeColor,
  } as CSSProperties;

  return (
    <article className="tarot-card-face" style={style}>
      <div className="tarot-card-border" />
      <div className="tarot-card-art">
        <Icon icon={card.icon} className="tarot-card-icon" aria-hidden />
      </div>
      <p className="tarot-card-name">{card.zhName}</p>
      <p className="tarot-card-subname">{card.cardName}</p>
    </article>
  );
}
