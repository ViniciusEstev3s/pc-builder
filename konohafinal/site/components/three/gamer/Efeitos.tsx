'use client';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { VivoCtx } from './Modelo';

/* =============================================================================
   FLUXO DE AR: partículas que entram frias (azul) pelas ventoinhas e saem
   quentes (laranja) pelo teto.
   ============================================================================= */

const N = 520;
const FRIO = new THREE.Color('#38bdf8');
const QUENTE = new THREE.Color('#ff5a2a');

const vertex = /* glsl */ `
  attribute float aAlpha;
  attribute vec3 aCor;
  varying float vAlpha;
  varying vec3 vCor;
  uniform float uTamanho;
  void main() {
    vAlpha = aAlpha;
    vCor = aCor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uTamanho * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const fragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vCor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vCor, a);
  }
`;

const FANS_FRENTE = [0.92, 0.22, -0.48];
const FANS_BAIXO = [-0.66, 0, 0.66];

export function FluxoDeAr({ ativo, frontais, inferiores, reduzir }: { ativo: boolean; frontais: boolean; inferiores: boolean; reduzir: boolean }) {
  const vivo = useContext(VivoCtx);
  const pontos = useRef<THREE.Points>(null);
  const visivel = useRef(0);

  const dados = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const cor = new Float32Array(N * 3);
    const alpha = new Float32Array(N);
    const vel = new Float32Array(N * 3);
    const idade = new Float32Array(N);
    const vida = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i * 3 + 1] = -100;
      idade[i] = -Math.random() * 3; // espalha o primeiro ciclo
      vida[i] = 0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aCor', new THREE.BufferAttribute(cor, 3));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);
    return { geo, pos, cor, alpha, vel, idade, vida };
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uTamanho: { value: 0.15 } },
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      dados.geo.dispose();
      material.dispose();
    },
    [dados, material],
  );

  const tmp = useMemo(() => new THREE.Color(), []);

  function nascer(i: number) {
    const { pos, vel, vida, idade } = dados;
    const fontes: number[] = [];
    if (frontais) fontes.push(0, 1, 2);
    if (inferiores) fontes.push(3, 4, 5);
    if (!fontes.length) {
      pos[i * 3 + 1] = -100;
      vida[i] = 0;
      return;
    }
    const f = fontes[Math.floor(Math.random() * fontes.length)];
    const ang = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.25;
    if (f < 3) {
      pos[i * 3] = 1.15;
      pos[i * 3 + 1] = FANS_FRENTE[f] + Math.cos(ang) * r;
      pos[i * 3 + 2] = -0.1 + Math.sin(ang) * r;
      vel[i * 3] = -0.9 - Math.random() * 0.3;
      vel[i * 3 + 1] = 0.05 + Math.random() * 0.1;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    } else {
      pos[i * 3] = FANS_BAIXO[f - 3] + Math.cos(ang) * r;
      pos[i * 3 + 1] = -0.74;
      pos[i * 3 + 2] = -0.1 + Math.sin(ang) * r;
      vel[i * 3] = -0.1 + (Math.random() - 0.5) * 0.2;
      vel[i * 3 + 1] = 0.8 + Math.random() * 0.3;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    idade[i] = 0;
    vida[i] = 2.6 + Math.random() * 1.6;
  }

  useFrame((_, dt) => {
    const p = pontos.current;
    if (!p) return;
    visivel.current = THREE.MathUtils.damp(visivel.current, ativo ? 1 : 0, 5, Math.min(dt, 0.1));
    p.visible = visivel.current > 0.01;
    if (!p.visible) return;

    const { pos, cor, alpha, vel, idade, vida } = dados;
    const ritmo = (vivo.current.rotacao / 0.6) * (reduzir ? 0.35 : 1);
    const d = Math.min(dt, 0.1) * ritmo;

    for (let i = 0; i < N; i++) {
      idade[i] += d;
      if (vida[i] <= 0) {
        if (idade[i] > 0) nascer(i);
        continue;
      }
      const k = i * 3;
      // ar quente sobe; o ar desacelera ao se espalhar
      vel[k + 1] += 0.35 * d;
      vel[k] *= 1 - 0.25 * d;
      pos[k] += vel[k] * d;
      pos[k + 1] += vel[k + 1] * d;
      pos[k + 2] += vel[k + 2] * d;
      // paredes
      if (pos[k] < -1.3) vel[k] = Math.abs(vel[k]) * 0.3;
      if (pos[k + 2] < -0.95 || pos[k + 2] > 0.95) vel[k + 2] *= -0.5;

      const t = idade[i] / vida[i];
      const saiu = pos[k + 1] > 1.55 || t >= 1 || ritmo === 0;
      if (saiu) {
        vida[i] = 0;
        idade[i] = -Math.random() * 0.4;
        pos[k + 1] = -100;
        alpha[i] = 0;
        continue;
      }
      tmp.copy(FRIO).lerp(QUENTE, Math.min(1, t * 1.25));
      cor[k] = tmp.r;
      cor[k + 1] = tmp.g;
      cor[k + 2] = tmp.b;
      alpha[i] = Math.min(1, t * 8) * Math.min(1, (1 - t) * 4) * 0.85 * visivel.current;
    }
    dados.geo.attributes.position.needsUpdate = true;
    dados.geo.attributes.aCor.needsUpdate = true;
    dados.geo.attributes.aAlpha.needsUpdate = true;
  });

  return <points ref={pontos} geometry={dados.geo} material={material} renderOrder={5} raycast={() => null} />;
}

/* =============================================================================
   DIRETOR DE CÂMERA: voos suaves para ângulos prontos e para a peça escolhida.
   ============================================================================= */

export type Voo = { posicao: THREE.Vector3; alvo: THREE.Vector3; velocidade?: number } | null;

export function DiretorCamera({ voo }: { voo: React.MutableRefObject<Voo> }) {
  const controls = useThree((s) => s.controls) as unknown as
    | (THREE.EventDispatcher<{ start: object }> & { target: THREE.Vector3; update: () => void })
    | null;
  const camera = useThree((s) => s.camera);

  // se a pessoa arrastar durante o voo, o voo é cancelado
  useEffect(() => {
    if (!controls) return;
    const cancelar = () => {
      voo.current = null;
    };
    controls.addEventListener('start', cancelar);
    return () => controls.removeEventListener('start', cancelar);
  }, [controls, voo]);

  useFrame((_, dt) => {
    const v = voo.current;
    if (!v || !controls) return;
    const k = 1 - Math.exp(-(v.velocidade ?? 4.2) * Math.min(dt, 0.1));
    camera.position.lerp(v.posicao, k);
    controls.target.lerp(v.alvo, k);
    controls.update();
    if (camera.position.distanceTo(v.posicao) < 0.01 && controls.target.distanceTo(v.alvo) < 0.01) voo.current = null;
  });

  return null;
}
