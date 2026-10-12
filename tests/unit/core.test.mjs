import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { QUESTIONS } from '../../site/src/check-data.mjs';
import { MIXED, MIXED_PCT, MIXED_BAND, MIXED_GAPS, GEN, GEN_MUST, GEN_MUST_NOT } from '../fixtures.mjs';
const PD = createRequire(import.meta.url)('../../site/assets/core.js');
const items = (ans) => QUESTIONS.map((q) => ({ id: q.id, w: q.w, v: ans[q.id] }));

test('15 questions, total weight 33, each with EN and HI text and a reference', () => {
  assert.equal(QUESTIONS.length, 15);
  assert.equal(QUESTIONS.reduce((s, q) => s + q.w, 0), 33);
  for (const q of QUESTIONS) for (const l of ['en', 'hi']) { assert.ok(q[l].q && q[l].gap && q[l].help, q.id + l); assert.match(q.ref, /^(s|r)\./); }
});
test('all yes = 100, all no = 0, all unsure = 0', () => {
  for (const [v, pct] of [['yes', 100], ['no', 0], ['unsure', 0]]) {
    const r = PD.score(items(Object.fromEntries(QUESTIONS.map((q) => [q.id, v]))));
    assert.equal(r.pct, pct); assert.equal(r.max, 33);
  }
});
test('mixed answers: 14.5/30 = 48, partial, gaps in priority order', () => {
  const r = PD.score(items(MIXED));
  assert.equal(r.score, 14.5); assert.equal(r.max, 30); assert.equal(r.pct, MIXED_PCT); assert.equal(r.band, MIXED_BAND);
  assert.deepEqual(r.gaps.map((g) => g.id), MIXED_GAPS);
});
test('all partly = 50; bands at 40 and 75', () => {
  assert.equal(PD.score(items(Object.fromEntries(QUESTIONS.map((q) => [q.id, 'partly'])))).pct, 50);
  assert.equal(PD.band(39), 'low'); assert.equal(PD.band(40), 'partial'); assert.equal(PD.band(74), 'partial'); assert.equal(PD.band(75), 'good');
});
test('generator: English notice has the required items and nothing unselected', () => {
  const t = PD.toText(PD.buildNotice({ ...GEN, lang: 'en' }));
  for (const s of GEN_MUST) assert.ok(t.includes(s), 'missing: ' + s);
  for (const s of GEN_MUST_NOT) assert.ok(!t.includes(s), 'unexpected: ' + s);
});
test('generator: defaults (no CM, no children, no sharing, 90 days max)', () => {
  const t = PD.toText(PD.buildNotice({ lang: 'en', bizName: 'A', contactEmail: 'a@b.in', data: ['name'], purposes: ['deliver'] }));
  assert.ok(t.includes('We do not work with a Consent Manager yet'));
  assert.ok(t.includes('Our services are not meant for anyone under 18'));
  assert.ok(t.includes('We do not share your personal data'));
  assert.ok(t.includes('within 90 days'));
});
test('generator: Hindi notice uses Hindi labels', () => {
  const t = PD.toText(PD.buildNotice({ ...GEN, lang: 'hi' }));
  for (const s of ['गोपनीयता सूचना: Kaveri Coaching Centre', 'शिक्षा संबंधी रिकॉर्ड', 'धारा 11', 'धारा 13(3)', 'ExampleCM', '21 दिनों']) assert.ok(t.includes(s), s);
});
test('generator: validation and HTML escaping', () => {
  assert.deepEqual(PD.missing({}), ['bizName', 'contactEmail', 'data', 'purposes']);
  assert.deepEqual(PD.missing({ bizName: 'x', contactEmail: 'bad', data: ['name'], purposes: ['deliver'] }), ['contactEmail']);
  const h = PD.toHtml(PD.buildNotice({ lang: 'en', bizName: '<script>x</script>', contactEmail: 'a@b.in', data: ['name'], purposes: ['deliver'] }));
  assert.ok(!h.includes('<script>')); assert.ok(h.includes('&lt;script&gt;'));
});
