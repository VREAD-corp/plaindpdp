// Builds the static site into dist/. No dependencies. Usage: node site/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './src/config.mjs';
import { PAGES, layout } from './src/pages.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'dist');
export const INDEXNOW_KEY = '16a95bc4e36dd4bfccdadbf4e9ef96ba';

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'hi'), { recursive: true });
fs.cpSync(path.join(here, 'assets'), path.join(out, 'assets'), { recursive: true });
fs.cpSync(path.join(here, 'static'), out, { recursive: true });

const urls = [];
for (const [file, lang, page, fn, alt] of PAGES) {
  const { title, desc, body } = fn();
  fs.writeFileSync(path.join(out, file), layout({ lang, path: file, title, desc, body, alt, page }));
  urls.push(SITE.origin + SITE.base + file.replace(/index\.html$/, ''));
}
fs.writeFileSync(path.join(out, '404.html'), layout({ lang: 'en', path: '404.html', page: '404', title: 'Page not found | PlainDPDP', desc: 'Page not found.', body: '<section class="wrap narrow"><h1>Page not found</h1><p>Try the <a href="/plaindpdp/check.html">readiness check</a> or the <a href="/plaindpdp/notice.html">notice generator</a>.</p></section>' }).replace(/href="(assets\/)/g, 'href="/plaindpdp/$1').replace(/src="(assets\/)/g, 'src="/plaindpdp/$1'));
fs.writeFileSync(path.join(out, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map((u) => '  <url><loc>' + u + '</loc><lastmod>' + SITE.updatedIso + '</lastmod></url>').join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + SITE.origin + SITE.base + 'sitemap.xml\n');
fs.writeFileSync(path.join(out, INDEXNOW_KEY + '.txt'), INDEXNOW_KEY);
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log('built', PAGES.length + 1, 'pages into', out);
