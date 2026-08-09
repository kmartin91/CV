import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { criticalCss } from './critical-css.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = await fs.readFile(toAbsolute('dist/client/index.html'), 'utf-8');
const { render } = await import('./dist/server/entry-server.js');

const rendered = await render('/');
const html = template
  .replace('<!--critical-css-->', criticalCss)
  .replace('<!--app-html-->', rendered.html ?? '');

await fs.writeFile(toAbsolute('dist/client/index.html'), html);
console.log('pre-rendered: dist/client/index.html');
