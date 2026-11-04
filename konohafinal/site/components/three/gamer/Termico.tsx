'use client';
/**
 * Câmera térmica: troca o material de toda a cena por um mapa de calor
 * (paleta de termografia), calculado a partir das peças que estão montadas
 * e das temperaturas estimadas.
 */
import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { ConfigNivel, PecaId } from './dados';

const MAX_FONTES = 14;
export const TEMP_MIN = 20;
export const TEMP_MAX = 100;

/** Paleta de termografia (do frio ao quente), usada também na régua da interface. */
export const PALETA_TERMICA = ['#0a0420', '#2c0b5e', '#6a1b7f', '#b12a6e', '#e8504a', '#fb8f2c', '#fbd24e', '#fffbe0'];

const vertex = /* glsl */ `
  varying vec3 vMundo;
  varying vec3 vNormalMundo;
  void main() {
    vec4 p = vec4(position, 1.0);
    vec3 n = normal;
    #ifdef USE_INSTANCING
      p = instanceMatrix * p;
      n = mat3(instanceMatrix) * n;
    #endif
    vec4 mundo = modelMatrix * p;
    vMundo = mundo.xyz;
    vNormalMundo = normalize(mat3(modelMatrix) * n);
    gl_Position = projectionMatrix * viewMatrix * mundo;
  }
`;

const fragment = /* glsl */ `
  uniform vec4 uFontes[${MAX_FONTES}];
  uniform float uRaios[${MAX_FONTES}];
  uniform int uQtd;
  uniform float uAmbiente;
  uniform vec3 uPaleta[8];
  uniform float uTempo;
  varying vec3 vMundo;
  varying vec3 vNormalMundo;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  vec3 paleta(float t) {
    t = clamp(t, 0.0, 1.0) * 7.0;
    int i = int(floor(t));
    float f = fract(t);
    vec3 a = uPaleta[0];
    vec3 b = uPaleta[1];
    for (int k = 0; k < 7; k++) {
      if (k == i) { a = uPaleta[k]; b = uPaleta[k + 1]; }
    }
    if (i >= 7) return uPaleta[7];
    return mix(a, b, f);
  }

  void main() {
    float maior = 0.0;
    float soma = 0.0;
    for (int i = 0; i < ${MAX_FONTES}; i++) {
      if (i >= uQtd) break;
      vec3 d = vMundo - uFontes[i].xyz;
      float r = uRaios[i];
      float q = exp(-dot(d, d) / (r * r));
      float c = (uFontes[i].w - uAmbiente) * q;
      maior = max(maior, c);
      soma += c;
    }
    // o ar quente sobe: leve gradiente de baixo para cima dentro do gabinete
    float subida = smoothstep(-1.6, 1.6, vMundo.y) * 5.0;
    float temp = uAmbiente + maior + soma * 0.12 + subida;
    // relevo de forma (câmeras térmicas mostram bordas por emissividade)
    float borda = 1.0 - abs(dot(normalize(vNormalMundo), normalize(cameraPosition - vMundo)));
    temp -= borda * 2.5;
    // ruído do sensor
    temp += (hash(gl_FragCoord.xy + uTempo) - 0.5) * 0.9;
    float t = (temp - ${TEMP_MIN.toFixed(1)}) / ${(TEMP_MAX - TEMP_MIN).toFixed(1)};
    gl_FragColor = vec4(paleta(t), 1.0);
    #include <colorspace_fragment>
  }
`;

type Fonte = { pos: [number, number, number]; temp: number; raio: number };

