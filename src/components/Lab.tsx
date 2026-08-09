import { lab } from '../data/content';
import type { LabItem } from '../data/content';
import SecHead from './SecHead';

interface LabProps {
  onOpen: (item: LabItem) => void;
}

export default function Lab({ onOpen }: LabProps) {
  return (
    <section className="lab wrap" id="lab">
      <SecHead label="The Lab" num="04" />
      <p className="lab-intro reveal-word">{lab.intro}</p>
      <div className="lab-grid">
        {lab.items.map((item) => (
          <button
            key={item.idx}
            className={`lcard reveal-line${item.soon ? ' is-soon' : ''}`}
            type="button"
            onClick={() => onOpen(item)}
          >
            <span className="lcard-ghost" aria-hidden="true">{item.idx}</span>
            <span className="lcard-tag">{item.tag}</span>
            <span className="lcard-state">{item.state}</span>
            <h3>{item.title}</h3>
            <p>{item.teaser}</p>
            <span className="lcard-cta">
              {item.soon ? 'Preview' : 'View'} <span className="a">→</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
