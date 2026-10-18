// CRO framework: the vendored portable checks (cro.check.mjs on site/assets/cro.js, cro-gas.check.mjs on gas/src/Cro.js),
// the experiment config, the page tags and the backend routing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const read = (p) => fs.readFileSync(here(p), 'utf8');

test('cro.js passes the portable check', () => { execFileSync(process.execPath, [here('./cro.check.mjs'), here('../../site/assets/cro.js')], { stdio: 'pipe' }); });
test('Cro.js passes the portable check', () => { execFileSync(process.execPath, [here('./cro-gas.check.mjs'), here('../../gas/src/Cro.js')], { stdio: 'pipe' }); });

test('OCTAVE_XP: price a/b per tab, forced by ?p, same as the backend whitelist', () => {
  const ctx = { window: {} };
  vm.runInNewContext(read('../../site/assets/xp.js'), ctx);
  assert.deepEqual(JSON.parse(JSON.stringify(ctx.window.OCTAVE_XP)), [{ id: 'price', variants: ['a', 'b'], mode: 'tab', param: 'p' }]);
  assert.match(read('../../gas/src/Code.js'), /var CRO_EXPERIMENTS_ = \{ price: \['a', 'b'\] \};/);
});

test('every page loads xp.js then cro.js before the scripts that read the variant', async () => {
  const { PAGES, layout } = await import('../../site/src/pages.mjs');
  const { SITE } = await import('../../site/src/config.mjs');
  for (const [file, lang, page, fn, alt] of PAGES) {
    const { title, desc, body } = fn();
    const html = layout({ lang, path: file, title, desc, body, alt, page });
    const order = ['assets/xp.js', 'assets/cro.js', 'assets/app.js', 'assets/mesure.js'].map((s) => html.indexOf(s));
    assert.ok(order.every((i, k) => i > 0 && (k === 0 || i > order[k - 1])), file + ' script order');
    assert.ok(html.includes(`data-site="plaindpdp" data-api="${SITE.endpoint}" data-hosts="dpdp.jalonel.com"`), file);
    assert.ok(!/<script src="[^"]*cro\.js"[^>]*type="module"/.test(html), file);
  }
});

function backend(overrides = {}) {
  const calls = [];
  const ctx = {
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (s) => ({ body: JSON.parse(s), setMimeType() { return this; } }) },
    console, Date, JSON, Math, String, Number, Object, Array, RegExp, Error,
  };
  vm.runInNewContext(read('../../gas/src/Code.js') + '\n' + read('../../gas/src/Cro.js'), ctx);
  ctx.croTrack_ = (r) => { calls.push(['croTrack_', r]); return { ok: true, cro: 1 }; };
  ctx.croAction_ = (r) => { calls.push(['croAction_', r]); return { ok: true }; };
  ctx.croInit_ = (r) => { calls.push(['croInit_', r]); return { ok: true, set: true }; };
  ctx.track_ = (r) => { calls.push(['track_', r]); return { ok: true }; };
  Object.assign(ctx, overrides);
  return { ctx, calls, post: (q, body) => ctx.doPost({ parameter: q, postData: { contents: JSON.stringify(body) } }).body, get: (q) => ctx.doGet({ parameter: q }).body };
}

test('backend routes cro batches before the counter validation, cro and cro_init (POST only)', () => {
  const b = backend();
  assert.deepEqual(b.post({ action: 'track' }, { action: 'track', kind: 'cro', v: 2, site: 'plaindpdp', page: '/plaindpdp/', e: [['pv', '', '']] }), { ok: true, cro: 1 });
  assert.equal(b.calls[0][0], 'croTrack_');
  b.post({ action: 'track' }, { action: 'track', site: 'plaindpdp', event: 'view', v: 2 });
  assert.equal(b.calls[1][0], 'track_');
  b.get({ action: 'cro', key: 'x' });
  assert.equal(b.calls[2][0], 'croAction_');
  assert.deepEqual(b.get({ action: 'cro_init', key: 'x' }), { ok: false, error: 'post_only' });
  assert.deepEqual(b.post({}, { action: 'cro_init', key: 'x' }), { ok: true, set: true });
  assert.equal(b.calls.length, 4);
});

test('backend CRO settings: India time zone, Stats page names, real cro module validates a plaindpdp batch', () => {
  const { ctx } = backend();
  assert.equal(ctx.croTz_(), 'Asia/Kolkata');
  assert.equal(ctx.croPageOf_('plaindpdp', '/plaindpdp/check.html'), '/check');
  assert.equal(ctx.croPageOf_('plaindpdp', '/plaindpdp/hi/index.html'), '/hi/');
  const v = ctx.croValidate_({ site: 'plaindpdp', v: 2, page: '/plaindpdp/kit.html', device: 'mobile',
    e: [['pv', '', ''], ['xp', 'price', 'b.n'], ['xp', 'price', 'b.preorder'], ['xp', 'price', 'b.check'], ['xp', 'price', 'c.n'], ['xp', 'other', 'a.n']] });
  assert.deepEqual(JSON.parse(JSON.stringify(v.exp)), [['price', 'b', 'n'], ['price', 'b', 'preorder'], ['price', 'b', 'check']]);
  assert.equal(v.dropped, 2);
  assert.equal(ctx.croValidate_({ site: 'nope', v: 2, page: '/', e: [['pv', '', '']] }), null);
});
