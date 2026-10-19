import type { Field } from './field';

// The project screenshots, redrawn in the field's canvas on planes that follow
// their DOM boxes: a liquid ripple under the cursor, an RGB split and a bend
// driven by the scroll speed. The <img> stays in the page for layout,
// accessibility and as the fallback; it only turns invisible once its texture
// is on the GPU.

const VERTEX = /* glsl */ `
uniform float uVel;
uniform float uHover;
varying vec2 vUv;
void main(){
  vUv = uv;
  vec3 p = position;
  p.y += sin(uv.x * 3.14159265) * uVel * 0.07;
  p.x += sin(uv.y * 3.14159265) * uVel * 0.015;
  p.xy *= 1.0 + uHover * 0.025;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uTex;
uniform vec2 uSize;
uniform vec2 uImg;
uniform vec2 uMouse;
uniform float uHover;
uniform float uVel;
uniform float uTime;
uniform float uRadius;
uniform float uShift;
varying vec2 vUv;
float roundBox(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void main(){
  float pa = uSize.x / uSize.y;
  float ia = uImg.x / uImg.y;
  vec2 s = pa > ia ? vec2(1.0, ia / pa) : vec2(pa / ia, 1.0);
  vec2 uv = (vUv - 0.5) * s * (1.0 - 0.07 * uHover) + 0.5;
  uv.x += uShift;
  vec2 dm = vUv - uMouse;
  float d = length(dm);
  float wave = sin(d * 36.0 - uTime * 5.0) * exp(-d * 4.5) * 0.02 * uHover;
  uv += dm / max(d, 0.001) * wave * s;
  uv.x += sin(vUv.y * 11.0 + uTime * 1.7) * 0.004 * uHover;
  vec2 off = vec2(0.005 * uHover + abs(uVel) * 0.028, uVel * 0.008);
  vec3 col = vec3(
    texture2D(uTex, uv + off).r,
    texture2D(uTex, uv).g,
    texture2D(uTex, uv - off).b
  );
  float edge = roundBox((vUv - 0.5) * uSize, uSize * 0.5, uRadius);
  gl_FragColor = vec4(col, 1.0 - smoothstep(-1.0, 0.5, edge));
}`;

interface Item {
  el: HTMLElement;
  mesh: import('three').Mesh;
  u: Record<string, { value: unknown }>;
  hover: number;
  target: number;
  ready: boolean;
  parallax: boolean;
}

export function imageLayer(field: Field, root: HTMLElement, velocity: () => number): () => void {
  const THREE = field.three;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
  const geometry = new THREE.PlaneGeometry(1, 1, 24, 24);
  const loader = new THREE.TextureLoader();
  const offs: (() => void)[] = [];

  const items: Item[] = Array.from(root.querySelectorAll<HTMLElement>('.ch-shot:not(.amb), .wcard-shot')).map((el) => {
    const u = {
      uTex: { value: null as unknown },
      uSize: { value: new THREE.Vector2(1, 1) },
      uImg: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uVel: { value: 0 },
      uTime: { value: 0 },
      uRadius: { value: parseFloat(getComputedStyle(el).borderTopLeftRadius) || 16 },
      uShift: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms: u, vertexShader: VERTEX, fragmentShader: FRAGMENT,
      transparent: true, depthTest: false, depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false;
    mesh.frustumCulled = false;
    scene.add(mesh);
    const item: Item = { el, mesh, u, hover: 0, target: 0, ready: false, parallax: el.classList.contains('wcard-shot') };

    const enter = () => { item.target = 1; };
    const leave = () => { item.target = 0; };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      (u.uMouse.value as import('three').Vector2).set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    const host = el.closest<HTMLElement>('.wcard') ?? el;
    host.addEventListener('pointerenter', enter);
    host.addEventListener('pointerleave', leave);
    host.addEventListener('pointermove', move);
    offs.push(() => {
      host.removeEventListener('pointerenter', enter);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointermove', move);
    });
    return item;
  });

  // Textures load when their box gets near the screen, like the lazy <img>.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const item = items.find((it) => it.el === entry.target);
      const img = item?.el.querySelector('img');
      if (!item || !img) return;
      loader.load(img.currentSrc || img.src, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        item.u.uTex.value = tex;
        (item.u.uImg.value as import('three').Vector2).set(tex.image.width, tex.image.height);
        item.ready = true;
        item.el.classList.add('is-gl');
      });
    });
  }, { rootMargin: '600px' });
  items.forEach((it) => io.observe(it.el));

  let vel = 0;
  const detach = field.attach({
    render: (renderer, time) => {
      if (root.classList.contains('is-playing')) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      camera.left = -W / 2;
      camera.right = W / 2;
      camera.top = H / 2;
      camera.bottom = -H / 2;
      camera.updateProjectionMatrix();
      vel += (Math.max(-1, Math.min(1, velocity() / 30)) - vel) * 0.12;
      let any = false;
      items.forEach((it) => {
        if (!it.ready) return;
        const r = it.el.getBoundingClientRect();
        const on = r.bottom > -80 && r.top < H + 80 && r.right > -80 && r.left < W + 80;
        it.mesh.visible = on;
        if (!on) return;
        any = true;
        it.hover += (it.target - it.hover) * 0.08;
        it.mesh.position.set(r.left + r.width / 2 - W / 2, H / 2 - (r.top + r.height / 2), 0);
        it.mesh.scale.set(r.width, r.height, 1);
        (it.u.uSize.value as import('three').Vector2).set(r.width, r.height);
        it.u.uHover.value = it.hover;
        it.u.uVel.value = vel;
        it.u.uTime.value = time;
        it.u.uShift.value = it.parallax ? ((r.left + r.width / 2) / W - 0.5) * -0.07 : 0;
      });
      if (any) renderer.render(scene, camera);
    },
    dispose: () => {
      io.disconnect();
      offs.forEach((f) => f());
      items.forEach((it) => {
        (it.mesh.material as import('three').Material).dispose();
        (it.u.uTex.value as import('three').Texture | null)?.dispose();
        it.el.classList.remove('is-gl');
      });
      geometry.dispose();
    },
  });

  return detach;
}
