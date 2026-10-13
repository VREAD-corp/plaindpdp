/**
 * PlainDPDP web app (READ FRANCE SAS). Standalone Apps Script, separate from octave-checkout.
 *
 * Actions (POST text/plain JSON, or GET with the same fields as query parameters):
 *   track     cookieless, anonymous counters (Stats tab), same pattern as octave-checkout Track.js.
 *             Hits flagged `excluded` by mesure.js (crawler or headless user agent, navigator.webdriver,
 *             our own tests with octave_notrack=1) go to the Exclus tab by reason instead.
 *   preorder  early-access sign-up with DPDP-style consent (Signups tab)
 *   rights    data-principal request: withdraw | erase | access | correct | grievance (Requests tab)
 *   ping      health check
 *   summary   counts for the operator (needs the admin key; never returns personal data)
 *   purge_tests  deletes rows created by automated tests (admin key)
 *
 * The spreadsheet is created on first use and its id kept in Script Properties (SHEET_ID).
 * Only scope: spreadsheets. No e-mail is sent from here.
 */

var APP = {
  name: 'PlainDPDP',
  tz: 'Asia/Kolkata',
  consentVersion: 'ea-2026-10-13',
  adminHash: '30f4b699833760b9819edbac33b4c7655b6f97947af64cde565927a90d76c0f5',
  sites: ['plaindpdp'],
  events: ['view', 'cta_click', 'check_start', 'check_complete', 'notice_generated', 'notice_copy', 'notice_download', 'preorder_view', 'preorder_submit', 'lang_switch'],
  ownHosts: ['outils.vread.fr', 'vread-corp.github.io'],
  offers: { 'pack-4999': 4999, 'pro-999': 999, 'pro-2999': 2999 },
  btypes: ['d2c', 'clinic', 'education', 'saas', 'services', 'agency', 'ca-cs', 'manufacturing', 'ngo', 'other'],
  langs: ['as', 'bn', 'brx', 'doi', 'gu', 'hi', 'kn', 'ks', 'kok', 'mai', 'ml', 'mni', 'mr', 'ne', 'or', 'pa', 'sa', 'sat', 'sd', 'ta', 'te', 'ur'],
  ratePerMin: 200,
  signupRatePerMin: 20,
};

var SIGNUP_HEADER = ['created_at', 'updated_at', 'email', 'name', 'business', 'btype', 'offer', 'price_inr', 'variant', 'langs', 'ui_lang', 'consent_version', 'page', 'status', 'test'];
var REQUEST_HEADER = ['created_at', 'type', 'email_sha256', 'message', 'matched_rows', 'status', 'test'];
var STATS_HEADER = ['date', 'site', 'page', 'event', 'variant', 'source', 'medium', 'campaign', 'count', 'mobile', 'desktop', 'updated_at'];
var STATS_KEYS = 8;
var EXCL_HEADER = ['date', 'site', 'page', 'event', 'variant', 'reason', 'count', 'mobile', 'desktop', 'updated_at'];
var EXCL_KEYS = 6;
// Decided in the browser (the user agent is never sent); 'legacy' = a hit without v, i.e. from a cached pre-filter
// mesure.js, which search-engine renderers keep using.
var EXCL_REASONS = ['webdriver', 'bot', 'notrack', 'legacy'];

function doGet(e) { return handle_(e, (e && e.parameter) || {}); }

function doPost(e) {
  var req = {};
  try { req = JSON.parse((e && e.postData && e.postData.contents) || '{}') || {}; } catch (err) { return json_({ ok: false, error: 'bad_json' }); }
  return handle_(e, req);
}

function handle_(e, req) {
  var action = String((e && e.parameter && e.parameter.action) || req.action || '');
  try {
    switch (action) {
      case 'track': return json_(track_(req));
      case 'preorder': return json_(preorder_(req));
      case 'rights': return json_(rights_(req));
      case 'summary': return json_(summary_(req));
      case 'purge_tests': return json_(purgeTests_(req));
      case 'ping': return json_({ ok: true, app: APP.name, consentVersion: APP.consentVersion });
      default: return json_({ ok: false, error: 'unknown_action' });
    }
  } catch (err) {
    if (err && err.userError) return json_({ ok: false, error: err.code, field: err.field || '' });
    console.error(String(err && err.stack || err));
    return json_({ ok: false, error: 'server_error' });
  }
}

