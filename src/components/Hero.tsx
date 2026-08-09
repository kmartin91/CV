import { hero } from '../data/content';

export default function Hero() {
  const words = [...hero.rotator, hero.rotator[0]];

  return (
    <section className="hero" id="top">
      <div className="haze" aria-hidden="true"></div>
      <div className="grain" aria-hidden="true"></div>
      <div className="wrap">
        <div className="avatar" title="That's me">
          <canvas className="avatar-ascii" aria-hidden="true"></canvas>
          <img
            className="avatar-photo"
            src="/assets/kevin.png"
            alt="Portrait of Kevin Martin"
            loading="eager"
            decoding="async"
            data-preload="/assets/kevin.png"
          />
          <span className="avatar-ring" aria-hidden="true"></span>
        </div>
        <p className="label kicker">{hero.kicker}</p>
        <h1>
          <span className="line"><span className="reveal reveal-line">I'm Kevin Martin,</span></span>
          <span className="line l2">
            <span className="rotator" aria-label={hero.rotator[0]}>
              <span className="rtrack">
                {words.map((word, i) => (
                  <span className="word" key={`${word}-${i}`}>{word}</span>
                ))}
              </span>
            </span>
            <span className="fixed reveal-line">developer</span>
          </span>
        </h1>
        <p className="sub reveal-line">{hero.sub}</p>
      </div>
      <div className="scrollcue"><div className="track"></div><span>Scroll</span></div>
    </section>
  );
}
