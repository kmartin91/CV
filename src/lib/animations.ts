import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Cleanup = () => void;

interface Hero {
  play: () => void;
  forcePlayed: () => void;
}

const qa = (root: ParentNode, sel: string): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(sel));

function makeHero(root: HTMLElement): Hero {
  let played = false;
  const play = () => {
    if (played) return;
    played = true;
    window.dispatchEvent(new Event('kma:heroplay'));
    const lines = qa(root, '.hero .reveal-line');
    gsap.fromTo(
      lines,
      { yPercent: 118 },
      { yPercent: 0, duration: 1.15, ease: 'power4.out', stagger: 0.1, clearProps: 'transform' },
    );
    setTimeout(() => {
      lines.forEach((el) => {
        const t = getComputedStyle(el).transform;
        if (t && t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)') el.style.transform = 'none';
      });
    }, 1500);
  };
  const forcePlayed = () => {
    played = true;
    window.dispatchEvent(new Event('kma:heroplay'));
  };
  return { play, forcePlayed };
}

function collectAssets(root: HTMLElement): string[] {
  const urls = new Set<string>();
  qa(root, 'img[src], [data-preload]').forEach((el) => {
    const u = el.getAttribute('src') || el.getAttribute('data-preload');
    if (u) urls.add(u);
  });
  return Array.from(urls);
}

