'use client';
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, Html, Grid } from '@react-three/drei';
import { getSoftTexture } from './materials';
import * as THREE from 'three';
import { scene, useSceneState } from '@/lib/store';
import { PARTS } from '@/lib/parts';
import {
  AirCooler,
  CaseShell,
  CPU,
  GlassPanel,
  GPU,
  HDD,
  Motherboard,
  Paste,
  PSU,
  RAM,
  SSD,
  WaterCooler,
  Fan,
} from './Parts';

type V3 = [number, number, number];

/** Posição montada (home), posição na vista explodida e distância da câmera ao focar. */
const LAYOUT: Record<string, { home: V3; exploded: V3; rot?: V3; focus: number; label: V3 }> = {
  cpu: { home: [-0.35, 0.5, -0.395], exploded: [-0.75, 0.9, 1.0], rot: [0, 0.3, 0], focus: 0.75, label: [-0.35, 0.5, 0] },
  mobo: { home: [-0.2, 0.12, -0.43], exploded: [-0.25, 0.15, -0.7], focus: 2.6, label: [-0.6, 0.0, 0] },
  ram: { home: [0.08, 0.5, -0.345], exploded: [0.85, 0.75, 0.75], rot: [0, -0.6, 0.15], focus: 1.25, label: [0.1, 0.5, 0] },
  gpu: { home: [-0.25, -0.25, -0.18], exploded: [0.55, -0.45, 0.85], rot: [-0.85, 0.15, 0], focus: 2.0, label: [-0.15, -0.25, 0.1] },
  ssd: { home: [-0.3, 0.06, -0.405], exploded: [-1.35, 0.05, 1.05], rot: [0, 0.35, 0.1], focus: 0.7, label: [-0.3, 0.06, 0] },
  hdd: { home: [0.55, -0.84, 0.05], exploded: [1.9, -1.25, 0.6], rot: [0.95, -0.3, 0], focus: 1.0, label: [0.55, -0.84, 0.2] },
  psu: { home: [-0.45, -0.83, 0.0], exploded: [-1.55, -1.45, 0.6], rot: [0, 0.45, 0], focus: 1.45, label: [-0.45, -0.83, 0.2] },
  aio: { home: [0, 0, 0], exploded: [0, 0.95, 0.5], focus: 2.4, label: [0.05, 0.88, 0.2] },
  air: { home: [-2.25, -0.2, 0.55], exploded: [-2.25, -0.2, 0.55], rot: [0, 0.55, 0], focus: 1.3, label: [0, 0, 0] },
  fans: { home: [0, 0, 0], exploded: [1.35, 0.15, 0.35], focus: 2.2, label: [0.95, 0.05, 0.3] },
  paste: { home: [-0.35, 0.5, -0.375], exploded: [-0.15, 1.2, 1.35], rot: [0, 0, 0], focus: 0.5, label: [-0.35, 0.5, 0] },
  case: { home: [0, 0, 0], exploded: [0, 0.1, -1.7], focus: 4.2, label: [0, 1.1, 0] },
};

/** Valores suavizados por quadro, compartilhados entre os componentes da cena. */
const rt = { e: 0, rot: 0, t: 0 };
/** Tom neutro usado pela grade do chão. */
export const rgbNow = new THREE.Color('#bdbab6');
const rgbTarget = new THREE.Color('#bdbab6');
const tmpV = new THREE.Vector3();
const WHITE = new THREE.Color('#ffffff');
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/* ------------------------------------------------------------------ */
/* Nó de peça: anima posição explodida e destaque do componente ativo  */
/* ------------------------------------------------------------------ */
type MatCache = { m: THREE.MeshStandardMaterial; color: THREE.Color; emissive: number; env: number; opacity: number };

