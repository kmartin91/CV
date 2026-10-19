import { renderToString } from 'react-dom/server';
import App from './App';
import { content, langFromPath } from './data/content';
import type { Lang } from './data/content';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The <head> tags that change with the language, plus the hreflang links
// that tie both versions together for search engines.
function head(lang: Lang): string {
  const { meta } = content[lang];
  const other = content[lang === 'en' ? 'fr' : 'en'].meta;
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    `<meta name="keywords" content="${esc(meta.keywords)}">`,
    `<link rel="canonical" href="${meta.url}">`,
    `<link rel="alternate" hreflang="en" href="${content.en.meta.url}">`,
    `<link rel="alternate" hreflang="fr" href="${content.fr.meta.url}">`,
    `<link rel="alternate" hreflang="x-default" href="${content.en.meta.url}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.social)}">`,
    `<meta property="og:url" content="${meta.url}">`,
    `<meta property="og:image:alt" content="${esc(meta.imageAlt)}">`,
    `<meta property="og:locale" content="${meta.locale}">`,
    `<meta property="og:locale:alternate" content="${other.locale}">`,
    `<meta name="twitter:title" content="${esc(meta.title)}">`,
    `<meta name="twitter:description" content="${esc(meta.social)}">`,
  ].join('\n');
}

export function render(url: string): { html: string; head: string; lang: Lang } {
  const lang = langFromPath(url);
  const html = renderToString(<App lang={lang} />);
  return { html, head: head(lang), lang };
}
