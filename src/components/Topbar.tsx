import type { MouseEvent } from 'react';
import { nav } from '../data/content';

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

function toggleTheme(e: MouseEvent<HTMLButtonElement>) {
  const el = document.documentElement;
  const next = el.dataset.theme === 'dark' ? 'light' : 'dark';
  const apply = () => {
    el.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      void 0;
    }
    window.dispatchEvent(new Event('kma:theme'));
  };
  const doc = document as ViewTransitionDocument;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!doc.startViewTransition || reduced) {
    apply();
    return;
  }
  const r = e.currentTarget.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const vt = doc.startViewTransition(apply);
  vt.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {
      void 0;
    });
}

export default function Topbar() {
  return (
    <header className="topbar">
      <a className="brand" href="#top">
        <span className="brand-full">Kevin <b>Martin</b></span>
        <span className="brand-short" aria-hidden="true">K<b>M</b>.</span>
      </a>
      <div className="topbar-end">
        <nav>
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="magnetic">{item.label}</a>
          ))}
        </nav>
        <button className="theme-toggle" type="button" aria-label="Toggle color theme" onClick={toggleTheme}>
          <svg className="tt-moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.4 14.2a8.6 8.6 0 0 1-10.6-10.6 8.6 8.6 0 1 0 10.6 10.6Z" />
          </svg>
          <svg className="tt-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
            <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
