import type { CSSProperties } from 'react';
import { projects } from '../data/content';
import SecHead from './SecHead';

export default function Projects() {
  return (
    <section className="projects wrap" id="work">
      <SecHead label="Selected Work" num="03" />
      <div className="list">
        {projects.map((p) => (
          <a
            key={p.num}
            className="pcard reveal-line"
            href={p.href}
            target="_blank"
            rel="noopener"
            style={{ '--img': p.img } as CSSProperties}
          >
            <span className="p-num">{p.num}</span>
            <div className="p-main">
              <h3>{p.title}</h3>
              <div className="p-meta">
                <span>{p.meta[0]}</span>
                <span>{p.meta[1]}</span>
              </div>
            </div>
            <span className="p-arrow">↗</span>
            <div className="p-thumb">
              {p.shot ? (
                <img src={p.shot} alt="" loading="lazy" decoding="async" />
              ) : (
                <span className="ph">{p.thumb}</span>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