/** Monta a lista de pontos quentes a partir do que está montado. */
export function fontesDeCalor(config: ConfigNivel, montadas: Set<PecaId>, cpu: number | null, gpu: number | null): Fonte[] {
  const tem = (id: PecaId) => montadas.has(id);
  if (!tem('fonte') || !tem('cabos')) return []; // sem energia, tudo frio
  const f: Fonte[] = [];
  const ventilado = tem('fans-frontais') || tem('fans-inferiores');

  f.push({ pos: [-0.7, -1.24, -0.15], temp: 46, raio: 0.55 }); // fonte
  if (tem('placa-mae')) {
    f.push({ pos: [-0.92, 0.78, -0.95], temp: (cpu ?? 40) - 8, raio: 0.28 }); // VRM
    f.push({ pos: [0.15, -0.6, -0.98], temp: 52, raio: 0.2 }); // chipset
  }
  if (tem('ssd')) f.push({ pos: [-0.32, 0.2, -0.97], temp: 54, raio: 0.16 });
  if (tem('ram')) f.push({ pos: [-0.0, 0.76, -0.92], temp: 44, raio: 0.22 });

  if (cpu != null && tem('cpu')) {
    const semCooler = !tem('cooler');
    f.push({ pos: [-0.6, 0.74, -0.95], temp: cpu, raio: semCooler ? 0.24 : 0.2 });
    if (!semCooler) {
      if (config.tipoCooler === 'water-240') {
        f.push({ pos: [-0.6, 0.74, -0.87], temp: cpu - 18, raio: 0.28 });
        f.push({ pos: [0.2, 1.45, -0.4], temp: cpu - 24, raio: 0.7 });
      } else if (config.tipoCooler === 'air-tower') {
        f.push({ pos: [-0.6, 0.85, -0.72], temp: cpu - 14, raio: 0.32 });
      } else {
        f.push({ pos: [-0.6, 0.74, -0.84], temp: cpu - 10, raio: 0.3 });
      }
    }
  }
  if (gpu != null && tem('gpu')) {
    const L = config.tamanhoGpu === 'triple-fan' ? 1.65 : 1.22;
    const gx = -1.3 + L / 2;
    f.push({ pos: [gx, -0.18, -0.7], temp: gpu, raio: 0.42 });
    f.push({ pos: [gx + L * 0.25, -0.12, -0.55], temp: gpu - 6, raio: 0.4 });
    f.push({ pos: [gx - L * 0.25, -0.12, -0.55], temp: gpu - 6, raio: 0.4 });
  }
  // bolsão de ar quente no teto (maior quando faltam ventoinhas)
  f.push({ pos: [0, 1.25, -0.2], temp: ventilado ? 34 : 44, raio: 0.9 });
  return f.slice(0, MAX_FONTES);
}

export function CameraTermica({ ativa, fontes }: { ativa: boolean; fontes: Fonte[] }) {
  const scene = useThree((s) => s.scene);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uFontes: { value: Array.from({ length: MAX_FONTES }, () => new THREE.Vector4()) },
          uRaios: { value: new Array(MAX_FONTES).fill(0.3) },
          uQtd: { value: 0 },
          uAmbiente: { value: 25 },
          uPaleta: { value: PALETA_TERMICA.map((c) => new THREE.Color(c)) },
          uTempo: { value: 0 },
        },
      }),
    [],
  );

  useEffect(() => {
    const u = material.uniforms;
    fontes.forEach((f, i) => {
      (u.uFontes.value as THREE.Vector4[])[i].set(f.pos[0], f.pos[1], f.pos[2], f.temp);
      (u.uRaios.value as number[])[i] = f.raio;
    });
    u.uQtd.value = fontes.length;
  }, [fontes, material]);

  useEffect(() => {
    scene.overrideMaterial = ativa ? material : null;
    return () => {
      scene.overrideMaterial = null;
    };
  }, [ativa, material, scene]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }) => {
    if (ativa) material.uniforms.uTempo.value = Math.floor(clock.getElapsedTime() * 12);
  });

  return null;
}

/** Temperatura máxima e mínima da cena (para a leitura da câmera). */
export function extremos(fontes: Fonte[]) {
  if (!fontes.length) return { max: 23, min: 22 };
  return { max: Math.round(Math.max(...fontes.map((f) => f.temp))), min: 22 };
}
