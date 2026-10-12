/* PlainDPDP page behaviour: price variant, readiness check, notice generator, early-access and rights forms. */
(function () {
  'use strict';
  var EP = 'https://script.google.com/macros/s/AKfycbxtPsxjdWpguJKKJ5nPN0K1NZSUCmMKpjmrkhM49wNv-0ySFsfq6aHNN2bt3puvlk1nhQ/exec';
  var CONSENT_VERSION = 'ea-2026-10-13';
  var d = document, $ = function (s, r) { return (r || d).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var track = function (ev) { try { if (window.pdTrack) window.pdTrack(ev); } catch (e) {} };
  var json = function (id) { try { return JSON.parse($('#' + id).textContent); } catch (e) { return {}; } };

  /* ---- price variant: from ?p=a|b, else drawn once and written into the URL (no cookie, no storage) ---- */
  var q = new URLSearchParams(location.search);
  var variant = q.get('p');
  if (variant !== 'a' && variant !== 'b') {
    variant = Math.random() < 0.5 ? 'a' : 'b';
    q.set('p', variant);
    try { history.replaceState(null, '', location.pathname + '?' + q.toString() + location.hash); } catch (e) {}
  }
  window.pdVariant = variant;
  $$('[data-price-pro]').forEach(function (el) { el.textContent = el.getAttribute('data-' + variant); });
  $$('[data-pro-label]').forEach(function (el) { el.textContent = el.getAttribute('data-' + variant); });
  $$('input[data-pro]').forEach(function (el) { el.value = variant === 'b' ? 'pro-2999' : 'pro-999'; });
  // keep the variant on internal links
  $$('a[href]').forEach(function (a) {
    var h = a.getAttribute('href');
    if (!h || /^(https?:|mailto:|#)/.test(h) || !/\.html(#.*)?$/.test(h)) return;
    var parts = h.split('#');
    a.setAttribute('href', parts[0] + '?p=' + variant + (parts[1] ? '#' + parts[1] : ''));
  });

  var post = function (body) {
    return fetch(EP, { method: 'POST', body: JSON.stringify(body), credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' } })
      .then(function (r) { return r.json(); });
  };

  /* ---- readiness check ---- */
  var check = $('#check');
  if (check) {
    var started = false;
    var i18n = json('check-i18n');
    check.addEventListener('change', function () { if (!started) { started = true; track('check_start'); } });
    check.addEventListener('submit', function (e) {
      e.preventDefault();
      var items = [], missingQ = [];
      $$('fieldset.q', check).forEach(function (fs, i) {
        var sel = $('input:checked', fs);
        fs.classList.toggle('missing', !sel);
        if (!sel) missingQ.push(i + 1);
        items.push({ id: fs.getAttribute('data-id'), w: Number(fs.getAttribute('data-w')), v: sel ? sel.value : '' });
      });
      var err = $('#check-error');
      if (missingQ.length) {
        err.textContent = i18n.unanswered + missingQ.join(', ');
        err.hidden = false;
        var first = $('fieldset.q.missing', check); if (first) first.scrollIntoView({ block: 'center' });
        return;
      }
      err.hidden = true;
      var r = window.PD.score(items);
      $('#score-num').textContent = r.pct;
      $('#score-bar').style.width = r.pct + '%';
      $('#score-band').textContent = i18n.band[r.band];
      $('#score-band').className = 'band band-' + r.band;
      var ol = $('#gaps'); ol.innerHTML = '';
      r.gaps.forEach(function (g) {
        var fs = $('#q-' + g.id);
        var li = d.createElement('li');
        li.className = 'gap gap-w' + g.w;
        li.setAttribute('data-id', g.id);
        var h = d.createElement('strong'); h.textContent = fs.getAttribute('data-gap');
        var meta = d.createElement('span'); meta.className = 'gap-meta';
        meta.textContent = i18n.weight[g.w] + ' · ' + i18n.ref + ': ' + fs.getAttribute('data-ref');
        li.appendChild(h); li.appendChild(d.createElement('br')); li.appendChild(meta);
        ol.appendChild(li);
      });
      $('#nogaps').hidden = r.gaps.length > 0;
      var res = $('#result'); res.hidden = false; res.setAttribute('data-score', r.pct); res.focus(); res.scrollIntoView({ block: 'start' });
      track('check_complete');
    });
    $('#reset').addEventListener('click', function () { check.reset(); $('#result').hidden = true; started = false; window.scrollTo(0, 0); });
    $('#print').addEventListener('click', function () { window.print(); });
  }

  /* ---- notice generator ---- */
  var gen = $('#gen');
  if (gen) {
    var gi = json('gen-i18n');
    var today = new Date().toISOString().slice(0, 10);
    if (!gen.date.value) gen.date.value = today;
    var current = null;
    var vals = function (name) { return $$('input[name="' + name + '"]:checked', gen).map(function (x) { return x.value; }); };
    gen.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = {
        lang: (vals('outLang')[0] || gen.getAttribute('data-lang')),
        bizName: gen.bizName.value, website: gen.website.value, bizAddress: gen.bizAddress.value,
        contactName: gen.contactName.value, contactRole: gen.contactRole.value, contactEmail: gen.contactEmail.value, contactPhone: gen.contactPhone.value,
        grievanceDays: Math.min(90, Math.max(1, Number(gen.grievanceDays.value) || 30)),
        data: vals('data'), dataOther: gen.dataOther.value, purposes: vals('purposes'), purposeOther: gen.purposeOther.value,
        marketing: vals('marketing').length > 0, share: vals('share'), shareOther: gen.shareOther.value, crossBorder: vals('crossBorder').length > 0,
        withdrawHow: gen.withdrawHow.value, consentManager: gen.consentManager.value, children: vals('children').length > 0, date: gen.date.value,
      };
      var miss = window.PD.missing(inp), err = $('#gen-error');
      if (miss.length) { err.textContent = gi.missing + miss.map(function (k) { return gi.fieldNames[k]; }).join(', '); err.hidden = false; err.scrollIntoView({ block: 'center' }); return; }
      err.hidden = true;
      current = window.PD.buildNotice(inp);
      $('#notice-out').innerHTML = window.PD.toHtml(current);
      $('#out-hi-note').hidden = current.lang !== 'hi';
      var out = $('#out'); out.hidden = false; out.focus(); out.scrollIntoView({ block: 'start' });
      track('notice_generated');
    });
    var save = function (text, type, ext) {
      var a = d.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: type }));
      a.download = 'privacy-notice-' + current.lang + '.' + ext;
      d.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    };
    $('#copy').addEventListener('click', function () {
      if (!current) return;
      var t = window.PD.toText(current);
      var done = function () { $('#copied').hidden = false; setTimeout(function () { $('#copied').hidden = true; }, 2500); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, done); else done();
      track('notice_copy');
    });
    $('#dl-txt').addEventListener('click', function () { if (current) { save(window.PD.toText(current), 'text/plain;charset=utf-8', 'txt'); track('notice_download'); } });
    $('#dl-html').addEventListener('click', function () {
      if (!current) return;
      save('<!doctype html><html lang="' + current.lang + '"><head><meta charset="utf-8"><title>' + current.title.replace(/</g, '&lt;') + '</title></head><body>' + window.PD.toHtml(current) + '</body></html>', 'text/html;charset=utf-8', 'html');
      track('notice_download');
    });
  }

  /* ---- early-access form ---- */
  var po = $('#preorder');
  if (po) {
    track('preorder_view');
    var pi = json('po-i18n');
    po.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = $('#po-error'), btn = $('button[type=submit]', po);
      err.hidden = true;
      if (!po.email.value || !po.email.checkValidity()) { err.textContent = pi.err; err.hidden = false; po.email.focus(); return; }
      if (!po.consent.checked) { err.textContent = pi.errConsent; err.hidden = false; return; }
      var label = btn.textContent; btn.disabled = true; btn.textContent = btn.getAttribute('data-sending');
      post({
        action: 'preorder', email: po.email.value, name: po.elements['name'].value, business: po.business.value, btype: po.btype.value,
        offer: ($('input[name=offer]:checked', po) || {}).value, variant: variant,
        langs: $$('input[name=langs]:checked', po).map(function (x) { return x.value; }).join(','),
        ui_lang: po.getAttribute('data-lang'), consent: true, consent_version: CONSENT_VERSION, page: location.pathname, website: po.website.value,
      }).then(function (r) {
        if (!r.ok) throw new Error(r.error);
        $('#po-ok').hidden = false; btn.hidden = true;
        track('preorder_submit');
      }).catch(function () { err.textContent = pi.err; err.hidden = false; btn.disabled = false; btn.textContent = label; });
    });
  }

  /* ---- rights / withdrawal form ---- */
  var rf = $('#rights');
  if (rf) {
    var ri = json('r-i18n');
    rf.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = $('#r-error'), ok = $('#r-ok'), btn = $('button[type=submit]', rf);
      err.hidden = true; ok.hidden = true;
      if (!rf.email.value || !rf.email.checkValidity()) { err.textContent = ri.err; err.hidden = false; return; }
      btn.disabled = true;
      post({ action: 'rights', type: ($('input[name=type]:checked', rf) || {}).value, email: rf.email.value, message: rf.message.value, website: rf.website.value })
        .then(function (r) { if (!r.ok) throw new Error(r.error); ok.textContent = ri.ok[r.status] || ri.ok.to_answer_by_email; ok.hidden = false; })
        .catch(function () { err.textContent = ri.err; err.hidden = false; })
        .then(function () { btn.disabled = false; });
    });
  }
})();