function runLoader(root: HTMLElement, reduced: boolean, hero: Hero): Cleanup {
  const loaderEl = root.querySelector<HTMLElement>('.loader');
  const counterEl = root.querySelector<HTMLElement>('.lc-num');
  const barEl = root.querySelector<HTMLElement>('.loader-bar-fill');
  if (!loaderEl) { hero.play(); return () => {}; }

  let cancelled = false;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const later = (fn: () => void, ms: number) => { const id = setTimeout(fn, ms); timers.push(id); return id; };

  if (reduced) {
    if (counterEl) counterEl.textContent = '100';
    if (barEl) barEl.style.width = '100%';
    later(() => {
      if (cancelled) return;
      loaderEl.classList.add('is-done');
      gsap.to(loaderEl, { autoAlpha: 0, duration: 0.5, onComplete: () => { loaderEl.style.display = 'none'; } });
      hero.play();
    }, 900);
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }

  const kicks = loaderEl.querySelectorAll('.loader-kick .lk');
  const words = loaderEl.querySelectorAll('.loader-name .lw');
  gsap.set(kicks, { yPercent: 130, opacity: 0 });
  gsap.set(words, { yPercent: 118 });
  const intro = gsap.timeline();
  intro.to(kicks, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06 }, 0.1);
  intro.to(words, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.11 }, 0.2);

  const assets = collectAssets(root);
  const total = assets.length + 1;
  let loaded = 0;
  const bump = () => { loaded += 1; };
  assets.forEach((srcUrl) => { const im = new Image(); im.onload = bump; im.onerror = bump; im.src = srcUrl; });
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(bump, bump);

  const minTime = 1800;
  const maxTime = 8000;
  const start = performance.now();
  let shown = 0;
  let exited = false;

  const hardDismiss = () => {
    qa(root, '.hero .reveal-line').forEach((el) => { el.style.transform = 'none'; });
    hero.forcePlayed();
    loaderEl.classList.add('is-done');
    loaderEl.style.display = 'none';
  };

  const failsafe = later(() => {
    if (exited || cancelled) return;
    exited = true;
    if (counterEl) counterEl.textContent = '100';
    if (barEl) barEl.style.width = '100%';
    hardDismiss();
  }, maxTime + 600);

  const exitLoader = () => {
    clearTimeout(failsafe);
    const out = gsap.timeline();
    out.to(loaderEl.querySelector('.loader-inner'), { yPercent: -12, opacity: 0, duration: 0.6, ease: 'power3.in' });
    out.to([loaderEl.querySelector('.loader-count'), loaderEl.querySelector('.loader-bar')], { opacity: 0, duration: 0.4, ease: 'power2.in' }, '<');
    out.add(hero.play, '>-0.5');
    out.to(loaderEl, {
      clipPath: 'inset(0 0 100% 0)', duration: 0.95, ease: 'power4.inOut',
      onComplete: () => { loaderEl.classList.add('is-done'); loaderEl.style.display = 'none'; },
    }, '>-0.05');
  };

  const tick = () => {
    if (exited || cancelled) return;
    const elapsed = performance.now() - start;
    const real = loaded / total;
    const timeFloor = Math.min(elapsed / minTime, 1);
    const forced = elapsed >= maxTime;
    const target = (forced ? 1 : Math.min(real, timeFloor)) * 100;
    shown += (target - shown) * 0.14;
    let n = Math.round(shown);
    const ready = forced || (loaded >= total && elapsed >= minTime);
    if (ready && n >= 99) { shown = 100; n = 100; }
    if (counterEl) counterEl.textContent = String(n).padStart(2, '0');
    if (barEl) barEl.style.width = n + '%';
    if (ready && n >= 100) { exited = true; exitLoader(); return; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  return () => { cancelled = true; timers.forEach(clearTimeout); };
}

function initRotator(root: HTMLElement, reduced: boolean): Cleanup {
  const rotator = root.querySelector<HTMLElement>('.rotator');
  const track = root.querySelector<HTMLElement>('.rtrack');
  if (!rotator || !track) return () => {};
  const words = Array.from(track.querySelectorAll<HTMLElement>('.word'));
  if (words.length < 2) return () => {};
  const total = words.length - 1;
  const ease = 'cubic-bezier(0.76, 0, 0.24, 1)';
  let i = 0;
  let rowH = 0;
  const size = () => {
    const maxW = Math.ceil(Math.max.apply(null, words.map((w) => w.getBoundingClientRect().width)));
    rowH = words[0].getBoundingClientRect().height;
    rotator.style.width = maxW + 'px';
    rotator.style.height = rowH + 'px';
    const prev = track.style.transition;
    track.style.transition = 'none';
    track.style.transform = 'translateY(' + (-i * rowH) + 'px)';
    void track.offsetHeight;
    track.style.transition = prev;
  };
  size();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(size).catch(() => {});
  window.addEventListener('resize', size);
  if (reduced) return () => window.removeEventListener('resize', size);

  track.style.transition = 'transform 0.72s ' + ease;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const interval = setInterval(() => {
    i += 1;
    track.style.transform = 'translateY(' + (-i * rowH) + 'px)';
    if (i >= total) {
      const t = setTimeout(() => {
        track.style.transition = 'none';
        i = 0;
        track.style.transform = 'translateY(0px)';
        void track.offsetHeight;
        track.style.transition = 'transform 0.72s ' + ease;
      }, 740);
      timers.add(t);
    }
  }, 2600);
  return () => {
    clearInterval(interval);
    timers.forEach(clearTimeout);
    window.removeEventListener('resize', size);
  };
}

interface Glyph {
  ch: string;
  a: number;
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function initAscii(root: HTMLElement, reduced: boolean): Cleanup {
  const cv = root.querySelector<HTMLCanvasElement>('.avatar-ascii');
  const avatar = root.querySelector<HTMLElement>('.avatar');
  const ctx = cv?.getContext('2d');
  if (!cv || !avatar || !ctx) return () => {};

  const ramp = ' .,:;irsXA253hMHGS#9B&@';
  const cols = 34;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let alive = true;
  let running = false;
  let heroPlayed = reduced;
  let raf = 0;
  let glyphs: Glyph[] = [];
  let cell = 0;
  let inner = 0;
  let ink = '#2a3352';
  let rect: DOMRect | null = null;
  let px = -1e4;
  let py = -1e4;

  const readInk = () => {
    const v = getComputedStyle(root).getPropertyValue('--ink').trim();
    if (v) ink = v;
  };

  const draw = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.font = (cell * 1.32) + 'px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = ink;
    for (const g of glyphs) {
      ctx.globalAlpha = g.a;
      ctx.fillText(g.ch, g.x, g.y);
    }
    ctx.globalAlpha = 1;
  };

  const img = new Image();
  img.decoding = 'async';

  const build = (scattered: boolean) => {
    if (!img.naturalWidth) return;
    const side = avatar.getBoundingClientRect().width || 120;
    cv.width = Math.round(side * 2 * dpr);
    cv.height = Math.round(side * 2 * dpr);
    inner = side * dpr;
    const off = inner / 2;
    cell = inner / cols;
    const rows = Math.round(inner / cell);
    const offc = document.createElement('canvas');
    offc.width = cols;
    offc.height = rows;
    const octx = offc.getContext('2d', { willReadFrequently: true });
    if (!octx) return;
    octx.drawImage(img, 0, 0, cols, rows);
    const data = octx.getImageData(0, 0, cols, rows).data;
    glyphs = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i4 = (y * cols + x) * 4;
        const a = data[i4 + 3];
        if (a < 46) continue;
        const l = (0.299 * data[i4] + 0.587 * data[i4 + 1] + 0.114 * data[i4 + 2]) / 255;
        const ri = Math.min(ramp.length - 1, Math.max(0, Math.round((1 - l) * (ramp.length - 1))));
        const ch = ramp[ri];
        if (ch === ' ') continue;
        const hx = off + (x + 0.5) * cell;
        const hy = off + (y + 0.5) * cell;
        glyphs.push({
          ch,
          a: Math.min(1, a / 255),
          hx,
          hy,
          x: scattered ? hx + (Math.random() - 0.5) * inner * 2.2 : hx,
          y: scattered ? hy + (Math.random() - 0.5) * inner * 2.2 : hy,
          vx: 0,
          vy: 0,
        });
      }
    }
    rect = cv.getBoundingClientRect();
    draw();
  };

  const step = () => {
    if (!alive) return;
    const R = inner * 0.5;
    const R2 = R * R;
    let energy = 0;
    for (const g of glyphs) {
      const dx = g.x - px;
      const dy = g.y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < R2 && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const f = ((R - d) / R) * cell * 0.55;
        g.vx += (dx / d) * f;
        g.vy += (dy / d) * f;
      }
      g.vx += (g.hx - g.x) * 0.07;
      g.vy += (g.hy - g.y) * 0.07;
      g.vx *= 0.84;
      g.vy *= 0.84;
      g.x += g.vx;
      g.y += g.vy;
      energy += Math.abs(g.vx) + Math.abs(g.vy) + Math.abs(g.x - g.hx) + Math.abs(g.y - g.hy);
    }
    draw();
    if (px < -9000 && energy < glyphs.length * 0.08) {
      for (const g of glyphs) { g.x = g.hx; g.y = g.hy; g.vx = 0; g.vy = 0; }
      draw();
      running = false;
      return;
    }
    raf = requestAnimationFrame(step);
  };

  const wake = () => {
    if (reduced || running || !heroPlayed || !glyphs.length) return;
    running = true;
    raf = requestAnimationFrame(step);
  };

  const onMove = (e: PointerEvent) => {
    if (!rect) return;
    const lx = (e.clientX - rect.left) * dpr;
    const ly = (e.clientY - rect.top) * dpr;
    const pad = inner * 0.5;
    if (lx < -pad || ly < -pad || lx > cv.width + pad || ly > cv.height + pad) {
      px = -1e4;
      py = -1e4;
      return;
    }
    px = lx;
    py = ly;
    wake();
  };

  const onLayout = () => { rect = cv.getBoundingClientRect(); };
  const onResize = () => { build(false); };
  const onTheme = () => {
    readInk();
    if (!running) draw();
  };
  const onHero = () => {
    heroPlayed = true;
    wake();
  };

  const heroFallback = setTimeout(onHero, 4200);

  img.onload = () => {
    if (!alive) return;
    readInk();
    build(!reduced);
    wake();
  };
  img.src = '/assets/kevin.png';

  window.addEventListener('kma:heroplay', onHero);
  window.addEventListener('kma:theme', onTheme);
  window.addEventListener('resize', onResize);
  if (!reduced) {
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onLayout, { passive: true });
  }

  return () => {
    alive = false;
    clearTimeout(heroFallback);
    cancelAnimationFrame(raf);
    window.removeEventListener('kma:heroplay', onHero);
    window.removeEventListener('kma:theme', onTheme);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('scroll', onLayout);
  };
}

