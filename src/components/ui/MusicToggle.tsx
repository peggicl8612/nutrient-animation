import { useState } from 'react';
import { ambientMusic } from '../../utils/ambientMusic';
import playerIcon from '../../assets/icons/player.svg';

export function MusicToggle() {
  const [playing, setPlaying] = useState(false);

  const handleClick = async () => {
    const next = await ambientMusic.toggle();
    setPlaying(next);
  };

  return (
    <button
      type="button"
      className={`music-toggle${playing ? ' is-playing' : ''}`}
      onClick={handleClick}
      aria-label={playing ? '關閉背景音樂' : '播放背景音樂'}
      title={playing ? '關閉背景音樂' : '播放背景音樂'}
    >
     <img src={playerIcon} alt="" width={18} height={18} />

     
    </button>
  );
}
