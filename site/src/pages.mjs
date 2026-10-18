import { SITE, SOURCES } from './config.mjs';
import { UI, esc, inr, checkForm, generatorForm, preorderForm, rightsForm } from './components.mjs';
import PD from '../assets/core.js';

const P = SITE.prices;

/** Page shell. path = file path relative to the site root ('index.html', 'hi/check.html'). */
export function layout({ lang, path, title, desc, body, alt, page }) {
  const u = UI[lang];
  const depth = path.split('/').length - 1;
  const R = depth ? '../'.repeat(depth) : '';
  const L = lang === 'hi' ? '' : (depth ? '' : ''); // links between pages of the same language are relative
  const canonical = SITE.origin + SITE.base + path.replace(/index\.html$/, '');
  const altHref = alt ? SITE.origin + SITE.base + alt.replace(/index\.html$/, '') : '';
  const altRel = alt ? (lang === 'hi' ? R + alt : (depth ? '../' : '') + alt) : '';
  const nav = u.nav.map(([k, label]) => `<a href="${k}.html"${page === k ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const legalBase = lang === 'hi' ? R : '';
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src https://script.google.com https://script.googleusercontent.com; form-action 'none'; base-uri 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${alt ? `<link rel="alternate" hreflang="${lang}" href="${canonical}">\n<link rel="alternate" hreflang="${lang === 'hi' ? 'en' : 'hi'}" href="${altHref}">\n<link rel="alternate" hreflang="x-default" href="${lang === 'en' ? canonical : altHref}">` : ''}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${lang === 'hi' ? 'hi_IN' : 'en_IN'}">
<link rel="icon" href="${R}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${R}assets/style.css">
<script src="${R}assets/xp.js" defer></script>
<script src="${R}assets/cro.js" defer data-site="plaindpdp" data-api="${SITE.endpoint}" data-hosts="dpdp.jalonel.com" data-cta="[data-mesure=cta_click],#preorder [type=submit]"></script>
<script src="${R}assets/core.js" defer></script>
<script src="${R}assets/app.js" defer></script>
<script src="${R}assets/mesure.js?v=2" defer></script>
</head>
<body data-page="${page}">
<a class="skip" href="#main">${u.skip}</a>
<header class="top"><div class="wrap top-in">
<a class="logo" href="index.html" aria-label="PlainDPDP home"><span class="logo-mark" aria-hidden="true">§</span>PlainDPDP</a>
<nav class="nav" aria-label="Main">${nav}</nav>
${alt ? `<a class="lang" href="${altRel}" hreflang="${lang === 'hi' ? 'en' : 'hi'}" lang="${lang === 'hi' ? 'en' : 'hi'}" title="${u.langSwitchLabel}" data-mesure="lang_switch">${u.langSwitch}</a>` : ''}
</div></header>
<main id="main">
${body}
</main>
<footer class="foot"><div class="wrap">
<p class="disclaimer">${u.footDisclaimer}</p>
<p>${u.footBuilt}</p>
<p>${u.footCompany}</p>
<p class="brand-line"><a href="https://jalonel.com/en/">A Jalonel brand</a></p>
<p><a href="${legalBase}${lang === 'hi' ? 'hi/' : ''}privacy.html">${u.privacy}</a> · <a href="${legalBase}terms.html">${u.terms}</a> · ${u.updated}</p>
</div></footer>
</body>
</html>
`;
}

const SRC = (lang) => `<section class="wrap sources" id="sources">
<h2>${lang === 'hi' ? 'स्रोत' : 'Sources we read'}</h2>
<ul>
${Object.values(SOURCES).map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('\n')}
</ul>
</section>`;

// A real notice produced by the generator, shown in the hero.
function sampleNotice(lang) {
  const n = PD.buildNotice({ lang, bizName: lang === 'hi' ? 'नीलगिरि टी ट्रेडर्स' : 'Nilgiri Tea Traders', contactEmail: 'privacy@example.in', contactName: lang === 'hi' ? 'एस. मेनन' : 'S. Menon', contactRole: lang === 'hi' ? 'प्रोप्राइटर' : 'Proprietor', data: ['name', 'phone', 'address', 'orders'], purposes: ['deliver', 'transactional', 'payments'], share: ['payment', 'logistics'], grievanceDays: 30, date: '2026-10-13' });
  const s = n.sections;
  return `<div class="paper paper-sample" aria-label="${lang === 'hi' ? 'जनरेटर से बनी नमूना सूचना' : 'Sample notice made with the generator'}">
<p class="paper-tag">${lang === 'hi' ? 'जनरेटर का असली आउटपुट (अंश)' : 'Real generator output (excerpt)'}</p>
<h3>${esc(n.title)}</h3>
<p>${esc(s[0].p[0])}</p>
<h4>${esc(s[1].h)}</h4><ul>${s[1].ul.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
<h4>${esc(s[2].h)}</h4><ul>${s[2].ul.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
<p class="fade">…</p>
</div>`;
}

/* ---------------- English ---------------- */

const EN = {};

EN.index = () => ({
  title: 'DPDP Rules 2025 (G.S.R. 843(E)) dates and readiness check for Indian SMEs | PlainDPDP',
  desc: 'Notification G.S.R. 843(E) of 13 November 2025: most DPDP duties apply eighteen months later, from 13 May 2027. Free 15-question readiness check and privacy-notice generator (English, Hindi). Not legal advice.',
  body: `<section class="hero" id="hero"><div class="wrap hero-in">
<div class="hero-copy">
<p class="kicker">India · Digital Personal Data Protection Act, 2023</p>
<h1>DPDP compliance templates for Indian small businesses</h1>
<p class="lead">Most duties under the DPDP Act and the DPDP Rules 2025 apply from <strong>13 May 2027</strong>. Start with two free tools: a 15-question readiness check that scores you and lists your gaps, and a privacy-notice generator that writes the notice Rule 3 asks for, in English or Hindi.</p>
<div class="cta-row"><a class="btn" href="check.html" data-mesure="cta_click">Take the free readiness check (5 minutes)</a> <a class="btn btn-ghost" href="notice.html" data-mesure="cta_click">Generate a privacy notice (free)</a></div>
<p class="small">No sign-up for the free tools. Your answers stay in your browser.</p>
</div>
${sampleNotice('en')}
</div></section>

<section class="wrap" id="dates">
<h2>What applies, and from when</h2>
<p>The Rules were notified on 13 November 2025 and bring the Act into force in three steps:</p>
<div class="table-wrap"><table class="dates">
<thead><tr><th>Date</th><th>What starts</th><th>Who it affects</th></tr></thead>
<tbody>
<tr><td>13 Nov 2025</td><td>Definitions, the Data Protection Board of India and its procedures (sections 1(2), 2, 18 to 26, 35, 38 to 43, 44(1) and 44(3); Rules 1, 2 and 17 to 21)</td><td>Mostly the government and the Board</td></tr>
<tr><td>13 Nov 2026</td><td>Registration of Consent Managers (section 6(9), section 27(1)(d), Rule 4, First Schedule)</td><td>Companies that want to become Consent Managers</td></tr>
<tr><td><strong>13 May 2027</strong></td><td>Notice, consent, legitimate uses, security safeguards, breach reporting, erasure, children's data, rights of Data Principals, the Board's powers and penalties (sections 3 to 5, 6 except 6(9), 7 to 17, 27 to 34, 36, 37 and 44(2); Rules 3, 5 to 16, 22 and 23)</td><td><strong>Every business that handles personal data of people in India in digital form</strong></td></tr>
</tbody></table></div>
<p class="small">Our reading of notification G.S.R. 843(E) and rule 1 of the Rules ("eighteen months after the date of publication"). The Gazette is dated 13 November 2025 but was signed on 14 November 2025, so some advisers count from the 14th; plan for 13 May 2027. Until that date, section 43A of the IT Act 2000 and the SPDI Rules 2011 still apply (section 44(2) removes them on 13 May 2027). We have not found any later amendment to these dates, but check the sources below before relying on them.</p>
</section>

<section class="wrap split" id="audience">
<div>
<h2>Who this is for</h2>
<p>Shops and D2C brands with a website or WhatsApp catalogue, clinics, coaching centres and schools, small software firms, agencies and CA practices that keep client data. If you collect names and phone numbers in a Google Sheet, the Act applies to you.</p>
<p>The penalties in the Schedule to the Act go up to ₹250 crore for failing to take reasonable security safeguards, up to ₹200 crore for not reporting a breach or for breaching the duties on children's data, and up to ₹50 crore for other breaches such as a missing notice or invalid consent. The Board imposes them only after an inquiry, and decides the amount considering the nature of the breach and the business (section 33).</p>
</div>
<div class="box">
<h2>Who this is not for</h2>
<p>If the government notifies you as a Significant Data Fiduciary, you need a Data Protection Officer in India, an independent audit and impact assessments (section 10). Templates will not cover that; talk to a law firm.</p>
<p>Banks, insurers and listed companies also have sector rules (RBI, IRDAI, SEBI) that this kit does not cover.</p>
<p>Section 17(3) lets the government exempt some businesses, including DPIIT-recognised startups, from the notice, erasure and access duties. We could not confirm whether any such notification has been issued; check before relying on it.</p>
</div>
</section>

<section class="wrap" id="kit">
<h2>The full kit: ${inr(P.pack)} one-off, in early access</h2>
<p>The free tools find your gaps and write one notice. The kit gives you the documents to close the rest:</p>
<ul class="kit-list">
<li><strong>Notice templates in the 22 Eighth Schedule languages</strong>, from Assamese to Urdu, matching the English generator output, because section 5(3) gives your customers the right to read the notice in any of them. Translations are machine-assisted with a review flag for each language.</li>
<li><strong>Consent records register</strong> (Google Sheets and Excel) with the columns you need to meet the burden of proof in section 6(10).</li>
<li><strong>Breach-response playbook</strong>: who does what in the first hour, the first 24 hours and by the 72-hour report to the Board, with message templates (Rule 7).</li>
<li><strong>Data-processor clause</strong> to add to vendor contracts (section 8(2)).</li>
<li><strong>Children's data checklist</strong> for schools, coaching and kids' brands (section 9, Rules 10 and 11).</li>
<li><strong>Retention schedule</strong> with the erasure duty of section 8(7) and the Third Schedule periods.</li>
</ul>
<p><a class="btn" href="kit.html" data-mesure="cta_click">See the kit and join early access</a> <span class="small">Price shown: <span data-price-pack>${inr(P.pack)}</span> one-off, or Pro at <span data-price-pro data-a="${inr(P.a)}" data-b="${inr(P.b)}">${inr(P.a)}</span> per month. No payment today.</span></p>
</section>

<section class="wrap" id="how">
<h2>How this site was made</h2>
<p>Octave, the AI agent of READ FRANCE SAS, a small software company in Paris, read the Act and the Rules as published by the Ministry of Electronics and Information Technology and wrote each question and each line of the generator against a section or rule. We have done similar work for French and EU rules (GDPR, the EU product safety regulation). No lawyer has reviewed this site, and we say so on every page. If you find a mistake, write to <a href="mailto:${SITE.email}">${SITE.email}</a> and we will correct it and credit the fix on this page.</p>
</section>
${SRC('en')}`,
});

EN.check = () => ({
  title: 'DPDP readiness check: 15 questions, a score and your gap list | PlainDPDP',
  desc: 'Free DPDP Act 2023 readiness check for Indian small businesses: 15 questions mapped to sections and rules, a score out of 100 and a prioritised gap list. Answers stay in your browser.',
  body: `<section class="wrap narrow" data-section="check-tool">
<h1>DPDP readiness check</h1>
<p class="lead">15 questions, about 5 minutes. Each one is tied to a section of the DPDP Act 2023 or a rule of the DPDP Rules 2025. At the end you get a score out of 100 and your gaps, most important first.</p>
<p class="small">Answer for your business as it works today. "Partly" means you do it for some customers or some channels only.</p>
${checkForm('en')}
<aside class="next" id="next" data-section="next"><h2>After the check</h2><p>Gap on the notice? <a href="notice.html" data-mesure="cta_click">Generate a draft notice for free</a>. Need the register, playbook and clauses? <a href="kit.html" data-mesure="cta_click">See the full kit (${inr(P.pack)})</a>.</p></aside>
</section>`,
});

EN.notice = () => ({
  title: 'Free DPDP privacy notice generator (English and Hindi) | PlainDPDP',
  desc: 'Generate a DPDP Act 2023 privacy notice with the items of Rule 3: data items, purposes, withdrawal of consent, rights, grievance contact, Consent Manager and the Data Protection Board. English or Hindi.',
  body: `<section class="wrap narrow" data-section="generator">
<h1>DPDP privacy notice generator</h1>
<p class="lead">Fill in what your business collects and why. You get a notice with the items that section 5 and Rule 3 require: an itemised list of data and purposes, how to withdraw consent, how to use your rights, who handles grievances, and how to complain to the Data Protection Board. In English or Hindi. Nothing you type leaves your browser.</p>
${generatorForm('en')}
</section>`,
});

EN.kit = () => ({
  title: `DPDP compliance kit for SMEs: ${inr(P.pack)}, early access | PlainDPDP`,
  desc: `The PlainDPDP kit: notice templates in 22 Indian languages, consent register, breach playbook, processor clause, children's data checklist and retention schedule. ${inr(P.pack)} one-off. Early access, no payment today.`,
  body: `<section class="wrap narrow" data-section="pricing">
<h1>The PlainDPDP kit</h1>
<p class="lead">Templates to close the gaps the readiness check finds, for businesses that cannot pay a law firm ₹1 lakh or more for a DPDP project. The kit is <strong>not on sale yet</strong>: join early access and we will e-mail you when it is ready, at the price below.</p>
<div class="table-wrap"><table class="kit-table">
<thead><tr><th>What you get</th><th>Starter kit<br>${inr(P.pack)} one-off</th><th>Pro<br><span data-price-pro data-a="${inr(P.a)}" data-b="${inr(P.b)}">${inr(P.a)}</span>/month</th></tr></thead>
<tbody>
<tr><td>Privacy notice templates in English and the 22 Eighth Schedule languages (s.5(3))</td><td>✓</td><td>✓, kept up to date</td></tr>
<tr><td>Consent records register, Google Sheets and Excel (s.6(10))</td><td>✓</td><td>Hosted consent log with an embeddable consent form</td></tr>
<tr><td>Breach-response playbook with the 72-hour Board report (s.8(6), Rule 7)</td><td>✓</td><td>✓</td></tr>
<tr><td>Data-processor clause for vendor contracts (s.8(2))</td><td>✓</td><td>✓</td></tr>
<tr><td>Children's data checklist, verifiable parental consent (s.9, Rules 10 and 11)</td><td>✓</td><td>✓</td></tr>
<tr><td>Retention schedule and erasure procedure (s.8(7), Rule 8, Third Schedule)</td><td>✓</td><td>✓</td></tr>
<tr><td>Rights-request and grievance inbox (s.11 to 14, Rule 14)</td><td>Template</td><td>Hosted inbox with reply deadlines</td></tr>
<tr><td>Updates when MeitY or the Board publishes changes</td><td>12 months</td><td>While subscribed</td></tr>
</tbody></table></div>
<p class="small">What the kit does not include: legal advice, a review of your contracts by an advocate, Data Protection Officer services, or the duties of a Significant Data Fiduciary. Translations are machine-assisted; each one carries a note to have it reviewed.</p>
${preorderForm('en')}
</section>`,
});

EN.privacy = () => ({
  title: 'Privacy notice of PlainDPDP (READ FRANCE SAS)',
  desc: 'How READ FRANCE SAS handles personal data on PlainDPDP: anonymous visit and behaviour counts without cookies, A/B tests, the early-access list, your rights under the DPDP Act and the GDPR.',
  body: `<section class="wrap narrow prose" data-section="privacy">
<h1>Privacy notice</h1>
<p class="small">Version of ${SITE.updated}. Also in <a href="hi/privacy.html">Hindi</a>.</p>
<p>${SITE.company.name}, ${SITE.company.address} (SIREN ${SITE.company.siren}), runs this site. Jalonel is a brand of READ FRANCE SAS. For the early-access list we are the Data Fiduciary under India's DPDP Act 2023 and the controller under the EU GDPR. Questions, requests and grievances: <a href="mailto:${SITE.email}">${SITE.email}</a>. We reply within 30 days.</p>
<h2>1. The free tools</h2>
<p>The readiness check and the notice generator run entirely in your browser. Your answers and the details you type are not sent to us or stored by us (we only count, without any content, that a form was started or submitted: see section 2).</p>
<h2>2. Anonymous visit and behaviour counts</h2>
<p>We count visits without cookies and without any identifier. Each page sends: the page path, the event (for example "check completed"), the referring website's domain, campaign tags in the link (utm_source, utm_medium, utm_campaign), the price variant shown (a or b) and whether the screen is narrower than 768 pixels.</p>
<p>To improve the site, each page also sends, once, a short list of what happened on it: how far the page was scrolled, which sections were reached, the time before the first click on a main button (in bands such as "under 10 seconds"), whether a form was started or submitted and the name of the last field touched (for example "bizName", never what you typed in it), which collapsible items were opened, the domain of links to other websites, technical errors (as an anonymous fingerprint of the error message), page speed (Core Web Vitals, as good, needs improvement or poor) and repeated clicks on the same element.</p>
<p>We do not send or keep your IP address, browser details, any cookie or any ID, and we only keep daily totals per page; we cannot follow you from page to page or from one day to the next. There is no tracking across other websites, and nothing is combined with other data, shared or sold: the totals serve only this site's own statistics. If your browser sends "Do Not Track" or "Global Privacy Control", nothing at all is sent. Search-engine crawlers and automated browsers (recognised inside your browser, without sending its details) are counted separately or not at all, and a prerendered page is counted only if you open it. Because these counts cannot identify anyone, they are not personal data under the DPDP Act or the GDPR.</p>
<p><strong>A/B tests.</strong> Some visitors see a different version of a headline, a button or a price (today: the Pro plan shown at ₹999 or ₹2,999 per month). The version letter is kept in your browser tab's sessionStorage, which the browser deletes when you close the tab, or chosen by date, without storing anything; it is never linked to you. We count each version's visits and sign-ups only as totals. If you join early access, the price recorded is the one you were shown, and the price you would pay is always the one displayed.</p>
<p class="small">Section updated on 13 October 2026.</p>
<h2>3. The early-access list</h2>
<ul>
<li><strong>Data:</strong> your e-mail address and, if you give them, your name, business name, business type, the option you chose and the languages you need.</li>
<li><strong>Purpose:</strong> to e-mail you when the kit is ready, at the price shown when you joined, and to ask you up to two short questions about your needs. Nothing else.</li>
<li><strong>Basis:</strong> your consent (DPDP Act section 6; GDPR article 6(1)(a)).</li>
<li><strong>Processor:</strong> Google (Google Sheets and Apps Script), under Google's data-processing terms. Data may be stored outside India and outside the EU.</li>
<li><strong>Retention:</strong> until the kit launches plus 6 months, then erased. Immediately if you withdraw consent or ask for erasure.</li>
<li><strong>No sharing, no sale, no advertising use.</strong></li>
</ul>
<h2>4. Your rights</h2>
<p>You can withdraw consent at any time, as easily as you gave it, with the form below. You can also ask for a summary of your data and who it was shared with, correction or erasure, or nominate someone to act for you (DPDP Act sections 11 to 14), and use your GDPR rights (access, rectification, erasure, restriction, objection, portability).</p>
<p>If our answer does not satisfy you, you can complain to the French authority, the <a href="https://www.cnil.fr/en/complaints" rel="nofollow">CNIL</a>. From 13 May 2027, when the Board's complaint powers start, you can also complain to the Data Protection Board of India after using our grievance process (sections 13(3) and 27 of the DPDP Act).</p>
${rightsForm('en')}
<h2>5. Hosting</h2>
<p>The site is hosted by GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Like any web host, GitHub may process technical connection data such as IP addresses to run and secure the service, under its own privacy statement.</p>
</section>`,
});

EN.terms = () => ({
  title: 'Terms of use of PlainDPDP',
  desc: 'Terms of use of PlainDPDP, a self-help DPDP template kit by READ FRANCE SAS. Not legal advice.',
  body: `<section class="wrap narrow prose" data-section="terms">
<h1>Terms of use</h1>
<p class="small">Version of ${SITE.updated}.</p>
<h2>1. Who we are</h2>
<p>PlainDPDP is published by ${SITE.company.name}, a simplified joint-stock company with share capital of ${SITE.company.capital}, registered office ${SITE.company.address}, SIREN ${SITE.company.siren} (${SITE.company.rcs}). Publication director: ${SITE.company.president}, president. Contact: <a href="mailto:${SITE.email}">${SITE.email}</a>. The site is built and run by Octave, an AI agent working for READ FRANCE SAS. Jalonel is a brand of READ FRANCE SAS.</p>
<h2>2. Not legal advice</h2>
<p>PlainDPDP is a self-help template kit, not a law firm. We are not advocates enrolled in India and we do not give legal advice. The readiness check, the generator and the templates are general information based on our reading of the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025. They may contain errors, may not fit your business, and may become out of date when the law, the Rules or the Board's guidance change. You decide what to publish and remain responsible for your compliance. For advice on your situation, consult an advocate or a qualified professional in India.</p>
<h2>3. Free tools</h2>
<p>You may use the free tools and the notices they generate for your own business or your clients, without attribution. They are provided as they are, without any warranty.</p>
<h2>4. Early access</h2>
<p>Joining early access is free and does not commit you to buy. No payment is taken on this site at present. If we open sales, the price, taxes and terms will be shown before any payment, and the price shown when you joined will be honoured for your first purchase.</p>
<h2>5. Liability</h2>
<p>To the extent permitted by law, READ FRANCE SAS is not liable for any loss arising from the use of the free tools or from decisions taken on the basis of this site. Nothing in these terms limits liability that cannot be limited by law.</p>
<h2>6. Law</h2>
<p>These terms are governed by French law. This does not take away any protection you have under the mandatory law of your country.</p>
</section>`,
});

/* ---------------- Hindi (machine-assisted) ---------------- */

const HI = {};
const hiNote = '<p class="mt-note">यह पेज मशीन की सहायता से अनुवादित है और किसी मूल हिंदी भाषी कानूनी अनुवादक ने इसकी जाँच नहीं की है। किसी अंतर की स्थिति में अंग्रेज़ी पेज मान्य है।</p>';

HI.index = () => ({
  title: 'PlainDPDP: छोटे व्यवसायों के लिए DPDP तैयारी जाँच और गोपनीयता सूचना जनरेटर',
  desc: 'भारतीय छोटे व्यवसायों के लिए मुफ़्त 15-प्रश्न DPDP तैयारी जाँच, स्कोर और कमियों की सूची, और हिंदी व अंग्रेज़ी में मुफ़्त गोपनीयता सूचना जनरेटर। पूरा किट ₹4,999, अर्ली एक्सेस में। कानूनी सलाह नहीं।',
  body: `<section class="hero" id="hero"><div class="wrap hero-in">
<div class="hero-copy">
${hiNote}
<p class="kicker">भारत · डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023</p>
<h1>भारतीय छोटे व्यवसायों के लिए DPDP अनुपालन टेम्पलेट</h1>
<p class="lead">DPDP अधिनियम और DPDP नियम 2025 के अधिकांश दायित्व <strong>13 मई 2027</strong> से लागू होते हैं। दो मुफ़्त टूल से शुरू करें: 15 प्रश्नों की तैयारी जाँच जो आपको स्कोर और कमियों की सूची देती है, और गोपनीयता सूचना जनरेटर जो नियम 3 के अनुसार सूचना हिंदी या अंग्रेज़ी में लिखता है।</p>
<div class="cta-row"><a class="btn" href="check.html" data-mesure="cta_click">मुफ़्त तैयारी जाँच करें (5 मिनट)</a> <a class="btn btn-ghost" href="notice.html" data-mesure="cta_click">गोपनीयता सूचना बनाएँ (मुफ़्त)</a></div>
<p class="small">मुफ़्त टूल के लिए साइन-अप नहीं। आपके उत्तर आपके ब्राउज़र में ही रहते हैं।</p>
</div>
${sampleNotice('hi')}
</div></section>
<section class="wrap" id="dates">
<h2>क्या लागू होता है, और कब से</h2>
<p>नियम 13 नवंबर 2025 को अधिसूचित हुए और अधिनियम को तीन चरणों में लागू करते हैं:</p>
<div class="table-wrap"><table class="dates">
<thead><tr><th>तारीख़</th><th>क्या शुरू होता है</th><th>किस पर असर</th></tr></thead>
<tbody>
<tr><td>13 नवंबर 2025</td><td>परिभाषाएँ, भारतीय डेटा संरक्षण बोर्ड और उसकी प्रक्रियाएँ (धारा 1(2), 2, 18 से 26, 35, 38 से 43, 44(1) और 44(3); नियम 1, 2 और 17 से 21)</td><td>मुख्यतः सरकार और बोर्ड</td></tr>
<tr><td>13 नवंबर 2026</td><td>सहमति प्रबंधकों का पंजीकरण (धारा 6(9), धारा 27(1)(d), नियम 4, पहली अनुसूची)</td><td>सहमति प्रबंधक बनना चाहने वाली कंपनियाँ</td></tr>
<tr><td><strong>13 मई 2027</strong></td><td>सूचना, सहमति, वैध उपयोग, सुरक्षा उपाय, ब्रीच की सूचना, डेटा मिटाना, बच्चों का डेटा, डेटा प्रिंसिपल के अधिकार, बोर्ड की शक्तियाँ और जुर्माने (धारा 3 से 5, 6 (6(9) को छोड़कर), 7 से 17, 27 से 34, 36, 37 और 44(2); नियम 3, 5 से 16, 22 और 23)</td><td><strong>हर व्यवसाय जो भारत में लोगों का व्यक्तिगत डेटा डिजिटल रूप में संभालता है</strong></td></tr>
</tbody></table></div>
<p class="small">अधिसूचना G.S.R. 843(E) और नियमों के नियम 1 ("राजपत्र में प्रकाशन की तारीख़ से अठारह महीने बाद") की हमारी समझ। राजपत्र पर 13 नवंबर 2025 की तारीख़ है पर हस्ताक्षर 14 नवंबर 2025 को हुए, इसलिए कुछ सलाहकार 14 से गिनते हैं; 13 मई 2027 के हिसाब से योजना बनाएँ। उस तारीख़ तक IT अधिनियम 2000 की धारा 43A और SPDI नियम 2011 लागू रहते हैं। स्रोत पेज के नीचे हैं।</p>
</section>
<section class="wrap split" id="audience">
<div><h2>यह किसके लिए है</h2>
<p>वेबसाइट या WhatsApp कैटलॉग वाली दुकानें और D2C ब्रांड, क्लिनिक, कोचिंग सेंटर और स्कूल, छोटी सॉफ़्टवेयर कंपनियाँ, एजेंसियाँ और ग्राहकों का डेटा रखने वाली CA प्रैक्टिस। यदि आप Google Sheet में नाम और फ़ोन नंबर रखते हैं, तो अधिनियम आप पर लागू होता है।</p>
<p>अधिनियम की अनुसूची में जुर्माना उचित सुरक्षा उपाय न करने पर ₹250 करोड़ तक, ब्रीच की सूचना न देने या बच्चों के डेटा के दायित्व तोड़ने पर ₹200 करोड़ तक, और अन्य उल्लंघनों (जैसे सूचना न होना या अमान्य सहमति) पर ₹50 करोड़ तक है। बोर्ड जाँच के बाद ही जुर्माना लगाता है और राशि उल्लंघन व व्यवसाय की प्रकृति देखकर तय करता है (धारा 33)।</p></div>
<div class="box"><h2>यह किसके लिए नहीं है</h2>
<p>यदि सरकार आपको महत्वपूर्ण डेटा फ़िड्युशरी अधिसूचित करती है, तो आपको भारत में डेटा संरक्षण अधिकारी, स्वतंत्र ऑडिट और प्रभाव आकलन चाहिए (धारा 10)। टेम्पलेट इसके लिए काफ़ी नहीं; किसी लॉ फ़र्म से बात करें।</p>
<p>बैंक, बीमा कंपनियाँ और सूचीबद्ध कंपनियों पर क्षेत्रीय नियम (RBI, IRDAI, SEBI) भी लागू हैं, जो यह किट कवर नहीं करता।</p></div>
</section>
<section class="wrap" id="kit">
<h2>पूरा किट: ${inr(P.pack)} एक बार, अर्ली एक्सेस में</h2>
<p>मुफ़्त टूल आपकी कमियाँ ढूँढते हैं और एक सूचना लिखते हैं। किट बाकी कमियाँ दूर करने के दस्तावेज़ देता है: 22 भाषाओं में सूचना टेम्पलेट, सहमति रिकॉर्ड रजिस्टर, ब्रीच-रिस्पॉन्स प्लेबुक, डेटा-प्रोसेसर अनुबंध खंड, बच्चों के डेटा की चेकलिस्ट और रिटेंशन शेड्यूल।</p>
<p><a class="btn" href="kit.html" data-mesure="cta_click">किट देखें और अर्ली एक्सेस से जुड़ें</a> <span class="small">कीमत: <span data-price-pack>${inr(P.pack)}</span> एक बार, या प्रो <span data-price-pro data-a="${inr(P.a)}" data-b="${inr(P.b)}">${inr(P.a)}</span> प्रति माह। आज कोई भुगतान नहीं।</span></p>
</section>
<section class="wrap" id="how"><h2>यह साइट कैसे बनी</h2>
<p>पेरिस की एक छोटी सॉफ़्टवेयर कंपनी READ FRANCE SAS के AI एजेंट Octave ने इलेक्ट्रॉनिकी और सूचना प्रौद्योगिकी मंत्रालय द्वारा प्रकाशित अधिनियम और नियम पढ़े और हर प्रश्न व जनरेटर की हर पंक्ति किसी धारा या नियम के आधार पर लिखी। किसी वकील ने इस साइट की समीक्षा नहीं की है। गलती मिले तो <a href="mailto:${SITE.email}">${SITE.email}</a> पर लिखें।</p></section>
${SRC('hi')}`,
});

HI.check = () => ({
  title: 'DPDP तैयारी जाँच: 15 प्रश्न, स्कोर और कमियों की सूची | PlainDPDP',
  desc: 'भारतीय छोटे व्यवसायों के लिए मुफ़्त DPDP अधिनियम 2023 तैयारी जाँच: धाराओं और नियमों से जुड़े 15 प्रश्न, 100 में से स्कोर और प्राथमिकता वाली कमियों की सूची।',
  body: `<section class="wrap narrow" data-section="check-tool">
${hiNote}
<h1>DPDP तैयारी जाँच</h1>
<p class="lead">15 प्रश्न, लगभग 5 मिनट। हर प्रश्न DPDP अधिनियम 2023 की किसी धारा या DPDP नियम 2025 के किसी नियम से जुड़ा है। अंत में आपको 100 में से स्कोर और आपकी कमियाँ मिलेंगी, सबसे ज़रूरी पहले।</p>
<p class="small">अपने व्यवसाय के आज के काम के हिसाब से उत्तर दें। "आंशिक" का अर्थ है कि आप यह केवल कुछ ग्राहकों या कुछ माध्यमों के लिए करते हैं।</p>
${checkForm('hi')}
<aside class="next" id="next" data-section="next"><h2>जाँच के बाद</h2><p>सूचना में कमी? <a href="notice.html" data-mesure="cta_click">मुफ़्त ड्राफ़्ट सूचना बनाएँ</a>। रजिस्टर, प्लेबुक और खंड चाहिए? <a href="kit.html" data-mesure="cta_click">पूरा किट देखें (${inr(P.pack)})</a>।</p></aside>
</section>`,
});

HI.notice = () => ({
  title: 'मुफ़्त DPDP गोपनीयता सूचना जनरेटर (हिंदी और अंग्रेज़ी) | PlainDPDP',
  desc: 'नियम 3 के बिंदुओं के साथ DPDP अधिनियम 2023 की गोपनीयता सूचना बनाएँ: डेटा, उद्देश्य, सहमति वापसी, अधिकार, शिकायत संपर्क, सहमति प्रबंधक और डेटा संरक्षण बोर्ड।',
  body: `<section class="wrap narrow" data-section="generator">
${hiNote}
<h1>DPDP गोपनीयता सूचना जनरेटर</h1>
<p class="lead">भरिए कि आपका व्यवसाय कौन-सा डेटा लेता है और क्यों। आपको धारा 5 और नियम 3 के बिंदुओं वाली सूचना मिलेगी: डेटा और उद्देश्यों की अलग-अलग सूची, सहमति वापस लेने का तरीका, अधिकारों का उपयोग, शिकायत कौन देखेगा, और डेटा संरक्षण बोर्ड से शिकायत कैसे करें। हिंदी या अंग्रेज़ी में। आपकी भरी जानकारी आपके ब्राउज़र से बाहर नहीं जाती।</p>
${generatorForm('hi')}
</section>`,
});

HI.kit = () => ({
  title: `छोटे व्यवसायों के लिए DPDP अनुपालन किट: ${inr(P.pack)}, अर्ली एक्सेस | PlainDPDP`,
  desc: `PlainDPDP किट: 22 भारतीय भाषाओं में सूचना टेम्पलेट, सहमति रजिस्टर, ब्रीच प्लेबुक, प्रोसेसर खंड, बच्चों के डेटा की चेकलिस्ट और रिटेंशन शेड्यूल। ${inr(P.pack)} एक बार। आज कोई भुगतान नहीं।`,
  body: `<section class="wrap narrow" data-section="pricing">
${hiNote}
<h1>PlainDPDP किट</h1>
<p class="lead">तैयारी जाँच में मिली कमियों को दूर करने के टेम्पलेट, उन व्यवसायों के लिए जो DPDP प्रोजेक्ट के लिए लॉ फ़र्म को ₹1 लाख या उससे अधिक नहीं दे सकते। किट <strong>अभी बिक्री पर नहीं है</strong>: अर्ली एक्सेस से जुड़ें, किट तैयार होने पर हम नीचे दी गई कीमत पर आपको ई-मेल करेंगे।</p>
<div class="table-wrap"><table class="kit-table">
<thead><tr><th>आपको क्या मिलता है</th><th>स्टार्टर किट<br>${inr(P.pack)} एक बार</th><th>प्रो<br><span data-price-pro data-a="${inr(P.a)}" data-b="${inr(P.b)}">${inr(P.a)}</span>/माह</th></tr></thead>
<tbody>
<tr><td>अंग्रेज़ी और आठवीं अनुसूची की 22 भाषाओं में गोपनीयता सूचना टेम्पलेट (धारा 5(3))</td><td>✓</td><td>✓, अपडेट के साथ</td></tr>
<tr><td>सहमति रिकॉर्ड रजिस्टर, Google Sheets और Excel (धारा 6(10))</td><td>✓</td><td>होस्टेड सहमति लॉग</td></tr>
<tr><td>72 घंटे की बोर्ड रिपोर्ट सहित ब्रीच-रिस्पॉन्स प्लेबुक (धारा 8(6), नियम 7)</td><td>✓</td><td>✓</td></tr>
<tr><td>वेंडर अनुबंधों के लिए डेटा-प्रोसेसर खंड (धारा 8(2))</td><td>✓</td><td>✓</td></tr>
<tr><td>बच्चों के डेटा की चेकलिस्ट (धारा 9, नियम 10 और 11)</td><td>✓</td><td>✓</td></tr>
<tr><td>रिटेंशन शेड्यूल और डेटा मिटाने की प्रक्रिया (धारा 8(7), नियम 8)</td><td>✓</td><td>✓</td></tr>
<tr><td>अधिकार-अनुरोध और शिकायत इनबॉक्स (धारा 11 से 14, नियम 14)</td><td>टेम्पलेट</td><td>होस्टेड इनबॉक्स</td></tr>
</tbody></table></div>
<p class="small">किट में शामिल नहीं: कानूनी सलाह, किसी अधिवक्ता द्वारा अनुबंधों की समीक्षा, डेटा संरक्षण अधिकारी सेवाएँ, या महत्वपूर्ण डेटा फ़िड्युशरी के दायित्व। अनुवाद मशीन-सहायता से हैं; हर अनुवाद पर समीक्षा करवाने का नोट है।</p>
${preorderForm('hi')}
</section>`,
});

HI.privacy = () => ({
  title: 'PlainDPDP (READ FRANCE SAS) की गोपनीयता सूचना',
  desc: 'READ FRANCE SAS PlainDPDP पर व्यक्तिगत डेटा कैसे संभालता है: बिना कुकी के गुमनाम गिनती, अर्ली-एक्सेस सूची, DPDP अधिनियम और GDPR के तहत आपके अधिकार।',
  body: `<section class="wrap narrow prose" data-section="privacy">
${hiNote}
<h1>गोपनीयता सूचना</h1>
<p class="small">13 अक्टूबर 2026 का संस्करण। <a href="../privacy.html">अंग्रेज़ी</a> में भी।</p>
<p>${SITE.company.name}, ${SITE.company.address} (SIREN ${SITE.company.siren}) यह साइट चलाता है। Jalonel, READ FRANCE SAS का एक ब्रांड है। अर्ली-एक्सेस सूची के लिए हम भारत के DPDP अधिनियम 2023 के तहत डेटा फ़िड्युशरी और EU GDPR के तहत कंट्रोलर हैं। प्रश्न, अनुरोध और शिकायतें: <a href="mailto:${SITE.email}">${SITE.email}</a>। हम 30 दिनों के भीतर उत्तर देते हैं।</p>
<h2>1. मुफ़्त टूल</h2><p>तैयारी जाँच और सूचना जनरेटर पूरी तरह आपके ब्राउज़र में चलते हैं। आपके उत्तर और भरी गई जानकारी हमें नहीं भेजी जाती और हम उसे स्टोर नहीं करते (हम केवल, बिना किसी सामग्री के, गिनते हैं कि कोई फ़ॉर्म शुरू या जमा हुआ: भाग 2 देखें)।</p>
<h2>2. गुमनाम विज़िट और व्यवहार गिनती</h2><p>हम बिना कुकी और बिना किसी पहचानकर्ता के विज़िट गिनते हैं। हर पेज भेजता है: पेज का पाथ, घटना (जैसे "जाँच पूरी हुई"), रेफ़र करने वाली वेबसाइट का डोमेन, लिंक के कैंपेन टैग, दिखाया गया कीमत संस्करण (a या b) और क्या स्क्रीन 768 पिक्सेल से संकरी है।</p>
<p>साइट सुधारने के लिए हर पेज एक बार यह छोटी सूची भी भेजता है: पेज कितना स्क्रॉल हुआ, कौन-से हिस्से देखे गए, किसी मुख्य बटन पर पहले क्लिक से पहले का समय (जैसे "10 सेकंड से कम"), क्या कोई फ़ॉर्म शुरू या जमा हुआ और आख़िरी छुए गए फ़ील्ड का नाम (जैसे "bizName", उसमें लिखा गया कभी नहीं), कौन-से खुलने वाले हिस्से खोले गए, दूसरी वेबसाइटों के लिंक का डोमेन, तकनीकी त्रुटियाँ (त्रुटि संदेश का गुमनाम फ़िंगरप्रिंट), पेज की गति (Core Web Vitals: अच्छा, सुधार चाहिए या खराब) और एक ही चीज़ पर बार-बार क्लिक।</p>
<p>हम आपका IP पता, ब्राउज़र विवरण, कोई कुकी या कोई ID न भेजते हैं न रखते हैं, और केवल हर पेज के दैनिक कुल रखते हैं; हम आपको एक पेज से दूसरे पेज या एक दिन से अगले दिन तक नहीं पहचान सकते। दूसरी वेबसाइटों पर कोई ट्रैकिंग नहीं, किसी अन्य डेटा से जोड़ना नहीं, साझा करना या बेचना नहीं: ये कुल केवल इसी साइट के अपने आँकड़ों के लिए हैं। यदि आपका ब्राउज़र "Do Not Track" या "Global Privacy Control" भेजता है, तो कुछ भी नहीं भेजा जाता। सर्च इंजन क्रॉलर और स्वचालित ब्राउज़र (आपके ब्राउज़र में ही पहचाने जाते हैं, उनका विवरण भेजा नहीं जाता) अलग गिने जाते हैं या बिल्कुल नहीं, और पहले से लोड किया गया पेज तभी गिना जाता है जब आप उसे खोलते हैं।</p>
<p><strong>A/B परीक्षण।</strong> कुछ विज़िटर किसी शीर्षक, बटन या कीमत का अलग संस्करण देखते हैं (अभी: प्रो योजना ₹999 या ₹2,999 प्रति माह)। संस्करण का अक्षर आपके ब्राउज़र टैब के sessionStorage में रखा जाता है, जिसे टैब बंद करने पर ब्राउज़र मिटा देता है, या तारीख़ के हिसाब से चुना जाता है, बिना कुछ स्टोर किए; यह कभी आपसे नहीं जोड़ा जाता। अर्ली एक्सेस से जुड़ने पर वही कीमत दर्ज होती है जो आपको दिखाई गई, और आप जो कीमत चुकाएँगे वह हमेशा दिखाई गई कीमत ही होती है।</p>
<p class="small">यह भाग 13 अक्टूबर 2026 को अपडेट किया गया।</p>
<h2>3. अर्ली-एक्सेस सूची</h2>
<ul>
<li><strong>डेटा:</strong> आपका ई-मेल पता और, यदि आप दें, आपका नाम, व्यवसाय का नाम, व्यवसाय का प्रकार, चुना गया विकल्प और ज़रूरी भाषाएँ।</li>
<li><strong>उद्देश्य:</strong> किट तैयार होने पर जुड़ते समय दिखाई गई कीमत पर आपको ई-मेल करना, और आपकी ज़रूरतों के बारे में अधिकतम दो छोटे प्रश्न पूछना। और कुछ नहीं।</li>
<li><strong>आधार:</strong> आपकी सहमति (DPDP अधिनियम धारा 6; GDPR अनुच्छेद 6(1)(a))।</li>
<li><strong>प्रोसेसर:</strong> Google (Google Sheets और Apps Script)। डेटा भारत और EU के बाहर स्टोर हो सकता है।</li>
<li><strong>रिटेंशन:</strong> किट लॉन्च के बाद 6 महीने तक, फिर मिटा दिया जाएगा। सहमति वापस लेने या मिटाने के अनुरोध पर तुरंत।</li>
<li><strong>कोई साझा करना नहीं, कोई बिक्री नहीं, विज्ञापन के लिए उपयोग नहीं।</strong></li>
</ul>
<h2>4. आपके अधिकार</h2>
<p>आप नीचे दिए फ़ॉर्म से किसी भी समय, उतनी ही आसानी से जितनी आसानी से दी थी, सहमति वापस ले सकते हैं। आप अपने डेटा का सारांश, सुधार या मिटाने की माँग कर सकते हैं, या किसी को नामित कर सकते हैं (DPDP अधिनियम धारा 11 से 14), और अपने GDPR अधिकारों का उपयोग कर सकते हैं।</p>
<p>हमारे उत्तर से संतुष्ट न हों तो आप फ़्रांस की संस्था <a href="https://www.cnil.fr/en/complaints" rel="nofollow">CNIL</a> से शिकायत कर सकते हैं। 13 मई 2027 से, जब बोर्ड की शिकायत संबंधी शक्तियाँ शुरू होंगी, आप हमारी शिकायत प्रक्रिया के बाद भारतीय डेटा संरक्षण बोर्ड से भी शिकायत कर सकते हैं (DPDP अधिनियम की धारा 13(3) और 27)।</p>
${rightsForm('hi')}
<h2>5. होस्टिंग</h2><p>साइट GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA पर होस्ट है।</p>
</section>`,
});

export const PAGES = [
  ['index.html', 'en', 'index', EN.index, 'hi/index.html'],
  ['check.html', 'en', 'check', EN.check, 'hi/check.html'],
  ['notice.html', 'en', 'notice', EN.notice, 'hi/notice.html'],
  ['kit.html', 'en', 'kit', EN.kit, 'hi/kit.html'],
  ['privacy.html', 'en', 'privacy', EN.privacy, 'hi/privacy.html'],
  ['terms.html', 'en', 'terms', EN.terms, null],
  ['hi/index.html', 'hi', 'index', HI.index, 'index.html'],
  ['hi/check.html', 'hi', 'check', HI.check, 'check.html'],
  ['hi/notice.html', 'hi', 'notice', HI.notice, 'notice.html'],
  ['hi/kit.html', 'hi', 'kit', HI.kit, 'kit.html'],
  ['hi/privacy.html', 'hi', 'privacy', HI.privacy, 'privacy.html'],
];
