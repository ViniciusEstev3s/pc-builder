'use client';
/**
 * Cenário de estúdio: fundo infinito curvo (claro) ou piso espelhado (escuro),
 * luz de recorte e a entrada da câmera na primeira vez que a cena aparece.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { Voo } from './Efeitos';

const PISO_Y = -1.7;

/** Fundo infinito: piso que sobe em curva suave atrás do gabinete. */
function geoCiclorama() {
  const g = new THREE.PlaneGeometry(40, 30, 1, 90);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const raio = 5;
  const inicio = -4; // profundidade onde a curva começa
  for (let i = 0; i < pos.count; i++) {
    const v = pos.getY(i); // ao longo da profundidade (de +15 a -15)
    let y = 0;
    let z = -v;
    if (z < inicio) {
      const arco = inicio - z;
      const ang = Math.min(arco / raio, Math.PI / 2);
      z = inicio - Math.sin(ang) * raio;
      y = (1 - Math.cos(ang)) * raio;
      if (arco > (raio * Math.PI) / 2) y += arco - (raio * Math.PI) / 2;
    }
    pos.setXYZ(i, pos.getX(i), y, z);
  }
  g.computeVertexNormals();
  return g;
}

export function Palco({ escuro, alta }: { escuro: boolean; alta: boolean }) {
  const geo = useMemo(geoCiclorama, []);
  useEffect(() => () => geo.dispose(), [geo]);

  if (escuro) {
    return (
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, PISO_Y - 0.001, 0]}>
          <planeGeometry args={[40, 40]} />
          {alta ? (
            <MeshReflectorMaterial
              blur={[400, 120]}
              resolution={512}
              mixBlur={1}
              mixStrength={18}
              roughness={0.9}
              depthScale={1.1}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.3}
              color="#0c0e13"
              metalness={0.4}
              mirror={0}
            />
          ) : (
            <meshStandardMaterial color="#0c0e13" roughness={0.85} metalness={0.2} />
          )}
        </mesh>
      </group>
    );
  }

  return (
    <mesh geometry={geo} position={[0, PISO_Y - 0.001, 0]} receiveShadow>
      <meshStandardMaterial color="#e9ecf0" roughness={0.95} metalness={0} />
    </mesh>
  );
}

/** Entrada da câmera: chega de longe até a vista panorâmica, uma vez só. */
export function EntradaCamera({ voo, destino, reduzir }: { voo: React.MutableRefObject<Voo>; destino: [number, number, number]; reduzir: boolean }) {
  const camera = useThree((s) => s.camera);
  const largura = useThree((s) => s.size.width);
  const feito = useRef(false);
  useFrame(() => {
    if (feito.current || largura === 0) return;
    feito.current = true;
    const fator = largura < 560 ? 1.45 : 1;
    const final = new THREE.Vector3(...destino).multiplyScalar(fator);
    if (reduzir) {
      camera.position.copy(final);
      return;
    }
    camera.position.copy(final).multiplyScalar(2.1).add(new THREE.Vector3(-1.5, 2.5, 0));
    voo.current = { posicao: final, alvo: new THREE.Vector3(0, 0, 0), velocidade: 1.6 };
  });
  return null;
}
