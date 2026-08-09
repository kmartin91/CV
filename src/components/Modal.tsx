import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import type { LabItem } from '../data/content';

interface ModalProps {
  item: LabItem | null;
  onClose: () => void;
}

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Modal({ item, onClose }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [current, setCurrent] = useState<LabItem | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (item) {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setCurrent(item);
      setVisible(true);
      return;
    }
    if (!visible) return;
    const panel = panelRef.current;
    const scrim = scrimRef.current;
    const done = () => {
      setVisible(false);
      setCurrent(null);
      lastFocus.current?.focus();
    };
    if (prefersReduced() || !panel || !scrim) { done(); return; }
    gsap.killTweensOf([scrim, panel]);
    const tl = gsap.timeline({ onComplete: done });
    tl.to(panel, { y: 30, scale: 0.97, autoAlpha: 0, duration: 0.35, ease: 'power3.in' }, 0);
    tl.to(scrim, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.05);
    return () => { tl.kill(); };
  }, [item]);

  useEffect(() => {
    if (!current) return;
    const panel = panelRef.current;
    const scrim = scrimRef.current;
    const closeBtn = closeRef.current;
    if (!panel || !scrim || !closeBtn) return;
    const items = panel.querySelectorAll('.m-head, .m-title, .m-desc, .m-stack, .m-foot');
    gsap.set(panel, { autoAlpha: 1 });
    if (prefersReduced()) {
      gsap.set(scrim, { opacity: 1 });
      gsap.set([panel, items], { clearProps: 'transform,opacity' });
      closeBtn.focus();
      return;
    }
    gsap.killTweensOf([scrim, panel, items, closeBtn]);
    const tl = gsap.timeline();
    tl.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0);
    tl.fromTo(
      panel,
      { clipPath: 'inset(0 0 100% 0 round 22px)', y: 40, scale: 0.98 },
      { clipPath: 'inset(0 0 0% 0 round 22px)', y: 0, scale: 1, duration: 0.7, ease: 'power4.out' },
      0.05,
    );
    tl.fromTo(items, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.07 }, 0.28);
    tl.fromTo(closeBtn, { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' }, 0.4);
    tl.add(() => closeBtn.focus());
    return () => { tl.kill(); };
  }, [current]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  const c = current;
  const tech = c?.tech ?? [];

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden={!visible}>
      <div className="modal-scrim" ref={scrimRef} onClick={onClose}></div>
      <div className="modal-panel" ref={panelRef}>
        <button className="modal-close" type="button" aria-label="Close" ref={closeRef} onClick={onClose}>
          <span className="mc-x"></span>
        </button>
        <div className="modal-body">
          <div className="m-head">
            <span className="m-idx">{c?.idx ?? ''}</span>
            <span className="m-tag">{c?.tag ?? ''}</span>
            <span className={`m-state${c?.soon ? ' is-soon' : ''}`}>{c?.state ?? ''}</span>
          </div>
          <h2 className="m-title" id="modal-title">{c?.title ?? ''}</h2>
          <p className="m-desc">{c?.desc ?? ''}</p>
          <div className="m-stack">
            <span className="m-stack-label">Stack</span>
            <div className="m-chips">
              {tech.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
          <div className="m-foot">
            {c?.link ? (
              <a className="m-cta" href={c.link} target="_blank" rel="noopener">{c.linkLabel || 'Open'}</a>
            ) : null}
            {c?.soon ? (
              <span className="m-soon"><span className="dot"></span>In the works, coming soon</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
