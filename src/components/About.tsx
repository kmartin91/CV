import { about } from '../data/content';
import SecHead from './SecHead';

export default function About() {
  return (
    <section className="about wrap" id="about">
      <SecHead label="About" num="01" />
      <div className="grid">
        <p className="lede reveal-word">
          {about.lede.map((part, i) =>
            typeof part === 'string' ? part : <em key={i}>{part.em}</em>,
          )}
        </p>
        <div>
          <div className="body">
            {about.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="stats">
            {about.stats.map((s) => (
              <div key={s.v}>
                <div className="k">{s.k}{s.warm && <span className="warm">{s.warm}</span>}</div>
                <span className="v">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