function PartNode({
  id,
  children,
  home,
  exploded,
  rot,
  onlyExploded,
  fadeOnExplode,
}: {
  id: string;
  children: React.ReactNode;
  home?: V3;
  exploded?: V3;
  rot?: V3;
  onlyExploded?: boolean;
  fadeOnExplode?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const cache = useRef<MatCache[] | null>(null);
  const focus = useRef(1);
  const idx = useMemo(() => PARTS.findIndex((p) => p.id === id), [id]);
  const L = LAYOUT[id];
  const h = home ?? L.home;
  const x = exploded ?? L.exploded;
  const r = rot ?? L.rot ?? [0, 0, 0];

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    if (!cache.current) {
      const list: MatCache[] = [];
      const seen = new Set<THREE.Material>();
      g.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const m = mesh.material as THREE.MeshStandardMaterial;
        if (seen.has(m) || !m.color) return;
        seen.add(m);
        list.push({
          m,
          color: m.color.clone(),
          emissive: m.emissiveIntensity ?? 0,
          env: m.envMapIntensity ?? 1,
          opacity: m.opacity,
        });
      });
      cache.current = list;
    }
    const e = ease(rt.e);
    g.position.set(h[0] + (x[0] - h[0]) * e, h[1] + (x[1] - h[1]) * e, h[2] + (x[2] - h[2]) * e);
    g.rotation.set(r[0] * e, r[1] * e, r[2] * e);

    // foco: na fase "parts" só a peça ativa fica acesa
    const parts = scene.phase === 'parts' && scene.active >= 0;
    const isActive = scene.active === idx;
    const target = parts ? (isActive ? 1 : 0.13) : 1;
    focus.current = THREE.MathUtils.damp(focus.current, target, 5, Math.min(dt, 0.05));
    const f = focus.current;

    let s = 1;
    if (onlyExploded) s = THREE.MathUtils.smoothstep(rt.e, 0.45, 0.95);
    if (parts && isActive) s *= 1 + Math.sin(rt.t * 2) * 0.012;
    g.scale.setScalar(Math.max(s, 0.0001));
    g.visible = s > 0.01;

    const fade = fadeOnExplode ? 1 - THREE.MathUtils.smoothstep(rt.e, 0.05, 0.45) : 1;
    for (const c of cache.current) {
      c.m.color.copy(c.color).lerp(WHITE, (1 - f) * 0.88);
      if (c.emissive) c.m.emissiveIntensity = c.emissive * (0.08 + 0.92 * f);
      c.m.envMapIntensity = c.env * (0.15 + 0.85 * f);
      if (fadeOnExplode) {
        c.m.opacity = c.opacity * fade;
        c.m.transparent = true;
      }
    }
    if (fadeOnExplode) g.visible = fade > 0.01;
  });

  return <group ref={ref}>{children}</group>;
}

