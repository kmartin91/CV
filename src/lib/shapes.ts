// Target positions for the particle field. Every shape is a flat Float32Array
// of `count` xyz triplets, centred on the origin and about 4.4 units wide.

type Draw = (ctx: CanvasRenderingContext2D, size: number) => void;

interface SampleOptions {
  width?: number;
  depth?: number;
  ink?: boolean;
  relief?: number;
}

const SIZE = 256;

function sampleCanvas(canvas: HTMLCanvasElement, count: number, opts: SampleOptions = {}): Float32Array {
  const width = opts.width ?? 4.4;
  const depth = opts.depth ?? 0.35;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const out = new Float32Array(count * 3);
  if (!ctx) return out;
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

  // Weighted pick: opaque pixels, darker ones more often for a portrait.
  const weights = new Float32Array(SIZE * SIZE);
  let total = 0;
  for (let i = 0; i < SIZE * SIZE; i += 1) {
    const a = data[i * 4 + 3] / 255;
    if (a >= 0.4) {
      let w = a;
      if (opts.ink) {
        const lum = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
        w = a * Math.pow(1 - lum, 1.6) + 0.015;
      }
      total += w;
    }
    weights[i] = total;
  }
  if (total === 0) return sphere(count);

  for (let n = 0; n < count; n += 1) {
    const r = Math.random() * total;
    let lo = 0;
    let hi = weights.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (weights[mid] < r) lo = mid + 1; else hi = mid;
    }
    const px = (lo % SIZE) + Math.random();
    const py = Math.floor(lo / SIZE) + Math.random();
    const x = (px / SIZE - 0.5) * width;
    const y = -(py / SIZE - 0.5) * width;
    let z = (Math.random() - 0.5) * depth;
    if (opts.relief) {
      const lum = (0.299 * data[lo * 4] + 0.587 * data[lo * 4 + 1] + 0.114 * data[lo * 4 + 2]) / 255;
      const bulge = Math.max(0, 1 - (x * x + y * y) / 4.5);
      z = bulge * opts.relief + (lum - 0.5) * 0.35 + (Math.random() - 0.5) * 0.12;
    }
    out[n * 3] = x;
    out[n * 3 + 1] = y;
    out[n * 3 + 2] = z;
  }
  return out;
}

function canvasFrom(draw: Draw): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx, SIZE);
  return canvas;
}

export function fromDrawing(draw: Draw, count: number, opts?: SampleOptions): Float32Array {
  return sampleCanvas(canvasFrom(draw), count, opts);
}

// The same drawings as text: each character cell gets the glyph whose
// density matches the ink under it. Cells are taller than wide, hence cols.
export const RAMP = ' .:-=+*#%@';

export function asciiArt(draw: Draw, rows = 20): string {
  const cols = Math.round(rows * 1.7);
  const ctx = canvasFrom(draw).getContext('2d', { willReadFrequently: true });
  if (!ctx) return '';
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  const lines: string[] = [];
  for (let r = 0; r < rows; r += 1) {
    let line = '';
    for (let c = 0; c < cols; c += 1) {
      const x0 = Math.floor((c / cols) * SIZE);
      const x1 = Math.floor(((c + 1) / cols) * SIZE);
      const y0 = Math.floor((r / rows) * SIZE);
      const y1 = Math.floor(((r + 1) / rows) * SIZE);
      let sum = 0;
      let n = 0;
      for (let y = y0; y < y1; y += 1) {
        for (let x = x0; x < x1; x += 1) {
          sum += data[(y * SIZE + x) * 4 + 3];
          n += 1;
        }
      }
      const cover = Math.sqrt(sum / (n * 255));
      line += RAMP[Math.min(RAMP.length - 1, Math.round(cover * (RAMP.length - 1)))];
    }
    lines.push(line);
  }
  return lines.join('\n');
}

export function fromImage(src: string, count: number, opts?: SampleOptions): Promise<Float32Array> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      resolve(fromDrawing((ctx, s) => {
        const k = Math.min(s / img.width, s / img.height);
        const w = img.width * k;
        const h = img.height * k;
        ctx.drawImage(img, (s - w) / 2, (s - h) / 2, w, h);
      }, count, opts));
    };
    img.onerror = () => resolve(sphere(count));
    img.src = src;
  });
}

export function fromText(text: string, count: number, font = '900 120px "Schibsted Grotesk", sans-serif'): Float32Array {
  return fromDrawing((ctx, s) => {
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font;
    const m = ctx.measureText(text);
    const k = Math.min(1, (s * 0.92) / m.width);
    ctx.save();
    ctx.translate(s / 2, s / 2);
    ctx.scale(k, k);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }, count, { depth: 0.5 });
}

