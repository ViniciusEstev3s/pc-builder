import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const htmlPath = resolve('scratch/desempenho-evolucao.html');
const dest1 = resolve('../RELATORIO_DESEMPENHO_EVOLUCAO_KONOHA.pdf');
const dest2 = resolve('../../RELATORIO_DESEMPENHO_EVOLUCAO_KONOHA.pdf');

console.log('Iniciando geração do PDF de Desempenho e Evolução a partir de:', htmlPath);

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist']
});

const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const pdfOptions = {
  format: 'A4',
  printBackground: true,
  margin: {
    top: '18mm',
    bottom: '18mm',
    left: '16mm',
    right: '16mm'
  },
  displayHeaderFooter: true,
  headerTemplate: `
    <div style="font-size: 8px; color: #94a3b8; width: 100%; text-align: right; padding-right: 16mm; font-family: -apple-system, sans-serif; font-weight: 500;">
      Konoha Hardware · Relatório de Desempenho, Evolução e Inovação 3D
    </div>
  `,
  footerTemplate: `
    <div style="font-size: 8px; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; padding: 0 16mm; font-family: -apple-system, sans-serif; font-weight: 500;">
      <span>Google Antigravity IDE · Engenharia de Software</span>
      <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
    </div>
  `
};

console.log('Gerando PDF 1:', dest1);
await page.pdf({ ...pdfOptions, path: dest1 });

console.log('Gerando PDF 2:', dest2);
await page.pdf({ ...pdfOptions, path: dest2 });

await browser.close();
console.log('PDFs de Desempenho e Evolução gerados com sucesso!');
