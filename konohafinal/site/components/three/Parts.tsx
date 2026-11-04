'use client';
import { useMemo, useRef } from 'react';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { mats } from './materials';

/* ------------------------------------------------------------------ */
/* Registro de LEDs RGB: o Director anima a cor de todos em onda.      */
/* ------------------------------------------------------------------ */
export const rgbRegistry: { mat: THREE.MeshStandardMaterial; offset: number }[] = [];
function useRGB(offset = 0, _intensity = 4) {
  // versão minimalista: sem LEDs. Os antigos pontos de RGB viram detalhes em cinza-claro fosco.
  return useMemo(() => {
    void offset;
    return new THREE.MeshStandardMaterial({ color: '#d4d2cf', metalness: 0.2, roughness: 0.5 });
  }, [offset]);
}

/* ------------------------------------------------------------------ */
/* Fan genérica (eixo +Z)                                              */
/* ------------------------------------------------------------------ */
export function Fan({
  size = 0.4,
  speed = 9,
  rgbOffset = 0,
  ...props
}: { size?: number; speed?: number; rgbOffset?: number } & ThreeElements['group']) {
  const rotor = useRef<THREE.Group>(null);
  const frame = useMemo(mats.plastic, []);
  const blade = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#2a2a2a', metalness: 0.1, roughness: 0.5, transparent: true, opacity: 0.95 }),
    [],
  );
  const ring = useRGB(rgbOffset, 1.34);
  const r = size / 2;
  useFrame((_, dt) => {
    if (rotor.current) rotor.current.rotation.z += dt * speed;
  });
  const blades = 7;
  return (
    <group {...props}>
      {/* moldura quadrada */}
      {[
        [0, r - 0.012, size, 0.024],
        [0, -r + 0.012, size, 0.024],
        [r - 0.012, 0, 0.024, size],
        [-r + 0.012, 0, 0.024, size],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0]} material={frame}>
          <boxGeometry args={[w, h, size * 0.25]} />
        </mesh>
      ))}
      <mesh material={frame} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r * 0.96, r * 0.96, size * 0.24, 40, 1, true]} />
      </mesh>
      {/* anel RGB */}
      <mesh material={ring} position={[0, 0, size * 0.125]}>
        <torusGeometry args={[r * 0.9, 0.009, 8, 48]} />
      </mesh>
      <mesh material={ring} position={[0, 0, -size * 0.125]}>
        <torusGeometry args={[r * 0.9, 0.006, 8, 48]} />
      </mesh>
      <group ref={rotor}>
        <mesh material={frame} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[r * 0.3, r * 0.3, size * 0.2, 24]} />
        </mesh>
        <mesh material={ring} position={[0, 0, size * 0.105]}>
          <circleGeometry args={[r * 0.18, 24]} />
        </mesh>
        {Array.from({ length: blades }).map((_, i) => (
          <group key={i} rotation={[0, 0, (i / blades) * Math.PI * 2]}>
            <mesh material={blade} position={[r * 0.58, 0, 0]} rotation={[0.45, 0, 0.18]}>
              <boxGeometry args={[r * 0.6, r * 0.32, 0.006]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* CPU — substrato + IHS (tampa metálica) virado para +Z               */
/* ------------------------------------------------------------------ */
export function CPU() {
  const sub = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2b2b2b', metalness: 0.3, roughness: 0.5 }), []);
  const ihs = useMemo(mats.alu, []);
  const gold = useMemo(mats.gold, []);
  return (
    <group>
      <mesh material={sub}>
        <boxGeometry args={[0.2, 0.2, 0.012]} />
      </mesh>
      <mesh material={ihs} position={[0, 0, 0.014]}>
        <boxGeometry args={[0.15, 0.15, 0.018]} />
      </mesh>
      <mesh material={gold} position={[-0.088, 0.088, 0.007]}>
        <circleGeometry args={[0.008, 3]} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} material={gold} position={[-0.075 + i * 0.03, -0.092, 0.007]}>
          <boxGeometry args={[0.012, 0.006, 0.001]} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Pasta térmica — gota prateada                                       */
/* ------------------------------------------------------------------ */
export function Paste() {
  const m = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#d9d4e4', metalness: 0.4, roughness: 0.35, clearcoat: 1 }),
    [],
  );
  return (
    <group>
      <mesh material={m} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.35, 1]}>
        <sphereGeometry args={[0.055, 32, 16]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Placa-mãe                                                           */
/* ------------------------------------------------------------------ */
export function Motherboard() {
  const pcb = useMemo(mats.pcb, []);
  const metal = useMemo(mats.darkMetal, []);
  const plastic = useMemo(mats.plastic, []);
  const alu = useMemo(mats.alu, []);
  const accent = useRGB(0.5, 0.92);
  return (
    <group>
      <mesh material={pcb}>
        <boxGeometry args={[1.25, 1.45, 0.025]} />
      </mesh>
      {/* soquete */}
      <mesh material={plastic} position={[-0.15, 0.38, 0.02]}>
        <boxGeometry args={[0.28, 0.28, 0.02]} />
      </mesh>
      {/* dissipadores VRM */}
      <mesh material={metal} position={[-0.15, 0.62, 0.05]}>
        <boxGeometry args={[0.42, 0.1, 0.08]} />
      </mesh>
      <mesh material={metal} position={[-0.45, 0.35, 0.05]}>
        <boxGeometry args={[0.1, 0.4, 0.08]} />
      </mesh>
      <mesh material={accent} position={[-0.15, 0.62, 0.091]}>
        <boxGeometry args={[0.36, 0.008, 0.002]} />
      </mesh>
      {/* slots DIMM */}
      {[0.22, 0.26, 0.3, 0.34].map((x, i) => (
        <mesh key={i} material={plastic} position={[x, 0.38, 0.02]}>
          <boxGeometry args={[0.016, 0.6, 0.02]} />
        </mesh>
      ))}
      {/* slots PCIe */}
      {[-0.37, -0.62].map((y, i) => (
        <mesh key={i} material={i === 0 ? alu : plastic} position={[-0.05, y, 0.02]}>
          <boxGeometry args={[0.85, 0.022, 0.025]} />
        </mesh>
      ))}
      {/* chipset */}
      <mesh material={metal} position={[0.38, -0.45, 0.03]}>
        <boxGeometry args={[0.24, 0.24, 0.04]} />
      </mesh>
      <mesh material={accent} position={[0.38, -0.45, 0.051]}>
        <ringGeometry args={[0.06, 0.07, 32]} />
      </mesh>
      {/* tampa do painel traseiro */}
      <mesh material={metal} position={[-0.53, 0.42, 0.06]}>
        <boxGeometry args={[0.12, 0.5, 0.1]} />
      </mesh>
      {/* conector 24 pinos */}
      <mesh material={plastic} position={[0.55, 0.3, 0.03]}>
        <boxGeometry args={[0.04, 0.2, 0.04]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* RAM — dois pentes em pé com barra de luz                            */
/* ------------------------------------------------------------------ */
export function RAM() {
  const spreader = useMemo(mats.darkMetal, []);
  const pcb = useMemo(mats.pcb, []);
  const bar0 = useRGB(0.2, 2.1);
  const bar1 = useRGB(0.6, 2.1);
  return (
    <group>
      {[
        [-0.04, bar0],
        [0.04, bar1],
      ].map(([x, bar], i) => (
        <group key={i} position={[x as number, 0, 0]}>
          <mesh material={pcb}>
            <boxGeometry args={[0.012, 0.56, 0.11]} />
          </mesh>
          <mesh material={spreader} position={[0, 0, 0.012]}>
            <boxGeometry args={[0.026, 0.58, 0.11]} />
          </mesh>
          <mesh material={bar as THREE.Material} position={[0, 0, 0.075]}>
            <boxGeometry args={[0.022, 0.56, 0.025]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Placa de vídeo — comprimento em X, cooler voltado para -Y           */
/* ------------------------------------------------------------------ */
export function GPU() {
  const shroud = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.4, roughness: 0.45 }), []);
  const back = useMemo(mats.darkMetal, []);
  const alu = useMemo(mats.alu, []);
  const strip = useRGB(0.1, 2.52);
  return (
    <group>
      <mesh material={shroud}>
        <boxGeometry args={[1.2, 0.13, 0.46]} />
      </mesh>
      <mesh material={back} position={[0, 0.072, 0]}>
        <boxGeometry args={[1.18, 0.012, 0.44]} />
      </mesh>
      {/* barra RGB na borda visível */}
      <mesh material={strip} position={[0.05, 0.02, 0.232]}>
        <boxGeometry args={[0.9, 0.018, 0.004]} />
      </mesh>
      {/* suporte PCIe */}
      <mesh material={alu} position={[-0.61, 0, -0.02]}>
        <boxGeometry args={[0.02, 0.16, 0.5]} />
      </mesh>
      {[-0.38, 0, 0.38].map((x, i) => (
        <Fan key={i} size={0.34} speed={12} rgbOffset={i * 0.3} position={[x, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* SSD M.2                                                             */
/* ------------------------------------------------------------------ */
export function SSD() {
  const pcb = useMemo(mats.pcb, []);
  const chip = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0c0c0c', metalness: 0.4, roughness: 0.35 }), []);
  const gold = useMemo(mats.gold, []);
  const label = useRGB(0.4, 0.67);
  return (
    <group>
      <mesh material={pcb}>
        <boxGeometry args={[0.34, 0.075, 0.008]} />
      </mesh>
      {[-0.09, 0.0, 0.09].map((x, i) => (
        <mesh key={i} material={chip} position={[x, 0, 0.008]}>
          <boxGeometry args={[0.07, 0.055, 0.008]} />
        </mesh>
      ))}
      <mesh material={label} position={[0.04, -0.03, 0.0125]}>
        <boxGeometry args={[0.2, 0.004, 0.001]} />
      </mesh>
      <mesh material={gold} position={[-0.165, 0, 0]}>
        <boxGeometry args={[0.012, 0.07, 0.009]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* HD 3,5"                                                             */
/* ------------------------------------------------------------------ */
export function HDD() {
  const body = useMemo(mats.alu, []);
  const top = useMemo(() => new THREE.MeshStandardMaterial({ color: '#a8a8a8', metalness: 1, roughness: 0.2 }), []);
  const pcb = useMemo(mats.pcb, []);
  const platter = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e8e8e8', metalness: 1, roughness: 0.08 }), []);
  const arm = useMemo(mats.darkMetal, []);
  return (
    <group>
      <mesh material={body}>
        <boxGeometry args={[0.42, 0.09, 0.3]} />
      </mesh>
      <mesh material={pcb} position={[0, -0.047, 0]}>
        <boxGeometry args={[0.4, 0.006, 0.28]} />
      </mesh>
      {/* "janela" mostrando prato e braço de leitura */}
      <mesh material={top} position={[0, 0.0455, 0]}>
        <boxGeometry args={[0.4, 0.002, 0.28]} />
      </mesh>
      <mesh material={platter} position={[0.05, 0.048, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.003, 48]} />
      </mesh>
      <mesh material={arm} position={[0.05, 0.05, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.006, 24]} />
      </mesh>
      <mesh material={arm} position={[-0.08, 0.051, 0.06]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.18, 0.004, 0.018]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Fonte                                                               */
/* ------------------------------------------------------------------ */
export function PSU() {
  const body = useMemo(() => new THREE.MeshStandardMaterial({ color: '#181818', metalness: 0.3, roughness: 0.55 }), []);
  const plastic = useMemo(mats.plastic, []);
  const badge = useRGB(0.8, 1.26);
  const gold = useMemo(mats.gold, []);
  return (
    <group>
      <mesh material={body}>
        <boxGeometry args={[0.62, 0.3, 0.54]} />
      </mesh>
      {/* grade da fan */}
      <mesh material={plastic} position={[0.05, -0.152, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.2, 40]} />
      </mesh>
      {/* selo e faixa */}
      <mesh material={gold} position={[0.18, 0.04, 0.272]}>
        <circleGeometry args={[0.045, 32]} />
      </mesh>
      <mesh material={badge} position={[-0.05, -0.06, 0.272]}>
        <boxGeometry args={[0.4, 0.012, 0.002]} />
      </mesh>
      {/* conectores modulares */}
      {[-0.08, 0, 0.08].map((y, i) => (
        <mesh key={i} material={plastic} position={[0.315, y, 0.12 - i * 0.03]}>
          <boxGeometry args={[0.01, 0.04, 0.12]} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Water cooler: bomba sobre a CPU + mangueiras + radiador no topo     */
/* Coordenadas no espaço do gabinete.                                  */
/* ------------------------------------------------------------------ */
export const PUMP_POS = new THREE.Vector3(-0.35, 0.5, -0.33);
export const RAD_POS = new THREE.Vector3(0.05, 0.88, 0.02);

export function WaterCooler() {
  const metal = useMemo(mats.darkMetal, []);
  const mirror = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#262626', metalness: 0.8, roughness: 0.15, clearcoat: 1 }),
    [],
  );
  const tube = useMemo(() => new THREE.MeshStandardMaterial({ color: '#121212', roughness: 0.7 }), []);
  const fin = useMemo(mats.darkMetal, []);
  const ring = useRGB(0.0, 2.52);

  const tubes = useMemo(() => {
    const mk = (dx: number, z: number) =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(PUMP_POS.x + 0.1, PUMP_POS.y + dx, PUMP_POS.z + 0.03),
          new THREE.Vector3(PUMP_POS.x + 0.35, PUMP_POS.y + 0.12 + dx, PUMP_POS.z + 0.18),
          new THREE.Vector3(RAD_POS.x + 0.52, RAD_POS.y - 0.2, z),
          new THREE.Vector3(RAD_POS.x + 0.6, RAD_POS.y - 0.04, z),
        ]),
        40,
        0.018,
        10,
      );
    return [mk(0.04, 0.12), mk(-0.04, 0.2)];
  }, []);

  return (
    <group>
      {/* bomba */}
      <group position={PUMP_POS}>
        <mesh material={metal} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.115, 0.07, 48]} />
        </mesh>
        <mesh material={mirror} position={[0, 0, 0.037]}>
          <circleGeometry args={[0.095, 48]} />
        </mesh>
        <mesh material={ring} position={[0, 0, 0.038]}>
          <torusGeometry args={[0.1, 0.007, 8, 64]} />
        </mesh>
        <mesh material={ring} position={[0, 0, 0.039]}>
          <torusGeometry args={[0.035, 0.004, 8, 32]} />
        </mesh>
      </group>
      {tubes.map((g, i) => (
        <mesh key={i} geometry={g} material={tube} />
      ))}
      {/* radiador 360 mm deitado sob o teto */}
      <group position={RAD_POS}>
        <mesh material={metal}>
          <boxGeometry args={[1.3, 0.05, 0.4]} />
        </mesh>
        {Array.from({ length: 36 }).map((_, i) => (
          <mesh key={i} material={fin} position={[-0.6 + i * 0.0343, 0.032, 0]}>
            <boxGeometry args={[0.006, 0.015, 0.38]} />
          </mesh>
        ))}
        {[-0.41, 0, 0.41].map((x, i) => (
          <Fan key={i} size={0.38} speed={7} rgbOffset={0.15 + i * 0.25} position={[x, -0.075, 0]} rotation={[Math.PI / 2, 0, 0]} />
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Air cooler em torre (alternativa)                                   */
/* ------------------------------------------------------------------ */
export function AirCooler() {
  const fin = useMemo(mats.alu, []);
  const copper = useMemo(mats.copper, []);
  const top = useMemo(mats.darkMetal, []);
  const pipes = useMemo(
    () =>
      [-0.09, -0.03, 0.03, 0.09].map(
        (x) =>
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(x - 0.04, 0.36, 0),
              new THREE.Vector3(x - 0.04, -0.28, 0),
              new THREE.Vector3(x, -0.36, 0),
              new THREE.Vector3(x + 0.04, -0.28, 0),
              new THREE.Vector3(x + 0.04, 0.36, 0),
            ]),
            40,
            0.012,
            8,
          ),
      ),
    [],
  );
  return (
    <group>
      {Array.from({ length: 28 }).map((_, i) => (
        <mesh key={i} material={fin} position={[0, -0.26 + i * 0.022, 0]}>
          <boxGeometry args={[0.34, 0.004, 0.3]} />
        </mesh>
      ))}
      <mesh material={top} position={[0, 0.36, 0]}>
        <boxGeometry args={[0.35, 0.025, 0.31]} />
      </mesh>
      {pipes.map((g, i) => (
        <mesh key={i} geometry={g} material={copper} />
      ))}
      <mesh material={copper} position={[0, -0.37, 0]}>
        <boxGeometry args={[0.2, 0.03, 0.18]} />
      </mesh>
      <Fan size={0.34} speed={8} rgbOffset={0.9} position={[0, 0.04, 0.17]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Gabinete (sem o vidro — o vidro é tratado à parte)                  */
/* ------------------------------------------------------------------ */
export function CaseShell() {
  const panel = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f2f1ee', metalness: 0.05, roughness: 0.55 }), []);
  const strip = useRGB(0.35, 2.1);
  const W = 2.1,
    H = 2.1,
    D = 1.0,
    t = 0.04;
  return (
    <group>
      {/* fundo (atrás da placa-mãe) */}
      <mesh material={panel} position={[0, 0, -D / 2]}>
        <boxGeometry args={[W, H, t]} />
      </mesh>
      {/* teto e base */}
      <mesh material={panel} position={[0, H / 2, 0]}>
        <boxGeometry args={[W, t, D]} />
      </mesh>
      <mesh material={panel} position={[0, -H / 2, 0]}>
        <boxGeometry args={[W, t, D]} />
      </mesh>
      {/* frente: vidro panorâmico (ver GlassPanel); só um friso fino no topo e na base */}
      <mesh material={panel} position={[W / 2 - 0.01, H / 2 - 0.03, 0]}>
        <boxGeometry args={[0.03, 0.05, D]} />
      </mesh>
      <mesh material={panel} position={[W / 2 - 0.01, -H / 2 + 0.03, 0]}>
        <boxGeometry args={[0.03, 0.05, D]} />
      </mesh>
      {/* traseira */}
      <mesh material={panel} position={[-W / 2, 0, 0]}>
        <boxGeometry args={[t, H, D]} />
      </mesh>
      {/* shroud da fonte */}
      <mesh material={panel} position={[0, -0.66, 0]}>
        <boxGeometry args={[W - 0.02, 0.025, D - 0.02]} />
      </mesh>
      <mesh material={panel} position={[-0.12, -0.83, D / 2 - 0.03]}>
        <boxGeometry args={[1.5, 0.34, 0.02]} />
      </mesh>
      <mesh material={strip} position={[-0.12, -0.67, D / 2 - 0.015]}>
        <boxGeometry args={[1.5, 0.012, 0.004]} />
      </mesh>
      {/* pés */}
      {[
        [0.8, 0.3],
        [-0.8, 0.3],
        [0.8, -0.3],
        [-0.8, -0.3],
      ].map(([x, z], i) => (
        <mesh key={i} material={panel} position={[x, -H / 2 - 0.04, z]}>
          <cylinderGeometry args={[0.06, 0.07, 0.05, 20]} />
        </mesh>
      ))}
    </group>
  );
}

type Edge = 'top' | 'bottom' | 'left' | 'right';
export function GlassPanel({ w = 2.06, h = 2.06, edges = ['top', 'bottom', 'left'] }: { w?: number; h?: number; edges?: Edge[] }) {
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f4f6f8',
        metalness: 0,
        roughness: 0.03,
        transparent: true,
        opacity: 0.09,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 3,
        reflectivity: 0.9,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const frame = useMemo(mats.plastic, []);
  const bars: Record<Edge, [number, number, number, number]> = {
    top: [0, h / 2, w + 0.04, 0.04],
    bottom: [0, -h / 2, w + 0.04, 0.04],
    left: [-w / 2, 0, 0.04, h + 0.04],
    right: [w / 2, 0, 0.04, h + 0.04],
  };
  return (
    <group>
      <mesh material={glass} renderOrder={10}>
        <boxGeometry args={[w, h, 0.012]} />
      </mesh>
      {edges.map((e) => {
        const [x, y, bw, bh] = bars[e];
        return (
          <mesh key={e} material={frame} position={[x, y, 0]}>
            <boxGeometry args={[bw, bh, 0.02]} />
          </mesh>
        );
      })}
    </group>
  );
}
