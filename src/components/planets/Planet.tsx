import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import {
  planetVertexShader,
  atmosphereVertexShader,
  atmosphereFragmentShader,
  icePlanetFragmentShader,
  gasPlanetFragmentShader,
  terranPlanetFragmentShader,
  ringVertexShader,
  ringFragmentShader,
} from './planetShaders';

export type PlanetVariant = 'ice' | 'gas' | 'terran';
export type PlanetMode = 'default' | 'background' | 'mini';

const MODE_SETTINGS: Record<
  PlanetMode,
  {
    rotationMultiplier: number;
    desaturate: number;
    showMoons: boolean;
    showRings: boolean;
    floatEnabled: boolean;
    hoverSpinBoost: number;
    lightIntensity: number;
    atmosphereMultiplier: number;
    segments: number;
  }
> = {
  default: {
    rotationMultiplier: 1,
    desaturate: 0,
    showMoons: true,
    showRings: true,
    floatEnabled: true,
    hoverSpinBoost: 1,
    lightIntensity: 1,
    atmosphereMultiplier: 1,
    segments: 96,
  },
  background: {
    rotationMultiplier: 0.12,
    desaturate: 0.72,
    showMoons: false,
    showRings: true,
    floatEnabled: false,
    hoverSpinBoost: 1,
    lightIntensity: 0.35,
    atmosphereMultiplier: 0.45,
    segments: 64,
  },
  mini: {
    rotationMultiplier: 0.6,
    desaturate: 0,
    showMoons: false,
    showRings: true,
    floatEnabled: false,
    hoverSpinBoost: 3.5,
    lightIntensity: 1,
    atmosphereMultiplier: 1,
    segments: 48,
  },
};

interface AtmosphereLayer {
  scale: number;
  intensity: number;
  power: number;
  softness: number;
}

interface RingConfig {
  inner: number;
  outer: number;
  color: string;
  opacity: number;
  tilt: number;
  gapCenter?: number;
  gapWidth?: number;
}

interface PlanetConfig {
  radius: number;
  atmosphereColor: string;
  atmosphereLayers: AtmosphereLayer[];
  lightColor: string;
  rings?: RingConfig[];
  moons?: { radius: number; distance: number; speed: number; color: string }[];
  rotationSpeed: number;
  floatIntensity: number;
}

const PLANET_CONFIGS: Record<PlanetVariant, PlanetConfig> = {
  ice: {
    radius: 1.35,
    atmosphereColor: '#99ccff',
    atmosphereLayers: [
      { scale: 1.05, intensity: 0.12, power: 2.8, softness: 0.9 },
      { scale: 1.12, intensity: 0.28, power: 1.6, softness: 0.75 },
      { scale: 1.24, intensity: 0.14, power: 1.1, softness: 0.55 },
    ],
    lightColor: '#5599ff',
    rings: [
      { inner: 1.7, outer: 2.2, color: '#c8e8ff', opacity: 0.52, tilt: 0.42, gapCenter: 0.55, gapWidth: 0.04 },
      { inner: 2.25, outer: 2.75, color: '#88bbee', opacity: 0.22, tilt: 0.42 },
    ],
    moons: [
      { radius: 0.14, distance: 2.6, speed: 0.6, color: '#ccddee' },
      { radius: 0.09, distance: 3.1, speed: 0.45, color: '#99bbdd' },
    ],
    rotationSpeed: 0.08,
    floatIntensity: 0.25,
  },
  gas: {
    radius: 1.55,
    atmosphereColor: '#ffbb88',
    atmosphereLayers: [
      { scale: 1.04, intensity: 0.14, power: 2.6, softness: 0.88 },
      { scale: 1.11, intensity: 0.32, power: 1.5, softness: 0.72 },
      { scale: 1.22, intensity: 0.16, power: 1.0, softness: 0.5 },
    ],
    lightColor: '#ff8844',
    rings: [
      { inner: 2.05, outer: 2.45, color: '#ffddaa', opacity: 0.45, tilt: 0.22, gapCenter: 0.5, gapWidth: 0.05 },
      { inner: 2.5, outer: 3.0, color: '#cc9966', opacity: 0.18, tilt: 0.22 },
    ],
    moons: [{ radius: 0.18, distance: 2.9, speed: 0.35, color: '#ffbb88' }],
    rotationSpeed: 0.12,
    floatIntensity: 0.18,
  },
  terran: {
    radius: 1.3,
    atmosphereColor: '#a0b4ff',
    atmosphereLayers: [
      { scale: 1.05, intensity: 0.14, power: 2.6, softness: 0.92 },
      { scale: 1.14, intensity: 0.28, power: 1.45, softness: 0.78 },
      { scale: 1.28, intensity: 0.18, power: 1.0, softness: 0.58 },
    ],
    lightColor: '#7788ff',
    rings: [
      { inner: 1.8, outer: 2.25, color: '#b8c8ff', opacity: 0.48, tilt: 0.58, gapCenter: 0.48, gapWidth: 0.035 },
      { inner: 2.3, outer: 2.85, color: '#8899ee', opacity: 0.2, tilt: 0.58 },
    ],
    moons: [
      { radius: 0.1, distance: 2.2, speed: 0.55, color: '#b0b8dd' },
      { radius: 0.07, distance: 2.8, speed: 0.4, color: '#8899bb' },
    ],
    rotationSpeed: 0.05,
    floatIntensity: 0.2,
  },
};

