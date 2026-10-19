// Interface sounds, all synthesized with the Web Audio API: no audio file.
// Off by default; the toggle in the top bar turns them on (and remembers it).

export interface Sound {
  enabled: () => boolean;
  toggle: () => boolean;
  tick: () => void;
  pop: () => void;
  whoosh: () => void;
  scramble: () => void;
  eat: () => void;
  over: () => void;
  destroy: () => void;
}

const KEY = 'sound';

export function createSound(): Sound {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let on = false;
  let lastTick = 0;

  const boot = () => {
    if (ctx) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  };

  const blip = (freq: number, dur: number, type: OscillatorType, gain: number, glide = 0, delay = 0) => {
    if (!on || !ctx || !master) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * glide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
  };

  const hiss = (dur: number, from: number, to: number, gain: number, delay = 0, type: BiquadFilterType = 'bandpass') => {
    if (!on || !ctx || !master || !noise) return;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = type === 'lowpass' ? 0.5 : 1.4;
    f.frequency.setValueAtTime(from, t);
    f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(master);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.05);
  };

  const setOn = (value: boolean) => {
    on = value;
    if (on) boot();
    if (ctx && master) {
      if (on && ctx.state === 'suspended') ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(on ? 0.9 : 0, ctx.currentTime + 0.4);
    }
    try {
      localStorage.setItem(KEY, on ? 'on' : 'off');
    } catch {
      void 0;
    }
  };

  return {
    enabled: () => on,
    toggle: () => { setOn(!on); if (on) blip(880, 0.12, 'sine', 0.12, 1.5); return on; },
    tick: () => {
      const now = performance.now();
      if (now - lastTick < 45) return;
      lastTick = now;
      blip(1900 + Math.random() * 400, 0.035, 'sine', 0.035);
    },
    pop: () => blip(420, 0.14, 'triangle', 0.16, 2.2),
    whoosh: () => hiss(1.4, 180, 900, 0.05, 0, 'lowpass'),
    scramble: () => {
      for (let i = 0; i < 9; i += 1) blip(1200 + Math.random() * 1600, 0.025, 'square', 0.025, 0, i * 0.07);
    },
    eat: () => {
      [523, 659, 784].forEach((f, i) => blip(f, 0.09, 'square', 0.06, 0, i * 0.06));
    },
    over: () => {
      blip(330, 0.5, 'sawtooth', 0.08, 0.25);
      hiss(0.6, 1600, 120, 0.1, 0.05);
    },
    destroy: () => { ctx?.close(); ctx = null; },
  };
}
