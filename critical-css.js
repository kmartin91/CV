export const criticalCss = `<style>
html { background: #f7f9fd; }
html[data-theme='dark'] { background: oklch(0.17 0.02 262); }
#root { min-height: 100dvh; }
.loader { position: fixed; inset: 0; z-index: 9000; background: #f7f9fd; display: grid; align-items: center; justify-items: start; padding: clamp(1.25rem, 5vw, 6rem); }
html[data-theme='dark'] .loader { background: oklch(0.17 0.02 262); }
.loader.is-done { display: none !important; }
.loader-inner, .loader-count, .loader-bar { opacity: 0; }
html.is-ready .loader-inner, html.is-ready .loader-count, html.is-ready .loader-bar { opacity: 1; }
</style>
<noscript><style>
.loader { display: none !important; }
.portfolio:has(.loader:not(.is-done)) { overflow: visible !important; block-size: auto !important; }
</style></noscript>`;
