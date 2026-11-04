'use client';
/**
 * Modelo 3D do gabinete aquário: estrutura fixa + peças removíveis animadas.
 * Toda a geometria é procedural (sem arquivos externos), então funciona offline.
 */
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import { DEF, type ConfigNivel, type DefPeca, type EfeitoLed, type PecaId, type V3 } from './dados';
import {
  aplicarRelevo,
  texturaAdesivoFan,
  texturaBackplate,
  texturaChipset,
  texturaMarcasVidro,
  texturaPerfurada,
  texturaPlaca,
  texturaProcessador,
  texturaRam,
  texturaSSD,
  texturaTrancado,
  texturasPlacaMae,
} from './texturas';

/* =============================================================================
   ESTADO EM TEMPO REAL (lido a cada quadro, sem re-renderizar o React)
   ============================================================================= */

export type Vivo = {
  /** 0 = ventoinhas paradas, 0,6 = normal, 1 = máximo */
  rotacao: number;
};

export const VivoCtx = createContext<React.MutableRefObject<Vivo>>({ current: { rotacao: 0.6 } });

/* =============================================================================
   GEOMETRIAS PROCEDURAIS (criadas uma vez e reaproveitadas)
   ============================================================================= */

const cacheGeo = new Map<string, THREE.BufferGeometry>();
function memoGeo(chave: string, criar: () => THREE.BufferGeometry) {
  let g = cacheGeo.get(chave);
  if (!g) {
    g = criar();
    cacheGeo.set(chave, g);
  }
  return g;
}

function retanguloArredondado(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Moldura quadrada de ventoinha com o furo redondo vazado. */
function geoMolduraFan(t: number, d: number) {
  return memoGeo(`moldura-${t}-${d}`, () => {
    const s = retanguloArredondado(t, t, t * 0.09);
    const furo = new THREE.Path();
    furo.absarc(0, 0, t * 0.455, 0, Math.PI * 2, true);
    s.holes.push(furo);
    const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.005, bevelSegments: 2, curveSegments: 40 });
    g.translate(0, 0, -d / 2);
    return g;
  });
}

/** Pá curva de ventoinha, deitada ao longo do eixo X. */
function geoPa(ri: number, ro: number) {
  return memoGeo(`pa-${ri}-${ro}`, () => {
    const s = new THREE.Shape();
    const borda: [number, number][] = [];
    const fuga: [number, number][] = [];
    const N = 12;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = ri + (ro - ri) * t;
      const c = 0.32 * (ro - ri) * t * t;
      const w = (ro - ri) * (0.3 + 0.28 * t);
      borda.push([x, c + w / 2]);
      fuga.push([x, c - w / 2]);
    }
    s.moveTo(...borda[0]);
    borda.forEach((p) => s.lineTo(...p));
    fuga.reverse().forEach((p) => s.lineTo(...p));
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.006, bevelEnabled: false });
    g.translate(0, 0, -0.003);
    return g;
  });
}

/** Tampa inferior da placa de vídeo com os furos das ventoinhas. */
function geoShroudGpu(L: number, H: number, furos: number[], raio: number) {
  return memoGeo(`shroud-${L}-${furos.join('_')}`, () => {
    const s = retanguloArredondado(L, H, 0.05);
    furos.forEach((fx) => {
      const p = new THREE.Path();
      p.absarc(fx, 0, raio, 0, Math.PI * 2, true);
      s.holes.push(p);
    });
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2, curveSegments: 40 });
    g.rotateX(Math.PI / 2);
    return g;
  });
}

/* =============================================================================
   TEXTURAS PROCEDURAIS
   ============================================================================= */

function canvasTex(w: number, h: number, desenhar: (g: CanvasRenderingContext2D) => void, repetir?: [number, number]) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  desenhar(g);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repetir) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repetir);
  }
  return t;
}

function texturaFiltro() {
  return canvasTex(
    64,
    64,
    (g) => {
      g.fillStyle = '#1a1d23';
      g.fillRect(0, 0, 64, 64);
      g.fillStyle = '#050608';
      for (let y = 0; y < 4; y++)
        for (let x = 0; x < 4; x++) {
          g.beginPath();
          g.arc(8 + x * 16 + (y % 2) * 8, 8 + y * 16, 5, 0, Math.PI * 2);
          g.fill();
        }
    },
    [40, 30],
  );
}

function texturaEtiqueta(titulo: string, sub: string, cor: string) {
  return canvasTex(512, 160, (g) => {
    g.fillStyle = '#0e1013';
    g.fillRect(0, 0, 512, 160);
    g.fillStyle = cor;
    g.fillRect(0, 128, 512, 32);
    g.fillStyle = '#f1f5f9';
    g.font = 'bold 54px sans-serif';
    g.fillText(titulo, 28, 72);
    g.fillStyle = 'rgba(241,245,249,0.65)';
    g.font = '28px sans-serif';
    g.fillText(sub, 30, 112);
  });
}

/* =============================================================================
   MATERIAIS
   ============================================================================= */

export type Materiais = ReturnType<typeof criarMateriais>;

function criarMateriais() {
  const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p);
  const trancado = texturaTrancado();
  const marcas = texturaMarcasVidro();
  return {
    // pintura eletrostática do gabinete: textura fina e fosca
    chassi: aplicarRelevo(std({ color: '#f2f4f6', metalness: 0.05, roughness: 0.5 }), { tipo: 'pintura', escala: 16, relevo: 0.22, aspereza: 0.2, cor: 0.015 }),
    chassiInterno: aplicarRelevo(std({ color: '#e6eaee', metalness: 0.05, roughness: 0.6 }), { tipo: 'pintura', escala: 16, relevo: 0.22, aspereza: 0.2, cor: 0.015 }),
    // plástico/metal preto texturizado (molduras, fonte, tampas)
    preto: aplicarRelevo(std({ color: '#111419', metalness: 0.35, roughness: 0.55 }), { tipo: 'granulado', escala: 14, relevo: 0.45, aspereza: 0.3, cor: 0.08 }),
    // metais escovados
    metalEscuro: aplicarRelevo(std({ color: '#1c2027', metalness: 0.9, roughness: 0.34 }), { tipo: 'escovado', escala: 2.2, relevo: 1.3, aspereza: 0.6, cor: 0.25 }),
    grafite: aplicarRelevo(std({ color: '#2b313a', metalness: 0.85, roughness: 0.36 }), { tipo: 'escovado', escala: 2.2, relevo: 1.3, aspereza: 0.6, cor: 0.25 }),
    prata: aplicarRelevo(std({ color: '#d2d9e1', metalness: 1, roughness: 0.24 }), { tipo: 'escovado', escala: 3, relevo: 1.0, aspereza: 0.7, cor: 0.12 }),
    aluminio: aplicarRelevo(std({ color: '#b1bbc6', metalness: 0.95, roughness: 0.32 }), { tipo: 'escovado', escala: 3.5, relevo: 0.9, aspereza: 0.6, cor: 0.15 }),
    cobre: aplicarRelevo(std({ color: '#c47c4a', metalness: 1, roughness: 0.3 }), { tipo: 'escovado', escala: 3, relevo: 1.0, aspereza: 0.6, cor: 0.35 }),
    ouro: aplicarRelevo(std({ color: '#d6a740', metalness: 1, roughness: 0.28 }), { tipo: 'pintura', escala: 12, relevo: 0.4, aspereza: 0.4, cor: 0.1 }),
    borracha: aplicarRelevo(std({ color: '#0c0d0f', metalness: 0, roughness: 0.92 }), { tipo: 'borracha', escala: 10, relevo: 1.4, aspereza: 0.1, cor: 0.15 }),
    plastico: aplicarRelevo(std({ color: '#16191e', metalness: 0.1, roughness: 0.62 }), { tipo: 'granulado', escala: 12, relevo: 0.9, aspereza: 0.3, cor: 0.1 }),
    furoFan: std({ color: '#050608', metalness: 0, roughness: 1 }),
    // pás translúcidas foscas (difusoras de LED)
    pa: aplicarRelevo(std({ color: '#e5e9f0', metalness: 0, roughness: 0.55, transparent: true, opacity: 0.6, emissive: '#000000' }), {
      tipo: 'granulado',
      escala: 14,
      relevo: 0.6,
      aspereza: 0.3,
      cor: 0.05,
    }),
    paEscura: aplicarRelevo(std({ color: '#1f242c', metalness: 0.2, roughness: 0.5 }), { tipo: 'granulado', escala: 14, relevo: 0.7, aspereza: 0.3, cor: 0.1 }),
    // mangueiras e cabos com malha trançada (relevo pela UV do tubo)
    tubo: std({ color: '#15181d', metalness: 0.25, roughness: 0.62, bumpMap: trancado, bumpScale: 2.2 }),
    caboSleeve: std({ color: '#1d2128', metalness: 0.15, roughness: 0.6, bumpMap: trancado, bumpScale: 2.4 }),
    pcb: aplicarRelevo(std({ color: '#12352a', metalness: 0.25, roughness: 0.45 }), { tipo: 'granulado', escala: 18, relevo: 0.6, aspereza: 0.3, cor: 0.12 }),
    pcbPreta: aplicarRelevo(std({ color: '#0d0f12', metalness: 0.3, roughness: 0.45 }), { tipo: 'granulado', escala: 18, relevo: 0.6, aspereza: 0.3, cor: 0.12 }),
    etiqueta: aplicarRelevo(std({ color: '#e2e8f0', metalness: 0.05, roughness: 0.75 }), { tipo: 'pintura', escala: 20, relevo: 0.5, aspereza: 0.2, cor: 0.05 }),
    adesivo: std({ color: '#ffffff', map: texturaAdesivoFan(), metalness: 0.05, roughness: 0.5 }),
    vidro: new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0,
      roughness: 0.35,
      roughnessMap: marcas,
      transparent: true,
      opacity: 0.05,
      clearcoat: 0.3,
      clearcoatRoughness: 0.35,
      clearcoatRoughnessMap: marcas,
      envMapIntensity: 0.35,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    led: std({ color: '#000000', emissive: '#ff6b00', emissiveIntensity: 2.6, roughness: 0.25, toneMapped: false }),
  };
}