const SURFACE_SHADERS: Record<PlanetVariant, string> = {
  ice: icePlanetFragmentShader,
  gas: gasPlanetFragmentShader,
  terran: terranPlanetFragmentShader,
};

const LIGHT_DIR = new THREE.Vector3(0.5, 0.8, 0.4).normalize();

interface PlanetProps {
  variant: PlanetVariant;
  position: [number, number, number];
  islandId: string;
  metric: number;
  hovered: boolean;
  mode?: PlanetMode;
}

function PlanetRing({
  inner,
  outer,
  color,
  opacity,
  tilt,
  gapCenter = 0.5,
  gapWidth = 0.0,
}: RingConfig) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uGapCenter: { value: gapCenter },
      uGapWidth: { value: gapWidth },
    }),
    [color, opacity, gapCenter, gapWidth]
  );

  return (
    <mesh rotation={[Math.PI / 2 + tilt, 0.2, 0.15]}>
      <ringGeometry args={[inner, outer, 256]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={ringVertexShader}
        fragmentShader={ringFragmentShader}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function PlanetMoons({
  moons,
}: {
  moons: NonNullable<PlanetConfig['moons']>;
}) {
  const moonRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    moons.forEach((moon, i) => {
      const mesh = moonRefs.current[i];
      if (!mesh) return;
      const angle = state.clock.elapsedTime * moon.speed + i * 1.8;
      mesh.position.set(
        Math.cos(angle) * moon.distance,
        Math.sin(angle * 0.7) * 0.15,
        Math.sin(angle) * moon.distance
      );
    });
  });

  return (
    <>
      {moons.map((moon, i) => (
        <mesh
          key={i}
          ref={(el) => { moonRefs.current[i] = el; }}
        >
          <sphereGeometry args={[moon.radius, 16, 16]} />
          <meshStandardMaterial
            color={moon.color}
            emissive={moon.color}
            emissiveIntensity={0.12}
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>
      ))}
    </>
  );
}

