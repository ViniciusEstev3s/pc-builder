'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

/* Prevenção de erros (heurística 5) e diagnóstico com correção (heurística 9). */

const SOCKETS = ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1851', 'LGA2011-3'];
const RAMS = ['DDR4', 'DDR5'];

type Num = 'gpuLen' | 'caseGpu' | 'coolerH' | 'caseCooler' | 'cpuW' | 'gpuW' | 'psuW';
type Form = { cpuSocket: string; moboSocket: string; moboRam: string; ram: string } & Record<Num, string>;

const EXAMPLE: Form = {
  cpuSocket: 'AM5',
  moboSocket: 'AM5',
  moboRam: 'DDR5',
  ram: 'DDR5',
  gpuLen: '300',
  caseGpu: '400',
  coolerH: '158',
  caseCooler: '170',
  cpuW: '120',
  gpuW: '250',
  psuW: '750',
};

const WITH_ERRORS: Form = { ...EXAMPLE, moboSocket: 'LGA1700', ram: 'DDR4', gpuLen: '410', psuW: '500' };

const RANGES: Record<Num, [number, number, string]> = {
  gpuLen: [100, 450, 'mm'],
  caseGpu: [150, 500, 'mm'],
  coolerH: [30, 200, 'mm'],
  caseCooler: [40, 220, 'mm'],
  cpuW: [15, 400, 'W'],
  gpuW: [0, 600, 'W'],
  psuW: [250, 1600, 'W'],
};

function fieldError(k: Num, v: string) {
  const [min, max, u] = RANGES[k];
  if (v.trim() === '') return `Preencha este campo (entre ${min} e ${max} ${u}).`;
  const n = Number(v.replace(',', '.'));
  if (!Number.isFinite(n)) return 'Use só números, sem letras.';
  if (n < min || n > max) return `Valor fora do comum: use entre ${min} e ${max} ${u}. Confira na ficha técnica da peça.`;
  return null;
}
const num = (v: string) => Number(v.replace(',', '.'));

type Status = 'ok' | 'warn' | 'fail' | 'wait';
type Check = { title: string; status: Status; msg: string; fix?: string };

function runChecks(f: Form, errs: Partial<Record<Num, string | null>>): Check[] {
  const out: Check[] = [];
  out.push(
    f.cpuSocket === f.moboSocket
      ? { title: 'Soquete', status: 'ok', msg: `Processador e placa-mãe usam ${f.cpuSocket}. Encaixam.` }
      : {
          title: 'Soquete',
          status: 'fail',
          msg: `O processador usa ${f.cpuSocket} e a placa-mãe usa ${f.moboSocket}. A CPU não entra no encaixe.`,
          fix: `Troque a placa-mãe por uma ${f.cpuSocket}, ou escolha um processador ${f.moboSocket}.`,
        },
  );
  out.push(
    f.ram === f.moboRam
      ? { title: 'Memória RAM', status: 'ok', msg: `Pentes ${f.ram} em slots ${f.moboRam}. Encaixam.` }
      : {
          title: 'Memória RAM',
          status: 'fail',
          msg: `Pentes ${f.ram} não entram em slots ${f.moboRam}: o chanfro do encaixe fica em outra posição.`,
          fix: `Compre memória ${f.moboRam}.`,
        },
  );
  if (errs.gpuLen || errs.caseGpu) out.push({ title: 'Placa de vídeo no gabinete', status: 'wait', msg: 'Corrija os campos destacados para ver o resultado.' });
  else {
    const m = num(f.caseGpu) - num(f.gpuLen);
    out.push(
      m < 0
        ? { title: 'Placa de vídeo no gabinete', status: 'fail', msg: `Faltam ${-m} mm: a placa é maior que o espaço do gabinete.`, fix: 'Escolha uma placa mais curta ou um gabinete maior.' }
        : m < 15
          ? { title: 'Placa de vídeo no gabinete', status: 'warn', msg: `Cabe, mas sobram só ${m} mm. Fans frontais ou cabos podem atrapalhar.`, fix: 'Prefira pelo menos 15 mm de folga.' }
          : { title: 'Placa de vídeo no gabinete', status: 'ok', msg: `Cabe com ${m} mm de folga.` },
    );
  }
  if (errs.coolerH || errs.caseCooler) out.push({ title: 'Altura do cooler', status: 'wait', msg: 'Corrija os campos destacados para ver o resultado.' });
  else {
    const m = num(f.caseCooler) - num(f.coolerH);
    out.push(
      m < 0
        ? { title: 'Altura do cooler', status: 'fail', msg: `O cooler é ${-m} mm mais alto do que o gabinete aceita. A tampa lateral não fecha.`, fix: 'Escolha um cooler mais baixo, um water cooler ou um gabinete mais largo.' }
        : m < 5
          ? { title: 'Altura do cooler', status: 'warn', msg: `Cabe por ${m} mm. Fica muito justo.`, fix: 'Uma folga de 5 mm ou mais evita apertar o vidro lateral.' }
          : { title: 'Altura do cooler', status: 'ok', msg: `Cabe com ${m} mm de folga.` },
    );
  }
  if (errs.cpuW || errs.gpuW || errs.psuW) out.push({ title: 'Fonte', status: 'wait', msg: 'Corrija os campos destacados para ver o resultado.' });
  else {
    const need = num(f.cpuW) + num(f.gpuW) + 100;
    const rec = Math.ceil((need * 1.3) / 50) * 50;
    const psu = num(f.psuW);
    out.push(
      psu < need
        ? { title: 'Fonte', status: 'fail', msg: `O PC pode puxar cerca de ${need} W e a fonte entrega ${psu} W. Ele pode desligar sozinho em jogos.`, fix: `Use uma fonte de pelo menos ${rec} W.` }
        : psu < rec
          ? { title: 'Fonte', status: 'warn', msg: `Funciona, mas com pouca folga (consumo estimado de ${need} W).`, fix: `O recomendado é ${rec} W, para a fonte trabalhar fria e durar mais.` }
          : { title: 'Fonte', status: 'ok', msg: `${psu} W cobre o consumo estimado de ${need} W com folga (recomendado: ${rec} W).` },
    );
  }
  return out;
}

