import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import { Planet } from '../planets/Planet.tsx';

function BackgroundPlanets() {
  return (
    <>
      <group position={[11, -5, -4]} scale={5.8}>
        <Planet
          variant="terran"
          position={[0, 0, 0]}
          islandId="bg-terran"
          metric={0.65}
          hovered={false}
          mode="background"
        />
      </group>
      <group position={[-13, 8, -8]} scale={4.2}>
        <Planet
          variant="ice"
          position={[0, 0, 0]}
          islandId="bg-ice"
          metric={0.5}
          hovered={false}
          mode="background"
        />
      </group>
    </>
  );
}

export function BackgroundScene() {
  return (
    <div className="background-canvas" aria-hidden>
      <Canvas
        camera={{ position: [0, 2, 18], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.75,
        }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#fafaf7']} />
        <ambientLight intensity={0.18} />
        <directionalLight position={[4, 6, 8]} intensity={0.22} color="#c8d0e8" />

        <Suspense fallback={null}>
          <BackgroundPlanets />
        </Suspense>

        <EffectComposer multisampling={2}>
          <Vignette eskil={false} offset={0.08} darkness={1.35} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