/** Material com uma textura desenhada (adesivos, rostos de componentes). */
function useMaterialTextura(criar: () => THREE.Texture, deps: unknown[], p: THREE.MeshStandardMaterialParameters = {}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', map: criar(), metalness: 0.1, roughness: 0.55, ...p }), deps);
  useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

/** Desliga o raycast de um objeto (vidro não deve roubar cliques). */
export const semRaycast = () => null;

/* =============================================================================
   PEÇAS PEQUENAS REUTILIZÁVEIS
   ============================================================================= */

/** Rotor de ventoinha com pás curvas; a rotação segue o controle de velocidade. */
function Rotor({ m, ri, ro, pas = 9, base = 9, material }: { m: Materiais; ri: number; ro: number; pas?: number; base?: number; material?: THREE.Material }) {
  const ref = useRef<THREE.Group>(null);
  const vivo = useContext(VivoCtx);
  const angulos = useMemo(() => Array.from({ length: pas }, (_, i) => (i * Math.PI * 2) / pas), [pas]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z -= base * (vivo.current.rotacao / 0.6) * Math.min(dt, 0.1);
  });
  const geo = geoPa(ri * 0.9, ro);
  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={m.plastico}>
        <cylinderGeometry args={[ri, ri, 0.045, 28]} />
      </mesh>
      <mesh position={[0, 0, 0.024]} material={m.adesivo}>
        <circleGeometry args={[ri * 0.72, 28]} />
      </mesh>
      {angulos.map((a) => (
        <group key={a} rotation={[0, 0, a]}>
          <mesh geometry={geo} rotation={[0.5, 0, 0]} material={material ?? m.pa} />
        </group>
      ))}
    </group>
  );
}

/** Ventoinha 120 mm completa. O ar sai pela face +Z local. */
function Ventoinha({ m, t = 0.62, led = true }: { m: Materiais; t?: number; led?: boolean }) {
  const d = t * 0.2;
  return (
    <group>
      <mesh geometry={geoMolduraFan(t, d)} material={m.preto} />
      <mesh position={[0, 0, -d / 2 + 0.002]} material={m.furoFan}>
        <circleGeometry args={[t * 0.455, 40]} />
      </mesh>
      {/* braços de sustentação do motor (lado de trás) */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0, -d / 2 + 0.01]} rotation={[0, 0, (i * Math.PI) / 2 + Math.PI / 4]} material={m.preto}>
          <boxGeometry args={[t * 0.9, 0.012, 0.012]} />
        </mesh>
      ))}
      {led && (
        <>
          <mesh position={[0, 0, d / 2 + 0.004]} material={m.led}>
            <torusGeometry args={[t * 0.448, 0.012, 10, 64]} />
          </mesh>
          <mesh position={[0, 0, 0.026]} material={m.led}>
            <torusGeometry args={[t * 0.13, 0.008, 8, 32]} />
          </mesh>
        </>
      )}
      <Rotor m={m} ri={t * 0.12} ro={t * 0.43} />
      {/* parafusos */}
      {[
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ].map(([sx, sy]) => (
        <mesh key={`${sx}${sy}`} position={[sx * t * 0.41, sy * t * 0.41, d / 2 + 0.006]} rotation={[Math.PI / 2, 0, 0]} material={m.prata}>
          <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
        </mesh>
      ))}
    </group>
  );
}

/** Conjunto de placas finas repetidas (aletas de dissipador e radiador). */
function Aletas({
  qtd,
  tamanho,
  passo,
  eixo = 'x',
  material,
  posicao = [0, 0, 0],
}: {
  qtd: number;
  tamanho: V3;
  passo: number;
  eixo?: 'x' | 'y' | 'z';
  material: THREE.Material;
  posicao?: V3;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const im = ref.current;
    if (!im) return;
    const o = new THREE.Object3D();
    const ini = -((qtd - 1) * passo) / 2;
    for (let i = 0; i < qtd; i++) {
      o.position.set(0, 0, 0);
      o.position[eixo] = ini + i * passo;
      o.updateMatrix();
      im.setMatrixAt(i, o.matrix);
    }
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingBox();
    im.computeBoundingSphere();
  }, [qtd, passo, eixo]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, qtd]} material={material} position={posicao}>
      <boxGeometry args={tamanho} />
    </instancedMesh>
  );
}

/** Cabo (ou feixe de fios) seguindo uma curva suave. */
function Cabo({ pontos, raio = 0.02, material, fios = 1, afastamento = 0.032 }: { pontos: V3[]; raio?: number; material: THREE.Material; fios?: number; afastamento?: number }) {
  const geos = useMemo(
    () =>
      Array.from({ length: fios }, (_, i) => {
        const dy = (i - (fios - 1) / 2) * afastamento;
        const curva = new THREE.CatmullRomCurve3(pontos.map(([x, y, z]) => new THREE.Vector3(x, y + dy, z)));
        const geo = new THREE.TubeGeometry(curva, 64, raio, 12, false);
        // a malha trançada mantém o mesmo tamanho em cabos curtos e longos, finos e grossos
        const voltas = Math.max(1, Math.round((2 * Math.PI * raio) / 0.05));
        const comp = curva.getLength() / (2 * Math.PI * raio / voltas) / 2;
        const uv = geo.attributes.uv as THREE.BufferAttribute;
        for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * comp, uv.getY(k) * voltas);
        uv.needsUpdate = true;
        return geo;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(pontos), raio, fios, afastamento],
  );
  useEffect(() => () => geos.forEach((g) => g.dispose()), [geos]);
  return (
    <group>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} material={material} />
      ))}
    </group>
  );
}

