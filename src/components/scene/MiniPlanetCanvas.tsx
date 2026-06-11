import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { Planet, type PlanetVariant } from '../planets/Planet.tsx';
import { MINI_PLANET_SCENE_SCALE } from '../../constants/planetVisuals.ts';

interface Props {
  variant: PlanetVariant;
  metric: number;
  hovered: boolean;
}

function MiniPlanetScene({ variant, metric, hovered }: Props) {
  const sceneScale = MINI_PLANET_SCENE_SCALE[variant];

  return (
    <group scale={sceneScale}>
      <ambientLight intensity={0.44} />
      <directionalLight position={[3, 4, 5]} intensity={0.62} color="#e8ecf4" />
      <pointLight position={[-2, 1, 3]} intensity={0.28} color="#b0c0e0" distance={12} />
      <Planet
        variant={variant}
        position={[0, 0, 0]}
        islandId={`mini-${variant}`}
        metric={metric}
        hovered={hovered}
        mode="mini"
      />
    </group>
  );
}

export function MiniPlanetCanvas({ variant, metric, hovered }: Props) {
  return (
    <div className="mini-planet-canvas">
      <Canvas
        camera={{ position: [0, 0.08, 7.2], fov: 30 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.88,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
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
