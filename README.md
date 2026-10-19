# Kevin Martin — Portfolio

A server-rendered one-page portfolio built with **Vite + React + TypeScript (SSR)**,
hand-written CSS, a **three.js particle field**, GSAP + ScrollTrigger and Lenis.

The page is rendered on the server and **pre-rendered to static HTML at build time**, in
English at `/` and in French at `/fr/`, so search engines and social crawlers receive the
full, populated markup in both languages. React then
hydrates it in the browser, the WebGL field boots and the motion kicks in.

## Getting started

```bash
npm install
npm run dev          # SSR dev server + HMR  → http://localhost:5173
npm run typecheck    # tsc --noEmit (also runs as part of build)
```

## Build & serve

```bash
npm run build        # client bundle + SSR bundle + pre-rendered dist/client/index.html
npm run preview      # serve the static build (any static host works too)
npm run serve        # production Node SSR server (per-request rendering)
```

`npm run build` produces:

```
dist/
├── client/          Static, SEO-ready site (index.html, fr/index.html + hashed assets)
└── server/          SSR bundle and raw template used by server.js / prerender.js
```

Deploy `dist/client/` to any static host (Netlify, Vercel, GitHub Pages…), **or** run
`npm run serve` for true per-request SSR on a Node host.

## Structure

```
portfolio/
├── index.html              SSR template — shared <head>, stylesheet, <div id="root"><!--app-html--></div>
├── server.js               Express + Vite SSR server (dev & prod)
├── prerender.js            Bakes / and /fr/ into static pages at build time
├── critical-css.js         Pre-paint CSS (the loader covers the page instantly)
├── vite.config.js          Vite + @vitejs/plugin-react
├── tsconfig.json           Strict TypeScript config
├── public/
│   ├── favicon.svg         Monogram favicon
│   ├── site.webmanifest    PWA manifest
│   └── assets/             Portrait, client work shots, assets/lab/ for the Lab projects
└── src/
    ├── main.tsx            Client entry — hydrateRoot
    ├── entry-server.tsx    Server entry — renderToString + the per-language <head>
    ├── App.tsx             Root component, boots the motion
    ├── style.css           All styles
    ├── data/content.en.json  ← All site content, in English
    ├── data/content.fr.json  ← and in French (same structure)
    ├── data/content.ts     Types, the language context and useContent()
    ├── lib/field.ts        The WebGL particle field (three.js, loaded lazily, custom shaders)
    ├── lib/shapes.ts       Target shapes for the field: sphere, galaxy, grid, the portrait,
    │                       and one emblem per Lab project, sampled from 2D canvas drawings
    ├── lib/motion.ts       Client-only orchestration: Lenis, loader, scroll scenes, cursor,
    │                       magnetic buttons, tilt, text scramble, marquees — returns a cleanup fn
    └── components/         Loader, Topbar, Hero, Marquee, About, Work, Lab, Ambilight,
                            Contact, Footer, Split (all .tsx)
```

## How the particle field works

One fixed `<canvas>` sits behind the page. Every section carries a `data-shape` attribute
(plus optional `data-shape-x`, `-y`, `-y-mobile`, `-scale`); when it reaches the middle of
the screen, the field morphs to that shape. Shapes are computed once on the CPU, in idle
time, by sampling 2D canvas drawings (or the portrait PNG) into 16,000 points (7,000 on
small or weak devices). The morph, the noise, the mouse repulsion and the scroll-speed
turbulence all run in the vertex shader.

The Lab section switches the whole page to dark, and the field to an **ASCII pass**: the
particles are drawn off-screen, then a fullscreen shader replaces every 12 px cell with the
glyph (` .:-=+*#%@`) whose density matches the particles under it, coloured by them.

The Lab tiles draw the same emblems as text (`asciiArt()` in `lib/shapes.ts`): the glyphs
shimmer while the grid is on screen, a hover scrambles the tile in a diagonal wave and
morphs the field behind into that emblem.

In the hero, the letters of the name react to the cursor on the variable weight axis of
Schibsted Grotesk (900 → 420).

## Screenshots in WebGL (`lib/images.ts`)

On wide screens with a mouse, the Lab and Work screenshots are redrawn in the field's canvas,
on planes that follow their DOM boxes every frame: liquid ripple and zoom under the cursor,
RGB split and a bend driven by the scroll speed, rounded corners in the shader. Each
`<img>` stays in the page for layout, alt text and fallback; it turns invisible (`.is-gl`)
only once its texture is on the GPU.

## Sound (`lib/sound.ts`)

Synthesized with the Web Audio API, no audio file: ticks on hover, pops on click, a soft
breath when entering the Lab, clicks on the ASCII scramble and the Snake bleeps. Nothing
plays on scroll. Off by default; the top bar toggle remembers the choice.

## Easter egg (`lib/snake.ts`)

Type `snake` (or the Konami code), or use the footer link: the particle field becomes a
Snake game drawn in ASCII. The border, the snake and the apple are the same particles
(the orange ones play the apple). Arrows / WASD / ZQSD or swipes; Esc to leave. The best
score is kept in `localStorage`.

## Editing content

Everything the site displays is data in [`src/data/content.en.json`](src/data/content.en.json)
and its French twin [`content.fr.json`](src/data/content.fr.json), interface labels included
(`ui`) and the translated `<head>` (`meta`). Both files keep the same structure.
A Lab project picks its emblem with `shape` (`otter`, `onigiri`, `snake`, `pulse`, `sun`,
`ambilight`); new emblems are drawing functions in `lib/shapes.ts`, registered in
`buildShapes()` in `lib/motion.ts`. The JSON shape is type-checked against `content.ts`
at build time. The FR/EN button in the top bar links one version to the other; `hreflang`
tags tie them together for search engines.

## Notes

- three.js is a separate lazy chunk: the first paint and the SSR bundle don't load it.
- `prefers-reduced-motion` disables smooth scrolling, the pin, the scrubbed scenes and
  the field's motion; the content stays fully readable.
- Without WebGL the canvas is removed and the rest of the site works as usual.