export function sphere(count: number, radius = 1.75): Float32Array {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const shell = radius * (0.92 + Math.random() * 0.1);
    out[i * 3] = Math.cos(th) * r * shell;
    out[i * 3 + 1] = y * shell;
    out[i * 3 + 2] = Math.sin(th) * r * shell;
  }
  return out;
}

export function galaxy(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const arms = 4;
  for (let i = 0; i < count; i += 1) {
    const r = Math.pow(Math.random(), 1.6) * 2.8;
    const arm = (i % arms) * ((Math.PI * 2) / arms);
    const twist = r * 1.9;
    const jitter = (1 - r / 3) * 0.35 + 0.05;
    const a = arm + twist + (Math.random() - 0.5) * jitter * 2;
    out[i * 3] = Math.cos(a) * r + (Math.random() - 0.5) * jitter;
    out[i * 3 + 1] = (Math.random() - 0.5) * (0.5 - r * 0.12) * 0.6;
    out[i * 3 + 2] = Math.sin(a) * r + (Math.random() - 0.5) * jitter;
  }
  // Tilt the disc towards the camera.
  const tilt = 1.05;
  for (let i = 0; i < count; i += 1) {
    const y = out[i * 3 + 1];
    const z = out[i * 3 + 2];
    out[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt);
    out[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt);
  }
  return out;
}

export function grid(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const cols = Math.ceil(Math.sqrt(count * 1.8));
  const rows = Math.ceil(count / cols);
  for (let i = 0; i < count; i += 1) {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    const x = (cx / (cols - 1) - 0.5) * 7.5;
    const z = (cy / (rows - 1) - 0.5) * 4.2;
    const y = Math.sin(x * 1.2) * 0.25 + Math.cos(z * 1.6 + x * 0.4) * 0.22;
    out[i * 3] = x;
    out[i * 3 + 1] = y * Math.cos(0.9) - z * Math.sin(0.9) - 0.4;
    out[i * 3 + 2] = y * Math.sin(0.9) + z * Math.cos(0.9);
  }
  return out;
}

// Pixel-art drawing helper: rows of characters, one colour per character.
function pixels(rows: string[], palette: Record<string, string>): Draw {
  return (ctx, s) => {
    const h = rows.length;
    const w = Math.max(...rows.map((r) => r.length));
    const cell = Math.floor((s * 0.9) / Math.max(w, h));
    const ox = (s - cell * w) / 2;
    const oy = (s - cell * h) / 2;
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const color = palette[ch];
        if (!color) return;
        ctx.fillStyle = color;
        ctx.fillRect(ox + x * cell, oy + y * cell, cell - 1, cell - 1);
      });
    });
  };
}

// A question-mark block, the brick everything starts from in a level editor:
// a full square with the question mark and the four rivets carved out.
export const questionBlock: Draw = (ctx, s) => {
  pixels(Array(16).fill('################'), { '#': '#000' })(ctx, s);
  ctx.globalCompositeOperation = 'destination-out';
  pixels([
    '................',
    '................',
    '..#..........#..',
    '.....####.......',
    '....##..##......',
    '....##..##......',
    '........##......',
    '.......##.......',
    '......##........',
    '......##........',
    '................',
    '......##........',
    '..#....##....#..',
    '................',
    '................',
    '................',
  ], { '#': '#000' })(ctx, s);
  ctx.globalCompositeOperation = 'source-over';
};

// The rice ball that ends every Alex Kidd level (the Maker's app icon).
export const onigiri: Draw = pixels([
  '.......####.......',
  '......######......',
  '.....########.....',
  '....##########....',
  '...############...',
  '...############...',
  '..##############..',
  '..#####....#####..',
  '.######....######.',
  '.######....######.',
  '#######....#######',
  '#######....#######',
  '##################',
  '.################.',
], { '#': '#000' });