function initAvatarTap(root: HTMLElement): Cleanup {
  const avatar = root.querySelector<HTMLElement>('.avatar');
  if (!avatar || !window.matchMedia('(hover: none)').matches) return () => {};
  const onTap = () => avatar.classList.toggle('is-flipped');
  avatar.addEventListener('click', onTap);
  return () => avatar.removeEventListener('click', onTap);
}

function initScrollSpy(root: HTMLElement): Cleanup {
  const links = qa(root, '.topbar nav a[href^="#"]');
  const map = new Map<string, HTMLElement>();
  links.forEach((a) => {
    const id = (a.getAttribute('href') || '').slice(1);
    if (id && document.getElementById(id)) map.set(id, a);
  });
  if (!map.size) return () => {};
  const clear = () => links.forEach((a) => a.classList.remove('is-active'));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        clear();
        map.get(en.target.id)?.classList.add('is-active');
      });
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  const hero = document.getElementById('top');
  if (hero) {
    const heroIo = new IntersectionObserver(
      (entries) => { if (entries.some((en) => en.isIntersecting)) clear(); },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    heroIo.observe(hero);
    map.forEach((_, id) => io.observe(document.getElementById(id) as Element));
    return () => { io.disconnect(); heroIo.disconnect(); };
  }
  map.forEach((_, id) => io.observe(document.getElementById(id) as Element));
  return () => io.disconnect();
}

