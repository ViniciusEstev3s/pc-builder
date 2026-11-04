'use client';
import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scene, setScene } from '@/lib/store';
import { PARTS } from '@/lib/parts';

/**
 * Narrativa guiada pela rolagem. Cada ScrollTrigger escreve no estado da cena:
 *  hero → explode (0→1) → parts (uma peça por vez) → away (cena esmaece) → summary (1→0, rótulos)
 */
export default function Story() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const bar = document.getElementById('explode-bar');

      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom 70%',
        onToggle: (s) => s.isActive && setScene({ phase: 'hero', active: -1 }),
        onEnterBack: () => {
          scene.explode = 0;
        },
      });

      ScrollTrigger.create({
        trigger: '#explode',
        start: 'top 70%',
        end: 'bottom bottom',
        onUpdate: (s) => {
          scene.explode = s.progress;
          if (bar) bar.style.transform = `scaleX(${s.progress})`;
        },
        onToggle: (s) => s.isActive && setScene({ phase: s.progress > 0.001 ? 'explode' : 'hero', active: -1 }),
        onEnter: () => setScene({ phase: 'explode', active: -1 }),
        onLeaveBack: () => {
          scene.explode = 0;
          setScene({ phase: 'hero', active: -1 });
        },
      });

      PARTS.forEach((p, i) => {
        ScrollTrigger.create({
          trigger: `#part-${p.id}`,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (s) => {
            if (s.isActive) {
              scene.explode = 1;
              setScene({ phase: 'parts', active: i });
            }
          },
        });
      });

      // a cena some enquanto os comparativos, o diagrama e o glossário ocupam a tela
      ScrollTrigger.create({
        trigger: '#comparar',
        start: 'top 60%',
        onEnter: () => setScene({ phase: 'away', active: -1 }),
        onLeaveBack: () => setScene({ phase: 'parts', active: PARTS.length - 1 }),
      });
      gsap.fromTo(
        '#scene-layer',
        { opacity: 1 },
        {
          opacity: 0,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: '#comparar', start: 'top bottom', end: 'top 40%', scrub: true },
        },
      );

      // resumo: volta a montar, girando, com rótulos
      gsap.fromTo(
        '#scene-layer',
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: '#resumo', start: 'top bottom', end: 'top 50%', scrub: true },
        },
      );
      ScrollTrigger.create({
        trigger: '#resumo',
        start: 'top 85%',
        end: 'bottom bottom',
        onUpdate: (s) => {
          scene.explode = 1 - smooth(s.progress / 0.7);
        },
        onEnter: () => setScene({ phase: 'summary', active: -1 }),
        onEnterBack: () => setScene({ phase: 'summary', active: -1 }),
        onLeaveBack: () => {
          scene.explode = 1;
          setScene({ phase: 'away', active: -1 });
        },
      });
    });
    return () => ctx.revert();
  }, []);
  return null;
}

function smooth(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}
