import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { Planet, type PlanetVariant } from '../planets/Planet.tsx';

interface Props {
  variant: PlanetVariant;
  metric: number;
  hovered: boolean;
}

function MiniPlanetScene({ variant, metric, hovered }: Props) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={0.55} color="#d8dce8" />
      <pointLight position={[-2, 1, 3]} intensity={0.3} color="#8899cc" distance={12} />
      <Planet
        variant={variant}
        position={[0, 0, 0]}
        islandId={`mini-${variant}`}
        metric={metric}
        hovered={hovered}
        mode="mini"
      />
    </>
  );
}

export function MiniPlanetCanvas({ variant, metric, hovered }: Props) {
  return (
    <div className="mini-planet-canvas">
      <Canvas
        camera={{ position: [0, 0.2, 4.2], fov: 32 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <MiniPlanetScene variant={variant} metric={metric} hovered={hovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}
