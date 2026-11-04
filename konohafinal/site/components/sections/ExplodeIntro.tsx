export default function ExplodeIntro() {
  const steps = [
    ['Gabinete fechado', 'Por fora, só vidro e metal.'],
    ['Vista explodida', 'Cada peça se afasta, mantendo a posição relativa.'],
    ['Uma por vez', 'A câmera visita cada componente, do cérebro à casa.'],
  ];
  return (
    <section id="explode" className="gutter relative h-[220vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between pb-[6svh] pt-[13svh]">
        <div className="max-w-[460px]">
          <p className="eyebrow">Vista explodida</p>
          <h2 className="display mt-4 text-[clamp(2rem,4.4vw,3.6rem)] font-[800] uppercase">
            Vamos <span className="text-gradient">abrir</span> o gabinete
          </h2>
          <div className="mt-5 h-1 w-48 overflow-hidden rounded-full bg-[var(--line)]">
            <div id="explode-bar" className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[var(--violet)] to-[var(--lilac)]" />
          </div>
          <p className="mt-4 max-w-[40ch] text-[0.9rem] leading-relaxed text-[var(--fg2)]">
            Continue rolando. Os números de cada peça são de um PC gamer completo, parecido com o nosso <a href="#prontos" className="underline underline-offset-4">PC Gamer Avançado</a>.
          </p>
          <a href="#comparar" className="mono mt-3 inline-block text-[0.68rem] uppercase tracking-[0.16em] text-[var(--lilac)] hover:text-[var(--fg)]">
            Já conheço as peças, pular ↓
          </a>
        </div>
        <ol className="hidden max-w-[280px] flex-col gap-2 md:flex">
          {steps.map(([t, d], i) => (
            <li key={t} className="glass rounded-2xl px-4 py-3">
              <span className="mono text-[0.68rem] text-[var(--lilac)]">{String(i + 1).padStart(2, '0')}</span>
              <strong className="ml-2 text-[0.92rem] text-[var(--fg)]">{t}</strong>
              <span className="mt-0.5 block text-[0.82rem] leading-snug text-[var(--muted)]">{d}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