function initCursor(root: HTMLElement, reduced: boolean, coarse: boolean): Cleanup {
  const cursor = root.querySelector<HTMLElement>('.cursor');
  const dot = root.querySelector<HTMLElement>('.cursor-dot');
  if (!cursor || !dot || coarse || reduced) return () => {};
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let tx = cx;
  let ty = cy;
  let raf = 0;
  const onMove = (e: MouseEvent) => {
    tx = e.clientX;
    ty = e.clientY;
    dot.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) translate(-50%, -50%)';
  };
  window.addEventListener('mousemove', onMove);
  const loop = () => {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.transform = 'translate(' + cx + 'px, ' + cy + 'px) translate(-50%, -50%)';
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  const hoverables = qa(root, 'a, button, .pcard, .lcard');
  const bound = hoverables.map((el) => {
    const en = () => el.classList.add('is-hovering');
    const lv = () => el.classList.remove('is-hovering');
    el.addEventListener('mouseenter', en);
    el.addEventListener('mouseleave', lv);
    return { el, en, lv };
  });
  return () => {
    window.removeEventListener('mousemove', onMove);
    cancelAnimationFrame(raf);
    bound.forEach(({ el, en, lv }) => {
      el.removeEventListener('mouseenter', en);
      el.removeEventListener('mouseleave', lv);
    });
  };
}

function initMagnetic(root: HTMLElement, reduced: boolean, coarse: boolean): Cleanup {
  if (reduced || coarse) return () => {};
  const bound: { el: HTMLElement; move: (e: MouseEvent) => void; out: () => void }[] = [];
  qa(root, '.magnetic').forEach((el) => {
    const strength = 0.4;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * strength, y: (e.clientY - (r.top + r.height / 2)) * strength, duration: 0.5, ease: 'power3.out' });
    };
    const out = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', out);
    bound.push({ el, move, out });
  });
  return () => bound.forEach(({ el, move, out }) => {
    el.removeEventListener('mousemove', move);
    el.removeEventListener('mouseleave', out);
    gsap.killTweensOf(el);
  });
}

function initScrollFx(root: HTMLElement, reduced: boolean): void {
  if (reduced) return;
  qa(root, 'section:not(.hero) .reveal-line').forEach((el) => {
    gsap.from(el, {
      yPercent: 118, duration: 1, ease: 'power4.out', immediateRender: false,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
  qa(root, '.reveal-word').forEach((el) => {
    gsap.from(el, {
      yPercent: 40, opacity: 0, duration: 0.9, ease: 'power3.out', immediateRender: false,
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
  qa(root, '.hero .wrap, .about .lede').forEach((el) => {
    gsap.to(el, {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

export function initPortfolio(root: HTMLElement): Cleanup {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);

  const hero = makeHero(root);
  const cleanups: Cleanup[] = [];

  const ctx = gsap.context(() => initScrollFx(root, reduced), root);
  cleanups.push(() => ctx.revert());
  cleanups.push(initRotator(root, reduced));
  cleanups.push(initAscii(root, reduced));
  cleanups.push(initAvatarTap(root));
  cleanups.push(initScrollSpy(root));
  cleanups.push(initCursor(root, reduced, coarse));
  cleanups.push(initMagnetic(root, reduced, coarse));
  cleanups.push(runLoader(root, reduced, hero));

  return () => cleanups.forEach((fn) => fn());
}