/* =============================================================================
   COMPONENTES GRANDES
   ============================================================================= */

function PlacaDeVideo({ m, L, triplo }: { m: Materiais; L: number; triplo: boolean }) {
  const H = 0.72;
  const matBackplate = useMaterialTextura(() => texturaBackplate(L), [L], { metalness: 0.75, roughness: 0.4 });
  const fans = triplo ? [-L / 2 + 0.32, 0, L / 2 - 0.32] : [-L / 4 + 0.03, L / 4 - 0.03];
  const raioFuro = triplo ? 0.235 : 0.25;
  const nAletas = Math.floor((L - 0.14) / 0.022);
  return (
    <group>
      {/* backplate (lado de cima) */}
      <RoundedBox args={[L, 0.026, H]} radius={0.01} smoothness={3} position={[0, 0.128, 0]} material={m.grafite} />
      <mesh position={[0, 0.1415, 0]} rotation={[-Math.PI / 2, 0, 0]} material={matBackplate}>
        <planeGeometry args={[L - 0.02, H - 0.02]} />
      </mesh>
      <mesh position={[L * 0.18, 0.142, H / 2 - 0.09]} material={m.led}>
        <boxGeometry args={[0.36, 0.004, 0.04]} />
      </mesh>
      {/* PCB */}
      <mesh position={[0, 0.1, 0]} material={m.pcbPreta}>
        <boxGeometry args={[L - 0.03, 0.018, H - 0.03]} />
      </mesh>
      {/* conector de energia PCIe */}
      <mesh position={[L / 2 - 0.42, 0.075, H / 2 - 0.035]} material={m.plastico}>
        <boxGeometry args={[0.13, 0.05, 0.06]} />
      </mesh>
      {/* heatpipes */}
      {[-0.18, -0.06, 0.06, 0.18].map((z) => (
        <mesh key={z} position={[0, 0.07, z]} rotation={[0, 0, Math.PI / 2]} material={m.cobre}>
          <cylinderGeometry args={[0.012, 0.012, L - 0.18, 10]} />
        </mesh>
      ))}
      {/* dissipador de aletas */}
      <Aletas qtd={nAletas} tamanho={[0.006, 0.12, H - 0.08]} passo={0.022} eixo="x" material={m.aluminio} posicao={[0, 0.0, 0]} />
      {/* tampa inferior com furos */}
      <mesh geometry={geoShroudGpu(L, H, fans, raioFuro)} position={[0, -0.075, 0]} material={m.metalEscuro} />
      {/* bordas laterais do shroud */}
      <RoundedBox args={[L, 0.1, 0.035]} radius={0.012} smoothness={3} position={[0, -0.03, H / 2 - 0.012]} material={m.metalEscuro} />
      <RoundedBox args={[L, 0.1, 0.035]} radius={0.012} smoothness={3} position={[0, -0.03, -H / 2 + 0.012]} material={m.metalEscuro} />
      <mesh position={[0, -0.02, H / 2 + 0.007]} material={m.led}>
        <boxGeometry args={[L * 0.72, 0.016, 0.004]} />
      </mesh>
      {/* ventoinhas */}
      {fans.map((x) => (
        <group key={x} position={[x, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <Rotor m={m} ri={0.05} ro={raioFuro - 0.02} pas={11} base={11} material={m.paEscura} />
        </group>
      ))}
      {/* suporte traseiro (bracket) */}
      <mesh position={[-L / 2 - 0.012, 0.02, -0.03]} material={m.prata}>
        <boxGeometry args={[0.014, 0.33, H + 0.08]} />
      </mesh>
    </group>
  );
}

function Radiador({ m, comprimento }: { m: Materiais; comprimento: number }) {
  const L = comprimento;
  return (
    <group>
      {[-0.32, 0.32].map((z) => (
        <RoundedBox key={z} args={[L - 0.18, 0.13, 0.04]} radius={0.01} smoothness={3} position={[0, 0, z]} material={m.metalEscuro} />
      ))}
      <Aletas qtd={Math.floor((L - 0.24) / 0.018)} tamanho={[0.005, 0.11, 0.6]} passo={0.018} eixo="x" material={m.grafite} />
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[0.1, 0.15, 0.7]} radius={0.02} smoothness={3} position={[s * (L / 2 - 0.05), 0, 0]} material={m.preto} />
      ))}
      {/* conexões das mangueiras */}
      {[-0.06, 0.06].map((z) => (
        <mesh key={z} position={[L / 2 - 0.05, -0.1, z]} material={m.prata}>
          <cylinderGeometry args={[0.03, 0.03, 0.06, 16]} />
        </mesh>
      ))}
    </group>
  );
}

function PlacaMae({ m }: { m: Materiais }) {
  const z = -1.0;
  const matPcb = useMemo(() => {
    const t = texturasPlacaMae();
    return new THREE.MeshStandardMaterial({ color: '#ffffff', map: t.cor, bumpMap: t.relevo, bumpScale: 1.6, metalness: 0.3, roughness: 0.42 });
  }, []);
  const matChipset = useMaterialTextura(texturaChipset, [], { metalness: 0.8, roughness: 0.35 });
  useEffect(() => () => matPcb.dispose(), [matPcb]);
  return (
    <group>
      <mesh position={[-0.35, 0.28, z - 0.02]} material={matPcb}>
        <boxGeometry args={[1.9, 2.38, 0.035]} />
      </mesh>
      {/* tampa do painel traseiro (I/O) com LED */}
      <RoundedBox args={[0.24, 0.82, 0.14]} radius={0.025} smoothness={3} position={[-1.15, 1.02, z + 0.07]} material={m.grafite} />
      <mesh position={[-1.08, 1.02, z + 0.142]} material={m.led}>
        <boxGeometry args={[0.018, 0.62, 0.004]} />
      </mesh>
      {/* dissipadores do VRM */}
      <RoundedBox args={[0.16, 0.66, 0.1]} radius={0.018} smoothness={3} position={[-0.92, 0.78, z + 0.05]} material={m.metalEscuro} />
      <RoundedBox args={[0.5, 0.15, 0.1]} radius={0.018} smoothness={3} position={[-0.6, 1.2, z + 0.05]} material={m.metalEscuro} />
      {[-0.03, 0.03].map((dx) => (
        <mesh key={dx} position={[-0.92 + dx, 0.78, z + 0.101]} material={m.prata}>
          <boxGeometry args={[0.008, 0.58, 0.002]} />
        </mesh>
      ))}
      {/* capacitores */}
      {[0.45, 0.55, 0.65, 0.75, 0.85, 0.95].map((y) => (
        <mesh key={y} position={[-1.02, y, z + 0.03]} rotation={[Math.PI / 2, 0, 0]} material={m.aluminio}>
          <cylinderGeometry args={[0.018, 0.018, 0.05, 12]} />
        </mesh>
      ))}
      {/* soquete do processador */}
      <mesh position={[-0.6, 0.74, z + 0.005]} material={m.plastico}>
        <boxGeometry args={[0.44, 0.44, 0.02]} />
      </mesh>
      <mesh position={[-0.6, 0.74, z + 0.016]} material={m.prata}>
        <boxGeometry args={[0.4, 0.4, 0.004]} />
      </mesh>
      {/* conector de 8 pinos do processador */}
      <mesh position={[-1.05, 1.43, z + 0.035]} material={m.plastico}>
        <boxGeometry args={[0.12, 0.05, 0.06]} />
      </mesh>
      {/* slots de memória com travas */}
      {[-0.2, -0.1, 0.0, 0.1].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.76, z + 0.015]} material={x === -0.1 || x === 0.1 ? m.grafite : m.plastico}>
            <boxGeometry args={[0.032, 0.74, 0.03]} />
          </mesh>
          <mesh position={[x, 1.14, z + 0.025]} material={m.plastico}>
            <boxGeometry args={[0.036, 0.04, 0.05]} />
          </mesh>
        </group>
      ))}
      {/* conector de 24 pinos */}
      <mesh position={[0.5, 0.62, z + 0.035]} material={m.plastico}>
        <boxGeometry args={[0.06, 0.34, 0.06]} />
      </mesh>
      {/* slot PCIe x16 reforçado + slot x1 */}
      <mesh position={[-0.75, -0.02, z + 0.02]} material={m.plastico}>
        <boxGeometry args={[0.95, 0.045, 0.035]} />
      </mesh>
      <mesh position={[-0.75, -0.02, z + 0.02]} material={m.prata}>
        <boxGeometry args={[0.97, 0.055, 0.02]} />
      </mesh>
      <mesh position={[-1.0, -0.5, z + 0.015]} material={m.plastico}>
        <boxGeometry args={[0.24, 0.035, 0.03]} />
      </mesh>
      {/* dissipador do chipset */}
      <RoundedBox args={[0.44, 0.38, 0.05]} radius={0.02} smoothness={3} position={[0.15, -0.6, z + 0.025]} material={m.metalEscuro} />
      <mesh position={[0.15, -0.6, z + 0.0505]} material={matChipset}>
        <planeGeometry args={[0.41, 0.35]} />
      </mesh>
      <mesh position={[0.15, -0.79, z + 0.03]} material={m.led}>
        <boxGeometry args={[0.3, 0.01, 0.01]} />
      </mesh>
      {/* tampa do áudio */}
      <RoundedBox args={[0.28, 0.44, 0.05]} radius={0.02} smoothness={3} position={[-1.12, -0.62, z + 0.025]} material={m.grafite} />
      {/* bateria da BIOS */}
      <mesh position={[-0.3, -0.62, z + 0.01]} rotation={[Math.PI / 2, 0, 0]} material={m.prata}>
        <cylinderGeometry args={[0.055, 0.055, 0.012, 24]} />
      </mesh>
      {/* slot M.2 */}
      <mesh position={[-0.6, 0.2, z + 0.008]} material={m.plastico}>
        <boxGeometry args={[0.04, 0.07, 0.02]} />
      </mesh>
    </group>
  );
}

