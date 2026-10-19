import gsap from 'gsap';

// The particle field behind the whole page: one WebGL canvas, a few thousand
// points that morph from one shape to the next as sections scroll into view.
// three.js is imported lazily so the server bundle and first paint stay light.

export interface ShapeOptions {
  x?: number;
  y?: number;
  scale?: number;
}

type Three = typeof import('three');

// Something drawn on top of the field, in the same canvas and frame.
export interface Layer {
  render: (renderer: import('three').WebGLRenderer, time: number) => void;
  dispose?: () => void;
}

export interface Field {
  three: Three;
  addShape: (name: string, data: Float32Array) => void;
  setShape: (name: string, opts?: ShapeOptions) => void;
  getShape: () => { name: string; opts: ShapeOptions };
  setTargets: (data: Float32Array, duration?: number) => void;
  setDark: (dark: boolean) => void;
  setAscii: (on: boolean) => void;
  setGame: (on: boolean) => void;
  setPointer: (x: number, y: number) => void;
  palette: () => Uint8Array;
  view: () => { w: number; h: number };
  count: number;
  attach: (layer: Layer) => () => void;
  kick: (velocity: number) => void;
  burst: () => void;
  destroy: () => void;
}

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uNoise;
uniform float uScatter;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uMouse;
uniform float uMouseForce;
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec4 aRand;
varying float vMix;
varying float vAlpha;
${NOISE}
void main(){
  float t = clamp((uProgress - aRand.x * 0.4) / 0.6, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 p = mix(aFrom, aTo, t);
  float mid = sin(t * 3.14159265);
  float time = uTime * 0.18 + aRand.w * 6.2831;
  vec3 q = p * 0.55 + vec3(0.0, 0.0, uTime * 0.12);
  vec3 n = vec3(snoise(q + aRand.w), snoise(q + 19.7), snoise(q + 43.1));
  p += n * (uNoise + mid * uScatter);
  p += vec3(sin(time), cos(time * 1.3), sin(time * 0.7)) * 0.012;
  vec2 d = p.xy - uMouse.xy;
  float dist = length(d);
  float push = smoothstep(1.15, 0.0, dist) * uMouseForce;
  p.xy += normalize(d + 0.0001) * push * 0.55;
  p.z += push * 0.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.55 + aRand.z) * uPixelRatio * (9.0 / -mv.z);
  vMix = aRand.y;
  vAlpha = 0.55 + 0.45 * aRand.z + push * 0.5;
}`;

const FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uOpacity;
varying float vMix;
varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.1, r);
  vec3 col = vMix < 0.72 ? uColorA : (vMix < 0.93 ? uColorB : uColorC);
  gl_FragColor = vec4(col, a * vAlpha * uOpacity);
}`;

// ASCII pass: the field is drawn off-screen, then every cell of the screen
// becomes the glyph whose density matches how many particles fell in it.
const POST_VERTEX = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const POST_FRAGMENT = /* glsl */ `
uniform sampler2D tScene;
uniform sampler2D tGlyphs;
uniform vec2 uRes;
uniform float uCell;
uniform float uMix;
uniform float uCount;
uniform float uTime;
varying vec2 vUv;
void main(){
  vec4 d = texture2D(tScene, vUv);
  vec4 direct = d.a > 0.0001 ? vec4(d.rgb / d.a, d.a) : vec4(0.0);
  vec2 px = vUv * uRes;
  vec2 cell = floor(px / uCell);
  vec4 acc = vec4(0.0);
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      acc += texture2D(tScene, (cell * uCell + (vec2(float(i), float(j)) + 0.5) * uCell / 3.0) / uRes);
    }
  }
  acc /= 9.0;
  float cover = 1.0 - exp(-acc.a * 5.0);
  float flick = fract(sin(dot(cell, vec2(12.9898, 78.233)) + floor(uTime * 7.0)) * 43758.5453);
  float idx = floor(clamp(cover + (flick - 0.5) * 0.1, 0.0, 1.0) * (uCount - 1.0) + 0.5);
  vec2 local = fract(px / uCell);
  float glyph = texture2D(tGlyphs, vec2((idx + local.x) / uCount, local.y)).a;
  vec3 col = acc.a > 0.0001 ? min(acc.rgb / acc.a * 1.25, vec3(1.0)) : vec3(0.0);
  vec4 ascii = vec4(col, glyph * step(0.025, cover));
  gl_FragColor = mix(direct, ascii, uMix);
}`;

