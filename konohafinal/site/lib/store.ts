'use client';
import { useSyncExternalStore } from 'react';

export type Phase = 'hero' | 'explode' | 'parts' | 'away' | 'summary';

/** Cores de RGB do hero. A primeira (roxo) é a identidade do site. */
export const THEMES = [
  { name: 'Roxo', hex: '#a24bff' },
  { name: 'Magenta', hex: '#ff3fd0' },
  { name: 'Ciano', hex: '#2ee6ff' },
  { name: 'Verde', hex: '#8cff3a' },
  { name: 'Âmbar', hex: '#ffc21a' },
  { name: 'Vermelho', hex: '#ff2d4b' },
];

/**
 * Estado compartilhado entre a narrativa de rolagem (GSAP), o HUD e a cena 3D.
 * Valores contínuos (explode) são lidos direto no useFrame, sem re-render.
 * Valores discretos notificam a UI React.
 */
export const scene = {
  explode: 0, // 0 = montado, 1 = vista explodida
  active: -1, // índice da peça em foco
  phase: 'hero' as Phase,
  theme: 0, // índice em THEMES
  locked: false, // true quando o visitante escolheu uma cor
};

type Snap = Pick<typeof scene, 'active' | 'phase' | 'theme' | 'locked'>;
const listeners = new Set<() => void>();
let snapshot: Snap = { active: scene.active, phase: scene.phase, theme: scene.theme, locked: scene.locked };

export function setScene(patch: Partial<Snap>) {
  let changed = false;
  (Object.keys(patch) as (keyof Snap)[]).forEach((k) => {
    if (scene[k] !== patch[k]) {
      // @ts-expect-error chaves compatíveis
      scene[k] = patch[k];
      changed = true;
    }
  });
  if (changed) {
    snapshot = { active: scene.active, phase: scene.phase, theme: scene.theme, locked: scene.locked };
    listeners.forEach((l) => l());
  }
}

/** Cor que o RGB 3D deve mostrar agora. Fora do hero volta ao roxo, a menos que o visitante tenha escolhido. */
export function rgbTargetHex() {
  if (scene.phase === 'hero' || scene.locked) return THEMES[scene.theme].hex;
  return THEMES[0].hex;
}

export function useSceneState() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snapshot,
    () => snapshot,
  );
}