/* =============================================================================
   ANIMAÇÃO DE CADA PEÇA REMOVÍVEL
   ============================================================================= */

type PropsPeca = {
  def: DefPeca;
  montada: boolean;
  antigravidade: boolean;
  reduzir: boolean;
  destacada: boolean;
  mostrarNome: boolean;
  arrastando: boolean;
  posArrasteRef: React.MutableRefObject<THREE.Vector3>;
  pertoDoSlotRef: React.MutableRefObject<boolean>;
  aoIniciarArraste: (id: PecaId, posInicial: THREE.Vector3) => void;
  registrar: (id: PecaId, g: THREE.Group | null) => void;
  aoClicar: (id: PecaId) => void;
  aoFocar: (id: PecaId) => void;
  aoPassar: (id: PecaId | null) => void;
  children: ReactNode;
};

/**
 * Envolve uma peça: anima a saída (para a bancada 3D se for arrastável, ou flutua),
 * a volta, o modo antigravidade e o arraste manual em tempo real (Arrastar e Encaixar).
 */
function PecaAnimada({
  def,
  montada,
  antigravidade,
  reduzir,
  destacada,
  mostrarNome,
  arrastando,
  posArrasteRef,
  pertoDoSlotRef,
  aoIniciarArraste,
  registrar,
  aoClicar,
  aoFocar,
  aoPassar,
  children,
}: PropsPeca) {
  const ref = useRef<THREE.Group>(null);
  const progresso = useRef(reduzir && montada ? 1 : 0);
  const flutuacao = useRef(0);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const semente = useMemo(() => [...def.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 17, [def.id]);
  const [cx, cy, cz] = def.centro;
  const [ex, ey, ez] = def.explode;
  const [bx, by, bz] = def.bancadaPos;

  useFrame(({ clock }, dt) => {
    const g = ref.current;
    if (!g) return;
    const passo = Math.min(dt, 0.1);

    if (arrastando) {
      const alvo = posArrasteRef.current;
      g.position.x = THREE.MathUtils.damp(g.position.x, alvo.x, 18, passo);
      g.position.y = THREE.MathUtils.damp(g.position.y, alvo.y, 18, passo);
      g.position.z = THREE.MathUtils.damp(g.position.z, alvo.z, 18, passo);
      const rotAlvo = pertoDoSlotRef.current ? 0 : 0.06;
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rotAlvo, 14, passo);
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, 0, 14, passo);
      g.rotation.z = THREE.MathUtils.damp(g.rotation.z, 0, 14, passo);
      const escAlvo = pertoDoSlotRef.current ? 1.0 : 0.96;
      const escAtual = THREE.MathUtils.damp(g.scale.x, escAlvo, 14, passo);
      g.scale.setScalar(escAtual);
      g.visible = true;
      return;
    }

    const alvo = montada ? 1 : 0;
    if (reduzir) {
      progresso.current = alvo;
      flutuacao.current = antigravidade ? 1 : 0;
    } else {
      progresso.current = THREE.MathUtils.damp(progresso.current, alvo, 6.5, passo);
      flutuacao.current = THREE.MathUtils.damp(flutuacao.current, antigravidade ? 1 : 0, 3.2, passo);
    }
    const p = progresso.current;
    const ag = flutuacao.current;
    const fora = 1 - p;
    const t = clock.getElapsedTime();
    const balanco = reduzir ? 0 : Math.sin(t * 1.25 + semente) * 0.07 * ag;

    if (def.arrastavel) {
      // Peças arrastáveis vão suavemente entre o slot no gabinete (p=1) e a Bancada 3D (p=0)
      const tx = THREE.MathUtils.lerp(bx, cx + ex * ag, p);
      const ty = THREE.MathUtils.lerp(by + Math.sin(t * 1.5 + semente) * 0.025, cy + ey * ag + balanco, p);
      const tz = THREE.MathUtils.lerp(bz, cz + ez * ag, p);
      g.position.set(tx, ty, tz);
      g.rotation.set(
        THREE.MathUtils.lerp(-0.22, Math.sin(t * 0.6 + semente) * 0.06 * ag, p),
        THREE.MathUtils.lerp(0.18, Math.cos(t * 0.5 + semente) * 0.08 * ag, p),
        THREE.MathUtils.lerp(0, Math.sin(t * 0.4 + semente * 2) * 0.04 * ag, p),
      );
      g.scale.setScalar(THREE.MathUtils.lerp(0.78, 1.0, p));
      g.visible = true;
    } else {
      g.position.set(cx + ex * ag + ex * fora * 0.5, cy + ey * ag + balanco + fora * 2.4, cz + ez * ag + ez * fora * 0.5);
      g.rotation.set(
        Math.sin(t * 0.6 + semente) * 0.06 * ag + fora * 0.5,
        Math.cos(t * 0.5 + semente) * 0.08 * ag + fora * (semente % 2 ? 0.9 : -0.9),
        Math.sin(t * 0.4 + semente * 2) * 0.04 * ag,
      );
      g.scale.setScalar(Math.max(0.001, p * p * (3 - 2 * p)));
      g.visible = p > 0.015;
    }
  });

  const setRef = useCallback(
    (g: THREE.Group | null) => {
      ref.current = g;
      registrar(def.id, g);
    },
    [def.id, registrar],
  );

  return (
    <group
      ref={setRef}
      position={def.centro}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        if (!def.arrastavel) return;
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
        e.stopPropagation();
        const posAtual = ref.current ? ref.current.position.clone() : new THREE.Vector3(...(montada ? def.centro : def.bancadaPos));
        aoIniciarArraste(def.id, posAtual);
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        if (e.delta > 6) return;
        if (pointerDownPos.current) {
          const dx = e.clientX - pointerDownPos.current.x;
          const dy = e.clientY - pointerDownPos.current.y;
          if (Math.hypot(dx, dy) > 6) return;
        }
        if (!montada && !def.arrastavel) return;
        e.stopPropagation();
        aoClicar(def.id);
      }}
      onDoubleClick={(e: ThreeEvent<MouseEvent>) => {
        if (!montada && !def.arrastavel) return;
        e.stopPropagation();
        aoFocar(def.id);
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        if (!montada && !def.arrastavel) return;
        e.stopPropagation();
        aoPassar(def.id);
      }}
      onPointerOut={() => aoPassar(null)}
    >
      <Select enabled={(destacada && (montada || !!def.arrastavel)) || arrastando}>
        <group position={[-cx, -cy, -cz]}>{children}</group>
      </Select>
      {((mostrarNome && montada) || (!montada && def.arrastavel && (destacada || mostrarNome))) && !arrastando && (
        <Html position={def.rotulo} center zIndexRange={[30, 10]} className="pointer-events-none">
          <button
            type="button"
            onClick={() => aoClicar(def.id)}
            className={`pointer-events-auto whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold shadow-lg backdrop-blur-[6px] transition-colors ${
              montada
                ? 'border-white/15 bg-[rgba(12,14,18,0.82)] text-white hover:border-[var(--violet)] hover:text-[var(--violet)]'
                : 'border-[var(--violet)]/60 bg-[rgba(12,14,18,0.92)] text-[var(--violet)]'
            }`}
          >
            {montada ? def.nome : `${def.nome} · Arraste ao slot`}
          </button>
        </Html>
      )}
    </group>
  );
}

