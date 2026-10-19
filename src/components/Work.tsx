import { useContent } from '../data/content';

export default function Work() {
  const { work, ui } = useContent();
  return (
    <section className="work" id="work" data-shape="grid" data-shape-y="-1.1" data-shape-scale="1">
      <div className="work-track">
        <div className="work-intro">
          <p className="label">{ui.work}</p>
          <h2 className="work-title"><span className="reveal-wrap"><span className="reveal">{work.title}</span></span></h2>
          <p className="work-lede">{work.intro}</p>
          <p className="work-hint label" aria-hidden="true">{ui.workHint}</p>
        </div>
        {work.items.map((w, i) => (
          <a className="wcard" href={w.href} target="_blank" rel="noopener" key={w.client} data-cursor={ui.cursor.visit}>
            <span className="wcard-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="wcard-shot tilt">
              <img src={w.shot} alt={`${w.client}, ${w.title}`} loading="lazy" decoding="async" width="960" height="720" />
              <span className="wcard-glare" aria-hidden="true"></span>
            </span>
            <span className="wcard-meta">
              <span className="wcard-client">{w.client}</span>
              <span className="wcard-years">{w.years}</span>
            </span>
            <span className="wcard-title">{w.title}</span>
            <span className="wcard-summary">{w.summary}</span>
            <span className="wcard-stack">{w.stack.join(' · ')}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
