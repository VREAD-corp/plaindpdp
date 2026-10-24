import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import { QUESTIONS } from '../../site/src/check-data.mjs';
import { SITE } from '../../site/src/config.mjs';
import { MIXED, MIXED_PCT, MIXED_GAPS, GEN, GEN_MUST, GEN_MUST_NOT } from '../fixtures.mjs';

const LIVE = !!process.env.BASE_URL;
const SHOTS = process.env.SHOTS_DIR;
const key = (() => { try { return /PLAINDPDP_ADMIN_KEY=(\S+)/.exec(fs.readFileSync(os.homedir() + '/.config/octave/plaindpdp.env', 'utf8'))[1]; } catch { return process.env.PLAINDPDP_ADMIN_KEY; } })();
const api = async (body) => (await fetch(SITE.endpoint, { method: 'POST', body: JSON.stringify(body), redirect: 'follow' })).json();
// Our runs never count as visits: octave_notrack=1 sends their hits to the excluded counters (reason notrack).
test.beforeEach(async ({ page }) => { await page.addInitScript(() => localStorage.setItem('octave_notrack', '1')); });
const shot = async (page, name, info) => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}-${info.project.name}.png`, fullPage: true }); };

test('no horizontal scroll and no console errors on every page', async ({ page }, info) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  for (const p of ['', 'check.html', 'notice.html', 'kit.html', 'privacy.html', 'terms.html', 'hi/', 'hi/check.html', 'hi/notice.html', 'hi/kit.html', 'hi/privacy.html']) {
    await page.goto(p + '?p=a&utm_source=e2e-test');
    expect(await page.evaluate(() => document.documentElement.scrollWidth), p).toBeLessThanOrEqual(page.viewportSize().width);
    await expect(page.locator('footer .disclaimer')).toContainText(p.startsWith('hi') ? 'कानूनी सलाह नहीं' : 'not a law firm');
    await expect(page.locator('footer')).toContainText('988 741 773');
    // paused since 2026-10-24: one robots tag (noindex) and the banner on every page
    expect(await page.locator('meta[name=robots]').evaluateAll((m) => m.map((x) => x.content)), p).toEqual(['noindex']);
    await expect(page.locator('body > .jal-pause')).toContainText('This service is paused.');
    await expect(page.locator('.jal-pause a')).toHaveAttribute('href', 'https://jalonel.com/en/');
  }
  await shot(page, 'home-hi', info);
  expect(errors).toEqual([]);
});

test('readiness check: mixed answers score 48 with gaps in priority order', async ({ page }, info) => {
  await page.goto('check.html?p=a&utm_source=e2e-test');
  // unanswered submit shows an error
  await page.getByRole('button', { name: 'See my score and gap list' }).click();
  await expect(page.locator('#check-error')).toBeVisible();
  for (const q of QUESTIONS) await page.locator(`#q-${q.id} input[value="${MIXED[q.id]}"]`).check();
  await page.getByRole('button', { name: 'See my score and gap list' }).click();
  await expect(page.locator('#result')).toBeVisible();
  await expect(page.locator('#score-num')).toHaveText(String(MIXED_PCT));
  await expect(page.locator('#score-band')).toHaveClass(/band-partial/);
  expect(await page.locator('#gaps li').evaluateAll((els) => els.map((e) => e.dataset.id))).toEqual(MIXED_GAPS);
  await expect(page.locator('#gaps li').first()).toContainText('s.5, r.3');
  await shot(page, 'check-result', info);
  // all yes = 100
  await page.locator('#reset').click();
  for (const q of QUESTIONS) await page.locator(`#q-${q.id} input[value="yes"]`).check();
  await page.getByRole('button', { name: 'See my score and gap list' }).click();
  await expect(page.locator('#score-num')).toHaveText('100');
  await expect(page.locator('#nogaps')).toBeVisible();
});

test('notice generator: English output, .txt download and Hindi output', async ({ page }, info) => {
  await page.goto('notice.html?p=a&utm_source=e2e-test');
  await page.getByRole('button', { name: 'Generate my notice' }).click();
  await expect(page.locator('#gen-error')).toContainText('business name');
  await page.fill('#bizName', GEN.bizName);
  await page.fill('#contactName', GEN.contactName);
  await page.fill('#contactRole', GEN.contactRole);
  await page.fill('#contactEmail', GEN.contactEmail);
  await page.fill('#contactPhone', GEN.contactPhone);
  await page.fill('#grievanceDays', String(GEN.grievanceDays));
  for (const box of await page.locator('input[name=data], input[name=purposes]').all()) await box.uncheck();
  for (const v of GEN.data) await page.locator(`input[name=data][value=${v}]`).check();
  for (const v of GEN.purposes) await page.locator(`input[name=purposes][value=${v}]`).check();
  for (const v of GEN.share) await page.locator(`input[name=share][value=${v}]`).check();
  await page.locator('input[name=crossBorder]').check();
  await page.locator('input[name=children]').check();
  await page.fill('#consentManager', GEN.consentManager);
  await page.fill('#date', GEN.date);
  await page.getByRole('button', { name: 'Generate my notice' }).click();
  const out = page.locator('#notice-out');
  await expect(out).toBeVisible();
  const text = (await out.innerText()).replace(/\s+/g, ' ');
  for (const s of GEN_MUST) expect(text, s).toContain(s);
  for (const s of GEN_MUST_NOT) expect(text, s).not.toContain(s);
  await shot(page, 'notice-en', info);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('#dl-txt').click()]);
  const txt = fs.readFileSync(await dl.path(), 'utf8');
  expect(dl.suggestedFilename()).toBe('privacy-notice-en.txt');
  expect(txt).toContain('Privacy notice: Kaveri Coaching Centre');
  expect(txt).toContain('- Education records (classes, marks, attendance)');
  await page.locator('input[name=outLang][value=hi]').check();
  await page.getByRole('button', { name: 'Generate my notice' }).click();
  await expect(out).toContainText('गोपनीयता सूचना: Kaveri Coaching Centre');
  await expect(out).toContainText('धारा 13(3)');
  await expect(page.locator('#out-hi-note')).toBeVisible();
});

