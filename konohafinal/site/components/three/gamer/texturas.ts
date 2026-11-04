/**
 * Texturas procedurais do visualizador 3D (geradas em <canvas>, sem arquivos externos).
 *
 * Dois tipos:
 * 1. Microrrelevo "triplanar": um mapa de altura que se repete e é aplicado pelo shader
 *    em qualquer peça, sem depender das coordenadas UV (metal escovado, pintura
 *    eletrostática, plástico granulado, borracha).
 * 2. Texturas com desenho: placa-mãe, SSD, memória, backplate, processador, adesivos,
 *    trançado dos cabos e marcas no vidro.
 */
import * as THREE from 'three';

/* =============================================================================
   BASE
   ============================================================================= */

const cache = new Map<string, THREE.Texture>();
function memo<T extends THREE.Texture>(chave: string, criar: () => T): T {
  let t = cache.get(chave) as T | undefined;
  if (!t) {
    t = criar();
    cache.set(chave, t);
  }
  return t;
}

function novoCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { c, g: c.getContext('2d')! };
}

function paraTextura(c: HTMLCanvasElement, opts: { cor?: boolean; repetir?: boolean } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = opts.cor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  if (opts.repetir) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.needsUpdate = true;
  return t;
}

/** Gerador pseudoaleatório com semente (as texturas saem iguais em todo carregamento). */
function aleatorio(semente: number) {
  let s = semente % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Ruído de valor que se repete sem emenda (soma de oitavas). */
function ruidoTileavel(tam: number, oitavas: [number, number][], semente = 1) {
  const rnd = aleatorio(semente);
  const out = new Float32Array(tam * tam);
  let pesoTotal = 0;
  for (const [celulas, peso] of oitavas) {
    pesoTotal += peso;
    const grade = new Float32Array(celulas * celulas).map(() => rnd());
    const v = (x: number, y: number) => grade[((y + celulas) % celulas) * celulas + ((x + celulas) % celulas)];
    for (let y = 0; y < tam; y++) {
      const gy = (y / tam) * celulas;
      const y0 = Math.floor(gy);
      const fy = gy - y0;
      const sy = fy * fy * (3 - 2 * fy);
      for (let x = 0; x < tam; x++) {
        const gx = (x / tam) * celulas;
        const x0 = Math.floor(gx);
        const fx = gx - x0;
        const sx = fx * fx * (3 - 2 * fx);
        const a = v(x0, y0) + (v(x0 + 1, y0) - v(x0, y0)) * sx;
        const b = v(x0, y0 + 1) + (v(x0 + 1, y0 + 1) - v(x0, y0 + 1)) * sx;
        out[y * tam + x] += (a + (b - a) * sy) * peso;
      }
    }
  }
  for (let i = 0; i < out.length; i++) out[i] /= pesoTotal;
  return out;
}

function campoParaCanvas(tam: number, campo: Float32Array) {
  const { c, g } = novoCanvas(tam, tam);
  const img = g.createImageData(tam, tam);
  for (let i = 0; i < campo.length; i++) {
    const v = Math.max(0, Math.min(255, Math.round(campo[i] * 255)));
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c;
}

/* =============================================================================
   1. MICRORRELEVO (mapas de altura em tons de cinza, repetíveis)
   ============================================================================= */

export type TipoRelevo = 'escovado' | 'pintura' | 'granulado' | 'borracha';

/** Metal escovado: riscos finos e longos numa só direção. */
function relevoEscovado() {
  const T = 512;
  const { c, g } = novoCanvas(T, T);
  const rnd = aleatorio(7);
  g.fillStyle = 'rgb(128,128,128)';
  g.fillRect(0, 0, T, T);
  for (let i = 0; i < 2600; i++) {
    const y = rnd() * T;
    const x = rnd() * T;
    const len = 60 + rnd() * 460;
    const claro = rnd() > 0.5;
    g.strokeStyle = claro ? `rgba(255,255,255,${0.05 + rnd() * 0.18})` : `rgba(0,0,0,${0.05 + rnd() * 0.18})`;
    g.lineWidth = rnd() > 0.85 ? 1.6 : 0.8;
    for (const dx of [0, -T]) {
      g.beginPath();
      g.moveTo(x + dx, y);
      g.lineTo(x + dx + len, y);
      g.stroke();
    }
  }
  return c;
}

export function texturaRelevo(tipo: TipoRelevo) {
  return memo(`relevo-${tipo}`, () => {
    let c: HTMLCanvasElement;
    if (tipo === 'escovado') c = relevoEscovado();
    else if (tipo === 'pintura') c = campoParaCanvas(256, ruidoTileavel(256, [[64, 0.6], [128, 0.4]], 3));
    else if (tipo === 'granulado') c = campoParaCanvas(256, ruidoTileavel(256, [[32, 0.35], [64, 0.4], [128, 0.25]], 5));
    else c = campoParaCanvas(256, ruidoTileavel(256, [[16, 0.3], [48, 0.4], [128, 0.3]], 9));
    return paraTextura(c, { repetir: true });
  });
}

export type OpcoesRelevo = {
  tipo: TipoRelevo;
  /** repetições por unidade da cena (1 unidade ≈ 15 cm) */
  escala: number;
  /** força do relevo na luz */
  relevo: number;
  /** quanto o relevo varia a aspereza (0 = nada) */
  aspereza?: number;
  /** quanto o relevo varia a cor (0 = nada) */
  cor?: number;
};

/**
 * Aplica o microrrelevo a um material padrão do three.js. O mapa é projetado nos três
 * eixos da própria peça (triplanar), então não estica em nenhuma face.
 */
export function aplicarRelevo<M extends THREE.MeshStandardMaterial>(material: M, o: OpcoesRelevo): M {
  const uniforms = {
    uTriTex: { value: texturaRelevo(o.tipo) },
    uTriEscala: { value: o.escala },
    uTriBump: { value: o.relevo },
    uTriRough: { value: o.aspereza ?? 0.35 },
    uTriCor: { value: o.cor ?? 0.08 },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vTriPos;\nvarying vec3 vTriNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvTriPos = position;\nvTriNormal = normal;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform sampler2D uTriTex;
uniform float uTriEscala;
uniform float uTriBump;
uniform float uTriRough;
uniform float uTriCor;
varying vec3 vTriPos;
varying vec3 vTriNormal;
float triAltura() {
  vec3 n = pow(abs(normalize(vTriNormal)), vec3(4.0));
  n /= (n.x + n.y + n.z + 1e-5);
  vec3 p = vTriPos * uTriEscala;
  return texture2D(uTriTex, p.zy).r * n.x + texture2D(uTriTex, p.xz).r * n.y + texture2D(uTriTex, p.xy).r * n.z;
}
vec3 triPerturba(vec3 pos, vec3 nor, vec2 dH, float faceDir) {
  vec3 sx = normalize(dFdx(pos));
  vec3 sy = normalize(dFdy(pos));
  vec3 r1 = cross(sy, nor);
  vec3 r2 = cross(nor, sx);
  float det = dot(sx, r1) * faceDir;
  vec3 grad = sign(det) * (dH.x * r1 + dH.y * r2);
  return normalize(abs(det) * nor - grad);
}`,
      )
      .replace('#include <color_fragment>', '#include <color_fragment>\nfloat triH = triAltura();\ndiffuseColor.rgb *= 1.0 + (triH - 0.5) * uTriCor;')
      .replace(
        '#include <roughnessmap_fragment>',
        '#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor * (1.0 + (triH - 0.5) * uTriRough * 2.0), 0.04, 1.0);',
      )
      .replace(
        '#include <normal_fragment_maps>',
        '#include <normal_fragment_maps>\nnormal = triPerturba(-vViewPosition, normal, vec2(dFdx(triH), dFdy(triH)) * uTriBump, faceDirection);',
      );
  };
  material.customProgramCacheKey = () => 'relevo-triplanar-v1';
  material.needsUpdate = true;
  return material;
}

/* =============================================================================
   2. TEXTURAS COM DESENHO
   ============================================================================= */

/** Trançado de sleeve/mangueira (usar com UV de TubeGeometry). */
export function texturaTrancado() {
  return memo('trancado', () => {
    const W = 128;
    const H = 64;
    const { c, g } = novoCanvas(W, H);
    const img = g.createImageData(W, H);
    const N = 6;
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const u = x / W;
        const v = y / H;
        const a = (u * 2 + v) * N;
        const b = (u * 2 - v) * N;
        const fa = a - Math.floor(a);
        const fb = b - Math.floor(b);
        const fio = (f: number) => Math.sin(f * Math.PI) ** 0.6;
        const cima = (Math.floor(a) + Math.floor(b)) % 2 === 0;
        const h = cima ? 0.55 * fio(fa) + 0.45 * fio(fb) * 0.6 : 0.55 * fio(fb) + 0.45 * fio(fa) * 0.6;
        const val = Math.round(Math.min(1, h) * 255);
        const i = (y * W + x) * 4;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = val;
        img.data[i + 3] = 255;
      }
    g.putImageData(img, 0, 0);
    return paraTextura(c, { repetir: true });
  });
}

/** Placa-mãe: cor + relevo (trilhas, pads e serigrafia em alto-relevo). */
export function texturasPlacaMae() {
  const cor = memo('mobo-cor', () => desenharPlacaMae(false));
  const relevo = memo('mobo-relevo', () => desenharPlacaMae(true));
  return { cor, relevo };
}

/**
 * A placa tem 1,9 × 2,38 unidades e o canvas guarda a mesma proporção.
 * Coordenadas do desenho em "px" com origem no canto superior esquerdo da placa.
 */
function desenharPlacaMae(relevo: boolean) {
  const W = 1520;
  const H = 1904;
  const { c, g } = novoCanvas(W, H);
  const rnd = aleatorio(relevo ? 21 : 21);
  const px = (u: number) => (u / 1.9) * W; // unidades → px
  // conversão de posição da cena para o canvas (placa centrada em x=-0.35, y=0.28)
  const X = (x: number) => px(x + 0.35 + 0.95);
  const Y = (y: number) => H - px(y - 0.28 + 1.19);

  const fundo = relevo ? '#3a3a3a' : '#15181d';
  g.fillStyle = fundo;
  g.fillRect(0, 0, W, H);

  // textura sutil da máscara de solda
  if (!relevo) {
    const ruido = ruidoTileavel(256, [[64, 0.5], [128, 0.5]], 31);
    const tile = campoParaCanvas(256, ruido);
    g.globalAlpha = 0.05;
    for (let y = 0; y < H; y += 256) for (let x = 0; x < W; x += 256) g.drawImage(tile, x, y);
    g.globalAlpha = 1;
  }

  // planos de cobre (levemente visíveis sob a máscara)
  g.fillStyle = relevo ? '#454545' : '#1a1e24';
  for (let i = 0; i < 9; i++) {
    const x = rnd() * W * 0.8;
    const y = rnd() * H * 0.85;
    g.fillRect(x, y, 120 + rnd() * 260, 80 + rnd() * 200);
  }

  // trilhas em 45°
  g.lineCap = 'round';
  g.lineJoin = 'round';
  const trilha = (pts: [number, number][], largura: number) => {
    g.lineWidth = largura;
    g.strokeStyle = relevo ? '#808080' : 'rgba(150,170,190,0.35)';
    g.beginPath();
    g.moveTo(...pts[0]);
    pts.slice(1).forEach((p) => g.lineTo(...p));
    g.stroke();
    const [ex, ey] = pts[pts.length - 1];
    g.fillStyle = relevo ? '#d0d0d0' : 'rgba(185,165,115,0.6)';
    g.beginPath();
    g.arc(ex, ey, largura + 2.5, 0, Math.PI * 2);
    g.fill();
  };
  for (let i = 0; i < 160; i++) {
    let x = Math.round((rnd() * W) / 16) * 16;
    let y = Math.round((rnd() * H) / 16) * 16;
    const pts: [number, number][] = [[x, y]];
    for (let k = 0; k < 3 + Math.floor(rnd() * 3); k++) {
      const len = 30 + Math.round(rnd() * 8) * 20;
      const d = Math.floor(rnd() * 6);
      if (d === 0) x += len;
      else if (d === 1) x -= len;
      else if (d === 2) y += len;
      else if (d === 3) y -= len;
      else if (d === 4) {
        x += len * 0.7;
        y += len * 0.7;
      } else {
        x -= len * 0.7;
        y += len * 0.7;
      }
      pts.push([x, y]);
    }
    trilha(pts, rnd() > 0.75 ? 3.5 : 1.8);
  }
  // barramento da memória (feixe paralelo do soquete aos slots)
  for (let j = 0; j < 28; j++) {
    const sx = X(-0.42) + j * 7;
    trilha(
      [
        [sx, Y(0.62)],
        [sx + 60, Y(0.5)],
        [X(-0.24) + j * 8, Y(0.5)],
        [X(-0.24) + j * 8, Y(0.42)],
      ],
      1.6,
    );
  }
  // barramento PCIe
  for (let j = 0; j < 22; j++) {
    const sx = X(-0.62) + j * 7;
    trilha(
      [
        [sx, Y(0.52)],
        [sx, Y(0.2)],
        [sx - 40, Y(0.1)],
        [sx - 40, Y(0.02)],
      ],
      1.6,
    );
  }

  // vias (cobertas pela máscara de solda: só um anel discreto)
  for (let i = 0; i < 700; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    g.fillStyle = relevo ? '#9a9a9a' : 'rgba(120,132,145,0.45)';
    g.beginPath();
    g.arc(x, y, 1.8, 0, Math.PI * 2);
    g.fill();
  }

  // componentes SMD (resistores e capacitores minúsculos)
  for (let i = 0; i < 520; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const w = rnd() > 0.5 ? 10 : 6;
    const h = rnd() > 0.5 ? 6 : 10;
    g.fillStyle = relevo ? '#e0e0e0' : rnd() > 0.5 ? '#2a2b2e' : '#3d342a';
    g.fillRect(x, y, w, h);
    if (!relevo) {
      g.fillStyle = 'rgba(210,210,210,0.8)';
      g.fillRect(x, y, 2, h);
      g.fillRect(x + w - 2, y, 2, h);
    }
  }

  // chips (super I/O, rede, áudio, BIOS)
  const chip = (cx: number, cy: number, w: number, h: number, txt?: string) => {
    g.fillStyle = relevo ? '#f0f0f0' : '#0b0c0e';
    g.fillRect(cx - w / 2, cy - h / 2, w, h);
    if (relevo) return;
    g.fillStyle = 'rgba(200,205,215,0.85)';
    for (let k = 0; k < Math.floor(w / 9); k++) {
      g.fillRect(cx - w / 2 + 4 + k * 9, cy - h / 2 - 6, 4, 6);
      g.fillRect(cx - w / 2 + 4 + k * 9, cy + h / 2, 4, 6);
    }
    for (let k = 0; k < Math.floor(h / 9); k++) {
      g.fillRect(cx - w / 2 - 6, cy - h / 2 + 4 + k * 9, 6, 4);
      g.fillRect(cx + w / 2, cy - h / 2 + 4 + k * 9, 6, 4);
    }
    if (txt) {
      g.fillStyle = 'rgba(200,205,215,0.55)';
      g.font = '14px monospace';
      g.fillText(txt, cx - w / 2 + 6, cy + 5);
    }
  };
  chip(X(0.32), Y(0.05), 110, 110, 'SIO-KH');
  chip(X(-0.98), Y(0.2), 80, 80, 'LAN');
  chip(X(-0.75), Y(-0.85), 70, 70, 'AUD');
  chip(X(0.38), Y(-0.92), 60, 40, 'BIOS');

  // furos de fixação com anel prateado
  const furo = (x: number, y: number) => {
    g.fillStyle = relevo ? '#ffffff' : '#b9c0c8';
    g.beginPath();
    g.arc(x, y, 26, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = relevo ? '#000000' : '#050505';
    g.beginPath();
    g.arc(x, y, 14, 0, Math.PI * 2);
    g.fill();
  };
  [
    [60, 60],
    [W - 60, 60],
    [60, H / 2],
    [W - 60, H / 2],
    [60, H - 60],
    [W - 60, H - 60],
    [W / 2, 60],
  ].forEach(([x, y]) => furo(x, y));

  // serigrafia: contornos e textos
  g.strokeStyle = relevo ? '#c8c8c8' : 'rgba(225,230,240,0.6)';
  g.lineWidth = 2;
  g.strokeRect(X(-0.84), Y(0.98), px(0.48), px(0.48)); // soquete
  g.strokeRect(X(-1.24), Y(0.03), px(1.0), px(0.08)); // pcie
  g.strokeRect(X(-0.25), Y(1.15), px(0.4), px(0.78)); // memória
  g.fillStyle = relevo ? '#c8c8c8' : 'rgba(225,230,240,0.62)';
  g.font = 'bold 22px sans-serif';
  g.fillText('PCIE_E1', X(-1.24), Y(0.08));
  g.fillText('DIMMA2   DIMMB2', X(-0.26), Y(1.18));
  g.fillText('CPU_FAN', X(-0.4), Y(1.32));
  g.fillText('M2_1', X(-0.86), Y(0.27));
  g.fillText('ATX_PWR', X(0.42), Y(0.82));
  g.fillText('SYS_FAN1', X(0.3), Y(-0.98));
  g.font = 'bold 54px sans-serif';
  g.fillText('KONOHA', X(-0.05), Y(-0.35));
  g.font = '28px sans-serif';
  g.fillText('GAMING  ·  REV 1.0', X(-0.05), Y(-0.42));
  g.font = '16px monospace';
  for (let i = 0; i < 40; i++) g.fillText(['R', 'C', 'Q', 'U', 'L'][i % 5] + Math.floor(rnd() * 900 + 100), rnd() * W, rnd() * H);

  // faixa decorativa na placa (estilo gamer)
  if (!relevo) {
    const grad = g.createLinearGradient(X(-0.2), 0, X(0.6), 0);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.5, 'rgba(210,220,235,0.18)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.save();
    g.translate(X(0.2), Y(-0.6));
    g.rotate(-Math.PI / 4);
    g.fillRect(-500, -18, 1000, 36);
    g.restore();
  }

  return paraTextura(c, { cor: !relevo });
}

/** Etiqueta/rosto de um componente desenhado num canvas. */
function rosto(chave: string, W: number, H: number, desenhar: (g: CanvasRenderingContext2D, rnd: () => number) => void) {
  return memo(chave, () => {
    const { c, g } = novoCanvas(W, H);
    desenhar(g, aleatorio(chave.length * 97));
    return paraTextura(c, { cor: true });
  });
}

/** SSD NVMe M.2 2280 visto de cima: controlador, NAND, etiqueta e contatos dourados. */
export function texturaSSD(capacidade: string) {
  return rosto(`ssd-${capacidade}`, 1040, 200, (g, rnd) => {
    g.fillStyle = '#0d0f12';
    g.fillRect(0, 0, 1040, 200);
    // contatos dourados (lado direito)
    for (let i = 0; i < 26; i++) {
      g.fillStyle = '#d4a63c';
      g.fillRect(1000, 14 + i * 6.6, 34, 4);
    }
    g.fillStyle = '#0d0f12';
    g.fillRect(1000, 108, 40, 14); // chanfro da chave M
    // meia-lua do parafuso (esquerda)
    g.fillStyle = '#c9ced6';
    g.beginPath();
    g.arc(0, 100, 26, -Math.PI / 2, Math.PI / 2);
    g.fill();
    // etiqueta
    const grad = g.createLinearGradient(60, 0, 940, 0);
    grad.addColorStop(0, '#1d2128');
    grad.addColorStop(1, '#2b313b');
    g.fillStyle = grad;
    g.fillRect(70, 16, 880, 168);
    g.fillStyle = '#ff6a13';
    g.fillRect(70, 16, 12, 168);
    g.fillStyle = '#f1f5f9';
    g.font = 'bold 56px sans-serif';
    g.fillText('KONOHA', 110, 86);
    g.fillStyle = 'rgba(241,245,249,0.7)';
    g.font = '30px sans-serif';
    g.fillText(`NVMe PCIe · ${capacidade}`, 112, 132);
    g.font = '18px monospace';
    g.fillText('SN: KH' + Math.floor(rnd() * 1e8), 112, 166);
    // código de barras
    for (let x = 640; x < 920; x += 3) {
      if (rnd() > 0.45) {
        g.fillStyle = '#e2e8f0';
        g.fillRect(x, 120, rnd() > 0.7 ? 3 : 1.5, 50);
      }
    }
    g.fillStyle = 'rgba(241,245,249,0.6)';
    g.font = '16px sans-serif';
    g.fillText('M.2 2280', 830, 50);
  });
}

/** Lateral do dissipador da memória RAM. */
export function texturaRam(rgb: boolean, rotulo: string) {
  return rosto(`ram-${rgb}-${rotulo}`, 1320, 260, (g) => {
    const grad = g.createLinearGradient(0, 0, 0, 260);
    grad.addColorStop(0, '#2a2f37');
    grad.addColorStop(1, '#14171c');
    g.fillStyle = grad;
    g.fillRect(0, 0, 1320, 260);
    // chanfros e cortes angulares
    g.fillStyle = 'rgba(255,255,255,0.06)';
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(380, 0);
    g.lineTo(300, 260);
    g.lineTo(0, 260);
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.18)';
    g.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      g.moveTo(820 + i * 28, 0);
      g.lineTo(760 + i * 28, 260);
      g.stroke();
    }
    // adesivo
    g.fillStyle = '#e8ecf1';
    g.fillRect(420, 70, 300, 120);
    g.fillStyle = '#111';
    g.font = 'bold 34px sans-serif';
    g.fillText('KONOHA', 440, 118);
    g.font = '22px sans-serif';
    g.fillText(rotulo, 440, 152);
    g.font = '14px monospace';
    g.fillText('1.35V  CL30', 440, 178);
    g.fillStyle = '#ff6a13';
    g.font = 'bold 40px sans-serif';
    g.fillText(rgb ? 'RGB' : 'FURY', 1040, 150);
  });
}

/** Backplate da placa de vídeo: metal escuro com recortes de ventilação e logo. */
export function texturaBackplate(comprimento: number) {
  const W = Math.round(comprimento * 700);
  return rosto(`backplate-${W}`, W, 504, (g, rnd) => {
    g.fillStyle = '#23272e';
    g.fillRect(0, 0, W, 504);
    // escovado
    for (let i = 0; i < 900; i++) {
      g.strokeStyle = `rgba(255,255,255,${rnd() * 0.05})`;
      g.lineWidth = 1;
      const y = rnd() * 504;
      g.beginPath();
      g.moveTo(rnd() * W, y);
      g.lineTo(rnd() * W, y);
      g.stroke();
    }
    // recortes de ventilação (no fim da placa, onde o ar atravessa)
    g.fillStyle = '#07080a';
    const ini = W * 0.72;
    for (let x = ini; x < W - 40; x += 34) {
      const r = 10;
      g.beginPath();
      g.roundRect(x, 60, 18, 384, r);
      g.fill();
    }
    // linhas gravadas
    g.strokeStyle = 'rgba(255,255,255,0.12)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(40, 440);
    g.lineTo(W * 0.62, 440);
    g.lineTo(W * 0.68, 380);
    g.stroke();
    g.fillStyle = 'rgba(235,240,248,0.55)';
    g.font = 'bold 64px sans-serif';
    g.fillText('KONOHA', 70, 150);
    g.font = '28px sans-serif';
    g.fillText('GAMING GPU', 74, 196);
    // furos de parafuso
    g.fillStyle = '#9aa3ad';
    [
      [W * 0.35, 200],
      [W * 0.35 + 140, 200],
      [W * 0.35, 340],
      [W * 0.35 + 140, 340],
    ].forEach(([x, y]) => {
      g.beginPath();
      g.arc(x, y, 9, 0, Math.PI * 2);
      g.fill();
    });
  });
}

/** Tampa metálica do processador com gravação a laser. */
export function texturaProcessador(nome: string) {
  return rosto(`cpu-${nome}`, 512, 512, (g, rnd) => {
    const grad = g.createRadialGradient(220, 200, 20, 256, 256, 380);
    grad.addColorStop(0, '#e9edf2');
    grad.addColorStop(1, '#a9b2bc');
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 500; i++) {
      g.strokeStyle = `rgba(80,90,100,${rnd() * 0.08})`;
      g.beginPath();
      const r = rnd() * 360;
      g.arc(256, 256, r, 0, Math.PI * 2);
      g.stroke();
    }
    g.fillStyle = 'rgba(55,62,72,0.75)';
    g.font = 'bold 54px sans-serif';
    g.fillText('KONOHA', 70, 200);
    g.font = '30px sans-serif';
    const partes = nome.replace(/^(AMD|Intel)\s+/i, '').split(' ');
    g.fillText(partes.slice(0, 3).join(' '), 72, 260);
    g.font = '22px monospace';
    g.fillText('100-0000' + Math.floor(rnd() * 900 + 100), 72, 320);
    g.fillText('DIFFUSED IN BRASIL', 72, 360);
    g.fillStyle = '#d4a63c';
    g.beginPath();
    g.moveTo(14, 498);
    g.lineTo(54, 498);
    g.lineTo(14, 458);
    g.fill();
  });
}

/** Adesivo redondo do centro das ventoinhas. */
export function texturaAdesivoFan() {
  return rosto('adesivo-fan', 256, 256, (g) => {
    g.fillStyle = '#15181d';
    g.beginPath();
    g.arc(128, 128, 128, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#ff6a13';
    g.lineWidth = 10;
    g.beginPath();
    g.arc(128, 128, 96, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = '#f1f5f9';
    g.font = 'bold 110px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('K', 128, 134);
  });
}

/** Marcas leves de dedo e poeira para a aspereza do vidro. */
export function texturaMarcasVidro() {
  return memo('vidro-marcas', () => {
    const { c, g } = novoCanvas(512, 512);
    const rnd = aleatorio(77);
    g.fillStyle = 'rgb(0,30,0)';
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 26; i++) {
      const x = rnd() * 512;
      const y = rnd() * 512;
      const r = 12 + rnd() * 50;
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(0,${120 + rnd() * 90},0,0.6)`);
      grad.addColorStop(1, 'rgba(0,30,0,0)');
      g.fillStyle = grad;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
    for (let i = 0; i < 1200; i++) {
      g.fillStyle = `rgba(0,${150 + rnd() * 100},0,${rnd() * 0.5})`;
      g.fillRect(rnd() * 512, rnd() * 512, 1.2, 1.2);
    }
    return paraTextura(c);
  });
}

