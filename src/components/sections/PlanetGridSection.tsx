import type { IslandCardData } from '../layout/IslandCard.tsx';
import { IslandCard } from '../layout/IslandCard.tsx';
import { IslandScrollSection } from './IslandScrollSection.tsx';

interface Props {
  islands: IslandCardData[];
}

export function PlanetGridSection({ islands }: Props) {
  return (
    <>
      <section className="section section-planet-grid" aria-label="營養星球儀表板">
        <div className="section-planet-grid-inner">
          <header className="section-header section-header-center planet-grid-header">
            <span className="section-index">03</span>
            <h2 className="section-title">三座星球 · 營養生態</h2>
            <p className="section-desc">
              蛋白質、碳水與纖維的攝取狀態<br />即時映照在三顆星球的紋理與光澤之上。
            </p>
          </header>

          <div className="planet-grid-desktop">
            {islands.map((island) => (
              <IslandCard key={island.id} data={island} />
            ))}
          </div>
        </div>
      </section>

      <div className="planet-grid-mobile">
        {islands.map((island, i) => (
          <IslandScrollSection
            key={island.id}
            data={island}
            sectionIndex={String(i + 3).padStart(2, '0')}
          />
        ))}
      </div>
    </>
  );
}
