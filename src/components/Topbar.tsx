import type { MouseEvent } from 'react';
import { useContent } from '../data/content';

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
  doc.startViewTransition(apply).ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {
      void 0;
    });
}

export default function Topbar() {
  const { nav, contact, ui } = useContent();
  return (
    <header className="topbar">
      <a className="brand magnetic" href="#top" aria-label={ui.home} data-cursor={ui.cursor.top}>
        <span className="brand-mark">KM</span>
        <span className="brand-status"><span className="dot"></span>{contact.availability}</span>
      </a>
      <nav className="topnav" aria-label={ui.sections}>
        {nav.map((item) => (
          <a key={item.href} href={item.href}><span className="scramble">{item.label}</span></a>
        ))}
      </nav>
      <div className="topbar-end">
        <span className="topclock">Royan <span className="clock">--:--</span></span>
        <a className="lang-switch magnetic" href={ui.switch.href} hrefLang={ui.switch.lang} lang={ui.switch.lang} aria-label={ui.switch.name} data-cursor={ui.cursor.lang}>
          {ui.switch.label}
        </a>
        <button className="sound-toggle magnetic" type="button" aria-pressed="false" aria-label={ui.sound} data-cursor={ui.cursor.sound}>
          <span className="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        </button>
        <button className="theme-toggle magnetic" type="button" aria-label={ui.theme} onClick={toggleTheme}>
          <span className="tt-disc" aria-hidden="true"></span>
        </button>
      </div>
    </header>
  );
}
