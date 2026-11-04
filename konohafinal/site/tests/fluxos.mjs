/**
 * Testes de ponta a ponta dos fluxos principais (navegador real via Playwright).
 * Uso: npm run build:relativo && npm run test:fluxos
 * Sobe um servidor estático para a pasta out/ e clica no site como um usuário faria.
 */
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

// require() também encontra um Playwright instalado globalmente
const { chromium } = createRequire(import.meta.url)('playwright');

const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.svg': 'image/svg+xml', '.txt': 'text/plain' };
const servidor = createServer(async (req, res) => {
  let caminho = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^([/\\])+/, '');
  if (!caminho || caminho.endsWith('/')) caminho += 'index.html';
  try {
    const dados = await readFile(join('out', caminho));
    res.writeHead(200, { 'Content-Type': TIPOS[extname(caminho)] || 'application/octet-stream' });
    res.end(dados);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((ok) => servidor.listen(5679, ok));

const U = 'http://localhost:5679/';
let aprovados = 0;
let falhas = 0;
const ok = (c, m) => {
  if (c) aprovados++;
  else falhas++;
  console.log((c ? 'OK    ' : 'FALHA ') + m);
};

  const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const errs = [];
  const p = await b.newPage({ viewport: { width: 1366, height: 860 } });
  p.on('pageerror', e => errs.push('PAGE ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  const hash = () => p.evaluate(() => location.hash);
  const cont = () => p.locator('aside[aria-label="Etapas e resumo da montagem"] .tnum').first().textContent();

  await p.goto(U); await p.evaluate(() => localStorage.clear()); await p.goto(U); await p.waitForTimeout(600);
  ok((await p.title()) === 'Konoha Hardware', 'título da página inicial');
  await p.click('main a.btn-primario'); await p.waitForTimeout(400);
  ok((await hash()) === '#montar', 'CTA leva ao montador');
  ok((await p.title()).startsWith('Montar seu PC'), 'título da aba muda por tela');

  for (let i = 0; i < 8; i++) {
    const btn = p.locator('section[aria-labelledby="titulo-etapa"] button.btn-primario:not([disabled])').first();
    await btn.click(); await p.waitForTimeout(150);
  }
  ok((await cont()) === '8/8', 'escolhe 8 peças com avanço automático de etapa');
  ok((await p.locator('.toast-notificacao, [role=status]').count()) >= 0, 'sem aviso ao escolher');
  ok(await p.locator('header a[href="#montar"] >> text=8/8').isVisible(), 'selo 8/8 no menu');

  await p.click('aside button:has-text("Ver resultado")'); await p.waitForTimeout(400);
  ok((await hash()) === '#resultado', 'vai para o resultado');
  ok(await p.locator('text=Resultado da sua montagem').isVisible(), 'resultado renderizado');
  ok(await p.locator('table').isVisible(), 'tabela de FPS em Jogos');
  await p.click('button[aria-pressed]:has-text("Trabalho")'); await p.waitForTimeout(300);
  ok(await p.locator('#titulo-trabalho').isVisible() && !(await p.locator('table').isVisible()), 'troca para Trabalho');
  await p.click('summary'); await p.waitForTimeout(200);
  ok((await p.locator('details li').count()) >= 8, 'detalhes com as 8 peças');
  await p.goBack(); await p.waitForTimeout(400);
  ok((await hash()) === '#montar', 'Voltar do navegador volta ao montador');

  await p.click('aside li:first-child button'); await p.waitForTimeout(200);
  await p.click('button:has-text("✓ Escolhida")'); await p.waitForTimeout(200);
  ok((await cont()) === '7/8', 'remove peça');
  await p.click('button:has-text("Desfazer")'); await p.waitForTimeout(200);
  ok((await cont()) === '8/8', 'desfazer restaura');

  await p.click('aside button:has-text("Limpar")'); await p.waitForTimeout(300);
  ok(await p.locator('[role=alertdialog]').isVisible(), 'pede confirmação para limpar');
  const foco = await p.evaluate(() => document.activeElement?.textContent?.trim());
  ok(foco === 'Manter peças', 'foco inicial na opção segura (' + foco + ')');
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  ok((await cont()) === '8/8', 'Esc cancela');
  await p.click('aside button:has-text("Limpar")'); await p.waitForTimeout(300);
  await p.click('[role=alertdialog] button:has-text("Limpar tudo")'); await p.waitForTimeout(300);
  ok((await cont()) === '0/8', 'limpa após confirmar');
  await p.click('button:has-text("Desfazer")'); await p.waitForTimeout(200);
  ok((await cont()) === '8/8', 'desfazer após limpar');

  await p.reload(); await p.waitForTimeout(800);
  ok((await cont()) === '8/8', 'montagem persiste após recarregar');

  // conflito: escolhe placa intel com cpu AM4 -> deve estar escondida
  await p.click('aside li:nth-child(2) button'); await p.waitForTimeout(200);
  const chk = p.locator('#mostrar-incompativeis');
  ok(await chk.isVisible(), 'oferece mostrar incompatíveis');
  await chk.check(); await p.waitForTimeout(200);
  ok(await p.locator('text=Não encaixa:').first().isVisible(), 'mostra motivo da incompatibilidade');

  // busca global
  await p.fill('#busca-topo', 'rtx'); await p.waitForTimeout(300);
  ok(await p.locator('[role=listbox] >> text=Peças').isVisible(), 'busca sugere peças');
  await p.keyboard.press('ArrowDown'); await p.keyboard.press('Enter'); await p.waitForTimeout(600);
  ok((await hash()) === '#montar' && (await p.locator('#titulo-etapa').textContent()).includes('Placa de vídeo'), 'peça da busca abre a etapa certa');
  await p.fill('#busca-topo', 'vram'); await p.waitForTimeout(300);
  await p.click('[role=listbox] button:has-text("VRAM")'); await p.waitForTimeout(800);
  await p.waitForSelector('#glossary-search');
  const gh = await hash(), gv = await p.inputValue('#glossary-search');
  ok(gh === '#glossario' && gv === 'VRAM', 'termo da busca abre o glossário filtrado (' + gh + ' / ' + gv + ')');
  await p.fill('#busca-topo', 'xyzqwe'); await p.waitForTimeout(300);
  ok(await p.locator('[role=listbox] >> text=Nada encontrado').isVisible(), 'busca sem resultado orienta');
  await p.fill('#busca-topo', '');

  // PCs prontos -> substituir
  await p.goto(U + '#prontos'); await p.waitForTimeout(1200);
  await p.click('button:has-text("Ver detalhes") >> nth=0'); await p.waitForTimeout(400);
  ok(await p.locator('[role=dialog] >> text=Para onde vai o dinheiro').isVisible(), 'detalhes com divisão do orçamento');
  await p.click('[role=dialog] button:has-text("Personalizar no montador")'); await p.waitForTimeout(500);
  ok(await p.locator('[role=alertdialog] >> text=Substituir sua montagem?').isVisible(), 'confirma antes de sobrescrever');
  await p.click('[role=alertdialog] button:has-text("Substituir")'); await p.waitForTimeout(500);
  ok((await hash()) === '#montar' && (await cont()) === '8/8', 'PC pronto carregado no montador');
  ok(await p.locator('button:has-text("Desfazer")').isVisible(), 'oferece desfazer a substituição');
  await p.click('.segmentado a:has-text("Conferir")'); await p.waitForTimeout(400);
  await p.click('button:has-text("Ver um exemplo com erros")'); await p.waitForTimeout(300);
  ok(await p.locator('text=impedem a montagem').isVisible(), 'conferir peças detecta erros');

  // resultado incompleto
  await p.evaluate(() => localStorage.clear()); await p.goto(U + '#resultado'); await p.reload(); await p.waitForTimeout(700);
  ok(await p.locator('text=ainda não está pronta').isVisible(), 'resultado incompleto explica e oferece voltar');
  await p.goto(U + '#montar'); await p.waitForTimeout(400);
  await p.click('aside button:has-text("Ver resultado")'); await p.waitForTimeout(300);
  ok(await p.locator('[role=alert] >> text=faltam 8 peças').isVisible(), 'alerta do que falta');

  // quiz via teclado
  await p.goto(U + '#quiz'); await p.waitForTimeout(1200);
  await p.click('main li button >> nth=0'); await p.waitForTimeout(400);
  for (let i = 0; i < 3; i++) { await p.keyboard.press('a'); await p.keyboard.press('Enter'); await p.waitForTimeout(150); await p.keyboard.press('Enter'); await p.waitForTimeout(250); }
  ok(await p.locator('text=Refazer este tema').isVisible(), 'quiz completo pelo teclado');

  // ajuda e atalhos
  await p.keyboard.press('?'); await p.waitForTimeout(300);
  ok(await p.locator('#help-panel >> text=Escolha um tema').isVisible(), 'ajuda contextual do quiz');
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  ok(!(await p.locator('#help-panel').isVisible()), 'Esc fecha ajuda');
  await p.keyboard.press('Alt+Digit4'); await p.waitForTimeout(400);
  ok((await hash()) === '#prontos', 'Alt+4 vai para PCs prontos');

  // montador -> explicação da peça
  await p.goto(U + '#montar'); await p.waitForTimeout(400);
  await p.click('a:has-text("Entenda esta peça")'); await p.waitForTimeout(3500);
  ok((await hash()) === '#part-cpu' && await p.locator('#h-cpu').isVisible(), 'montador leva à explicação 3D da peça');

  // celular
  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  m.on('pageerror', e => errs.push('M ' + e.message));
  await m.goto(U + '#montar'); await m.waitForTimeout(700);
  await m.evaluate(() => localStorage.clear()); await m.reload(); await m.waitForTimeout(700);
  ok(await m.locator('text=Total · 0/8 peças').isVisible(), 'celular: barra fixa com total');
  ok(!(await m.locator('aside button:has-text("Ver resultado")').isVisible()), 'celular: sem botão duplicado na lateral');
  const largo = await m.evaluate(() => [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().right > 392 && getComputedStyle(e).position !== 'fixed' && !e.closest('ol')).length);
  ok(largo === 0, 'celular: nada passa da largura da tela (' + largo + ')');
  await m.click('button:has-text("Menu")'); await m.waitForTimeout(300);
  ok(await m.locator('#mobile-menu').isVisible(), 'celular: menu abre');
  await m.click(`#mobile-menu a[href="#quiz"]`); await m.waitForTimeout(2000);
  const mh = await m.evaluate(() => location.hash), mv = await m.locator('#mobile-menu').count();
  ok(mh === '#quiz' && mv === 0, 'celular: menu navega e fecha (' + mh + ' / ' + mv + ')');
  await m.goto(U + '#prontos'); await m.waitForTimeout(1200);
  await m.click('#lista-prontos li:nth-child(2) button:has-text("Personalizar")'); await m.waitForTimeout(700);
  await m.goto(U + '#resultado'); await m.waitForTimeout(800);
  const largoR = await m.evaluate(() => [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().right > 392 && !e.closest('.overflow-x-auto')).length);
  ok(largoR === 0, 'celular: resultado cabe na tela (' + largoR + ')');

  console.log('\nErros de console:', errs.length ? '\n' + errs.join('\n') : 'nenhum');
  await b.close();
  servidor.close();
  console.log(`\n${aprovados} aprovados, ${falhas} falhas`);
  process.exit(falhas || errs.length ? 1 : 0);
