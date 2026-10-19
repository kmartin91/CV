import { useContent } from '../data/content';

export default function Marquee() {
  const { stack, ui } = useContent();
  return (
    <section className="stack" id="stack" data-shape="galaxy" data-shape-scale="1.1">
      <h2 className="visually-hidden">{ui.stack}</h2>
      <ul className="visually-hidden">
        {stack.flat().map((t) => <li key={t}>{t}</li>)}
      </ul>
      {stack.map((row, r) => (
        <div className={`marquee marquee-${r}`} aria-hidden="true" key={r}>
          <div className="marquee-track">
            {[...row, ...row].map((t, i) => (
              <span className={`mq-item${i % 2 ? ' is-outline' : ''}`} key={`${t}-${i}`}>
                {t}<span className="mq-star">✳</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