const GLYPHS = ' .:-=+*#%@';

const LIGHT = { a: '#2433ff', b: '#0d0e14', c: '#ff4d1a', opacity: 0.92 };
const DARK = { a: '#6f7dff', b: '#e9ecff', c: '#ff6a3d', opacity: 1 };

export async function createField(canvas: HTMLCanvasElement, count: number, reduced: boolean): Promise<Field> {
  const THREE = await import('three');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const from = new Float32Array(count * 3);
  const to = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);
  for (let i = 0; i < count; i += 1) {
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const r = 6 + Math.random() * 6;
    const s = Math.sqrt(1 - u * u);
    from[i * 3] = r * s * Math.cos(th);
    from[i * 3 + 1] = r * s * Math.sin(th);
    from[i * 3 + 2] = r * u;
    rand[i * 4] = Math.random();
    rand[i * 4 + 1] = Math.random();
    rand[i * 4 + 2] = Math.random() * Math.random();
    rand[i * 4 + 3] = Math.random();
  }
  to.set(from);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(to, 3));
  const aFrom = new THREE.BufferAttribute(from, 3);
  const aTo = new THREE.BufferAttribute(to, 3);
  geometry.setAttribute('aFrom', aFrom);
  geometry.setAttribute('aTo', aTo);
  geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 4));

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 1 },
    uNoise: { value: 0.06 },
    uScatter: { value: 0.9 },
    uSize: { value: 2.1 },
    uPixelRatio: { value: dpr },
    uMouse: { value: new THREE.Vector3(99, 99, 0) },
    uMouseForce: { value: 0 },
    uColorA: { value: new THREE.Color(LIGHT.a) },
    uColorB: { value: new THREE.Color(LIGHT.b) },
    uColorC: { value: new THREE.Color(LIGHT.c) },
    uOpacity: { value: LIGHT.opacity },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  const target = new THREE.WebGLRenderTarget(1, 1);
  const atlasCanvas = document.createElement('canvas');
  atlasCanvas.width = GLYPHS.length * 64;
  atlasCanvas.height = 64;
  const atlas = new THREE.CanvasTexture(atlasCanvas);
  const drawAtlas = () => {
    const ctx = atlasCanvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, atlasCanvas.width, atlasCanvas.height);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 50px "JetBrains Mono", ui-monospace, monospace';
    [...GLYPHS].forEach((g, i) => ctx.fillText(g, i * 64 + 32, 34));
    atlas.needsUpdate = true;
  };
  drawAtlas();
  document.fonts?.ready.then(drawAtlas);

  const post = {
    tScene: { value: target.texture },
    tGlyphs: { value: atlas },
    uRes: { value: new THREE.Vector2(1, 1) },
    uCell: { value: 12 * dpr },
    uMix: { value: 0 },
    uCount: { value: GLYPHS.length },
    uTime: { value: 0 },
  };
  const postMaterial = new THREE.ShaderMaterial({
    uniforms: post,
    vertexShader: POST_VERTEX,
    fragmentShader: POST_FRAGMENT,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const postScene = new THREE.Scene();
  const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
  postQuad.frustumCulled = false;
  postScene.add(postQuad);
  const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const shapes = new Map<string, Float32Array>();
  let current = '';
  let pending: { name: string; opts?: ShapeOptions } | null = null;
  const place = { x: 0, y: 0, scale: 1 };
  const pointer = new THREE.Vector2(0, 0);
  const mouseWorld = new THREE.Vector3();
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  let pointerActive = false;
  let velocity = 0;
  let spin = 0;

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    target.setSize(Math.round(w * dpr), Math.round(h * dpr));
    post.uRes.value.set(Math.round(w * dpr), Math.round(h * dpr));
  };
  resize();
  window.addEventListener('resize', resize);

  const snapshot = () => {
    // Freeze where every particle is right now, so a new morph starts from there.
    const p = uniforms.uProgress.value;
    for (let i = 0; i < count; i += 1) {
      let t = Math.min(Math.max((p - rand[i * 4] * 0.4) / 0.6, 0), 1);
      t = t * t * (3 - 2 * t);
      const k = i * 3;
      from[k] += (to[k] - from[k]) * t;
      from[k + 1] += (to[k + 1] - from[k + 1]) * t;
      from[k + 2] += (to[k + 2] - from[k + 2]) * t;
    }
  };

  const setShape = (name: string, opts?: ShapeOptions) => {
    const target = shapes.get(name);
    if (!target) { pending = { name, opts }; return; }
    pending = null;
    const x = opts?.x ?? 0;
    const y = opts?.y ?? 0;
    const scale = opts?.scale ?? 1;
    gsap.to(place, { x, y, scale, duration: reduced ? 0 : 1.6, ease: 'power3.inOut', overwrite: true });
    if (name === current) return;
    current = name;
    snapshot();
    to.set(target);
    aFrom.needsUpdate = true;
    aTo.needsUpdate = true;
    gsap.killTweensOf(uniforms.uProgress);
    if (reduced) { uniforms.uProgress.value = 1; return; }
    uniforms.uProgress.value = 0;
    gsap.to(uniforms.uProgress, { value: 1, duration: 2.2, ease: 'power2.inOut' });
  };

  const addShape = (name: string, data: Float32Array) => {
    shapes.set(name, data);
    if (pending && pending.name === name) setShape(name, pending.opts);
  };

  const getShape = () => ({ name: current, opts: { x: place.x, y: place.y, scale: place.scale } });

  // Raw targets for a quick move (the Snake game redraws the field every tick).
  const setTargets = (data: Float32Array, duration = 0.12) => {
    current = '__targets';
    snapshot();
    to.set(data);
    aFrom.needsUpdate = true;
    aTo.needsUpdate = true;
    gsap.killTweensOf(uniforms.uProgress);
    uniforms.uProgress.value = 0;
    gsap.to(uniforms.uProgress, { value: 1, duration, ease: 'none' });
  };

  const palette = () => {
    const out = new Uint8Array(count);
    for (let i = 0; i < count; i += 1) {
      const m = rand[i * 4 + 1];
      out[i] = m < 0.72 ? 0 : m < 0.93 ? 1 : 2;
    }
    return out;
  };

  const view = () => {
    const h = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    return { w: h * camera.aspect, h };
  };

  // Game mode: no sway, no noise, no mouse, the field sits flat in the middle.
  let game = false;
  const setGame = (on: boolean) => {
    game = on;
    gsap.to(place, { x: 0, y: 0, scale: 1, duration: on ? 0.8 : 0, overwrite: true });
    gsap.to(uniforms.uNoise, { value: on ? 0 : 0.06, duration: 0.6 });
    uniforms.uMouseForce.value = 0;
  };

  const layers = new Set<Layer>();
  const attach = (layer: Layer) => {
    layers.add(layer);
    return () => { layers.delete(layer); layer.dispose?.(); };
  };

  let ascii = false;
  const setAscii = (on: boolean) => {
    if (on === ascii) return;
    ascii = on;
    const dur = reduced ? 0 : 1.1;
    gsap.to(post.uMix, { value: on ? 1 : 0, duration: dur, ease: 'power2.inOut' });
    gsap.to(uniforms.uSize, { value: on ? 3.6 : 2.6, duration: dur, overwrite: true });
  };

  const setDark = (dark: boolean) => {
    const pal = dark ? DARK : LIGHT;
    const dur = reduced ? 0 : 0.9;
    (['a', 'b', 'c'] as const).forEach((key) => {
      const u = key === 'a' ? uniforms.uColorA : key === 'b' ? uniforms.uColorB : uniforms.uColorC;
      const c = new THREE.Color(pal[key]);
      gsap.to(u.value, { r: c.r, g: c.g, b: c.b, duration: dur, ease: 'power2.out' });
    });
    gsap.to(uniforms.uOpacity, { value: pal.opacity, duration: dur });
    if (!ascii) gsap.to(uniforms.uSize, { value: dark ? 2.6 : 2.1, duration: dur, overwrite: true });
    material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.needsUpdate = true;
  };

  const setPointer = (x: number, y: number) => {
    pointer.set(x, y);
    pointerActive = true;
  };

  const kick = (v: number) => {
    velocity = Math.max(velocity, Math.min(Math.abs(v), 60));
  };

  const burst = () => {
    if (reduced) return;
    gsap.fromTo(uniforms.uNoise, { value: 1.4 }, { value: 0.06, duration: 1.6, ease: 'expo.out' });
  };

  const timer = new THREE.Timer();
  let raf = 0;
  let visible = true;
  const onVisibility = () => {
    visible = document.visibilityState === 'visible';
    if (visible && !raf) raf = requestAnimationFrame(frame);
  };
  document.addEventListener('visibilitychange', onVisibility);

  const inv = new THREE.Matrix4();
  function frame(now?: number) {
    raf = 0;
    if (!visible) return;
    timer.update(now);
    const dt = Math.min(timer.getDelta(), 0.05);
    const time = reduced ? 0 : timer.getElapsed();
    uniforms.uTime.value = time;

    velocity *= 0.9;
    const turb = Math.min(velocity / 40, 1);
    if (!reduced) {
      uniforms.uScatter.value = game ? 0.15 : 0.9 + turb * 0.8;
      spin += dt * (0.08 + turb * 0.9);
    }

    const still = reduced || game;
    group.position.set(place.x, place.y, 0);
    group.scale.setScalar(place.scale);
    group.rotation.y = still ? 0 : Math.sin(spin) * 0.42 + pointer.x * 0.18;
    group.rotation.x = still ? 0 : Math.cos(spin * 0.7) * 0.08 - pointer.y * 0.12;
    group.updateMatrixWorld();

    if (pointerActive && !still) {
      ray.setFromCamera(pointer, camera);
      if (ray.ray.intersectPlane(plane, mouseWorld)) {
        inv.copy(group.matrixWorld).invert();
        mouseWorld.applyMatrix4(inv);
        uniforms.uMouse.value.lerp(mouseWorld, 0.2);
      }
      uniforms.uMouseForce.value += (1 - uniforms.uMouseForce.value) * 0.08;
    }

    if (post.uMix.value > 0.001) {
      post.uTime.value = time;
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCamera);
    } else {
      renderer.render(scene, camera);
    }
    if (layers.size) {
      renderer.autoClear = false;
      layers.forEach((layer) => layer.render(renderer, time));
      renderer.autoClear = true;
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  const destroy = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibility);
    layers.forEach((layer) => layer.dispose?.());
    layers.clear();
    geometry.dispose();
    material.dispose();
    target.dispose();
    atlas.dispose();
    postMaterial.dispose();
    postQuad.geometry.dispose();
    renderer.dispose();
  };

  return {
    three: THREE, count,
    addShape, setShape, getShape, setTargets, setDark, setAscii, setGame, setPointer,
    palette, view, attach, kick, burst, destroy,
  };
}