/* ---------- helpers ---------- */

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function userError_(code, field) { var e = new Error(code); e.userError = true; e.code = code; e.field = field; return e; }
function now_() { return new Date(); }
function istDate_(d) { return Utilities.formatDate(d, APP.tz, 'yyyy-MM-dd'); }
/** Text cell: a leading quote stops formula injection (=, +, -, @). */
function txt_(v) { var s = String(v === undefined || v === null ? '' : v); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function cell_(v) { return v instanceof Date ? Utilities.formatDate(v, APP.tz, 'yyyy-MM-dd') : String(v); }
function sha256Hex_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}
function clean_(v, max) { return String(v === undefined || v === null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max); }
function token_(v, max) { return String(v === undefined || v === null ? '' : v).toLowerCase().replace(/[^a-z0-9._ -]+/g, '').replace(/\s+/g, ' ').trim().slice(0, max); }
function isTestEmail_(email) { return /@example\.(com|org)$/.test(email); }
function checkAdmin_(req) { if (!req.key || sha256Hex_(String(req.key)) !== APP.adminHash) throw userError_('forbidden'); }

function ss_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    id = props.getProperty('SHEET_ID');
    if (id) return SpreadsheetApp.openById(id);
    var ss = SpreadsheetApp.create('PlainDPDP: early access and stats (READ FRANCE SAS)');
    ss.setSpreadsheetTimeZone(APP.tz);
    props.setProperty('SHEET_ID', ss.getId());
    return ss;
  } finally { lock.releaseLock(); }
}

function tab_(name, header) {
  var ss = ss_();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold');
    sh.setFrozenRows(1);
    var def = ss.getSheetByName('Sheet1') || ss.getSheetByName('Feuille 1');
    if (def && ss.getSheets().length > 1 && def.getLastRow() === 0) ss.deleteSheet(def);
  }
  return sh;
}

function rateOk_(bucket, max) {
  var cache = CacheService.getScriptCache();
  var k = 'rl:' + bucket + ':' + Math.floor(now_().getTime() / 60000);
  var n = Number(cache.get(k) || 0);
  if (n >= max) return false;
  cache.put(k, String(n + 1), 120);
  return true;
}

function withLock_(fn, waitMs) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(waitMs || 28000)) throw userError_('busy');
  try { return fn(); } finally { lock.releaseLock(); }
}

/* ---------- tracking (cookieless, anonymous daily counters) ---------- */

function trackPage_(page) {
  var p = String(page === undefined || page === null ? '' : page).slice(0, 300).toLowerCase().replace(/[?#].*$/, '');
  if (!/^\/[a-z0-9\/._%~-]*$/.test(p)) return null;
  if (p === '/plaindpdp' || p.indexOf('/plaindpdp/') === 0) p = p.slice('/plaindpdp'.length) || '/';
  p = p.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/{2,}/g, '/');
  return p.slice(0, 80) || '/';
}

function validateTrack_(req) {
  var site = String(req.site || '');
  if (APP.sites.indexOf(site) < 0) throw userError_('bad_request', 'site');
  var event = String(req.event || '');
  if (APP.events.indexOf(event) < 0) throw userError_('bad_request', 'event');
  var page = trackPage_(req.page);
  if (page === null) throw userError_('bad_request', 'page');
  if (req.ts !== undefined && req.ts !== null && req.ts !== '') {
    var ts = Number(req.ts);
    if (!isFinite(ts) || Math.abs(ts - now_().getTime()) > 2 * 86400 * 1000) throw userError_('bad_request', 'ts');
  }
  var ref = String(req.ref_domain || '').toLowerCase().replace(/^www\./, '');
  if (ref && !/^[a-z0-9.-]{1,100}$/.test(ref)) ref = '';
  if (APP.ownHosts.indexOf(ref) >= 0) ref = '(internal)';
  var variant = req.variant === 'a' || req.variant === 'b' ? req.variant : '';
  return {
    date: istDate_(now_()), site: site, page: page, event: event, variant: variant,
    source: token_(req.utm_source, 50) || ref || '(direct)',
    medium: token_(req.utm_medium, 30), campaign: token_(req.utm_campaign, 50),
    device: req.device === 'mobile' || req.device === 'desktop' ? req.device : '',
    reason: !req.v ? 'legacy' : !req.excluded ? '' : EXCL_REASONS.indexOf(String(req.excluded)) >= 0 ? String(req.excluded) : 'bot',
  };
}

function track_(req) {
  var hit = validateTrack_(req);
  if (!rateOk_('track', APP.ratePerMin)) return { ok: false, error: 'rate_limited' };
  // A dropped count is acceptable; a sign-up waiting behind a burst of hits is not: short wait here.
  try { withLock_(function () { incrementStat_(hit); }, 8000); } catch (e) { if (e.userError) return { ok: false, error: 'busy' }; throw e; }
  return { ok: true };
}

function incrementStat_(h) {
  if (h.reason) return incrementRow_('Exclus', EXCL_HEADER, EXCL_KEYS, [h.date, h.site, h.page, h.event, h.variant, h.reason], h.device);
  return incrementRow_('Stats', STATS_HEADER, STATS_KEYS, [h.date, h.site, h.page, h.event, h.variant, h.source, h.medium, h.campaign], h.device);
}

/** Caller holds the lock. Daily counter row `keys` (date first) in tab `name`: incremented, or appended. */
function incrementRow_(name, header, nKeys, keys, device) {
  var sh = tab_(name, header);
  var key = keys.join('\u001f');
  var h = { date: keys[0], device: device };
  var last = sh.getLastRow();
  var rowNum = 0;
  var n = Math.min(Math.max(last - 1, 0), 3000);
  if (n > 0) {
    var vals = sh.getRange(last - n + 1, 1, n, nKeys).getValues();
    for (var i = vals.length - 1; i >= 0; i--) {
      if (cell_(vals[i][0]) < h.date) break;
      if (vals[i].map(cell_).join('\u001f') === key) { rowNum = last - n + 1 + i; break; }
    }
  }
  var stamp = now_().toISOString();
  if (!rowNum) {
    sh.appendRow(keys.map(txt_).concat([1, h.device === 'mobile' ? 1 : 0, h.device === 'desktop' ? 1 : 0, stamp]));
  } else {
    var c = sh.getRange(rowNum, nKeys + 1, 1, 3).getValues()[0];
    sh.getRange(rowNum, nKeys + 1, 1, 4).setValues([[Number(c[0] || 0) + 1, Number(c[1] || 0) + (h.device === 'mobile' ? 1 : 0), Number(c[2] || 0) + (h.device === 'desktop' ? 1 : 0), stamp]]);
  }
}

/* ---------- early-access sign-up ---------- */

function validEmail_(v) {
  var s = clean_(v, 254).toLowerCase();
  if (!/^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,24}$/.test(s) || s.indexOf('..') >= 0) throw userError_('bad_request', 'email');
  return s;
}

