import { useContent } from '../data/content';
import { Chars } from './Split';

export default function Hero() {
  const { hero, ui } = useContent();
  return (
    <section className="hero" id="top" data-shape="orb" data-shape-x="2.1" data-shape-y="0.15" data-shape-y-mobile="1">
      <div className="hero-top hero-line">
        <span className="label">{ui.heroLabel}</span>
        <span className="label">{hero.location}</span>
      </div>
      <h1 className="hero-name">
        <Chars text={hero.first} />
        <Chars text={hero.last} className="is-indent" />
      </h1>
      <div className="hero-bottom">
        <p className="hero-role hero-line">
          {hero.role}{' '}
          <span className="rot" aria-label={hero.rotator.join(', ')}>
            {hero.rotator.map((w) => (
              <span className="rot-word" aria-hidden="true" key={w}>{w}</span>
            ))}
          </span>
          <br />
          {hero.roleEnd}
        </p>
        <p className="hero-intro hero-line">{hero.intro}</p>
        <div className="hero-ctas hero-line">
          <a className="btn btn-solid magnetic" href="#lab" data-cursor={ui.cursor.lab}>{ui.ctaLab}</a>
          <a className="btn btn-ghost magnetic" href="#contact" data-cursor={ui.cursor.hi}>{ui.ctaContact}</a>
        </div>
      </div>
    </section>
  );
}
