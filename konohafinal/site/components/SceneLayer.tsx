'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import StaticPC from './StaticPC';
import { useSceneState } from '@/lib/store';

// A cena 3D (three.js + R3F + pós-processamento) vira um chunk separado,
// baixado só depois que a página já está interativa.
const PCScene = dynamic(() => import('./three/PCScene'), { ssr: false });

type Mode = 'pending' | '3d' | 'static';

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function SceneLayer() {
  const [mode, setMode] = useState<Mode>('pending');
  const [lite, setLite] = useState(false);
  const [desktop, setDesktop] = useState(true);
  const [ready, setReady] = useState(false);
  const { phase } = useSceneState();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
    const lowMem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const cores = navigator.hardwareConcurrency || 8;
    setDesktop(window.innerWidth >= 1024);
    setLite(small || (lowMem !== undefined && lowMem <= 4) || cores <= 4);
    const onResize = () => setDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);

    if (reduced || !hasWebGL()) {
      setMode('static');
      return () => window.removeEventListener('resize', onResize);
    }
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const start = () => setMode('3d');
    if (ric) ric(start, { timeout: 900 });
    else setTimeout(start, 300);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (mode !== '3d') return;
    const t = setTimeout(() => setReady(true), 700);
    return () => clearTimeout(t);
  }, [mode]);

  return (
    <div id="scene-layer" className="fixed inset-0 z-0" aria-hidden>
      {mode === '3d' && (
        <div className={`absolute inset-0 transition-opacity duration-[1400ms] ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <PCScene lite={lite} desktop={desktop} active={phase !== 'away'} />
        </div>
      )}
      {mode === 'static' && (
        <div className="absolute inset-0">
          <StaticPC />
        </div>
      )}
      {(mode === 'pending' || (mode === '3d' && !ready)) && (
        <div className="absolute inset-0 flex items-center justify-center ">
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 animate-spin rounded-full border-2 border-[rgba(255,106,19,0.2)] border-t-[var(--neon)]" />
            <span className="mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--muted)]">Carregando o PC…</span>
          </div>
        </div>
      )}
      {/* HUD: grade e circuito sobre as bordas da cena */}
      <div className="bg-grid mask-edges pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_42%,transparent_45%,rgba(255,255,255,0.7)_100%)]" />
    </div>
  );
}
