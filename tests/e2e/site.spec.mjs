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

test('price variant b shows ₹2,999 and keeps the variant on links', async ({ page }) => {
  await page.goto('kit.html?p=b&utm_source=e2e-test');
  await expect(page.locator('[data-pro-label]')).toHaveText('Pro, ₹2,999 per month');
  expect(await page.locator('input[data-pro]').getAttribute('value')).toBe('pro-2999');
  expect(await page.locator('nav a').first().getAttribute('href')).toBe('index.html?p=b');
  await page.goto('index.html');
  expect(new URL(page.url()).searchParams.get('p')).toMatch(/^[ab]$/);
});

test('early-access form: consent required, then the row reaches the Sheet, then withdrawal erases it', async ({ page }, info) => {
  test.skip(!LIVE || !key, 'live only (needs the admin key to read the Sheet)');
  const email = `e2e+${info.project.name}-${Date.now()}@example.com`;
  await page.goto('kit.html?p=b&utm_source=e2e-test&utm_medium=test');
  await page.fill('#po-email', email);
  await page.fill('#po-name', 'E2E Test');
  await page.fill('#po-business', 'Test Traders');
  await page.selectOption('#po-btype', 'clinic');
  await page.locator('input[name=offer][value=pro-2999]').check();
  await page.locator('details.langs summary').click();
  await page.locator('input[name=langs][value=ta]').check();
  await page.getByRole('button', { name: /Join early access/ }).click();
  await expect(page.locator('#po-error')).toContainText('consent');
  await page.locator('#po-consent').check();
  await page.getByRole('button', { name: /Join early access/ }).click();
  await expect(page.locator('#po-ok')).toBeVisible({ timeout: 30_000 });
  await shot(page, 'preorder-ok', info);
  let s = await api({ action: 'summary', key, email });
  expect(s.ok).toBe(true);
  expect(s.hasEmail).toBe(true);
  // withdrawal from the privacy page
  await page.goto('privacy.html?p=b');
  await page.fill('#r-email', email);
  await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.locator('#r-ok')).toContainText('removed', { timeout: 30_000 });
  s = await api({ action: 'summary', key, email });
  expect(s.hasEmail).toBe(false);
});

test('anonymous tracking increments the daily counters', async ({ page }) => {
  test.skip(!LIVE || !key, 'live only');
  const views = (s) => Object.entries(s.stats).filter(([k]) => / view( |$)/.test(k)).reduce((a, [, n]) => a + n, 0);
  const completes = (s) => Object.entries(s.stats).filter(([k]) => / check_complete( |$)/.test(k)).reduce((a, [, n]) => a + n, 0);
  const before = await api({ action: 'summary', key });
  await page.goto('check.html?p=a&utm_source=e2e-test&utm_medium=test');
  for (const q of QUESTIONS) await page.locator(`#q-${q.id} input[value="yes"]`).check();
  await page.getByRole('button', { name: 'See my score and gap list' }).click();
  await expect(page.locator('#score-num')).toHaveText('100');
  await expect.poll(async () => { const a = await api({ action: 'summary', key }); return [views(a) > views(before), completes(a) > completes(before)]; }, { timeout: 45_000, intervals: [2000] }).toEqual([true, true]);
});
