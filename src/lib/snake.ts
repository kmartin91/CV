import type Lenis from 'lenis';
import type { Field } from './field';
import type { Sound } from './sound';

// Easter egg: type "snake" (or the Konami code) and the particle field becomes
// a Snake game, drawn in ASCII. The border, the snake and the apple are all
// made of the same particles; the orange ones play the apple.

const COLS = 30;
const ROWS = 16;
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const DIRS: Record<string, [number, number]> = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], z: [0, -1], q: [-1, 0],
};

interface Hooks {
  onStart: () => void;
  onStop: () => void;
}

export function snakeGame(root: HTMLElement, field: Field, lenis: Lenis | null, sound: Sound, hooks: Hooks): () => void {
  const hud = root.querySelector<HTMLElement>('.snake-hud');
  const scoreEl = root.querySelector<HTMLElement>('.snake-score');
  const bestEl = root.querySelector<HTMLElement>('.snake-best');
  const msgEl = root.querySelector<HTMLElement>('.snake-msg');
  const PLAY = hud?.dataset.play ?? '';
  const OVER = hud?.dataset.over ?? '';
  const pal = field.palette();
  const apples: number[] = [];
  const body: number[] = [];
  pal.forEach((c, i) => (c === 2 ? apples : body).push(i));
  const border = body.splice(0, Math.floor(body.length * 0.28));

  let playing = false;
  let over = false;
  let timer = 0;
  let snake: [number, number][] = [];
  let dir: [number, number] = [1, 0];
  let queued: [number, number] | null = null;
  let apple: [number, number] = [0, 0];
  let score = 0;
  let best = 0;
  let saved: ReturnType<Field['getShape']> | null = null;
  try { best = Number(localStorage.getItem('snake-best')) || 0; } catch { best = 0; }

  const geometry = () => {
    const { w, h } = field.view();
    const cell = Math.min((w * 0.86) / COLS, (h * 0.66) / ROWS);
    return { cell, x0: (-COLS * cell) / 2, y0: (ROWS * cell) / 2 + h * 0.04 };
  };

  const draw = () => {
    const { cell, x0, y0 } = geometry();
    const out = new Float32Array(field.count * 3);
    const put = (i: number, x: number, y: number) => {
      out[i * 3] = x;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    };
    const inCell = (i: number, cx: number, cy: number, spread = 0.42) => {
      put(i, x0 + (cx + 0.5 + (Math.random() * 2 - 1) * spread) * cell, y0 - (cy + 0.5 + (Math.random() * 2 - 1) * spread) * cell);
    };
    // Border: the particles walk the perimeter.
    const perim = 2 * (COLS + ROWS) * cell;
    border.forEach((i, n) => {
      let d = (n / border.length) * perim;
      const W = COLS * cell;
      const H = ROWS * cell;
      let x: number;
      let y: number;
      if (d < W) { x = d; y = 0; } else if ((d -= W) < H) { x = W; y = d; } else if ((d -= H) < W) { x = W - d; y = H; } else { d -= W; x = 0; y = H - d; }
      put(i, x0 + x + (Math.random() - 0.5) * cell * 0.3, y0 - y + (Math.random() - 0.5) * cell * 0.3);
    });
    apples.forEach((i) => inCell(i, apple[0], apple[1], 0.4));
    const per = Math.max(1, Math.floor(body.length / snake.length));
    body.forEach((i, n) => {
      const seg = Math.min(snake.length - 1, Math.floor(n / per));
      inCell(i, snake[seg][0], snake[seg][1], seg === 0 ? 0.36 : 0.44);
    });
    field.setTargets(out, 0.11);
  };

  const placeApple = () => {
    do {
      apple = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)];
    } while (snake.some(([x, y]) => x === apple[0] && y === apple[1]));
  };

  const setHud = (msg: string) => {
    if (scoreEl) scoreEl.textContent = String(score);
    if (bestEl) bestEl.textContent = String(best);
    if (msgEl) msgEl.textContent = msg;
  };

  const step = () => {
    if (queued) { dir = queued; queued = null; }
    const head: [number, number] = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
    const hit = head[0] < 0 || head[1] < 0 || head[0] >= COLS || head[1] >= ROWS
      || snake.some(([x, y]) => x === head[0] && y === head[1]);
    if (hit) {
      over = true;
      clearInterval(timer);
      sound.over();
      if (score > best) {
        best = score;
        try { localStorage.setItem('snake-best', String(best)); } catch { void 0; }
      }
      setHud(OVER);
      field.burst();
      return;
    }
    snake.unshift(head);
    if (head[0] === apple[0] && head[1] === apple[1]) {
      score += 1;
      sound.eat();
      placeApple();
      setHud(PLAY);
      clearInterval(timer);
      timer = window.setInterval(step, Math.max(60, 120 - score * 3));
    } else {
      snake.pop();
    }
    draw();
  };

  const reset = () => {
    snake = [[8, 8], [7, 8], [6, 8], [5, 8]];
    dir = [1, 0];
    queued = null;
    score = 0;
    over = false;
    placeApple();
    setHud(PLAY);
    draw();
    clearInterval(timer);
    timer = window.setInterval(step, 120);
  };

  const start = () => {
    if (playing) return;
    playing = true;
    saved = field.getShape();
    hooks.onStart();
    field.setGame(true);
    root.classList.add('is-playing');
    lenis?.stop();
    if (hud) hud.hidden = false;
    sound.whoosh();
    reset();
  };

  const stop = () => {
    if (!playing) return;
    playing = false;
    clearInterval(timer);
    field.setGame(false);
    root.classList.remove('is-playing');
    lenis?.start();
    if (hud) hud.hidden = true;
    if (saved) field.setShape(saved.name, saved.opts);
    hooks.onStop();
  };

  let typed = '';
  let konami = 0;
  const onKey = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (playing) {
      if (e.key === 'Escape') { e.preventDefault(); stop(); return; }
      if (over && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); reset(); return; }
      const d = DIRS[e.key] ?? DIRS[e.key.toLowerCase()];
      if (d) {
        e.preventDefault();
        const cur = queued ?? dir;
        if (d[0] !== -cur[0] || d[1] !== -cur[1]) queued = d;
      }
      if (e.key === ' ') e.preventDefault();
      return;
    }
    konami = e.key === KONAMI[konami] ? konami + 1 : e.key === KONAMI[0] ? 1 : 0;
    typed = (typed + e.key.toLowerCase()).slice(-5);
    if (konami === KONAMI.length || typed === 'snake') {
      konami = 0;
      typed = '';
      start();
    }
  };

  // Touch: swipe to steer.
  let tx = 0;
  let ty = 0;
  const onTouchStart = (e: TouchEvent) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; };
  const onTouchEnd = (e: TouchEvent) => {
    if (!playing) return;
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) { if (over) reset(); return; }
    const d: [number, number] = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)];
    const cur = queued ?? dir;
    if (d[0] !== -cur[0] || d[1] !== -cur[1]) queued = d;
  };

  const buttons = Array.from(root.querySelectorAll<HTMLElement>('[data-snake]'));
  const onButton = (e: Event) => {
    const action = (e.currentTarget as HTMLElement).dataset.snake;
    if (action === 'start') start(); else stop();
  };
  buttons.forEach((b) => b.addEventListener('click', onButton));
  window.addEventListener('keydown', onKey);
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd);

  return () => {
    stop();
    buttons.forEach((b) => b.removeEventListener('click', onButton));
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchend', onTouchEnd);
  };
}