const ICON: Record<Status, { s: string; cls: string; label: string }> = {
  ok: { s: '✓', cls: 'bg-[var(--fg)] text-white', label: 'Compatível' },
  warn: { s: '!', cls: 'bg-[var(--violet)] text-[var(--fg)]', label: 'Atenção' },
  fail: { s: '✕', cls: 'bg-[#c81e1e] text-white', label: 'Incompatível' },
  wait: { s: '…', cls: 'bg-[var(--plum)] text-[var(--muted)]', label: 'Aguardando' },
};

function Select({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label htmlFor={id} className="grid min-w-0 gap-1.5">
      <span className="text-[0.84rem] font-semibold">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-[1.5px] border-[var(--line)] bg-white px-3 py-2.5 text-[0.95rem] focus:border-[var(--fg)] focus:outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function NumberField({ id, label, value, error, onChange }: { id: Num; label: string; value: string; error: string | null; onChange: (v: string) => void }) {
  const [, , unit] = RANGES[id];
  return (
    <div className="grid min-w-0 gap-1.5">
      <label htmlFor={`chk-${id}`} className="text-[0.84rem] font-semibold">
        {label}
      </label>
      <div
        className={`flex items-center rounded-xl border-[1.5px] bg-white pr-3 focus-within:border-[var(--fg)] ${error ? 'border-[#c81e1e]' : 'border-[var(--line)]'}`}
      >
        <input
          id={`chk-${id}`}
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `chk-${id}-err` : undefined}
          className="tnum w-full min-w-0 rounded-xl bg-transparent px-3 py-2.5 text-[0.95rem] focus:outline-none"
        />
        <span className="mono text-[0.75rem] text-[var(--muted)]">{unit}</span>
      </div>
      {error && (
        <p id={`chk-${id}-err`} className="text-[0.8rem] leading-snug text-[#c81e1e]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ConferirPecas() {
  const [f, setF] = useState<Form>(EXAMPLE);
  const set = (k: keyof Form) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const errs = useMemo(() => Object.fromEntries((Object.keys(RANGES) as Num[]).map((k) => [k, fieldError(k, f[k])])) as Record<Num, string | null>, [f]);
  const checks = useMemo(() => runChecks(f, errs), [f, errs]);
  const fails = checks.filter((c) => c.status === 'fail').length;
  const warns = checks.filter((c) => c.status === 'warn').length;
  const waits = checks.filter((c) => c.status === 'wait').length;

  const summary =
    fails > 0
      ? { text: `${fails} ${fails > 1 ? 'problemas impedem' : 'problema impede'} a montagem`, cls: 'bg-[#c81e1e] text-white' }
      : warns > 0
        ? { text: `Monta, com ${warns} ${warns > 1 ? 'pontos' : 'ponto'} de atenção`, cls: 'bg-[var(--violet)] text-[var(--fg)]' }
        : waits > 0
          ? { text: 'Preencha os campos destacados', cls: 'bg-[var(--plum)] text-[var(--fg)]' }
          : { text: 'Tudo compatível', cls: 'bg-[var(--fg)] text-white' };

  const fs = 'grid gap-4 rounded-[20px] border border-[var(--line)] bg-white p-5 sm:grid-cols-2';
  const lg = 'text-[0.95rem] font-bold sm:col-span-2';

  return (
    <div>
      <p className="max-w-[62ch] text-[0.95rem] leading-relaxed text-[var(--fg2)]">
        Comprou ou viu peças em outra loja? Copie os dados das fichas técnicas. Os campos já vêm com um exemplo; mude um valor e o resultado se atualiza na hora.
      </p>
      <div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
          <form className="grid gap-4" onSubmit={(e) => e.preventDefault()} noValidate aria-label="Dados das peças">
            <fieldset className={fs}>
              <legend className="sr-only">Processador e placa-mãe</legend>
              <p className={lg} aria-hidden>
                Processador e placa-mãe
              </p>
              <Select id="chk-cpuSocket" label="Soquete do processador" value={f.cpuSocket} options={SOCKETS} onChange={set('cpuSocket')} />
              <Select id="chk-moboSocket" label="Soquete da placa-mãe" value={f.moboSocket} options={SOCKETS} onChange={set('moboSocket')} />
            </fieldset>
            <fieldset className={fs}>
              <legend className="sr-only">Memória</legend>
              <p className={lg} aria-hidden>
                Memória
              </p>
              <Select id="chk-moboRam" label="Slots da placa-mãe" value={f.moboRam} options={RAMS} onChange={set('moboRam')} />
              <Select id="chk-ram" label="Pentes de memória" value={f.ram} options={RAMS} onChange={set('ram')} />
            </fieldset>
            <fieldset className={fs}>
              <legend className="sr-only">Gabinete</legend>
              <p className={lg} aria-hidden>
                Espaço no gabinete
              </p>
              <NumberField id="gpuLen" label="Comprimento da placa de vídeo" value={f.gpuLen} error={errs.gpuLen} onChange={set('gpuLen')} />
              <NumberField id="caseGpu" label="Placa de vídeo máx. do gabinete" value={f.caseGpu} error={errs.caseGpu} onChange={set('caseGpu')} />
              <NumberField id="coolerH" label="Altura do cooler" value={f.coolerH} error={errs.coolerH} onChange={set('coolerH')} />
              <NumberField id="caseCooler" label="Cooler máx. do gabinete" value={f.caseCooler} error={errs.caseCooler} onChange={set('caseCooler')} />
            </fieldset>
            <fieldset className={fs}>
              <legend className="sr-only">Energia</legend>
              <p className={lg} aria-hidden>
                Energia
              </p>
              <NumberField id="cpuW" label="Consumo do processador (TDP)" value={f.cpuW} error={errs.cpuW} onChange={set('cpuW')} />
              <NumberField id="gpuW" label="Consumo da placa de vídeo" value={f.gpuW} error={errs.gpuW} onChange={set('gpuW')} />
              <NumberField id="psuW" label="Potência da fonte" value={f.psuW} error={errs.psuW} onChange={set('psuW')} />
            </fieldset>
          </form>

          <div className="lg:sticky lg:top-24">
            <div className="rounded-[22px] border-[1.5px] border-[var(--fg)] bg-white p-5 shadow-[6px_6px_0_var(--violet)] md:p-6">
              <div aria-live="polite">
                <p className={`inline-block rounded-full px-4 py-2 text-[0.9rem] font-bold ${summary.cls}`}>{summary.text}</p>
              </div>
              <ul className="mt-5 grid gap-4">
                {checks.map((c) => (
                  <li key={c.title} className="flex gap-3">
                    <span className={`display grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.8rem] font-[800] ${ICON[c.status].cls}`} aria-hidden>
                      {ICON[c.status].s}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.95rem] font-semibold">
                        {c.title} <span className="sr-only">: {ICON[c.status].label}</span>
                      </p>
                      <p className="text-[0.88rem] leading-snug text-[var(--fg2)]">{c.msg}</p>
                      <AnimatePresence>
                        {c.fix && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-1 text-[0.88rem] leading-snug">
                            <strong className="text-[var(--lilac)]">Como resolver: </strong>
                            {c.fix}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
                <button type="button" onClick={() => setF(EXAMPLE)} className="btn btn-secundario btn-pequeno">
                  Restaurar exemplo
                </button>
                <button type="button" onClick={() => setF(WITH_ERRORS)} className="btn btn-secundario btn-pequeno">
                  Ver um exemplo com erros
                </button>
              </div>
              <p className="mt-3 text-[0.78rem] text-[var(--muted)]">Estimativa educativa. Confirme sempre nas fichas técnicas dos fabricantes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
