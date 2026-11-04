/**
 * Motor de compatibilidade (portado do Konoha Hardware).
 * Verifica soquete, padrão de memória, vídeo integrado, formato da placa no gabinete,
 * comprimento da placa de vídeo, cooler (soquete, TDP e altura) e potência da fonte.
 */
import { CATEGORIAS_MONTADOR } from './pecas';
import type { Peca, Selecao } from './tipos';

/** Consumo estimado em carga e potência mínima de fonte recomendada (30% de folga, múltiplos de 50 W). */
export function calcularConsumoSistema(selecao: Partial<Selecao>) {
  let consumo = 25; // placa, ventoinhas e USB
  if (selecao.cpu) consumo += selecao.cpu.tdpWatts || 65;
  if (selecao.placamae) consumo += selecao.placamae.consumoWatts || 35;
  if (selecao.ram) consumo += selecao.ram.consumoWatts || 8;
  if (selecao.gpu) consumo += selecao.gpu.consumoWatts || 0;
  if (selecao.armazenamento) consumo += selecao.armazenamento.consumoWatts || 5;
  if (selecao.gabinete) consumo += selecao.gabinete.consumoWatts || 10;
  if (selecao.cooler) consumo += selecao.cooler.consumoWatts || 6;

  const comFolga = Math.ceil((consumo * 1.3) / 50) * 50;
  const requisitoGpu = selecao.gpu ? selecao.gpu.fonteRecomendadaWatts || 300 : 300;
  return { consumoWatts: consumo, fonteMinimaRecomendada: Math.max(comFolga, requisitoGpu) };
}

export type Avaliacao = { compativel: boolean; motivos: string[] };

