import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { Field } from './field';
import { createField } from './field';
import { imageLayer } from './images';
import { snakeGame } from './snake';
import { createSound } from './sound';
import type { Sound } from './sound';
import { EMBLEMS, RAMP, ambilight, asciiArt, at, fromDrawing, fromImage, galaxy, grid, onigiri, otter, pulse, snakeCrosshair, sphere, sunCloud } from './shapes';

type Cleanup = () => void;

const qa = <T extends Element = HTMLElement>(root: ParentNode, sel: string): T[] =>
  Array.from(root.querySelectorAll<T>(sel));

const isDark = () => document.documentElement.dataset.theme === 'dark';

// Shapes are computed on the CPU once, in idle time, then handed to the field.
async function buildShapes(field: Field, count: number) {
  const idle = (fn: () => void) =>
    new Promise<void>((resolve) => {
      const run = () => { fn(); resolve(); };
      if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 400 });
      else setTimeout(run, 16);
    });

  field.addShape('orb', sphere(count));
  await idle(() => field.addShape('galaxy', galaxy(count)));
  await idle(() => field.addShape('grid', grid(count)));
  await idle(() => field.addShape('otter', fromDrawing(otter, count, { depth: 0.7 })));
  await idle(() => field.addShape('onigiri', fromDrawing(onigiri, count, { depth: 0.9 })));
  await idle(() => field.addShape('snake', fromDrawing(snakeCrosshair, count, { depth: 0.45 })));
  await idle(() => field.addShape('pulse', fromDrawing(pulse, count, { depth: 0.5 })));
  await idle(() => field.addShape('sun', fromDrawing(sunCloud, count, { depth: 0.6 })));
  await idle(() => field.addShape('ambilight', fromDrawing(ambilight, count, { depth: 0.5 })));
  await document.fonts?.ready;
  await idle(() => field.addShape('at', fromDrawing(at, count, { depth: 0.6 })));
  field.addShape('portrait', await fromImage('/assets/kevin.png', count, { ink: true, relief: 0.9, width: 4.6 }));
}

function runLoader(root: HTMLElement, reduced: boolean, onReveal: () => void): Cleanup {
  const loader = root.querySelector<HTMLElement>('.loader');
  const num = root.querySelector<HTMLElement>('.loader-num');
  if (!loader || !num) { onReveal(); return () => {}; }
  const state = { v: 0 };
  const tl = gsap.timeline({ onComplete: () => loader.classList.add('is-done') });
  if (reduced) {
    tl.set(state, { v: 100, onUpdate: () => { num.textContent = '100'; } });
    tl.to(loader, { autoAlpha: 0, duration: 0.4 }, 0.3);
    tl.call(onReveal, undefined, 0.3);
    return () => tl.kill();
  }
  tl.to(state, {
    v: 100,
    duration: 1.9,
    ease: 'power3.inOut',
    onUpdate: () => { num.textContent = String(Math.round(state.v)).padStart(3, '0'); },
  });
  tl.to(qa(loader, '.loader-word'), { yPercent: -110, duration: 0.7, ease: 'power4.in', stagger: 0.05 }, '-=0.2');
  tl.to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '-=0.25');
  tl.call(onReveal, undefined, '<0.3');
  return () => tl.kill();
}

// The hero waits hidden under the loader and rises while the curtain lifts.
function heroIntro(root: HTMLElement, reduced: boolean): () => void {
  const chars = qa(root, '.hero .char');
  const lines = qa(root, '.hero .hero-line');
  if (reduced) return () => {};
  gsap.set(chars, { yPercent: 120, rotateX: -95, opacity: 0 });
  gsap.set(lines, { y: 40, opacity: 0 });
  return () => {
    gsap.to(chars, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.3, ease: 'expo.out', stagger: 0.045 });
    gsap.to(lines, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.3 });
  };
}

function rotator(root: HTMLElement, reduced: boolean): Cleanup {
  const words = qa(root, '.rot-word');
  if (words.length < 2 || reduced) return () => {};
  let i = 0;
  gsap.set(words, { yPercent: 110, opacity: 0 });
  gsap.set(words[0], { yPercent: 0, opacity: 1 });
  const id = setInterval(() => {
    const cur = words[i];
    i = (i + 1) % words.length;
    gsap.to(cur, { yPercent: -110, opacity: 0, duration: 0.45, ease: 'power2.in' });
    gsap.fromTo(words[i], { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.38 });
  }, 2200);
  return () => clearInterval(id);
}