/* ------------------------------------------------------------------ */
/* Rótulos do resumo final                                             */
/* ------------------------------------------------------------------ */
function Labels() {
  const { phase } = useSceneState();
  const show = phase === 'summary';
  const ids = ['cpu', 'mobo', 'ram', 'gpu', 'ssd', 'hdd', 'psu', 'aio', 'fans', 'case'];
  return (
    <>
      {ids.map((id) => {
        const p = PARTS.find((x) => x.id === id)!;
        return (
          <Html key={id} position={LAYOUT[id].label} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
            <div className={`pc-label ${show ? 'is-on' : ''}`}>
              <span>{p.index}</span>
              {p.name}
            </div>
          </Html>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* O PC completo                                                       */
/* ------------------------------------------------------------------ */
function PC({ lite }: { lite: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.PointLight>(null);
  const accent = useRef<THREE.PointLight>(null);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    const ph = scene.phase;
    if (ph === 'hero' || ph === 'summary') {
      rt.rot += d * 0.28;
    } else {
      // volta suavemente para um ângulo 3/4 fixo (pelo caminho mais curto)
      const base = -0.32;
      const k = Math.round((rt.rot - base) / (Math.PI * 2));
      rt.rot = THREE.MathUtils.damp(rt.rot, base + k * Math.PI * 2, 2.2, d);
    }
    g.rotation.y = rt.rot;
    if (inner.current) {
      inner.current.intensity = 0.9 * (1 - rt.e * 0.6);
    }
  });

  return (
    <group ref={group} name="pc-root" position={[0, 0.05, 0]}>
      <pointLight ref={inner} position={[0, 0.2, 0.15]} color="#ffffff" distance={3} decay={1.6} />
      <pointLight ref={accent} position={[0.2, -0.45, 0.15]} color="#ffffff" intensity={0.5} distance={2.2} />

      <PartNode id="case">
        <CaseShell />
      </PartNode>
      <PartNode id="case" exploded={[0, 0.1, 2.6]} fadeOnExplode>
        {/* vidro lateral + frontal formando uma quina sem coluna */}
        <group position={[0, 0, 0.5]}>
          <GlassPanel edges={['top', 'bottom', 'left']} />
        </group>
        <group position={[1.06, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <GlassPanel w={1.0} edges={['top', 'bottom', 'right']} />
        </group>
      </PartNode>
      <PartNode id="mobo">
        <Motherboard />
      </PartNode>
      <PartNode id="cpu">
        <CPU />
      </PartNode>
      <PartNode id="paste">
        <Paste />
      </PartNode>
      <PartNode id="ram">
        <RAM />
      </PartNode>
      <PartNode id="gpu">
        <GPU />
      </PartNode>
      <PartNode id="ssd">
        <SSD />
      </PartNode>
      <PartNode id="hdd">
        <HDD />
      </PartNode>
      <PartNode id="psu">
        <PSU />
      </PartNode>
      <PartNode id="aio">
        <WaterCooler />
      </PartNode>
      <PartNode id="air" onlyExploded>
        <AirCooler />
      </PartNode>
      {/* fans frontais */}
      <PartNode id="fans">
        {[0.55, 0.08, -0.39].map((y, i) => (
          <Fan key={i} size={0.42} speed={8} rgbOffset={0.2 + i * 0.22} position={[0.94, y, 0]} rotation={[0, Math.PI / 2, 0]} />
        ))}
      </PartNode>
      {/* fans no piso, soprando para cima */}
      <PartNode id="fans" home={[0, 0, 0]} exploded={[-0.35, -0.35, 1.55]}>
        {[-0.62, -0.2, 0.22].map((x, i) => (
          <Fan key={i} size={0.38} speed={9} rgbOffset={0.5 + i * 0.2} position={[x, -0.6, 0.04]} rotation={[-Math.PI / 2, 0, 0]} />
        ))}
      </PartNode>
      {/* fan traseira */}
      <PartNode id="fans" home={[-0.95, 0.5, 0]} exploded={[-2.25, 0.85, 0.35]} rot={[0, 0.9, 0]}>
        <Fan size={0.38} speed={8} rgbOffset={0.85} rotation={[0, Math.PI / 2, 0]} />
      </PartNode>

      <Labels />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Diretor: câmera, explosão suavizada, RGB                             */
/* ------------------------------------------------------------------ */
function Director({ desktop }: { desktop: boolean }) {
  const { camera, size, scene: s3 } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const cam = camera as THREE.PerspectiveCamera;
  const key = useRef<THREE.PointLight>(null);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    rt.t = state.clock.elapsedTime;
    rt.e = THREE.MathUtils.damp(rt.e, scene.explode, 5, d);

    // RGB: transição suave até a cor do tema, com uma onda leve de tom entre os LEDs
    // sem RGB: tom neutro fixo usado pela grade do chão
    rgbNow.lerp(rgbTarget, 1 - Math.exp(-3.2 * d));

    const aspect = size.width / size.height;
    const tanH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const fit = (hw: number, hh: number) => Math.max(hh / tanH, hw / (tanH * aspect));
    const ph = scene.phase;
    const target = new THREE.Vector3();
    let dist: number;
    let dir = new THREE.Vector3(0.0, 0.2, 1).normalize();
    let film = 0;

    if (ph === 'parts' && scene.active >= 0) {
      const id = PARTS[scene.active].id;
      const L = LAYOUT[id];
      const p = s3.getObjectByName('pc-root');
      tmpV.set(...L.exploded);
      if (p) {
        p.updateMatrixWorld();
        tmpV.applyMatrix4(p.matrixWorld);
      }
      target.copy(tmpV);
      const orbit = Math.sin(rt.t * 0.25) * 0.45;
      dir = new THREE.Vector3(Math.sin(orbit) + 0.25, 0.32, Math.cos(orbit)).normalize();
      dist = fit(L.focus * 0.62, L.focus * 0.5) + 0.6;
      film = desktop ? -7.5 : 0;
      if (!desktop) target.y -= dist * 0.13;
    } else {
      const hero = fit(1.6, desktop ? 1.95 : 1.7);
      const ex = fit(3.0, 2.55);
      dist = THREE.MathUtils.lerp(hero, ex, ease(Math.min(rt.e, 1)));
      target.set(0, 0.05 + rt.e * 0.05, 0);
      // hero centralizado; alvo abaixo do PC para ele subir e liberar a barra de HUD
      if (ph === 'hero') target.y -= dist * (desktop ? 0.075 : 0.16);
      if (ph === 'summary') target.y += dist * (desktop ? 0.05 : -0.02);
    }

    // luz de destaque que acompanha a peça em foco
    if (key.current) {
      const on = ph === 'parts' && scene.active >= 0;
      key.current.intensity = THREE.MathUtils.damp(key.current.intensity, on ? 2.5 : 0, 3, d);
      key.current.position.lerp(tmpV.set(target.x + 0.6, target.y + 0.8, target.z + 0.9), 1 - Math.exp(-4 * d));
    }

    const desired = target.clone().addScaledVector(dir, dist);
    cam.position.x = THREE.MathUtils.damp(cam.position.x, desired.x, 2.4, d);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, desired.y, 2.4, d);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, desired.z, 2.4, d);
    look.current.x = THREE.MathUtils.damp(look.current.x, target.x, 3, d);
    look.current.y = THREE.MathUtils.damp(look.current.y, target.y, 3, d);
    look.current.z = THREE.MathUtils.damp(look.current.z, target.z, 3, d);
    cam.lookAt(look.current);
    const nf = THREE.MathUtils.damp(cam.filmOffset, film, 2.5, d);
    if (Math.abs(nf - cam.filmOffset) > 1e-4) {
      cam.filmOffset = nf;
      cam.updateProjectionMatrix();
    }
  });
  return <pointLight ref={key} color="#ffffff" intensity={0} distance={4} decay={1.5} />;
}

export default function PCScene({ lite, desktop, active }: { lite: boolean; desktop: boolean; active: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={lite ? [1, 1.3] : [1, 1.8]}
      camera={{ fov: 34, position: [0, 0.4, 7], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1;
      }}
    >
      <color attach="background" args={['#ffffff']} />
      <fog attach="fog" args={['#ffffff', 10, 24]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#ffffff', '#e9e6e2', 0.6]} />
      <directionalLight position={[3, 5, 4]} intensity={1.7} color="#ffffff" />
      <ThemedLights />

      <Suspense fallback={null}>
        <Environment resolution={lite ? 128 : 256} frames={1}>
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, -1]} scale={[10, 2, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={2.5} color="#f2f0ec" position={[-5, 1, 1]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={2} color="#d9d6d2" position={[5, 0, 2]} scale={[3, 5, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="rect" intensity={6} color="#ffffff" position={[2.5, 1.5, 6]} scale={[0.6, 7, 1]} rotation-z={0.55} />
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[-2, 2, 6]} scale={[0.25, 7, 1]} rotation-z={0.55} />
        </Environment>
      </Suspense>

      <PC lite={lite} />
      <GroundShadow />
      <SceneRest lite={lite} desktop={desktop} />
    </Canvas>
  );
}

/** Sombra suave sob o gabinete: um sprite radial deitado no chão. */
function GroundShadow() {
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: getSoftTexture(), color: '#000000', transparent: true, opacity: 0.32, depthWrite: false }),
    [],
  );
  useFrame(() => {
    mat.opacity = 0.32 * (1 - rt.e * 0.75);
  });
  return (
    <mesh material={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.08, 0]} renderOrder={-1}>
      <planeGeometry args={[3.4, 2.1]} />
    </mesh>
  );
}

/** Luzes de contorno neutras. */
function ThemedLights() {
  const rim = useRef<THREE.DirectionalLight>(null);
  const spot = useRef<THREE.SpotLight>(null);
  useFrame(() => {

  });
  return (
    <>
      <directionalLight ref={rim} position={[-4, 2, -3]} intensity={0.9} color="#ffffff" />
      <spotLight ref={spot} position={[0, 6, 3]} angle={0.5} penumbra={1} intensity={12} color="#ffffff" />
    </>
  );
}

function ThemedGrid() {
  const ref = useRef<THREE.Mesh>(null);
  const tmp = useMemo(() => new THREE.Color(), []);
  useFrame(() => {
    const m = ref.current?.material as THREE.ShaderMaterial | undefined;
    if (!m?.uniforms) return;
    m.uniforms.sectionColor?.value.copy(tmp.set('#d6d3cf'));
    m.uniforms.cellColor?.value.copy(tmp.set('#ecebe8'));
  });
  return (
    <Grid
      ref={ref}
        position={[0, -1.1, 0]}
        args={[40, 40]}
        cellSize={0.35}
        cellThickness={0.6}
        cellColor="#2b1452"
        sectionSize={1.75}
        sectionThickness={1}
        sectionColor="#6a24d9"
        fadeDistance={16}
        fadeStrength={1.6}
        infiniteGrid
      />
  );
}

function SceneRest({ lite, desktop }: { lite: boolean; desktop: boolean }) {
  return (
    <>
      <Director desktop={desktop} />

    </>
  );
}
