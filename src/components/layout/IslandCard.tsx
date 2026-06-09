import { useState } from 'react';
import { MiniPlanetCanvas } from '../scene/MiniPlanetCanvas.tsx';
import type { PlanetVariant } from '../planets/Planet.tsx';
import { AnimatedGramsPair, AnimatedNumber } from '../ui/AnimatedNumber.tsx';

export type MetricFormat = 'percent' | 'grams-pair' | 'grams-single';

export interface IslandCardData {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  metricLabel: string;
  metricValue: number;
  metricFormat: MetricFormat;
  metricIntake?: number;
  metricTarget?: number;
  variant: PlanetVariant;
  metric: number;
}

interface Props {
  data: IslandCardData;
}

function MetricValue({ data }: { data: IslandCardData }) {
  if (data.metricFormat === 'percent') {
    return (
      <AnimatedNumber
        className="island-card-metric-value"
        value={data.metricValue}
        format="percent"
      />
    );
  }

  if (data.metricFormat === 'grams-pair' && data.metricIntake != null && data.metricTarget != null) {
    return (
      <AnimatedGramsPair
        className="island-card-metric-value"
        intake={data.metricIntake}
        target={data.metricTarget}
      />
    );
  }

  return (
    <AnimatedNumber
      className="island-card-metric-value"
      value={data.metricValue}
      format="integer"
      suffix="g"
    />
  );
}

function MetricDetail({ data }: { data: IslandCardData }) {
  if (data.metricFormat === 'grams-pair') return null;

  if (data.metricIntake != null && data.metricTarget != null) {
    return (
      <AnimatedGramsPair
        className="island-card-metric-detail"
        intake={data.metricIntake}
        target={data.metricTarget}
      />
    );
  }

  return (
    <AnimatedNumber
      className="island-card-metric-detail"
      value={data.metricValue}
      format="integer"
      suffix="g"
    />
  );
}

export function IslandCard({ data }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="island-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="island-card-visual">
        <MiniPlanetCanvas
          variant={data.variant}
          metric={data.metric}
          hovered={hovered}
        />
      </div>

      <div className="island-card-content">
        <span className="island-card-index">{data.index}</span>
        <h2 className="island-card-title">{data.title}</h2>
        <p className="island-card-subtitle">{data.subtitle}</p>
        <p className="island-card-description">{data.description}</p>

        <div className="island-card-metric">
          <span className="island-card-metric-label">{data.metricLabel}</span>
          <MetricValue data={data} />
          <MetricDetail data={data} />
        </div>
      </div>
    </article>
  );
}
