/**
 * Depois de `next build` com RELATIVE_ASSETS=1 (publicação em subpasta ou artefato):
 * o CSS gerado aponta as fontes para "_next/static/media/...", caminho que o navegador
 * resolve a partir da pasta do próprio CSS e não encontra. Aqui trocamos por "../media/...".
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const pasta = join('out', '_next', 'static', 'css');
let corrigidos = 0;
for (const arquivo of readdirSync(pasta).filter((f) => f.endsWith('.css'))) {
  const caminho = join(pasta, arquivo);
  const css = readFileSync(caminho, 'utf8');
  const novo = css.replace(/url\((?:\.\/)?_next\/static\/media\//g, 'url(../media/');
  if (novo !== css) {
    writeFileSync(caminho, novo);
    corrigidos++;
  }
}
console.log(`caminhos-relativos: ${corrigidos} arquivo(s) CSS corrigido(s)`);