test('price variant (cro.js experiment price): ?p=b forces ₹2,999, kept for the tab, prices match the variant', async ({ page }) => {
  const cro = [];
  page.on('request', (r) => { if (r.method() === 'POST' && /"kind":"cro"/.test(r.postData() || '')) cro.push(r.url()); });
  await page.goto('kit.html?p=b&utm_source=e2e-test&octave_notrack=1');
  expect(await page.locator('script[src$="assets/cro.js"]').getAttribute('data-site')).toBe('plaindpdp');
  expect(await page.evaluate(() => [window.octaveCro.v('price'), document.documentElement.dataset.xpPrice, window.pdVariant, sessionStorage.getItem('oxp_price')])).toEqual(['b', 'b', 'b', 'b']);
  await expect(page.locator('[data-pro-label]')).toHaveText('Pro, ₹2,999 per month');
  await expect(page.locator('thead [data-price-pro]')).toHaveText('₹2,999');
  expect(await page.locator('input[data-pro]').getAttribute('value')).toBe('pro-2999');
  // same tab, no parameter: the variant stays b
  await page.locator('nav a').first().click();
  await expect(page).toHaveURL(/index\.html$/);
  expect(await page.evaluate(() => window.octaveCro.v('price'))).toBe('b');
  await expect(page.locator('#kit [data-price-pro]')).toHaveText('₹2,999');
  // ?p=a forces a (and its prices)
  await page.goto('kit.html?p=a&octave_notrack=1');
  expect(await page.evaluate(() => window.octaveCro.v('price'))).toBe('a');
  await expect(page.locator('[data-pro-label]')).toHaveText('Pro, ₹999 per month');
  expect(await page.locator('input[data-pro]').getAttribute('value')).toBe('pro-999');
  await page.goto('privacy.html?octave_notrack=1');
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  expect(cro, 'tests never send CRO batches').toEqual([]);
});

test('a new tab without ?p draws a or b and the prices follow it', async ({ browser }) => {
  for (let i = 0; i < 2; i++) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(new URL('kit.html?octave_notrack=1', test.info().project.use.baseURL).href);
    const v = await page.evaluate(() => window.octaveCro.v('price'));
    expect(v).toMatch(/^[ab]$/);
    expect(new URL(page.url()).searchParams.get('p')).toBeNull();
    await expect(page.locator('[data-pro-label]')).toHaveText(v === 'b' ? 'Pro, ₹2,999 per month' : 'Pro, ₹999 per month');
    await ctx.close();
  }
});

test('early-access form is closed while paused: fields disabled, nothing is sent', async ({ page }) => {
  const posts = [];
  page.on('request', (r) => { if (r.method() === 'POST' && /"action":"preorder"/.test(r.postData() || '')) posts.push(r.url()); });
  for (const p of ['kit.html', 'hi/kit.html']) {
    await page.goto(p + '?p=a&octave_notrack=1');
    await expect(page.locator('#preorder .paused-note')).toHaveText('New requests are closed while the service is paused.');
    await expect(page.locator('#po-email')).toBeDisabled();
    await expect(page.locator('#preorder button[type=submit]')).toBeDisabled();
    await page.locator('#preorder').evaluate((f) => f.requestSubmit());
    await expect(page.locator('#po-ok')).toBeHidden();
  }
  // the rights / withdrawal form stays open
  await page.goto('privacy.html?octave_notrack=1');
  await expect(page.locator('#r-email')).toBeEnabled();
  expect(posts).toEqual([]);
});

test('anonymous tracking: our test hits reach the excluded counters, not the visits', async ({ page }) => {
  test.skip(!LIVE || !key, 'live only');
  const sum = (s, re) => Object.entries(s.excluded || {}).filter(([k]) => re.test(k)).reduce((a, [, n]) => a + n, 0);
  const views = (s) => sum(s, / view( [ab])?\|notrack$/);
  const completes = (s) => sum(s, / check_complete( [ab])?\|notrack$/);
  const counted = (s) => Object.entries(s.stats).filter(([k]) => / check_complete( |$)/.test(k)).reduce((a, [, n]) => a + n, 0);
  const before = await api({ action: 'summary', key, includeTests: true });
  await page.goto('check.html?p=a&utm_source=e2e-test&utm_medium=test');
  for (const q of QUESTIONS) await page.locator(`#q-${q.id} input[value="yes"]`).check();
  await page.getByRole('button', { name: 'See my score and gap list' }).click();
  await expect(page.locator('#score-num')).toHaveText('100');
  await expect.poll(async () => { const a = await api({ action: 'summary', key, includeTests: true }); return [views(a) > views(before), completes(a) > completes(before)]; }, { timeout: 90_000, intervals: [3000] }).toEqual([true, true]);
  expect(counted(await api({ action: 'summary', key, includeTests: true })), 'test hits must not count as visits').toBe(counted(before));
});
