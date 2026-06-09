export const planetVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

export const atmosphereVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

export const ringVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ringFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uGapCenter;
  uniform float uGapWidth;

  varying vec2 vUv;

  void main() {
    float t = vUv.y;
    float innerFade = smoothstep(0.0, 0.12, t);
    float outerFade = 1.0 - smoothstep(0.82, 1.0, t);
    float band = sin(vUv.x * 64.0) * 0.08 + 0.92;
    float gap = 1.0 - smoothstep(uGapCenter - uGapWidth, uGapCenter + uGapWidth, t)
                    * smoothstep(uGapCenter + uGapWidth * 0.3, uGapCenter - uGapWidth * 0.3, t);

    float alpha = innerFade * outerFade * band * gap * uOpacity;
    vec3 col = uColor * mix(0.7, 1.15, band * innerFade);
    gl_FragColor = vec4(col, alpha);
  }
`;

export const atmosphereFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  uniform float uSoftness;

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float ndotv = max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
    float edge = 1.0 - ndotv;
    float glow = pow(edge, uPower);
    glow = smoothstep(0.0, uSoftness, glow);
    float alpha = glow * uIntensity;
    vec3 col = uColor * mix(0.55, 1.0, glow * 0.6);
    gl_FragColor = vec4(col, alpha);
  }
`;

const surfaceLighting = /* glsl */ `
  vec3 applyLighting(vec3 col, vec3 n, vec3 lightDir, vec3 viewDir, float specPower, float specStr) {
    float diff = max(dot(n, lightDir), 0.08;
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(n, halfDir), 0.0), specPower);
    vec3 ambient = col * 0.14;
    vec3 diffuse = col * diff * 0.86;
    vec3 specular = vec3(1.0) * spec * specStr;
    return ambient + diffuse + specular;
  }

  vec3 desaturate(vec3 col, float amount) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    return mix(col, vec3(luma), amount);
  }
`;

export const icePlanetFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uMetric;
  uniform float uHover;
  uniform float uDesaturate;
  uniform vec3 uLightDir;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

// 計算視線與法線夾角
float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
vec3 atmosColor = vec3(0.3, 0.6, 1.0); // 大氣層顏色
col += atmosColor * fresnel * 0.5; // 疊加到主顏色上

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(vec3(i, 0.0));
    float b = hash(vec3(i + vec2(1.0, 0.0), 0.0));
    float c = hash(vec3(i + vec2(0.0, 1.0), 0.0));
    float d = hash(vec3(i + vec2(1.0, 1.0), 0.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  ${surfaceLighting}

  void main() {
    vec3 n = normalize(vNormal);
    vec3 viewDir = normalize(vViewDir);
    float lat = vWorldPos.y * 1.6;
    float n2 = noise(vec2(lat * 4.0, uTime * 0.05));
    float bands = sin(lat * 5.0 + uTime * 0.12 + n2 * 2.0) * 0.5 + 0.5;

    vec3 abyss = vec3(0.03, 0.08, 0.22);
    vec3 ice = vec3(0.28, 0.52, 0.82);
    vec3 frost = vec3(0.72, 0.86, 0.98);
    vec3 col = mix(abyss, ice, bands);
    col = mix(col, frost, hash(floor(vWorldPos * 8.0)) * (0.18 + uMetric * 0.28));
    col += vec3(0.08, 0.18, 0.38) * uHover * 0.3;

    col = applyLighting(col, n, normalize(uLightDir), viewDir, 56.0, 0.22);
    col = desaturate(col, uDesaturate);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const gasPlanetFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uMetric;
  uniform float uHover;
  uniform float uDesaturate;
  uniform vec3 uLightDir;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * hash(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  ${surfaceLighting}

  void main() {
    vec3 n = normalize(vNormal);
    vec3 viewDir = normalize(vViewDir);
    float lat = vWorldPos.y * 2.2;
    float turb = fbm(vec2(lat * 2.5 + uTime * 0.08, uTime * 0.04));
    float bands = sin(lat * 7.0 + uTime * 0.18 + turb * 3.0) * 0.5 + 0.5;

    vec3 core = vec3(0.38, 0.1, 0.03);
    vec3 amber = vec3(0.88, 0.4, 0.1);
    vec3 cream = vec3(0.95, 0.72, 0.48);
    vec3 col = mix(core, amber, bands + turb * 0.25);
    col = mix(col, cream, sin(lat * 16.0 + uTime * 0.5) * 0.06 + 0.1);
    col *= 0.82 + uMetric * 0.3;
    col += vec3(0.45, 0.18, 0.06) * uHover * 0.25;

    col = applyLighting(col, n, normalize(uLightDir), viewDir, 24.0, 0.08);
    col = desaturate(col, uDesaturate);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const terranPlanetFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uMetric;
  uniform float uHover;
  uniform float uDesaturate;
  uniform vec3 uLightDir;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * hash(p);
      p *= 2.05;
      a *= 0.48;
    }
    return v;
  }

  ${surfaceLighting}

  void main() {
    vec3 n = normalize(vNormal);
    vec3 viewDir = normalize(vViewDir);
    float lat = vWorldPos.y * 2.0;
    float lon = atan(vWorldPos.z, vWorldPos.x);
    float turb = fbm(vec2(lon * 1.8 + uTime * 0.06, lat * 3.0));
    float bands = sin(lat * 6.5 + uTime * 0.14 + turb * 4.0) * 0.5 + 0.5;

    vec3 deep = vec3(0.04, 0.05, 0.18);
    vec3 indigo = vec3(0.12, 0.14, 0.42);
    vec3 violet = vec3(0.35, 0.22, 0.62);
    vec3 periwinkle = vec3(0.45, 0.55, 0.92);

    vec3 col = mix(deep, indigo, bands);
    col = mix(col, violet, turb * (0.35 + uMetric * 0.4));
    col = mix(col, periwinkle, pow(sin(lon * 4.0 + lat * 8.0 + uTime * 0.2) * 0.5 + 0.5, 3.0) * 0.2);

    float storm = smoothstep(0.55, 0.9, sin(lon * 2.5 + lat * 5.0 - uTime * 0.3) * 0.5 + 0.5);
    col = mix(col, vec3(0.55, 0.45, 0.88), storm * 0.18);

    col += vec3(0.2, 0.15, 0.45) * uHover * 0.28;
    col = applyLighting(col, n, normalize(uLightDir), viewDir, 40.0, 0.16);
    col = desaturate(col, uDesaturate);

    gl_FragColor = vec4(col, 1.0);
  }
`;
