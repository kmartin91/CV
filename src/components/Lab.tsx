import { useContent } from '../data/content';
import type { LabItem } from '../data/content';
import { Chars } from './Split';
import Ambilight from './Ambilight';

function Chapter({ item, index }: { item: LabItem; index: number }) {
  const { ui } = useContent();
  const flip = index % 2 === 1;
  return (
    <article
      className={`chapter${flip ? ' is-flip' : ''}`}
      id={item.id}
      aria-labelledby={`${item.id}-name`}
      data-shape={item.shape}
      data-shape-x={flip ? '-2.5' : '2.5'}
      data-shape-y="0.9"
      data-shape-y-mobile="2.2"
      data-shape-scale="0.9"
    >
      <header className="ch-head">
        <p className="ch-meta">
          <span className="ch-num">{item.num}</span>
          <span>{item.kind}</span>
          <span>{item.year}</span>
          <span className={`ch-status${item.live ? ' is-live' : ''}`}><span className="dot"></span>{item.status}</span>
        </p>
        <h3 className="ch-name" id={`${item.id}-name`}><Chars text={item.name} /></h3>
        {item.aka ? <p className="ch-aka">{item.aka}</p> : null}
        <p className="ch-tagline fade-up">{item.tagline}</p>
      </header>

      <div className="ch-shots">
        {item.shots.map((s) => (s.kind === 'ambilight' ? <Ambilight key="ambilight" /> : (
          <figure className={`ch-shot is-${s.kind} tilt`} key={s.src}>
            <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
            <span className="wcard-glare" aria-hidden="true"></span>
          </figure>
        )))}
      </div>

      <div className="ch-body">
        <div className="ch-desc">
          {item.description.map((p) => <p className="fade-up" key={p.slice(0, 30)}>{p}</p>)}
        </div>
        <div className="ch-side">
          <h4 className="label">{ui.highlights}</h4>
          <ul className="ch-highlights">
            {item.highlights.map((h) => <li className="fade-up" key={h.slice(0, 30)}>{h}</li>)}
          </ul>
        </div>
      </div>

      <dl className="ch-facts">
        {item.facts.map((f) => (
          <div className="fade-up" key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>
        ))}
      </dl>

      <footer className="ch-foot">
        <ul className="ch-stack" aria-label={ui.stack}>
          {item.stack.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <div className="ch-links">
          {item.links.map((l, i) => (
            <a className={`btn ${i === 0 ? 'btn-solid' : 'btn-ghost'} magnetic`} href={l.href} target="_blank" rel="noopener" key={l.href} data-cursor={ui.cursor.open}>
              {l.label}
            </a>
          ))}
        </div>
      </footer>
    </article>
  );
}

export default function Lab() {
  const { lab, ui } = useContent();
  return (
    <section className="lab" id="lab" aria-labelledby="lab-title">
      <div className="lab-head" data-shape="orb" data-shape-scale="1.25">
        <p className="label">{ui.lab}</p>
        <h2 className="lab-title" id="lab-title"><Chars text={lab.title} /></h2>
        <p className="lab-intro fade-up">{lab.intro}</p>
      </div>

      <ol className="lab-grid">
        {lab.items.map((item) => (
          <li key={item.id}>
            <a className="tile" href={`#${item.id}`} data-cursor={ui.cursor.explore} data-emblem={item.shape}>
              <span className="tile-top">
                <span className="tile-num">{item.num}</span>
                <span className={`tile-status${item.live ? ' is-live' : ''}`}><span className="dot"></span>{item.status}</span>
              </span>
              <pre className="tile-ascii" aria-hidden="true"></pre>
              <span className="tile-name">{item.name}</span>
              <span className="tile-kind">{item.kind}</span>
            </a>
          </li>
        ))}
      </ol>

      {lab.items.map((item, i) => <Chapter item={item} index={i} key={item.id} />)}
    </section>
  );
}