/**
 * Guia visual de encaixe do slot 3D: aparece apenas quando uma peça está sendo arrastada.
 * Destaca exatamente o slot correspondente (soquete CPU, slots RAM, slot PCIe, slot M.2, etc.).
 */
function GuiaSlotEncaixe({
  def,
  perto,
  compativel,
}: {
  def: DefPeca;
  perto: boolean;
  compativel: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const corHex = !compativel ? '#ef4444' : perto ? '#10b981' : '#00e5ff';

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pulso = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * (perto ? 8 : 4));
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = perto ? 0.28 + pulso * 0.18 : 0.12 + pulso * 0.1;
  });

  return (
    <group position={def.slotPos}>
      <mesh ref={meshRef} raycast={() => null}>
        <boxGeometry args={def.slotTamanho} />
        <meshBasicMaterial color={corHex} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh raycast={() => null}>
        <boxGeometry args={[def.slotTamanho[0] * 1.03, def.slotTamanho[1] * 1.03, def.slotTamanho[2] * 1.03]} />
        <meshBasicMaterial color={corHex} wireframe transparent opacity={perto ? 0.95 : 0.65} depthWrite={false} />
      </mesh>
      <Html position={[0, def.slotTamanho[1] / 2 + 0.16, 0.08]} center zIndexRange={[40, 20]} className="pointer-events-none">
        <div
          className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.68rem] font-bold shadow-xl backdrop-blur-[8px] ${
            !compativel
              ? 'border-red-400/80 bg-red-950/90 text-red-200'
              : perto
              ? 'border-emerald-400 bg-emerald-950/90 text-emerald-200'
              : 'border-cyan-400/70 bg-slate-950/90 text-cyan-200'
          }`}
        >
          {!compativel
            ? `✕ Incompatível · ${def.nomeSlot}`
            : perto
            ? `✓ Solte para encaixar · ${def.nomeSlot}`
            : `↓ Encaixar aqui · ${def.nomeSlot}`}
        </div>
      </Html>
    </group>
  );
}

/* =============================================================================
   MODELO COMPLETO
   ============================================================================= */

export type PropsModelo = {
  config: ConfigNivel;
  montadas: Set<PecaId>;
  corLedHex: string;
  isRainbow?: boolean;
  ledLigado: boolean;
  efeitoLed: EfeitoLed;
  brilho: number;
  antigravidade: boolean;
  reduzir: boolean;
  destaque: PecaId | null;
  mostrarNomes: boolean;
  /** câmera térmica ligada: o vidro some para não cobrir o interior */
  termico?: boolean;
  arrastandoId: PecaId | null;
  pertoDoSlot: boolean;
  slotCompativel: boolean;
  aoIniciarArraste: (id: PecaId, posInicial?: THREE.Vector3) => void;
  aoAtualizarProximidade: (perto: boolean) => void;
  aoFinalizarArraste: (id: PecaId, pertoDoSlot: boolean, distancia: number) => void;
  registrar: (id: PecaId, g: THREE.Group | null) => void;
  aoClicar: (id: PecaId) => void;
  aoFocar: (id: PecaId) => void;
  aoPassar: (id: PecaId | null) => void;
};

export function ModeloGabinete(props: PropsModelo) {
  const {
    config,
    montadas,
    corLedHex,
    isRainbow,
    ledLigado,
    efeitoLed,
    brilho,
    reduzir,
    arrastandoId,
    pertoDoSlot,
    slotCompativel,
    aoIniciarArraste,
    aoAtualizarProximidade,
    aoFinalizarArraste,
  } = props;
  const { camera, gl } = useThree();
  const posArrasteRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const pertoDoSlotRef = useRef<boolean>(false);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const planoArrasteRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  // Inicia posição de arraste quando arrastandoId muda
  useEffect(() => {
    if (!arrastandoId) {
      pertoDoSlotRef.current = false;
      return;
    }
    const def = DEF[arrastandoId];
    const estaMontada = montadas.has(arrastandoId);
    const posInicial = estaMontada ? def.centro : def.bancadaPos;
    posArrasteRef.current.set(...posInicial);
    const distInicial = posArrasteRef.current.distanceTo(new THREE.Vector3(...def.centro));
    const jaPerto = distInicial <= def.raioEncaixe;
    pertoDoSlotRef.current = jaPerto;
    aoAtualizarProximidade(jaPerto);

    const normalCamera = new THREE.Vector3();
    camera.getWorldDirection(normalCamera).negate();
    normalCamera.y *= 0.25;
    if (normalCamera.lengthSq() < 0.01) normalCamera.set(0, 0, 1);
    normalCamera.normalize();

    const pontoPlano = new THREE.Vector3(...def.centro);
    planoArrasteRef.current.setFromNormalAndCoplanarPoint(normalCamera, pontoPlano);

    const aoMover = (ev: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const ndc = new THREE.Vector2(
        ((ev.clientX - rect.left) / rect.width) * 2 - 1,
        -((ev.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycasterRef.current.setFromCamera(ndc, camera);
      const hit = new THREE.Vector3();
      if (raycasterRef.current.ray.intersectPlane(planoArrasteRef.current, hit)) {
        hit.x = THREE.MathUtils.clamp(hit.x, -2.55, 2.55);
        hit.y = THREE.MathUtils.clamp(hit.y, -1.52, 1.52);
        hit.z = THREE.MathUtils.clamp(hit.z, -1.02, 1.85);

        const alvoSlot = new THREE.Vector3(...def.centro);
        const dist = hit.distanceTo(alvoSlot);
        const perto = dist <= def.raioEncaixe;
        if (perto && slotCompativel) {
          // Atração magnética suave ao aproximar do slot compatível
          hit.lerp(alvoSlot, 0.52);
        }
        posArrasteRef.current.copy(hit);
        if (perto !== pertoDoSlotRef.current) {
          pertoDoSlotRef.current = perto;
          aoAtualizarProximidade(perto);
        }
      }
    };

    const aoSoltar = () => {
      const alvoSlot = new THREE.Vector3(...def.centro);
      const dist = posArrasteRef.current.distanceTo(alvoSlot);
      aoFinalizarArraste(arrastandoId, pertoDoSlotRef.current, dist);
    };

    window.addEventListener('pointermove', aoMover);
    window.addEventListener('pointerup', aoSoltar);
    window.addEventListener('pointercancel', aoSoltar);
    return () => {
      window.removeEventListener('pointermove', aoMover);
      window.removeEventListener('pointerup', aoSoltar);
      window.removeEventListener('pointercancel', aoSoltar);
    };
  }, [arrastandoId, camera, gl, montadas, slotCompativel, aoAtualizarProximidade, aoFinalizarArraste]);
  const m = useMemo(criarMateriais, []);
  const [texturas, setTexturas] = useState<{ filtro: THREE.Texture } | null>(null);
  const luz1 = useRef<THREE.PointLight>(null);
  const luz2 = useRef<THREE.PointLight>(null);
  const luz3 = useRef<THREE.PointLight>(null);
  const corDinamica = useRef(new THREE.Color(corLedHex));
  const corApagada = useMemo(() => new THREE.Color('#2a2f38'), []);
  const nivelLed = useRef(ledLigado ? 1 : 0);

  useEffect(() => {
    const t = { filtro: texturaFiltro() };
    setTexturas(t);
    return () => {
      t.filtro.dispose();
    };
  }, []);

  const etiquetaFonte = useMemo(
    () => (typeof document === 'undefined' ? null : texturaEtiqueta('KONOHA PSU', config.modelos.fonte || 'Fonte ATX', config.seloFonte)),
    [config.modelos.fonte, config.seloFonte],
  );
  useEffect(() => () => etiquetaFonte?.dispose(), [etiquetaFonte]);

  const matPerfurado = useMemo(() => {
    const t = texturaPerfurada().clone();
    t.repeat.set(26, 6);
    t.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ color: '#0b0d10', alphaMap: t, alphaTest: 0.5, metalness: 0.3, roughness: 0.7 });
  }, []);
  const matPlaca = useMaterialTextura(texturaPlaca, [], { metalness: 0.95, roughness: 0.28 });
  useEffect(() => () => matPerfurado.dispose(), [matPerfurado]);
  const capacidadeSsd = (config.modelos.ssd.match(/\d+\s?(TB|GB)/i)?.[0] ?? '1TB').replace(/\s/g, '');
  const rotuloRam = config.modelos.ram.match(/DDR\d\s*\d{4}/i)?.[0] ?? (config.ramRgb ? 'DDR5' : 'DDR4');
  const matSsd = useMaterialTextura(() => texturaSSD(capacidadeSsd), [capacidadeSsd], { roughness: 0.5 });
  const matRam = useMaterialTextura(() => texturaRam(config.ramRgb, rotuloRam), [config.ramRgb, rotuloRam], { metalness: 0.6, roughness: 0.4 });
  const matCpu = useMaterialTextura(() => texturaProcessador(config.modelos.cpu), [config.modelos.cpu], { metalness: 0.9, roughness: 0.3 });
  const matFiltro = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ffffff', map: texturas?.filtro ?? null, metalness: 0.4, roughness: 0.6 }),
    [texturas],
  );
  const matEtiquetaFonte = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ffffff', map: etiquetaFonte, metalness: 0.2, roughness: 0.55 }),
    [etiquetaFonte],
  );

  useEffect(() => {
    const lista = Object.values(m);
    return () => lista.forEach((x) => x.dispose());
  }, [m]);

  // LEDs: cor, efeito, brilho e liga/desliga suave
  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    if (isRainbow) corDinamica.current.setHSL((t * 0.15) % 1, 1, 0.55);
    else corDinamica.current.set(corLedHex);

    const alvo = ledLigado ? 1 : 0;
    nivelLed.current = reduzir ? alvo : THREE.MathUtils.damp(nivelLed.current, alvo, 7, Math.min(dt, 0.1));
    let efeito = 1;
    if (!reduzir && efeitoLed === 'respirar') efeito = 0.18 + 0.82 * (0.5 + 0.5 * Math.sin(t * 1.9));
    if (!reduzir && efeitoLed === 'pulso') {
      const f = (t * 1.1) % 1;
      efeito = 0.15 + 0.85 * Math.max(Math.exp(-((f - 0.05) ** 2) / 0.002), 0.75 * Math.exp(-((f - 0.25) ** 2) / 0.002));
    }
    const n = nivelLed.current * efeito * brilho;

    m.led.color.copy(corApagada).multiplyScalar(1 - nivelLed.current);
    m.led.emissive.copy(corDinamica.current);
    m.led.emissiveIntensity = 2.8 * n;
    m.pa.emissive.copy(corDinamica.current);
    m.pa.emissiveIntensity = 0.16 * n;

    const luzes: [React.RefObject<THREE.PointLight | null>, number][] = [
      [luz1, 1.8],
      [luz2, 1.35],
      [luz3, 1.0],
    ];
    for (const [r, base] of luzes) {
      if (!r.current) continue;
      r.current.color.copy(corDinamica.current);
      r.current.intensity = base * n;
    }
  });

  // mangueiras do water cooler: da bomba até o radiador no teto
  const tuboA: V3[] = [
    [-0.33, 0.8, -0.82],
    [0.05, 0.94, -0.62],
    [0.62, 1.0, -0.42],
    [0.88, 1.16, -0.35],
    [0.92, 1.33, -0.34],
  ];
  const tuboB: V3[] = [
    [-0.33, 0.68, -0.82],
    [0.1, 0.84, -0.66],
    [0.66, 0.92, -0.52],
    [0.9, 1.1, -0.47],
    [0.92, 1.33, -0.46],
  ];

  const gpuTripla = config.tamanhoGpu === 'triple-fan';
  const gpuL = gpuTripla ? 1.65 : 1.22;
  const gpuX = -1.3 + gpuL / 2;
  const conectorGpu: V3 = [gpuX + gpuL / 2 - 0.42, -0.08, -0.29];

  const peca = (id: PecaId, conteudo: ReactNode, chave?: string) => (
    <PecaAnimada
      key={chave ?? id}
      def={DEF[id]}
      montada={montadas.has(id)}
      antigravidade={props.antigravidade}
      reduzir={reduzir}
      destacada={props.destaque === id}
      mostrarNome={props.mostrarNomes}
      arrastando={arrastandoId === id}
      posArrasteRef={posArrasteRef}
      pertoDoSlotRef={pertoDoSlotRef}
      aoIniciarArraste={(pecaId, posInicial) => {
        posArrasteRef.current.copy(posInicial);
        aoIniciarArraste(pecaId, posInicial);
      }}
      registrar={props.registrar}
      aoClicar={props.aoClicar}
      aoFocar={props.aoFocar}
      aoPassar={props.aoPassar}
    >
      {conteudo}
    </PecaAnimada>
  );

  return (
    <group>
      {arrastandoId && <GuiaSlotEncaixe def={DEF[arrastandoId]} perto={pertoDoSlot} compativel={slotCompativel} />}
      <pointLight ref={luz1} position={[0.1, 0.6, 0.0]} intensity={2.4} distance={4.5} decay={1.6} />
      <pointLight ref={luz2} position={[-0.3, -0.5, 0.1]} intensity={1.8} distance={3.5} decay={1.6} />
      <pointLight ref={luz3} position={[0.9, 0.2, -0.2]} intensity={1.4} distance={3} decay={1.6} />

      {/* ============ ESTRUTURA FIXA DO GABINETE ============ */}
      <RoundedBox args={[2.86, 0.1, 2.22]} radius={0.035} smoothness={4} position={[0, 1.58, 0]} material={m.chassi} />
      <RoundedBox args={[2.86, 0.1, 2.22]} radius={0.035} smoothness={4} position={[0, -1.58, 0]} material={m.chassi} />
      {/* filtro de poeira no teto */}
      <mesh position={[0.15, 1.632, -0.15]} rotation={[-Math.PI / 2, 0, 0]} material={matFiltro}>
        <planeGeometry args={[2.1, 1.5]} />
      </mesh>
      {/* botão liga com anel de LED e portas USB */}
      <group position={[-1.12, 1.633, 0.86]}>
        <mesh material={m.preto}>
          <cylinderGeometry args={[0.045, 0.045, 0.012, 24]} />
        </mesh>
        <mesh position={[0, 0.007, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.led}>
          <torusGeometry args={[0.038, 0.006, 8, 28]} />
        </mesh>
        {[0.14, 0.24].map((x) => (
          <mesh key={x} position={[x, 0.002, 0]} material={m.furoFan}>
            <boxGeometry args={[0.07, 0.006, 0.025]} />
          </mesh>
        ))}
      </group>
      {/* pés */}
      {[
        [1.25, 0.9],
        [1.25, -0.9],
        [-1.25, 0.9],
        [-1.25, -0.9],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, -1.665, z]} material={m.borracha}>
          <cylinderGeometry args={[0.09, 0.1, 0.07, 24]} />
        </mesh>
      ))}
      {/* cobertura da fonte (shroud) */}
      <RoundedBox args={[2.7, 0.08, 1.95]} radius={0.02} smoothness={3} position={[-0.05, -0.92, -0.05]} material={m.chassi} />
      {/* frente do shroud com janela para a fonte */}
      <RoundedBox args={[0.36, 0.56, 0.08]} radius={0.02} smoothness={3} position={[-1.22, -1.24, 0.65]} material={m.chassi} />
      <RoundedBox args={[1.4, 0.56, 0.08]} radius={0.02} smoothness={3} position={[0.6, -1.24, 0.65]} material={m.chassi} />
      <mesh position={[-0.52, -0.995, 0.65]} material={m.chassi}>
        <boxGeometry args={[1.04, 0.07, 0.08]} />
      </mesh>
      {/* ventilação perfurada na frente do shroud */}
      <mesh position={[-0.05, -0.8795, 0.55]} rotation={[-Math.PI / 2, 0, 0]} material={matPerfurado}>
        <planeGeometry args={[2.55, 0.62]} />
      </mesh>
      {/* placa de identificação em metal */}
      <RoundedBox args={[0.62, 0.13, 0.012]} radius={0.005} smoothness={2} position={[0.82, -1.2, 0.695]} material={m.prata} />
      <mesh position={[0.82, -1.2, 0.7015]} material={matPlaca}>
        <planeGeometry args={[0.6, 0.117]} />
      </mesh>
      {/* passagem de cabos no shroud */}
      <mesh position={[0.78, -0.875, -0.85]} material={m.borracha}>
        <boxGeometry args={[0.3, 0.012, 0.14]} />
      </mesh>
      {/* painel interno direito (atrás das ventoinhas frontais) */}
      <RoundedBox args={[0.08, 2.9, 2.12]} radius={0.02} smoothness={3} position={[1.37, 0.0, 0]} material={m.chassi} />
      {/* bandeja da placa-mãe com passa-cabos */}
      <mesh position={[0, 0.1, -1.08]} material={m.chassiInterno}>
        <boxGeometry args={[2.78, 2.95, 0.04]} />
      </mesh>
      {[0.45, -0.2].map((y) => (
        <RoundedBox key={y} args={[0.09, 0.42, 0.012]} radius={0.004} smoothness={2} position={[0.8, y, -1.058]} material={m.borracha} />
      ))}
      <RoundedBox args={[0.42, 0.06, 0.012]} radius={0.004} smoothness={2} position={[-1.0, 1.5, -1.058]} material={m.borracha} />
      {/* molduras pretas */}
      <mesh position={[0, 1.55, 1.08]} material={m.preto}>
        <boxGeometry args={[2.86, 0.065, 0.065]} />
      </mesh>
      <mesh position={[0, -1.55, 1.08]} material={m.preto}>
        <boxGeometry args={[2.86, 0.065, 0.065]} />
      </mesh>
      <mesh position={[-1.4, -1.55, 0]} material={m.preto}>
        <boxGeometry args={[0.065, 0.065, 2.2]} />
      </mesh>
      <mesh position={[-1.4, 1.55, 0]} material={m.preto}>
        <boxGeometry args={[0.065, 0.065, 2.2]} />
      </mesh>
      <mesh position={[-1.4, 0, -1.08]} material={m.preto}>
        <boxGeometry args={[0.065, 3.1, 0.065]} />
      </mesh>
      {/* fita LED no teto */}
      <mesh position={[0, 1.505, 0.98]} material={m.led}>
        <boxGeometry args={[2.6, 0.016, 0.016]} />
      </mesh>

      {/* ============ VIDRO PANORÂMICO ============ */}
      {peca(
        'vidro',
        <group visible={!props.termico}>
          <mesh position={[0, 0, 1.06]} material={m.vidro} raycast={semRaycast} renderOrder={2}>
            <boxGeometry args={[2.76, 3.0, 0.02]} />
          </mesh>
          <mesh position={[-1.38, 0, 0]} material={m.vidro} raycast={semRaycast} renderOrder={2}>
            <boxGeometry args={[0.02, 3.0, 2.12]} />
          </mesh>
          {/* serigrafia preta nas bordas do vidro */}
          {[1.47, -1.47].map((y) => (
            <mesh key={y} position={[0, y, 1.071]} material={m.preto} raycast={semRaycast}>
              <boxGeometry args={[2.76, 0.05, 0.003]} />
            </mesh>
          ))}
          <mesh position={[1.355, 0, 1.071]} material={m.preto} raycast={semRaycast}>
            <boxGeometry args={[0.05, 3.0, 0.003]} />
          </mesh>
        </group>,
      )}

      {/* ============ PLACA-MÃE ============ */}
      {peca('placa-mae', <PlacaMae m={m} />)}

      {/* ============ PROCESSADOR ============ */}
      {peca(
        'cpu',
        <group position={[-0.6, 0.74, -0.972]}>
          <mesh material={m.pcb}>
            <boxGeometry args={[0.34, 0.34, 0.02]} />
          </mesh>
          <RoundedBox args={[0.27, 0.27, 0.022]} radius={0.008} smoothness={2} position={[0, 0, 0.018]} material={m.prata} />
          <mesh position={[0, 0, 0.0295]} material={matCpu}>
            <planeGeometry args={[0.255, 0.255]} />
          </mesh>
          <mesh position={[-0.145, -0.145, 0.012]} material={m.ouro}>
            <boxGeometry args={[0.025, 0.025, 0.004]} />
          </mesh>
        </group>,
      )}

      {/* ============ COOLER (muda conforme o nível) ============ */}
      {config.tipoCooler === 'air-compact' &&
        peca(
          'cooler',
          <group position={[-0.6, 0.74, -0.86]}>
            <mesh position={[0, 0, -0.06]} material={m.cobre} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.03, 24]} />
            </mesh>
            {Array.from({ length: 20 }, (_, i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 10]} material={m.aluminio}>
                <boxGeometry args={[0.5, 0.01, 0.12]} />
              </mesh>
            ))}
            <group position={[0, 0, 0.09]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} material={m.preto}>
                <cylinderGeometry args={[0.25, 0.26, 0.06, 40, 1, true]} />
              </mesh>
              <mesh position={[0, 0, -0.02]} material={m.furoFan}>
                <circleGeometry args={[0.24, 32]} />
              </mesh>
              <group position={[0, 0, 0.01]}>
                <Rotor m={m} ri={0.05} ro={0.22} pas={9} base={14} material={m.paEscura} />
              </group>
            </group>
          </group>,
          'cooler-box',
        )}

      {config.tipoCooler === 'air-tower' &&
        peca(
          'cooler',
          <group position={[-0.6, 0.8, -0.72]}>
            <RoundedBox args={[0.3, 0.3, 0.06]} radius={0.01} smoothness={2} position={[0, -0.06, -0.2]} material={m.cobre} />
            {[-0.1, -0.035, 0.035, 0.1].map((x) => (
              <mesh key={x} position={[x, 0.07, -0.12]} material={m.cobre}>
                <cylinderGeometry args={[0.015, 0.015, 0.66, 12]} />
              </mesh>
            ))}
            <Aletas qtd={22} tamanho={[0.36, 0.008, 0.42]} passo={0.025} eixo="y" material={m.aluminio} posicao={[0, 0.07, -0.02]} />
            <RoundedBox args={[0.38, 0.035, 0.45]} radius={0.012} smoothness={3} position={[0, 0.36, -0.02]} material={m.preto} />
            {[-0.1, -0.035, 0.035, 0.1].map((x) => (
              <mesh key={x} position={[x, 0.385, -0.12]} rotation={[Math.PI / 2, 0, 0]} material={m.prata}>
                <cylinderGeometry args={[0.017, 0.017, 0.01, 12]} />
              </mesh>
            ))}
            {/* ventoinha presa na torre, soprando para a traseira */}
            <group position={[0.25, 0.07, -0.02]} rotation={[0, -Math.PI / 2, 0]} scale={0.88}>
              <Ventoinha m={m} t={0.58} led={false} />
            </group>
          </group>,
          'cooler-torre',
        )}

      {config.tipoCooler === 'water-240' &&
        peca(
          'cooler',
          <group>
            <group position={[0.2, 1.45, -0.4]}>
              <Radiador m={m} comprimento={1.46} />
            </group>
            {[-0.18, 0.46].map((x) => (
              <group key={x} position={[x, 1.315, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
                <Ventoinha m={m} t={0.6} />
              </group>
            ))}
            {/* bomba sobre o processador */}
            <group position={[-0.6, 0.74, -0.9]}>
              <RoundedBox args={[0.48, 0.48, 0.03]} radius={0.02} smoothness={3} position={[0, 0, -0.05]} material={m.cobre} />
              <mesh rotation={[Math.PI / 2, 0, 0]} material={m.metalEscuro}>
                <cylinderGeometry args={[0.26, 0.27, 0.13, 48]} />
              </mesh>
              <mesh position={[0, 0, 0.066]} material={m.led}>
                <torusGeometry args={[0.235, 0.014, 12, 64]} />
              </mesh>
              <mesh position={[0, 0, 0.066]} material={m.preto}>
                <circleGeometry args={[0.21, 48]} />
              </mesh>
              <mesh position={[0, 0, 0.07]} material={m.led}>
                <torusGeometry args={[0.14, 0.01, 10, 48]} />
              </mesh>
              <mesh position={[0, 0, 0.072]} material={m.led}>
                <torusGeometry args={[0.07, 0.008, 10, 36]} />
              </mesh>
              {[0.06, -0.06].map((y) => (
                <mesh key={y} position={[0.26, y, 0.06]} rotation={[0, 0, Math.PI / 2]} material={m.prata}>
                  <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
                </mesh>
              ))}
            </group>
            <Cabo pontos={tuboA} raio={0.036} material={m.tubo} />
            <Cabo pontos={tuboB} raio={0.036} material={m.tubo} />
          </group>,
          'cooler-water',
        )}

      {/* ============ MEMÓRIA RAM ============ */}
      {peca(
        'ram',
        <group>
          {[-0.1, 0.1].map((x) => (
            <group key={x} position={[x, 0.76, -0.93]}>
              <mesh material={m.pcbPreta}>
                <boxGeometry args={[0.012, 0.68, 0.06]} />
              </mesh>
              <RoundedBox args={[0.04, 0.66, 0.075]} radius={0.008} smoothness={2} position={[0, 0, 0.012]} material={m.metalEscuro} />
              {[-1, 1].map((lado) => (
                <mesh key={lado} position={[lado * 0.0205, 0, 0.012]} rotation={[0, (lado * Math.PI) / 2, Math.PI / 2]} material={matRam}>
                  <planeGeometry args={[0.64, 0.068]} />
                </mesh>
              ))}
              {config.ramRgb ? (
                <mesh position={[0, 0.345, 0.012]} material={m.led}>
                  <boxGeometry args={[0.036, 0.04, 0.07]} />
                </mesh>
              ) : (
                <Aletas qtd={5} tamanho={[0.04, 0.03, 0.01]} passo={0.015} eixo="z" material={m.aluminio} posicao={[0, 0.345, 0.012]} />
              )}
            </group>
          ))}
        </group>,
        `ram-${config.ramRgb ? 'rgb' : 'basica'}`,
      )}

      {/* ============ SSD NVMe ============ */}
      {peca(
        'ssd',
        <group position={[-0.32, 0.2, -0.982]}>
          <mesh material={m.pcbPreta}>
            <boxGeometry args={[0.52, 0.1, 0.012]} />
          </mesh>
          <mesh position={[0, 0, 0.0065]} material={matSsd}>
            <planeGeometry args={[0.52, 0.1]} />
          </mesh>
        </group>,
      )}

      {/* ============ PLACA DE VÍDEO ============ */}
      {peca(
        'gpu',
        <group position={[gpuX, -0.18, -0.62]}>
          <PlacaDeVideo m={m} L={gpuL} triplo={gpuTripla} />
        </group>,
        `gpu-${config.tamanhoGpu}`,
      )}

      {/* ============ FONTE ============ */}
      {peca(
        'fonte',
        <group position={[-0.7, -1.24, -0.15]}>
          <RoundedBox args={[1.0, 0.5, 1.1]} radius={0.03} smoothness={3} material={m.preto} />
          <mesh position={[0, 0, 0.552]} material={matEtiquetaFonte}>
            <planeGeometry args={[0.84, 0.26]} />
          </mesh>
          {/* tomadas modulares */}
          {[-0.3, -0.1, 0.1, 0.3].map((x) => (
            <mesh key={x} position={[0.505, 0.05, x]} material={m.furoFan}>
              <boxGeometry args={[0.01, 0.08, 0.12]} />
            </mesh>
          ))}
        </group>,
        `fonte-${config.seloFonte}`,
      )}

      {/* ============ CABOS DE ENERGIA ============ */}
      {peca(
        'cabos',
        <group>
          {montadas.has('placa-mae') && (
            <>
              {/* 24 pinos: do conector da placa-mãe até o passa-cabos */}
              <Cabo
                pontos={[
                  [0.535, 0.62, -0.965],
                  [0.65, 0.6, -0.93],
                  [0.76, 0.5, -0.99],
                  [0.8, 0.45, -1.06],
                ]}
                raio={0.012}
                fios={8}
                afastamento={0.026}
                material={m.caboSleeve}
              />
              {/* 8 pinos do processador */}
              <Cabo
                pontos={[
                  [-1.05, 1.46, -0.965],
                  [-1.03, 1.49, -0.99],
                  [-1.0, 1.5, -1.06],
                ]}
                raio={0.012}
                fios={3}
                afastamento={0.026}
                material={m.caboSleeve}
              />
            </>
          )}
          {montadas.has('gpu') && (
            <Cabo
              pontos={[
                conectorGpu,
                [conectorGpu[0] + 0.12, -0.02, -0.42],
                [0.62, -0.05, -0.84],
                [0.8, -0.2, -1.06],
              ]}
              raio={0.013}
              fios={3}
              afastamento={0.028}
              material={m.caboSleeve}
            />
          )}
        </group>,
        `cabos-${config.tamanhoGpu}`,
      )}

      {/* ============ VENTOINHAS FRONTAIS ============ */}
      {peca(
        'fans-frontais',
        <group>
          {[0.92, 0.22, -0.48].map((y) => (
            <group key={y} position={[1.26, y, -0.1]} rotation={[0, -Math.PI / 2, 0]}>
              <Ventoinha m={m} />
            </group>
          ))}
        </group>,
      )}

      {/* ============ VENTOINHAS INFERIORES ============ */}
      {peca(
        'fans-inferiores',
        <group>
          {[-0.66, 0.0, 0.66].map((x) => (
            <group key={x} position={[x, -0.82, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
              <Ventoinha m={m} />
            </group>
          ))}
        </group>,
      )}
    </group>
  );
}
