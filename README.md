# Kevin Martin — Portfolio

A server-rendered one-page portfolio built with **Vite + React + TypeScript (SSR)**,
hand-written modern CSS (OKLCH, container queries, `:has()`, scroll-driven animations,
`@property`) and GSAP + ScrollTrigger.

The page is rendered on the server and **pre-rendered to static HTML at build time**,
so search engines and social crawlers receive the full, populated markup — then React
hydrates it in the browser and the GSAP motion kicks in.

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
├── client/          Static, SEO-ready site (pre-rendered index.html + hashed assets)
└── server/          SSR bundle used by server.js / prerender.js
```

Deploy `dist/client/` to any static host (Netlify, Vercel, GitHub Pages…), **or** run
`npm run serve` for true per-request SSR on a Node host.

## Structure

```
portfolio/
├── index.html              SSR template — SEO <head>, favicon, <div id="root"><!--app-html--></div>
├── server.js               Express + Vite SSR server (dev & prod)
├── prerender.js            Bakes the rendered app into dist/client/index.html at build time
├── critical-css.js         Above-the-fold CSS injected pre-paint (loader covers the page instantly)
├── vite.config.js          Vite + @vitejs/plugin-react
├── tsconfig.json           Strict TypeScript config
├── public/
│   ├── favicon.svg         Monogram favicon (matches the site palette)
│   ├── site.webmanifest    PWA manifest (name, theme color, icons)
│   └── assets/kevin.png    Portrait
└── src/
    ├── main.tsx            Client entry — hydrateRoot
    ├── entry-server.tsx    Server entry — renderToString
    ├── App.tsx             Root component, owns modal state, boots animations
    ├── vite-env.d.ts       Vite client type references
    ├── style.css           All styles
    ├── data/content.json   ← All site content lives here (edit to change any copy/data)
    ├── data/content.ts     Types + typed exports over content.json
    ├── lib/animations.ts   Client-only motion (loader, rotator, ASCII avatar, cursor,
    │                       magnetic buttons, scroll reveals) — returns a cleanup fn
    └── components/         Loader, Topbar, Hero, About, Skills, Projects, Lab,
                            Contact, Footer, Modal, Overlays, SecHead (all .tsx)
```

## Editing content

Everything the site displays — nav, hero, about, skills, projects, the Lab cards and
the contact block — is data in [`src/data/content.json`](src/data/content.json). Edit
that file to change any copy or add/remove items; `content.ts` just types it and the
components render from it. `npm run dev` hot-reloads changes; `npm run build` bakes them
into the static output. The JSON shape is type-checked against `content.ts` at build time.

## SEO & site identity

- Real `<title>`, meta description, canonical URL, Open Graph + Twitter cards and a
  JSON-LD `Person` schema live in `index.html` (present in the pre-rendered output).
- A proper **favicon** (`public/favicon.svg`), web manifest and `theme-color` are wired
  in the `<head>`.
- All section content is server-rendered, so crawlers see the full page without running JS.
- A `<noscript>` fallback reveals the content (and disables the loader) when JS is off.

> Update the domain in `index.html` (`https://www.kevinmartin.dev/`) and the social
> image if you deploy elsewhere.

## Notes

- The loader really preloads page assets (fonts + images) — the counter reflects actual
  progress, with a hard failsafe so it can never block the site.
- `prefers-reduced-motion` disables the heavy animations throughout.
- The ASCII portrait is rendered at runtime on a `<canvas>` from `public/assets/kevin.png`;
  hovering reveals the real photo.
