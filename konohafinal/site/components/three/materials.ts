import * as THREE from 'three';

/** Textura procedural de placa de circuito (trilhas e pads), gerada uma vez. */
let pcbTex: THREE.CanvasTexture | null = null;
export function getPCBTexture() {
  if (pcbTex) return pcbTex;
  const s = 512;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d')!;
  g.fillStyle = '#1b1b1b';
  g.fillRect(0, 0, s, s);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  g.lineCap = 'round';
  for (let i = 0; i < 140; i++) {
    let x = Math.round(rnd() * 32) * 16;
    let y = Math.round(rnd() * 32) * 16;
    g.strokeStyle = rnd() > 0.85 ? 'rgba(150,150,150,0.35)' : 'rgba(90,90,90,0.35)';
    g.lineWidth = rnd() > 0.7 ? 3 : 1.5;
    g.beginPath();
    g.moveTo(x, y);
    for (let k = 0; k < 4; k++) {
      const len = 16 + Math.round(rnd() * 6) * 16;
      const dir = Math.floor(rnd() * 4);
      if (dir === 0) x += len;
      else if (dir === 1) x -= len;
      else if (dir === 2) y += len;
      else {
        x += len * 0.7;
        y += len * 0.7;
      }
      g.lineTo(x, y);
    }
    g.stroke();
    g.fillStyle = 'rgba(170,170,170,0.5)';
    g.beginPath();
    g.arc(x, y, 2.5, 0, Math.PI * 2);
    g.fill();
  }
  pcbTex = new THREE.CanvasTexture(c);
  pcbTex.colorSpace = THREE.SRGBColorSpace;
  pcbTex.anisotropy = 4;
  return pcbTex;
}

/** Sprite circular suave, usado em partículas e névoa. */
let softTex: THREE.CanvasTexture | null = null;
export function getSoftTexture() {
  if (softTex) return softTex;
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  softTex = new THREE.CanvasTexture(c);
  return softTex;
}

export const mats = {
  darkMetal: () => new THREE.MeshStandardMaterial({ color: '#1f1f1f', metalness: 0.6, roughness: 0.42 }),
  plastic: () => new THREE.MeshStandardMaterial({ color: '#161616', metalness: 0.1, roughness: 0.6 }),
  alu: () => new THREE.MeshStandardMaterial({ color: '#c9c9c9', metalness: 0.9, roughness: 0.3 }),
  copper: () => new THREE.MeshStandardMaterial({ color: '#b5b5b5', metalness: 1, roughness: 0.25 }),
  gold: () => new THREE.MeshStandardMaterial({ color: '#9a9a9a', metalness: 1, roughness: 0.3 }),
  pcb: () =>
    new THREE.MeshStandardMaterial({ color: '#ffffff', map: getPCBTexture(), metalness: 0.3, roughness: 0.6 }),
  rgb: (color = '#b05cff', intensity = 4) =>
    new THREE.MeshStandardMaterial({
      color: '#000000',
      emissive: new THREE.Color(color),
      emissiveIntensity: intensity,
      toneMapped: false,
    }),
};
