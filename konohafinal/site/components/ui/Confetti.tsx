'use client';
import { useEffect, useRef } from 'react';

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const cores = ['#00d2ff', '#38bdf8', '#818cf8', '#a855f7', '#ec4899', '#facc15', '#ffffff'];
    const qtd = 70;
    const particulas = Array.from({ length: qtd }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.4 - height * 0.2,
      r: Math.random() * 6 + 4,
      cor: cores[Math.floor(Math.random() * cores.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rotacao: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8,
      opacidade: 1,
    }));

    let frame = 0;
    const maxFrames = 200;

    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      particulas.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotacao += p.vRot;
        if (frame > maxFrames * 0.7) {
          p.opacidade = Math.max(0, p.opacidade - 0.02);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotacao * Math.PI) / 180);
        ctx.globalAlpha = p.opacidade;
        ctx.fillStyle = p.cor;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.5);
        ctx.restore();
      });

      if (frame < maxFrames) {
        animId = requestAnimationFrame(loop);
      }
    };

    loop();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      aria-hidden="true"
    />
  );
}
