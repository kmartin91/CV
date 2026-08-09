import { Fragment } from 'react';
import { skills } from '../data/content';
import type { SkillItem } from '../data/content';
import SecHead from './SecHead';

interface RowProps {
  items: SkillItem[];
  variant: 'a' | 'b';
}

function Row({ items, variant }: RowProps) {
  const doubled = [...items, ...items];
  return (
    <div className={`mq-row mq-${variant}`}>
      <div className="mq-track">
        {doubled.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            <span className="mq-item"><i>{item.i}</i>{item.label}</span>
            <span className="mq-sep">/</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section className="skills wrap" id="skills">
      <SecHead label="Stack" num="02" />
      <div className="mq">
        <Row items={skills[0]} variant="a" />
        <Row items={skills[1]} variant="b" />
      </div>
    </section>
  );
}