function AtmosphereShell({
  radius,
  layer,
  color,
  intensity,
  islandId,
}: {
  radius: number;
  layer: AtmosphereLayer;
  color: THREE.Color;
  intensity: number;
  islandId: string;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uColor: { value: color.clone() },
      uIntensity: { value: layer.intensity },
      uPower: { value: layer.power },
      uSoftness: { value: layer.softness },
    }),
    [color, layer.intensity, layer.power, layer.softness]
  );

  useFrame(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uIntensity.value,
      layer.intensity * intensity,
      0.06
    );
  });

  return (
    <mesh scale={layer.scale} userData={{ islandId }}>
      <sphereGeometry args={[radius, 48, 48]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function Planet({
  variant,
  position,
  islandId,
  metric,
  hovered,
  mode = 'default',
}: PlanetProps) {
  const config = PLANET_CONFIGS[variant];
  const modeSettings = MODE_SETTINGS[mode];
  const groupRef = useRef<THREE.Group>(null);
  const surfaceMatRef = useRef<THREE.ShaderMaterial>(null);
  const atmosphereColor = useMemo(() => new THREE.Color(config.atmosphereColor), [config.atmosphereColor]);

  const surfaceUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMetric: { value: metric },
      uHover: { value: 0 },
      uDesaturate: { value: modeSettings.desaturate },
      uLightDir: { value: LIGHT_DIR.clone() },
    }),
    [metric, modeSettings.desaturate]
  );

  const hoverBoost = hovered ? (mode === 'mini' ? 2.2 : 1.35) : 1;
  const hoverLerpSpeed = mode === 'mini' ? 0.14 : 0.06;

  useFrame((state, delta) => {
    if (groupRef.current) {
      const spin =
        config.rotationSpeed *
        modeSettings.rotationMultiplier *
        (hovered ? modeSettings.hoverSpinBoost : 1);
      groupRef.current.rotation.y += delta * spin;

      if (hovered && mode === 'default') {
        groupRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 2) * 0.03;
      } else {
        groupRef.current.position.x = position[0];
      }

      if (mode === 'mini') {
        const baseScale = 0.92 + metric * 0.18;
        const targetScale = hovered ? baseScale + 0.12 : baseScale;
        groupRef.current.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale),
          0.08
        );
      }
    }
    if (surfaceMatRef.current) {
      surfaceMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      surfaceMatRef.current.uniforms.uMetric.value = metric;
      surfaceMatRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        surfaceMatRef.current.uniforms.uHover.value,
        hovered ? 1 : 0,
        hoverLerpSpeed
      );
    }
  });

  const scale = 0.92 + metric * 0.18;
  const groupScale = mode === 'mini' ? 1 : scale;

  const planetBody = (
    <group
      ref={groupRef}
      position={position}
      scale={groupScale}
      userData={{ islandId }}
    >
      <mesh userData={{ islandId }}>
        <sphereGeometry args={[config.radius, modeSettings.segments, modeSettings.segments]} />
        <shaderMaterial
          ref={surfaceMatRef}
          uniforms={surfaceUniforms}
          vertexShader={planetVertexShader}
          fragmentShader={SURFACE_SHADERS[variant]}
        />
      </mesh>

      {config.atmosphereLayers.map((layer, i) => (
        <AtmosphereShell
          key={i}
          radius={config.radius}
          layer={layer}
          color={atmosphereColor}
          intensity={hoverBoost * modeSettings.atmosphereMultiplier}
          islandId={islandId}
        />
      ))}

      {variant === 'terran' && mode !== 'background' && (
        <mesh scale={1.03}>
          <sphereGeometry args={[config.radius, 32, 32]} />
          <meshStandardMaterial
            color="#c0d0ff"
            emissive="#6060cc"
            emissiveIntensity={hovered && mode === 'mini' ? 0.18 : 0.06}
            transparent
            opacity={hovered && mode === 'mini' ? 0.1 : 0.04}
            depthWrite={false}
          />
        </mesh>
      )}

      {modeSettings.showRings &&
        config.rings?.map((ring, i) => (
          <PlanetRing key={i} {...ring} />
        ))}

      {modeSettings.showMoons && config.moons && <PlanetMoons moons={config.moons} />}

      {mode !== 'background' && (
        <pointLight
          color={config.lightColor}
          intensity={
            (hovered ? 1.4 : 0.7) * modeSettings.lightIntensity
          }
          distance={config.radius * 8}
        />
      )}
    </group>
  );

  if (!modeSettings.floatEnabled) {
    return planetBody;
  }

  return (
    <Float speed={1} rotationIntensity={0.08} floatIntensity={config.floatIntensity}>
      {planetBody}
    </Float>
  );
}