function preorder_(req) {
  if (req.website) return { ok: true }; // honeypot: silently ignore bots
  if (req.consent !== true && req.consent !== 'true') throw userError_('consent_required', 'consent');
  if (String(req.consent_version || '') !== APP.consentVersion) throw userError_('consent_outdated', 'consent_version');
  var email = validEmail_(req.email);
  var offer = String(req.offer || '');
  if (!APP.offers.hasOwnProperty(offer)) throw userError_('bad_request', 'offer');
  var btype = String(req.btype || 'other');
  if (APP.btypes.indexOf(btype) < 0) throw userError_('bad_request', 'btype');
  var langs = String(req.langs || '').split(/[,\s]+/).filter(function (l) { return APP.langs.indexOf(l) >= 0; });
  var rec = {
    email: email, name: clean_(req.name, 80), business: clean_(req.business, 120), btype: btype, offer: offer,
    price: APP.offers[offer], variant: req.variant === 'a' || req.variant === 'b' ? req.variant : '',
    langs: langs.slice(0, 22).join(' '), uiLang: req.ui_lang === 'hi' ? 'hi' : 'en', page: trackPage_(req.page) || '',
    test: isTestEmail_(email),
  };
  if (!rateOk_('signup', APP.signupRatePerMin)) throw userError_('rate_limited');
  var updated = withLock_(function () {
    var sh = tab_('Signups', SIGNUP_HEADER);
    var stamp = now_().toISOString();
    var last = sh.getLastRow();
    var row = 0;
    if (last >= 2) {
      var emails = sh.getRange(2, 3, last - 1, 1).getValues();
      for (var i = emails.length - 1; i >= 0; i--) if (String(emails[i][0]) === email) { row = i + 2; break; }
    }
    var values = [txt_(rec.email), txt_(rec.name), txt_(rec.business), rec.btype, rec.offer, rec.price, rec.variant, rec.langs, rec.uiLang, APP.consentVersion, txt_(rec.page), 'active', rec.test ? 'yes' : ''];
    if (row) {
      sh.getRange(row, 2, 1, 1 + values.length).setValues([[stamp].concat(values)]);
      return true;
    }
    sh.appendRow([stamp, stamp].concat(values));
    return false;
  });
  return { ok: true, updated: updated };
}

/* ---------- data-principal requests ---------- */

