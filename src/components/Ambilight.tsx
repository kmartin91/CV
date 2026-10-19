// cs2-ambilight has no screenshot to show (it lives in your room), so the
// chapter draws it: a match on screen, the C4 pulse spilling onto the wall,
// the explosion flash, then the lights settle back.

import { useContent } from '../data/content';

export default function Ambilight() {
  const { ui } = useContent();
  return (
    <figure className="ch-shot is-wide amb" role="img" aria-label={ui.ambilight}>
      <span className="amb-glow" aria-hidden="true"></span>
      <span className="amb-lamp is-left" aria-hidden="true"></span>
      <span className="amb-lamp is-right" aria-hidden="true"></span>
      <span className="amb-screen" aria-hidden="true">
        <span className="amb-scene"></span>
        <span className="amb-xhair"></span>
        <span className="amb-hud">
          <span>T 4 · 3 CT</span>
          <span className="amb-c4">C4</span>
        </span>
        <span className="amb-msg">The bomb has been planted</span>
      </span>
      <span className="amb-stand" aria-hidden="true"></span>
    </figure>
  );
}