/** Avalia uma peça candidata contra as peças já escolhidas (simula a troca na categoria dela). */
export function avaliarCompatibilidadePeca(candidata: Peca | null, selecaoAtual: Selecao): Avaliacao {
  if (!candidata) return { compativel: true, motivos: [] };
  const sim: Selecao = { ...selecaoAtual, [candidata.categoria]: candidata };
  const cat = candidata.categoria;
  const motivos: string[] = [];
  const { cpu, placamae, ram, gpu, fonte, gabinete, cooler } = sim;

  if (cpu && placamae && cpu.soquete !== placamae.soquete) {
    if (cat === 'cpu') motivos.push(`Este processador usa o soquete ${cpu.soquete}, mas sua placa-mãe é ${placamae.soquete}.`);
    else if (cat === 'placamae') motivos.push(`Esta placa-mãe é ${placamae.soquete}, mas o processador escolhido usa ${cpu.soquete}.`);
  }

  if (ram && placamae && ram.tipoRam !== placamae.tipoRam) {
    if (cat === 'ram') motivos.push(`Esta memória é ${ram.tipoRam}, mas a placa-mãe aceita só ${placamae.tipoRam}.`);
    else if (cat === 'placamae') motivos.push(`Esta placa-mãe usa ${placamae.tipoRam}, mas a memória escolhida é ${ram.tipoRam}.`);
  }

  const jaTemMemoria = () => motivos.some((m) => m.includes('memória') || m.includes('Esta memória'));
  const cpuAceitaRam = (suportada?: string, tipoRam?: string) => {
    if (!suportada || !tipoRam) return true;
    return suportada.split('/').map((s) => s.trim()).includes(tipoRam);
  };
  if (ram && cpu && !cpuAceitaRam(cpu.tipoRamSuportada, ram.tipoRam) && !jaTemMemoria()) {
    if (cat === 'ram') motivos.push(`O processador escolhido só aceita memória ${cpu.tipoRamSuportada} (esta é ${ram.tipoRam}).`);
    else if (cat === 'cpu') motivos.push(`Este processador exige memória ${cpu.tipoRamSuportada}, e a escolhida é ${ram.tipoRam}.`);
  }

  if (cpu && gpu && gpu.requerVideoIntegradoCpu && !cpu.possuiVideoIntegrado) {
    if (cat === 'gpu') motivos.push(`O processador escolhido (${cpu.nomeCurto}) não tem vídeo integrado. Escolha uma placa de vídeo dedicada.`);
    else if (cat === 'cpu') motivos.push('Este processador não tem vídeo integrado, e você escolheu "Vídeo integrado". Escolha uma placa de vídeo dedicada ou um processador com vídeo.');
  }

  if (placamae && gabinete && !(gabinete.formatosPlacaMae || []).includes(placamae.formato || '')) {
    const aceitos = (gabinete.formatosPlacaMae || []).join('/');
    if (cat === 'gabinete') motivos.push(`Este gabinete só comporta placas ${aceitos}, e a sua placa-mãe é ${placamae.formato}.`);
    else if (cat === 'placamae') motivos.push(`Esta placa-mãe é ${placamae.formato}, e o gabinete escolhido só comporta ${aceitos}.`);
  }

  if (gpu && gabinete && (gpu.comprimentoMm || 0) > (gabinete.maxComprimentoGpuMm || Infinity)) {
    if (cat === 'gpu') motivos.push(`Esta placa tem ${gpu.comprimentoMm} mm e o gabinete aceita até ${gabinete.maxComprimentoGpuMm} mm.`);
    else if (cat === 'gabinete') motivos.push(`Este gabinete aceita placas de até ${gabinete.maxComprimentoGpuMm} mm, e a sua tem ${gpu.comprimentoMm} mm.`);
  }

  if (cooler && cpu) {
    if (!(cooler.soquetesSuportados || []).includes(cpu.soquete || '')) {
      if (cat === 'cooler' || cat === 'cpu') motivos.push(`O cooler não tem suporte de montagem para o soquete ${cpu.soquete}.`);
    } else if ((cpu.tdpWatts || 0) > (cooler.tdpMaximoWatts || Infinity)) {
      if (cat === 'cooler') motivos.push(`Este cooler dissipa até ${cooler.tdpMaximoWatts} W, e o processador gera ${cpu.tdpWatts} W.`);
      else if (cat === 'cpu') motivos.push(`Este processador gera ${cpu.tdpWatts} W, acima do que o cooler escolhido dissipa (${cooler.tdpMaximoWatts} W).`);
    }
  }

  if (cooler && gabinete && (cooler.alturaMm || 0) > (gabinete.maxAlturaCoolerMm || Infinity)) {
    if (cat === 'cooler' || cat === 'gabinete') {
      motivos.push(`O cooler tem ${cooler.alturaMm} mm de altura e o gabinete aceita até ${gabinete.maxAlturaCoolerMm} mm.`);
    }
  }

  if (fonte) {
    const { fonteMinimaRecomendada } = calcularConsumoSistema(sim);
    if ((fonte.potenciaWatts || 0) < fonteMinimaRecomendada) {
      if (cat === 'fonte') motivos.push(`Esta fonte tem ${fonte.potenciaWatts} W; sua montagem pede pelo menos ${fonteMinimaRecomendada} W.`);
      else if (cat === 'gpu') motivos.push(`Sua fonte (${fonte.potenciaWatts} W) é fraca para esta placa de vídeo (mínimo: ${fonteMinimaRecomendada} W).`);
      else if (cat === 'cpu') motivos.push(`Com este processador, sua fonte (${fonte.potenciaWatts} W) fica abaixo do mínimo (${fonteMinimaRecomendada} W).`);
    }
  }

  return { compativel: motivos.length === 0, motivos };
}

/** Confere se as 8 categorias estão preenchidas e se não sobrou nenhum conflito. */
export function validarMontagemCompleta(selecao: Selecao) {
  const categoriasFaltantes = CATEGORIAS_MONTADOR.filter((c) => c.obrigatorio && !selecao[c.id]);
  const conflitos: { categoria: Peca['categoria']; motivo: string }[] = [];
  for (const peca of Object.values(selecao)) {
    if (!peca) continue;
    for (const motivo of avaliarCompatibilidadePeca(peca, selecao).motivos) {
      if (!conflitos.some((c) => c.motivo === motivo)) conflitos.push({ categoria: peca.categoria, motivo });
    }
  }
  return {
    completa: categoriasFaltantes.length === 0 && conflitos.length === 0,
    categoriasFaltantes,
    conflitos,
  };
}