// A snake curling around a crosshair.
export const snakeCrosshair: Draw = (ctx, s) => {
  const c = s / 2;
  ctx.strokeStyle = '#000';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = s * 0.075;
  ctx.beginPath();
  for (let i = 0; i <= 120; i += 1) {
    const t = i / 120;
    const a = t * Math.PI * 3.2 - Math.PI * 0.4;
    const r = s * (0.42 - t * 0.2);
    const x = c + Math.cos(a) * r;
    const y = c + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.lineWidth = s * 0.018;
  ctx.beginPath();
  ctx.arc(c, c, s * 0.12, 0, Math.PI * 2);
  ctx.moveTo(c - s * 0.2, c); ctx.lineTo(c - s * 0.05, c);
  ctx.moveTo(c + s * 0.05, c); ctx.lineTo(c + s * 0.2, c);
  ctx.moveTo(c, c - s * 0.2); ctx.lineTo(c, c - s * 0.05);
  ctx.moveTo(c, c + s * 0.05); ctx.lineTo(c, c + s * 0.2);
  ctx.stroke();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(c + Math.cos(-Math.PI * 0.4) * s * 0.42, c + Math.sin(-Math.PI * 0.4) * s * 0.42, s * 0.07, 0, Math.PI * 2);
  ctx.fill();
};

// The Loutre logo: an otter head with ears, eyes and a big nose.
export const otter: Draw = (ctx, s) => {
  const k = s / 100;
  ctx.save();
  ctx.scale(k, k);
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(19, 32, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(81, 32, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.roundRect(16, 22, 68, 60, 30); ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath(); ctx.ellipse(50, 63, 22, 15.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(35, 44, 3.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(65, 44, 3.6, 0, Math.PI * 2); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath(); ctx.ellipse(50, 56, 7.5, 5.2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(50, 60.5); ctx.lineTo(50, 64);
  ctx.moveTo(50, 64); ctx.quadraticCurveTo(45.5, 68.5, 41, 66);
  ctx.moveTo(50, 64); ctx.quadraticCurveTo(54.5, 68.5, 59, 66);
  ctx.stroke();
  ctx.restore();
};

// The heartbeat line of the This Is Simply Life icon.
export const pulse: Draw = (ctx, s) => {
  ctx.strokeStyle = '#000';
  ctx.lineWidth = s * 0.06;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const pts: [number, number][] = [
    [0.04, 0.55], [0.3, 0.55], [0.38, 0.4], [0.46, 0.18], [0.54, 0.86], [0.62, 0.42], [0.68, 0.55], [0.86, 0.55],
  ];
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * s, y * s) : ctx.moveTo(x * s, y * s)));
  ctx.stroke();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(0.9 * s, 0.55 * s, s * 0.05, 0, Math.PI * 2); ctx.fill();
};

// A sun peeking behind a cloud.
export const sunCloud: Draw = (ctx, s) => {
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#000';
  ctx.lineCap = 'round';
  ctx.lineWidth = s * 0.035;
  const cx = s * 0.4;
  const cy = s * 0.36;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * s * 0.2, cy + Math.sin(a) * s * 0.2);
    ctx.lineTo(cx + Math.cos(a) * s * 0.28, cy + Math.sin(a) * s * 0.28);
    ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, s * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath(); ctx.roundRect(s * 0.18, s * 0.5, s * 0.7, s * 0.24, s * 0.12); ctx.fill();
  ctx.beginPath(); ctx.arc(s * 0.42, s * 0.5, s * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(s * 0.62, s * 0.46, s * 0.19, 0, Math.PI * 2); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath(); ctx.roundRect(s * 0.21, s * 0.53, s * 0.64, s * 0.18, s * 0.09); ctx.fill();
  ctx.beginPath(); ctx.arc(s * 0.42, s * 0.52, s * 0.12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(s * 0.62, s * 0.48, s * 0.16, 0, Math.PI * 2); ctx.fill();
};

// A screen bleeding its colours onto the wall behind it.
export const ambilight: Draw = (ctx, s) => {
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#000';
  ctx.lineCap = 'round';
  const x = s * 0.24;
  const y = s * 0.3;
  const w = s * 0.52;
  const h = s * 0.32;
  ctx.lineWidth = s * 0.03;
  ctx.strokeRect(x, y, w, h);
  ctx.fillRect(s * 0.46, y + h, s * 0.08, s * 0.08);
  ctx.fillRect(s * 0.38, y + h + s * 0.08, s * 0.24, s * 0.025);
  ctx.lineWidth = s * 0.018;
  const rays = 28;
  for (let i = 0; i < rays; i += 1) {
    const a = (i / rays) * Math.PI * 2;
    const ex = Math.cos(a);
    const ey = Math.sin(a);
    const tx = Math.min(Math.abs((w / 2) / (ex || 1e-6)), Math.abs((h / 2) / (ey || 1e-6)));
    const sx = s / 2 + ex * (tx + s * 0.04);
    const sy = s * 0.46 + ey * (tx + s * 0.04);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + ex * s * 0.12, sy + ey * s * 0.12);
    ctx.stroke();
  }
};

// Lab emblems by shape name, shared by the field and the ASCII tiles.
export const EMBLEMS: Record<string, Draw> = {
  otter: (ctx, s) => otter(ctx, s),
  onigiri: (ctx, s) => onigiri(ctx, s),
  snake: (ctx, s) => snakeCrosshair(ctx, s),
  pulse: (ctx, s) => pulse(ctx, s),
  sun: (ctx, s) => sunCloud(ctx, s),
  ambilight: (ctx, s) => ambilight(ctx, s),
};

export const at: Draw = (ctx, s) => {
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.round(s * 0.95)}px "Schibsted Grotesk", sans-serif`;
  ctx.fillText('@', s / 2, s / 2 + s * 0.04);
};