/** Rosto do dissipador do chipset com logo gravado. */
export function texturaChipset() {
  return rosto('chipset', 512, 440, (g, rnd) => {
    g.fillStyle = '#20242b';
    g.fillRect(0, 0, 512, 440);
    for (let i = 0; i < 400; i++) {
      g.strokeStyle = `rgba(255,255,255,${rnd() * 0.06})`;
      const y = rnd() * 440;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(512, y);
      g.stroke();
    }
    g.strokeStyle = 'rgba(255,255,255,0.22)';
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(40, 60);
    g.lineTo(472, 60);
    g.lineTo(472, 380);
    g.lineTo(140, 380);
    g.stroke();
    g.fillStyle = 'rgba(235,240,248,0.75)';
    g.font = 'bold 66px sans-serif';
    g.fillText('KONOHA', 70, 240);
    g.font = '26px sans-serif';
    g.fillText('GAMING SERIES', 74, 290);
  });
}

/** Chapa perfurada (furos hexagonais) com transparência, para a ventilação do shroud. */
export function texturaPerfurada() {
  return memo('perfurada', () => {
    const { c, g } = novoCanvas(128, 128);
    g.clearRect(0, 0, 128, 128);
    g.fillStyle = '#ffffff';
    const hex = (cx: number, cy: number, r: number) => {
      g.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      g.closePath();
      g.fill();
    };
    // 4 × 4 furos com fileiras alternadas; os da borda repetem do outro lado para emendar
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 5; x++) {
        const cx = x * 32 + (y % 2 ? 16 : 0);
        const cy = y * 32 + 16;
        hex(cx, cy, 11);
        hex(cx - 128, cy, 11);
      }
    const t = paraTextura(c, { repetir: true });
    return t;
  });
}