function rights_(req) {
  if (req.website) return { ok: true };
  var type = String(req.type || '');
  if (['withdraw', 'erase', 'access', 'correct', 'grievance'].indexOf(type) < 0) throw userError_('bad_request', 'type');
  var email = validEmail_(req.email);
  var message = clean_(req.message, 1000);
  if (!rateOk_('rights', 20)) throw userError_('rate_limited');
  return withLock_(function () {
    var matched = 0;
    var sh = tab_('Signups', SIGNUP_HEADER);
    var last = sh.getLastRow();
    if ((type === 'withdraw' || type === 'erase') && last >= 2) {
      var rows = sh.getRange(2, 1, last - 1, SIGNUP_HEADER.length).getValues();
      for (var i = 0; i < rows.length; i++) {
        if (String(rows[i][2]) !== email) continue;
        matched++;
        // Withdrawal and erasure both stop all use: personal fields are blanked at once.
        sh.getRange(i + 2, 2, 1, 4).setValues([[now_().toISOString(), '(erased) ' + sha256Hex_(email).slice(0, 16), '', '']]);
        sh.getRange(i + 2, 14).setValue(type === 'erase' ? 'erased' : 'withdrawn');
      }
    } else if (last >= 2) {
      var em = sh.getRange(2, 3, last - 1, 1).getValues();
      for (var j = 0; j < em.length; j++) if (String(em[j][0]) === email) matched++;
    }
    var status = (type === 'withdraw' || type === 'erase') ? 'done_automatically' : 'to_answer_by_email';
    tab_('Requests', REQUEST_HEADER).appendRow([now_().toISOString(), type, sha256Hex_(email), txt_(message), matched, status, isTestEmail_(email) ? 'yes' : '']);
    return { ok: true, type: type, matched: matched > 0, status: status };
  });
}

/* ---------- operator views (admin key) ---------- */

function summary_(req) {
  checkAdmin_(req);
  var out = { ok: true, sheetUrl: ss_().getUrl(), signups: { real: 0, test: 0, active: 0, byOffer: {}, byVariant: {} }, requests: { real: 0, test: 0, open: 0 }, stats: {}, excluded: {}, views: {} };
  var day = function (d) { return out.views[d] || (out.views[d] = { counted: 0, excluded: 0, raw: 0 }); };
  var su = tab_('Signups', SIGNUP_HEADER);
  if (su.getLastRow() >= 2) su.getRange(2, 1, su.getLastRow() - 1, SIGNUP_HEADER.length).getValues().forEach(function (r) {
    var test = r[14] === 'yes';
    out.signups[test ? 'test' : 'real']++;
    if (!test && r[13] === 'active') {
      out.signups.active++;
      out.signups.byOffer[r[6]] = (out.signups.byOffer[r[6]] || 0) + 1;
      out.signups.byVariant[r[8] || '-'] = (out.signups.byVariant[r[8] || '-'] || 0) + 1;
    }
  });
  var rq = tab_('Requests', REQUEST_HEADER);
  if (rq.getLastRow() >= 2) rq.getRange(2, 1, rq.getLastRow() - 1, REQUEST_HEADER.length).getValues().forEach(function (r) {
    var test = r[6] === 'yes';
    out.requests[test ? 'test' : 'real']++;
    if (!test && r[5] === 'to_answer_by_email') out.requests.open++;
  });
  var st = tab_('Stats', STATS_HEADER);
  if (st.getLastRow() >= 2) st.getRange(2, 1, st.getLastRow() - 1, STATS_HEADER.length).getValues().forEach(function (r) {
    if (!req.includeTests && String(r[5]) === 'e2e-test') return; // automated test traffic (utm_source=e2e-test)
    var k = cell_(r[0]) + ' ' + r[3] + (r[4] ? ' ' + r[4] : '');
    out.stats[k] = (out.stats[k] || 0) + Number(r[8] || 0);
    if (r[3] === 'view') { day(cell_(r[0])).counted += Number(r[8] || 0); day(cell_(r[0])).raw += Number(r[8] || 0); }
  });
  // Hits that are not visits (crawlers, automated browsers, our tests): "date event[ variant]|reason".
  var ex = tab_('Exclus', EXCL_HEADER);
  if (ex.getLastRow() >= 2) ex.getRange(2, 1, ex.getLastRow() - 1, EXCL_HEADER.length).getValues().forEach(function (r) {
    var k = cell_(r[0]) + ' ' + r[3] + (r[4] ? ' ' + r[4] : '') + '|' + r[5];
    out.excluded[k] = (out.excluded[k] || 0) + Number(r[6] || 0);
    if (r[3] === 'view') { day(cell_(r[0])).excluded += Number(r[6] || 0); day(cell_(r[0])).raw += Number(r[6] || 0); }
  });
  if (req.email) out.hasEmail = su.getLastRow() >= 2 && su.getRange(2, 3, su.getLastRow() - 1, 1).getValues().some(function (r) { return String(r[0]) === String(req.email).toLowerCase(); });
  return out;
}

function purgeTests_(req) {
  checkAdmin_(req);
  return withLock_(function () {
    var n = 0;
    [['Signups', SIGNUP_HEADER, 14], ['Requests', REQUEST_HEADER, 6]].forEach(function (t) {
      var sh = tab_(t[0], t[1]);
      for (var r = sh.getLastRow(); r >= 2; r--) if (sh.getRange(r, t[2] + 1).getValue() === 'yes') { sh.deleteRow(r); n++; }
    });
    return { ok: true, deleted: n };
  });
}