function clock(root: HTMLElement): Cleanup {
  const el = root.querySelector<HTMLElement>('.clock');
  if (!el) return () => {};
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick();
  const id = setInterval(tick, 15000);
  return () => clearInterval(id);
}

function topbar(root: HTMLElement): Cleanup {
  const bar = root.querySelector<HTMLElement>('.topbar');
  if (!bar) return () => {};
  let last = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    bar.classList.toggle('is-scrolled', y > 24);
    if (Math.abs(y - last) < 8) return;
    bar.classList.toggle('is-hidden', y > last && y > 240);
    last = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

function cursor(root: HTMLElement, field: Field | null, sound: Sound): Cleanup {
  const ring = root.querySelector<HTMLElement>('.cursor');
  const label = root.querySelector<HTMLElement>('.cursor-label');
  if (!ring || !window.matchMedia('(pointer: fine)').matches) return () => {};
  const xTo = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const yTo = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  let last: HTMLElement | null = null;
  const onMove = (e: PointerEvent) => {
    xTo(e.clientX);
    yTo(e.clientY);
    field?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button');
    if (target && target !== last) sound.tick();
    last = target;
    const text = target?.dataset.cursor ?? '';
    ring.classList.toggle('is-hover', Boolean(target));
    ring.classList.toggle('has-label', Boolean(text));
    if (label) label.textContent = text;
  };
  const onDown = () => { ring.classList.add('is-down'); field?.burst(); sound.pop(); };
  const onUp = () => ring.classList.remove('is-down');
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);
  root.classList.add('has-cursor');
  return () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointerup', onUp);
  };
}

function magnetic(root: HTMLElement): Cleanup {
  const items = qa(root, '.magnetic');
  const offs: Cleanup[] = items.map((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  });
  return () => offs.forEach((f) => f());
}

function tilt(root: HTMLElement): Cleanup {
  const items = qa(root, '.tilt');
  const offs: Cleanup[] = items.map((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3' });
    const move = (e: PointerEvent) => {
      if (el.classList.contains('is-gl')) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * 14);
      ry(px * 18);
      el.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
      el.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
    };
    const leave = () => { rx(0); ry(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  });
  return () => offs.forEach((f) => f());
}

function scramble(root: HTMLElement): Cleanup {
  const glyphs = '!<>-_\\/[]{}=+*^?#01';
  const items = qa(root, '.scramble');
  const offs: Cleanup[] = items.map((el) => {
    const original = el.textContent ?? '';
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      let frame = 0;
      const step = () => {
        frame += 1;
        el.textContent = [...original].map((ch, i) => {
          if (ch === ' ' || i < frame / 2) return ch;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        }).join('');
        if (frame / 2 < original.length) raf = requestAnimationFrame(step);
        else el.textContent = original;
      };
      raf = requestAnimationFrame(step);
    };
    const host = el.closest<HTMLElement>('a, button, .scramble-host') ?? el;
    host.addEventListener('pointerenter', run);
    return () => { host.removeEventListener('pointerenter', run); cancelAnimationFrame(raf); el.textContent = original; };
  });
  return () => offs.forEach((f) => f());
}

function marquees(root: HTMLElement, lenis: Lenis | null): Cleanup {
  const rows = qa(root, '.marquee-track');
  const state = rows.map((el, i) => ({ el, x: 0, dir: i % 2 === 0 ? -1 : 1 }));
  const tick = () => {
    const v = lenis ? lenis.velocity : 0;
    state.forEach((s) => {
      const w = s.el.scrollWidth / 2;
      if (!w) return;
      s.x += s.dir * (0.6 + Math.abs(v) * 0.35);
      if (s.x <= -w) s.x += w;
      if (s.x > 0) s.x -= w;
      gsap.set(s.el, { x: s.x, skewX: gsap.utils.clamp(-12, 12, -v * 0.6) * s.dir * -1 });
    });
  };
  gsap.ticker.add(tick);
  return () => gsap.ticker.remove(tick);
}

