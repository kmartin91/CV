import { useContent } from '../data/content';
import { Words } from './Split';

export default function About() {
  const { about, ui } = useContent();
  return (
    <section className="about" id="about" data-shape="portrait" data-shape-x="-2.6" data-shape-y="0" data-shape-y-mobile="1.2" data-shape-scale="1.05">
      <div className="about-grid">
        <div className="about-photo" aria-hidden="true"></div>
        <div className="about-text">
          <p className="label fade-up">{ui.about}</p>
          <p className="about-lede scrub-words"><Words text={about.lede} /></p>
          {about.body.map((p) => <p className="about-body fade-up" key={p.slice(0, 24)}>{p}</p>)}
          <dl className="about-facts">
            {about.facts.map((f) => (
              <div className="fade-up" key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