/** Placa de identificação em metal escovado com o nome gravado. */
export function texturaPlaca() {
  return rosto('placa-gabinete', 1024, 200, (g, rnd) => {
    const grad = g.createLinearGradient(0, 0, 0, 200);
    grad.addColorStop(0, '#d9dee5');
    grad.addColorStop(0.5, '#aeb6c0');
    grad.addColorStop(1, '#cfd5dc');
    g.fillStyle = grad;
    g.fillRect(0, 0, 1024, 200);
    for (let i = 0; i < 1400; i++) {
      g.strokeStyle = `rgba(${rnd() > 0.5 ? '255,255,255' : '60,70,80'},${rnd() * 0.12})`;
      const y = rnd() * 200;
      g.beginPath();
      g.moveTo(rnd() * 1024, y);
      g.lineTo(rnd() * 1024, y);
      g.stroke();
    }
    g.fillStyle = 'rgba(30,34,40,0.85)';
    g.font = '700 92px sans-serif';
    g.textBaseline = 'middle';
    g.fillText('KONOHA', 60, 104);
    g.fillStyle = '#ff6a13';
    g.fillRect(520, 70, 8, 68);
    g.fillStyle = 'rgba(30,34,40,0.7)';
    g.font = '500 44px sans-serif';
    g.fillText('Hardware', 560, 108);
  });
}