function scrollScenes(root: HTMLElement, field: Field | null, lenis: Lenis | null, reduced: boolean, sound: Sound): Cleanup {
  const triggers: ScrollTrigger[] = [];
  const mm = gsap.matchMedia();
  const wide = () => window.matchMedia('(min-width: 900px)').matches;

  // Work: horizontal ride on wide screens. Created first: every trigger below
  // the pin needs its spacing to compute its own position.
  if (!reduced) {
    mm.add('(min-width: 900px)', () => {
      const section = root.querySelector<HTMLElement>('.work');
      const track = root.querySelector<HTMLElement>('.work-track');
      if (!section || !track) return;
      const distance = () => track.scrollWidth - window.innerWidth + 64;
      const tween = gsap.to(track, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top top', end: () => `+=${distance()}`,
          pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
      qa(track, '.wcard-shot img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -8 }, {
          xPercent: 8, ease: 'none',
          scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        });
      });
    });
  }

  // Each [data-shape] section morphs the field when it reaches the middle of the screen.
  qa(root, '[data-shape]').forEach((el) => {
    const apply = () => {
      if (!field) return;
      const x = wide() ? Number(el.dataset.shapeX ?? 0) : 0;
      const y = wide() ? Number(el.dataset.shapeY ?? 0) : Number(el.dataset.shapeYMobile ?? 0);
      const scale = (wide() ? 1 : 0.62) * Number(el.dataset.shapeScale ?? 1);
      field.setShape(el.dataset.shape ?? 'orb', { x, y, scale });
    };
    triggers.push(ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onEnter: apply, onEnterBack: apply }));
  });

  // The Lab flips the whole page to ink.
  const labEl = root.querySelector<HTMLElement>('.lab');
  if (labEl) {
    const toggle = (on: boolean) => {
      root.classList.toggle('in-lab', on);
      if (on) {
        sound.whoosh();
        field?.setDark(true);
        field?.setAscii(true);
      } else {
        field?.setAscii(false);
        field?.setDark(isDark());
      }
    };
    triggers.push(ScrollTrigger.create({
      trigger: labEl, start: 'top 60%', end: 'bottom 40%',
      onEnter: () => toggle(true), onEnterBack: () => toggle(true),
      onLeave: () => toggle(false), onLeaveBack: () => toggle(false),
    }));
  }

  const progress = root.querySelector<HTMLElement>('.scroll-progress');
  if (progress) {
    triggers.push(ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => { progress.style.transform = `scaleX(${self.progress})`; },
    }));
  }

  if (reduced) return () => { triggers.forEach((t) => t.kill()); mm.revert(); };

  // Hero: the name spreads and fades as you leave.
  const heroName = root.querySelector('.hero-name');
  if (heroName) {
    gsap.to(qa(root, '.hero-name .split'), {
      xPercent: (i: number) => (i === 0 ? -18 : 18), opacity: 0.08, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // About: words light up one by one.
  qa(root, '.scrub-words').forEach((el) => {
    gsap.fromTo(qa(el, '.w'), { opacity: 0.14 }, {
      opacity: 1, ease: 'none', stagger: 0.04,
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  });

  // Big titles: letters flip up one by one.
  qa(root, '.lab-title, .ch-name').forEach((el) => {
    gsap.fromTo(qa(el, '.char'), { yPercent: 115, rotateX: -80, opacity: 0 }, {
      yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.025,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // Line reveals.
  qa(root, '.reveal').forEach((el) => {
    gsap.fromTo(el, { yPercent: 105 }, {
      yPercent: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
  qa(root, '.fade-up').forEach((el) => {
    gsap.fromTo(el, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
  qa(root, '.clip-in').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(18% 18% 18% 18% round 28px)', scale: 1.15 }, {
      clipPath: 'inset(0% 0% 0% 0% round 18px)', scale: 1, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // Lab chapters: number counter and shot parallax.
  qa(root, '.chapter').forEach((ch) => {
    const shots = qa(ch, '.ch-shot');
    shots.forEach((s, i) => {
      gsap.fromTo(s, { y: 120 + i * 60 }, {
        y: -60 - i * 40, ease: 'none',
        scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });

  // Field reacts to scroll speed.
  if (lenis && field) {
    lenis.on('scroll', ({ velocity }: { velocity: number }) => field.kick(velocity));
  }

  return () => {
    triggers.forEach((t) => t.kill());
    mm.revert();
  };
}

// The Lab tiles: each emblem drawn in ASCII. The glyphs shimmer while the Lab
// is on screen; hovering a tile scrambles it in a diagonal wave and morphs the
// particle field behind into the same emblem.
function asciiTiles(root: HTMLElement, reduced: boolean, getField: () => Field | null, sound: Sound): Cleanup {
  const grid = root.querySelector<HTMLElement>('.lab-grid');
  if (!grid) return () => {};
  const noise = RAMP.slice(3);
  const pick = () => noise[Math.floor(Math.random() * noise.length)];

  const tiles = qa(grid, '.tile').map((tile) => {
    const pre = tile.querySelector<HTMLElement>('.tile-ascii');
    const draw = EMBLEMS[tile.dataset.emblem ?? ''];
    const art = draw ? asciiArt(draw, 18) : '';
    if (pre) pre.textContent = art;
    const chars = [...art];
    const ink = chars.map((ch, i) => (ch !== ' ' && ch !== '\n' ? i : -1)).filter((i) => i >= 0);
    return { tile, pre, chars, ink, current: [...chars], raf: 0, mutated: [] as number[] };
  });

  if (reduced) return () => {};

  let visible = false;
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  io.observe(grid);
  const shimmer = setInterval(() => {
    if (!visible) return;
    tiles.forEach((t) => {
      if (!t.pre || t.raf || !t.ink.length) return;
      t.mutated.forEach((i) => { t.current[i] = t.chars[i]; });
      t.mutated = Array.from({ length: Math.ceil(t.ink.length * 0.04) }, () => t.ink[Math.floor(Math.random() * t.ink.length)]);
      t.mutated.forEach((i) => { t.current[i] = pick(); });
      t.pre.textContent = t.current.join('');
    });
  }, 130);

  const offs = tiles.map((t) => {
    const cols = t.chars.indexOf('\n') + 1 || 1;
    const scramble = () => {
      if (!t.pre) return;
      cancelAnimationFrame(t.raf);
      const start = performance.now();
      const step = (now: number) => {
        const p = (now - start) / 900;
        t.current = t.chars.map((ch, i) => {
          if (ch === '\n') return ch;
          const wave = ((i % cols) / cols + Math.floor(i / cols) / 30) / 1.6;
          if (wave < p) return ch;
          if (ch === ' ') return Math.random() < 0.12 ? pick() : ' ';
          return pick();
        });
        t.pre!.textContent = t.current.join('');
        if (p < 1.05) t.raf = requestAnimationFrame(step);
        else { t.raf = 0; t.current = [...t.chars]; t.pre!.textContent = t.current.join(''); }
      };
      t.raf = requestAnimationFrame(step);
      sound.scramble();
      getField()?.setShape(t.tile.dataset.emblem ?? 'orb', { x: 0, y: 0, scale: 1.25 });
    };
    t.tile.addEventListener('pointerenter', scramble);
    t.tile.addEventListener('focus', scramble);
    return () => {
      t.tile.removeEventListener('pointerenter', scramble);
      t.tile.removeEventListener('focus', scramble);
      cancelAnimationFrame(t.raf);
    };
  });
  const back = () => getField()?.setShape('orb', { x: 0, y: 0, scale: 1.25 });
  grid.addEventListener('pointerleave', back);

  return () => {
    clearInterval(shimmer);
    io.disconnect();
    offs.forEach((f) => f());
    grid.removeEventListener('pointerleave', back);
  };
}

// The name breathes under the cursor: letters near it slim down from 900 to
// 420 on the variable weight axis, then fill back up.
function heroWeight(root: HTMLElement, reduced: boolean): Cleanup {
  const chars = qa(root, '.hero-name .char');
  if (reduced || !chars.length || !window.matchMedia('(pointer: fine)').matches) return () => {};
  const weights = chars.map(() => ({ cur: 900, target: 900 }));
  const onMove = (e: PointerEvent) => {
    const radius = window.innerWidth * 0.22;
    chars.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const k = Math.max(0, 1 - d / radius);
      weights[i].target = 900 - 480 * k * k * (3 - 2 * k);
    });
  };
  const onLeave = () => weights.forEach((w) => { w.target = 900; });
  const tick = () => {
    weights.forEach((w, i) => {
      if (Math.abs(w.target - w.cur) < 0.5) return;
      w.cur += (w.target - w.cur) * 0.12;
      chars[i].style.fontVariationSettings = `'wght' ${w.cur.toFixed(1)}`;
    });
  };
  const hero = root.querySelector<HTMLElement>('.hero');
  window.addEventListener('pointermove', onMove);
  hero?.addEventListener('pointerleave', onLeave);
  gsap.ticker.add(tick);
  return () => {
    window.removeEventListener('pointermove', onMove);
    hero?.removeEventListener('pointerleave', onLeave);
    gsap.ticker.remove(tick);
  };
}

// The sound switch in the top bar. Browsers only allow audio after a gesture,
// so a visitor who left it on gets it back at their first click or key.
function soundToggle(root: HTMLElement, sound: Sound): Cleanup {
  const btn = root.querySelector<HTMLButtonElement>('.sound-toggle');
  if (!btn) return () => {};
  const sync = () => {
    btn.setAttribute('aria-pressed', String(sound.enabled()));
    btn.classList.toggle('is-on', sound.enabled());
  };
  const onClick = () => { sound.toggle(); sync(); };
  btn.addEventListener('click', onClick);
  let wanted = false;
  try { wanted = localStorage.getItem('sound') === 'on'; } catch { wanted = false; }
  const resume = (e: Event) => {
    if (e.target instanceof Node && btn.contains(e.target)) return;
    if (wanted && !sound.enabled()) { sound.toggle(); sync(); }
  };
  window.addEventListener('pointerdown', resume, { once: true });
  window.addEventListener('keydown', resume, { once: true });
  return () => {
    btn.removeEventListener('click', onClick);
    window.removeEventListener('pointerdown', resume);
    window.removeEventListener('keydown', resume);
  };
}

export function initPortfolio(root: HTMLElement): Cleanup {
  gsap.registerPlugin(ScrollTrigger);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cleanups: Cleanup[] = [];
  let field: Field | null = null;
  let destroyed = false;

  const lenis = reduced ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => { gsap.ticker.remove(raf); lenis.destroy(); });
    qa<HTMLAnchorElement>(root, 'a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = root.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { duration: 1.6, offset: 0 });
      });
    });
  }

  const sound = createSound();
  cleanups.push(() => sound.destroy());
  cleanups.push(soundToggle(root, sound));

  const canvas = root.querySelector<HTMLCanvasElement>('.field');
  const small = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
  const count = small ? 7000 : 16000;
  if (canvas) {
    createField(canvas, count, reduced).then((f) => {
      if (destroyed) { f.destroy(); return; }
      field = f;
      f.setDark(isDark());
      cleanups.push(() => f.destroy());
      cleanups.push(cursor(root, f, sound));
      cleanups.push(scrollScenes(root, f, lenis, reduced, sound));
      const fancy = !reduced && window.matchMedia('(min-width: 900px) and (pointer: fine)').matches;
      if (fancy) cleanups.push(imageLayer(f, root, () => lenis?.velocity ?? 0));
      cleanups.push(snakeGame(root, f, lenis, sound, {
        onStart: () => { f.setDark(true); f.setAscii(true); },
        onStop: () => {
          const lab = root.classList.contains('in-lab');
          f.setAscii(lab);
          f.setDark(lab || isDark());
        },
      }));
      buildShapes(f, count).then(() => ScrollTrigger.refresh());
    }).catch(() => {
      canvas.remove();
      cleanups.push(cursor(root, null, sound));
      cleanups.push(scrollScenes(root, null, lenis, reduced, sound));
    });
  }

  const onTheme = () => field?.setDark(isDark() || root.classList.contains('in-lab'));
  window.addEventListener('kma:theme', onTheme);
  cleanups.push(() => window.removeEventListener('kma:theme', onTheme));

  cleanups.push(runLoader(root, reduced, heroIntro(root, reduced)));
  cleanups.push(rotator(root, reduced));
  cleanups.push(clock(root));
  cleanups.push(topbar(root));
  cleanups.push(magnetic(root));
  cleanups.push(tilt(root));
  cleanups.push(scramble(root));
  cleanups.push(marquees(root, lenis));
  cleanups.push(asciiTiles(root, reduced, () => field, sound));
  cleanups.push(heroWeight(root, reduced));

  return () => {
    destroyed = true;
    cleanups.forEach((fn) => fn());
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}
