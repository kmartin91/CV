import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { criticalCss } from './critical-css.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = await fs.readFile(toAbsolute('dist/client/index.html'), 'utf-8');
// `npm run serve` renders each request from the untouched template.
await fs.writeFile(toAbsolute('dist/server/template.html'), template);
const { render } = await import('./dist/server/entry-server.js');

const pages = { '/': 'dist/client/index.html', '/fr/': 'dist/client/fr/index.html' };
for (const [route, file] of Object.entries(pages)) {
  const rendered = render(route);
  const html = template
    .replace('<html lang="en">', `<html lang="${rendered.lang}">`)
    .replace('<!--app-head-->', rendered.head)
    .replace('<!--critical-css-->', criticalCss)
    .replace('<!--app-html-->', rendered.html);
  await fs.mkdir(path.dirname(toAbsolute(file)), { recursive: true });
  await fs.writeFile(toAbsolute(file), html);
  console.log(`pre-rendered: ${file}`);
}
