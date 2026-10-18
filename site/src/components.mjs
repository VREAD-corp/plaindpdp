import { SITE, LANGS22 } from './config.mjs';
import { QUESTIONS } from './check-data.mjs';
import PD from '../assets/core.js';

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const inr = (n) => '₹' + n.toLocaleString('en-IN');

export const UI = {
  en: {
    skip: 'Skip to content', nav: [['index', 'Home'], ['check', 'Readiness check'], ['notice', 'Notice generator'], ['kit', 'Full kit']],
    langSwitch: 'हिंदी', langSwitchLabel: 'हिंदी में पढ़ें',
    footDisclaimer: 'PlainDPDP is a self-help template kit, not a law firm, and nothing on this site is legal advice. We read the DPDP Act 2023 and the DPDP Rules 2025 and cite them, but we may be wrong, and your situation may differ. For decisions that matter, ask an advocate or a qualified professional in India.',
    footBuilt: 'Built and run by Octave, the AI agent of READ FRANCE SAS. No human lawyer reviewed this site.',
    footCompany: `${SITE.company.name}, ${SITE.company.address}. SIREN ${SITE.company.siren} (${SITE.company.rcs}). Contact: <a href="mailto:${SITE.email}">${SITE.email}</a>`,
    privacy: 'Privacy', terms: 'Terms', updated: 'Last checked against the official texts on ' + SITE.updated + '.',
    ans: { yes: 'Yes', partly: 'Partly', no: 'No', unsure: 'Not sure' },
    qOf: 'Question', checkSubmit: 'See my score and gap list', checkReset: 'Start again',
    unanswered: 'Please answer every question. Unanswered: ',
    resTitle: 'Your result', resScore: 'Readiness score', resBand: { good: 'Mostly ready. Fix the gaps below and keep records.', partial: 'Partly ready. The gaps below are where a complaint or a breach would hurt.', low: 'Not ready yet. Start with the top three gaps; they carry the largest penalties or unlock the rest.' },
    resGaps: 'Your gaps, most important first', resNoGaps: 'No gaps from your answers. Keep your consent records and review once a year.',
    resRef: 'Where it is in the law', resWeight: { 3: 'High priority', 2: 'Medium priority', 1: 'Lower priority' },
    resNext: 'Next steps', resPrint: 'Print or save as PDF',
    resNote: 'Your answers stay in your browser. We only keep anonymous daily totals (for example, that a check was completed), never your answers.',
    resHow: 'How the score works: Yes = full points, Partly = half, No or Not sure = zero. Each question has a weight from 1 to 3. Weight 3 goes to the duties with the highest penalties in the Schedule to the Act (security safeguards up to ₹250 crore, breach reporting and children\'s data up to ₹200 crore) and to notice and consent, which every other duty depends on (up to ₹50 crore). "Does not apply" answers are left out. The weights are our judgement, not an official method.',
  },
  hi: {
    skip: 'सामग्री पर जाएँ', nav: [['index', 'होम'], ['check', 'तैयारी जाँच'], ['notice', 'सूचना जनरेटर'], ['kit', 'पूरा किट']],
    langSwitch: 'English', langSwitchLabel: 'Read in English',
    footDisclaimer: 'PlainDPDP एक स्व-सहायता टेम्पलेट किट है, कोई लॉ फ़र्म नहीं, और इस साइट की कोई भी बात कानूनी सलाह नहीं है। हमने DPDP अधिनियम 2023 और DPDP नियम 2025 पढ़कर उनका हवाला दिया है, पर हमसे गलती हो सकती है और आपकी स्थिति अलग हो सकती है। महत्वपूर्ण निर्णयों के लिए भारत में किसी अधिवक्ता या योग्य पेशेवर से सलाह लें।',
    footBuilt: 'इसे READ FRANCE SAS के AI एजेंट Octave ने बनाया और चलाता है। किसी वकील ने इस साइट की समीक्षा नहीं की है। हिंदी पाठ मशीन की सहायता से अनुवादित है और किसी मूल हिंदी भाषी कानूनी अनुवादक ने इसकी जाँच नहीं की है; अंग्रेज़ी पाठ ही मान्य है।',
    footCompany: `${SITE.company.name}, ${SITE.company.address}। SIREN ${SITE.company.siren} (${SITE.company.rcs})। संपर्क: <a href="mailto:${SITE.email}">${SITE.email}</a>`,
    privacy: 'गोपनीयता', terms: 'शर्तें (अंग्रेज़ी)', updated: 'आधिकारिक पाठ से अंतिम मिलान: 13 अक्टूबर 2026।',
    ans: { yes: 'हाँ', partly: 'आंशिक', no: 'नहीं', unsure: 'पता नहीं' },
    qOf: 'प्रश्न', checkSubmit: 'मेरा स्कोर और कमियों की सूची देखें', checkReset: 'फिर से शुरू करें',
    unanswered: 'कृपया हर प्रश्न का उत्तर दें। बिना उत्तर: ',
    resTitle: 'आपका परिणाम', resScore: 'तैयारी स्कोर', resBand: { good: 'काफ़ी हद तक तैयार। नीचे की कमियाँ दूर करें और रिकॉर्ड रखें।', partial: 'आंशिक रूप से तैयार। नीचे की कमियाँ वही हैं जहाँ शिकायत या ब्रीच से नुकसान होगा।', low: 'अभी तैयार नहीं। ऊपर की तीन कमियों से शुरू करें; इन पर सबसे बड़ा जुर्माना है या इनसे बाकी काम खुलता है।' },
    resGaps: 'आपकी कमियाँ, सबसे ज़रूरी पहले', resNoGaps: 'आपके उत्तरों में कोई कमी नहीं। सहमति के रिकॉर्ड रखें और साल में एक बार समीक्षा करें।',
    resRef: 'कानून में कहाँ', resWeight: { 3: 'उच्च प्राथमिकता', 2: 'मध्यम प्राथमिकता', 1: 'कम प्राथमिकता' },
    resNext: 'अगले कदम', resPrint: 'प्रिंट करें या PDF सेव करें',
    resNote: 'आपके उत्तर आपके ब्राउज़र में ही रहते हैं। हम केवल गुमनाम दैनिक कुल गिनती रखते हैं (जैसे कि एक जाँच पूरी हुई), आपके उत्तर कभी नहीं।',
    resHow: 'स्कोर कैसे बनता है: हाँ = पूरे अंक, आंशिक = आधे, नहीं या पता नहीं = शून्य। हर प्रश्न का भार 1 से 3 तक है। भार 3 उन दायित्वों को दिया गया है जिन पर अधिनियम की अनुसूची में सबसे बड़ा जुर्माना है (सुरक्षा उपाय ₹250 करोड़ तक, ब्रीच की सूचना और बच्चों का डेटा ₹200 करोड़ तक), और सूचना व सहमति को, जिन पर बाकी सारे दायित्व टिके हैं (₹50 करोड़ तक)। "लागू नहीं" वाले उत्तर गिने नहीं जाते। यह भार हमारा आकलन है, कोई आधिकारिक पद्धति नहीं।',
  },
};

/** The 15 questions as a plain HTML form; core.js scores it in the browser. */
export function checkForm(lang) {
  const u = UI[lang];
  const qs = QUESTIONS.map((q, i) => {
    const t = q[lang];
    const opts = ['yes', 'partly', 'no', 'unsure'].map((v) => `<label class="opt"><input type="radio" name="${q.id}" value="${v}" required> <span>${u.ans[v]}</span></label>`).join('');
    const na = q.na ? `<label class="opt opt-wide"><input type="radio" name="${q.id}" value="na"> <span>${esc(t.naLabel)}</span></label>` : '';
    return `<fieldset class="q" id="q-${q.id}" data-id="${q.id}" data-w="${q.w}" data-ref="${esc(q.ref)}" data-gap="${esc(t.gap)}" data-title="${esc(t.q)}">
<legend><span class="qn">${u.qOf} ${i + 1}/15</span> ${esc(t.q)}</legend>
<p class="help">${esc(t.help)} <span class="ref">(${esc(q.ref)})</span></p>
<div class="opts">${opts}${na}</div>
</fieldset>`;
  }).join('\n');
  return `<form id="check" class="check" novalidate data-lang="${lang}">
${qs}
<p id="check-error" class="error" role="alert" hidden></p>
<div class="actions"><button type="submit" class="btn">${u.checkSubmit}</button></div>
</form>
<section id="result" class="result" hidden tabindex="-1" aria-live="polite">
<h2>${u.resTitle}</h2>
<div class="score"><span class="score-num" id="score-num">0</span><span class="score-unit">/100</span><span class="score-lbl">${u.resScore}</span></div>
<div class="meter" aria-hidden="true"><span id="score-bar"></span></div>
<p id="score-band" class="band"></p>
<h3>${u.resGaps}</h3>
<ol id="gaps" class="gaps"></ol>
<p id="nogaps" hidden>${u.resNoGaps}</p>
<p class="small">${u.resHow}</p>
<p class="small">${u.resNote}</p>
<div class="actions"><button type="button" class="btn btn-ghost" id="print">${u.resPrint}</button> <button type="button" class="btn btn-ghost" id="reset">${u.checkReset}</button></div>
<script type="application/json" id="check-i18n">${JSON.stringify({ band: u.resBand, weight: u.resWeight, ref: u.resRef, unanswered: u.unanswered })}</script>
</section>`;
}

const G = {
  en: {
    s1: 'Your business', bizName: 'Legal name of the business', bizNameHint: 'As on your GST or Udyam registration, e.g. "Sharma Traders" or "Bright Path Coaching LLP".',
    website: 'Website or app link (recommended: Rule 3(c) asks the notice to give it)', bizAddress: 'Business address (optional)',
    s2: 'Who answers data questions and grievances', s2hint: 'Rule 9 asks you to publish the contact of a person who can answer questions about your processing. In a small business this is often the owner.',
    contactName: 'Name (optional)', contactRole: 'Role (optional)', contactRoleEx: 'e.g. Proprietor, Grievance Officer', contactEmail: 'E-mail for data requests', contactPhone: 'Phone (optional)', grievanceDays: 'Reply time for grievances (days)', grievanceHint: 'Rule 14 sets 90 days as the maximum. A shorter time builds trust.',
    s3: 'Personal data you collect', dataOther: 'Other items (comma-separated, optional)',
    s4: 'Why you use it', purposeOther: 'Other purposes (comma-separated, optional)', marketing: 'We send marketing messages (offers, newsletters) and ask for separate consent for them',
    s5: 'Vendors who handle the data for you', shareOther: 'Other vendors (comma-separated, optional)', crossBorder: 'Some vendors store or process data outside India (common with cloud and e-mail tools)',
    s6: 'Consent and children', withdrawHow: 'How people can withdraw consent (optional)', withdrawHint: 'Leave blank to use "write to [your e-mail]". Better: the same channel used to give consent, e.g. "tap Withdraw consent in Account > Privacy, or reply STOP on WhatsApp".',
    consentManager: 'Consent Manager you work with (optional)', cmHint: 'Consent Managers are registered with the Data Protection Board from 13 November 2026. Leave blank if you do not use one; the notice will say so.',
    children: 'Our customers or users include people under 18', date: 'Notice date',
    outLang: 'Language of the notice', outEn: 'English', outHi: 'Hindi (machine-assisted translation)',
    submit: 'Generate my notice', missing: 'Please fill: ', fieldNames: { bizName: 'business name', contactEmail: 'a valid e-mail for data requests', data: 'at least one data item', purposes: 'at least one purpose' },
    outTitle: 'Your draft notice', copy: 'Copy text', dlTxt: 'Download .txt', dlHtml: 'Download .html', copied: 'Copied',
    outCheck: 'Before you publish: check every line against what your business actually does, remove what is not true, and add anything missing. This draft covers the notice items in section 5 and Rule 3; it does not make you compliant on its own.',
    outHiNote: 'The Hindi version was produced with machine assistance and has not been checked by a native-speaker legal translator. Have it reviewed before you publish it.',
  },
  hi: {
    s1: 'आपका व्यवसाय', bizName: 'व्यवसाय का कानूनी नाम', bizNameHint: 'जैसा आपके GST या उद्यम पंजीकरण में है, जैसे "शर्मा ट्रेडर्स"।',
    website: 'वेबसाइट या ऐप का लिंक (सुझाया गया: नियम 3(c) के अनुसार सूचना में यह होना चाहिए)', bizAddress: 'व्यवसाय का पता (वैकल्पिक)',
    s2: 'डेटा से जुड़े प्रश्नों और शिकायतों का उत्तर कौन देगा', s2hint: 'नियम 9 के अनुसार ऐसे व्यक्ति का संपर्क प्रकाशित करना होगा जो आपकी प्रोसेसिंग के बारे में प्रश्नों का उत्तर दे सके। छोटे व्यवसाय में अक्सर यह मालिक ही होता है।',
    contactName: 'नाम (वैकल्पिक)', contactRole: 'पद (वैकल्पिक)', contactRoleEx: 'जैसे प्रोप्राइटर, शिकायत अधिकारी', contactEmail: 'डेटा अनुरोधों के लिए ई-मेल', contactPhone: 'फ़ोन (वैकल्पिक)', grievanceDays: 'शिकायत का उत्तर देने का समय (दिन)', grievanceHint: 'नियम 14 में अधिकतम 90 दिन हैं। कम समय भरोसा बढ़ाता है।',
    s3: 'आप कौन-सा व्यक्तिगत डेटा लेते हैं', dataOther: 'अन्य (कॉमा से अलग करें, वैकल्पिक)',
    s4: 'आप इसका उपयोग क्यों करते हैं', purposeOther: 'अन्य उद्देश्य (कॉमा से अलग करें, वैकल्पिक)', marketing: 'हम मार्केटिंग संदेश (ऑफ़र, न्यूज़लेटर) भेजते हैं और इनके लिए अलग सहमति लेते हैं',
    s5: 'आपके लिए डेटा संभालने वाले वेंडर', shareOther: 'अन्य वेंडर (कॉमा से अलग करें, वैकल्पिक)', crossBorder: 'कुछ वेंडर डेटा भारत के बाहर स्टोर या प्रोसेस करते हैं (क्लाउड और ई-मेल टूल में आम है)',
    s6: 'सहमति और बच्चे', withdrawHow: 'लोग सहमति कैसे वापस ले सकते हैं (वैकल्पिक)', withdrawHint: 'खाली छोड़ने पर "[आपके ई-मेल] पर लिखें" लिखा जाएगा। बेहतर: वही माध्यम जिससे सहमति दी गई, जैसे "WhatsApp पर STOP लिखें"।',
    consentManager: 'आप जिस सहमति प्रबंधक के साथ काम करते हैं (वैकल्पिक)', cmHint: 'सहमति प्रबंधकों का पंजीकरण 13 नवंबर 2026 से डेटा संरक्षण बोर्ड में होता है। यदि आप किसी का उपयोग नहीं करते, तो खाली छोड़ें; सूचना में यही लिखा जाएगा।',
    children: 'हमारे ग्राहकों या उपयोगकर्ताओं में 18 वर्ष से कम आयु के लोग हैं', date: 'सूचना की तारीख़',
    outLang: 'सूचना की भाषा', outEn: 'अंग्रेज़ी', outHi: 'हिंदी (मशीन-सहायता से अनुवाद)',
    submit: 'मेरी सूचना बनाएँ', missing: 'कृपया भरें: ', fieldNames: { bizName: 'व्यवसाय का नाम', contactEmail: 'डेटा अनुरोधों के लिए सही ई-मेल', data: 'कम से कम एक डेटा', purposes: 'कम से कम एक उद्देश्य' },
    outTitle: 'आपकी ड्राफ़्ट सूचना', copy: 'टेक्स्ट कॉपी करें', dlTxt: '.txt डाउनलोड', dlHtml: '.html डाउनलोड', copied: 'कॉपी हो गया',
    outCheck: 'प्रकाशित करने से पहले: हर पंक्ति को अपने व्यवसाय के असली काम से मिलाइए, जो सच नहीं है उसे हटाइए, और जो छूटा है उसे जोड़िए। यह ड्राफ़्ट धारा 5 और नियम 3 की सूचना के बिंदुओं को कवर करता है; केवल इससे आप अनुपालन में नहीं आ जाते।',
    outHiNote: 'हिंदी संस्करण मशीन की सहायता से बनाया गया है और किसी मूल हिंदी भाषी कानूनी अनुवादक ने इसकी जाँच नहीं की है। प्रकाशित करने से पहले इसकी समीक्षा करवाएँ।',
  },
};

const box = (name, value, label, checked) => `<label class="chk"><input type="checkbox" name="${name}" value="${value}"${checked ? ' checked' : ''}> <span>${esc(label)}</span></label>`;

export function generatorForm(lang) {
  const g = G[lang];
  const O = PD.OPTIONS;
  const defData = ['name', 'phone', 'email'];
  const defPurpose = ['deliver', 'transactional', 'support'];
  const field = (id, label, type = 'text', extra = '') => `<label class="fld" for="${id}"><span>${label}</span><input id="${id}" name="${id}" type="${type}" ${extra}></label>`;
  const ostr = (grp, k) => O[grp][k][lang];
  return `<form id="gen" class="gen" novalidate data-lang="${lang}">
<fieldset><legend>${g.s1}</legend>
${field('bizName', g.bizName, 'text', 'maxlength="120" autocomplete="organization" required')}
<p class="hint">${esc(g.bizNameHint)}</p>
${field('website', g.website, 'text', 'maxlength="120" inputmode="url"')}
${field('bizAddress', g.bizAddress, 'text', 'maxlength="200" autocomplete="street-address"')}
</fieldset>
<fieldset><legend>${g.s2}</legend>
<p class="hint">${esc(g.s2hint)}</p>
${field('contactName', g.contactName, 'text', 'maxlength="100" autocomplete="name"')}
${field('contactRole', g.contactRole, 'text', `maxlength="100" placeholder="${esc(g.contactRoleEx)}"`)}
${field('contactEmail', g.contactEmail, 'email', 'maxlength="120" autocomplete="email" required')}
${field('contactPhone', g.contactPhone, 'tel', 'maxlength="40" autocomplete="tel"')}
${field('grievanceDays', g.grievanceDays, 'number', 'min="1" max="90" value="30" inputmode="numeric"')}
<p class="hint">${esc(g.grievanceHint)}</p>
</fieldset>
<fieldset><legend>${g.s3}</legend>
<div class="chks">${Object.keys(O.data).map((k) => box('data', k, ostr('data', k), defData.includes(k))).join('')}</div>
${field('dataOther', g.dataOther, 'text', 'maxlength="400"')}
</fieldset>
<fieldset><legend>${g.s4}</legend>
<div class="chks">${Object.keys(O.purpose).map((k) => box('purposes', k, ostr('purpose', k), defPurpose.includes(k))).join('')}</div>
${field('purposeOther', g.purposeOther, 'text', 'maxlength="400"')}
<div class="chks">${box('marketing', '1', g.marketing, false)}</div>
</fieldset>
<fieldset><legend>${g.s5}</legend>
<div class="chks">${Object.keys(O.share).map((k) => box('share', k, ostr('share', k), false)).join('')}</div>
${field('shareOther', g.shareOther, 'text', 'maxlength="400"')}
<div class="chks">${box('crossBorder', '1', g.crossBorder, false)}</div>
</fieldset>
<fieldset><legend>${g.s6}</legend>
${field('withdrawHow', g.withdrawHow, 'text', 'maxlength="200"')}
<p class="hint">${esc(g.withdrawHint)}</p>
${field('consentManager', g.consentManager, 'text', 'maxlength="80"')}
<p class="hint">${esc(g.cmHint)}</p>
<div class="chks">${box('children', '1', g.children, false)}</div>
${field('date', g.date, 'date', '')}
<div class="radios" role="radiogroup" aria-label="${g.outLang}"><span class="lbl">${g.outLang}</span>
<label class="opt"><input type="radio" name="outLang" value="en"${lang === 'en' ? ' checked' : ''}> <span>${g.outEn}</span></label>
<label class="opt"><input type="radio" name="outLang" value="hi"${lang === 'hi' ? ' checked' : ''}> <span>${g.outHi}</span></label></div>
</fieldset>
<p id="gen-error" class="error" role="alert" hidden></p>
<div class="actions"><button type="submit" class="btn">${g.submit}</button></div>
</form>
<section id="out" class="out" hidden tabindex="-1">
<h2>${g.outTitle}</h2>
<p class="warn">${esc(g.outCheck)}</p>
<p class="warn" id="out-hi-note" hidden>${esc(g.outHiNote)}</p>
<div class="actions"><button type="button" class="btn" id="copy">${g.copy}</button> <button type="button" class="btn btn-ghost" id="dl-txt">${g.dlTxt}</button> <button type="button" class="btn btn-ghost" id="dl-html">${g.dlHtml}</button> <span id="copied" class="small" hidden>${g.copied}</span></div>
<div id="notice-out" class="paper"></div>
<script type="application/json" id="gen-i18n">${JSON.stringify({ missing: g.missing, fieldNames: g.fieldNames })}</script>
</section>`;
}

const F = {
  en: {
    title: 'Join early access', offer: 'Which option interests you?',
    pack: (p) => `Starter kit, ${inr(p)} one-off`, packSub: 'All templates, notices in 22 languages, 12 months of updates.',
    pro: (p) => `Pro, ${inr(p)} per month`, proSub: 'Hosted consent log, rights-request inbox and notices kept up to date. Cancel any month.',
    email: 'Work e-mail', name: 'Your name (optional)', business: 'Business name (optional)', btype: 'Type of business',
    btypes: { d2c: 'Online shop or D2C brand', clinic: 'Clinic, hospital or pharmacy', education: 'School, coaching or edtech', saas: 'Software or app', services: 'Services firm', agency: 'Web or marketing agency', 'ca-cs': 'CA, CS or law practice', manufacturing: 'Manufacturing or trading', ngo: 'NGO or trust', other: 'Other' },
    langs: 'Notice languages you need (optional)',
    noticeTitle: 'Before you join: how we use these details',
    notice: [
      `<strong>Who we are.</strong> ${SITE.company.name} (Paris, France) runs PlainDPDP and is the Data Fiduciary for this form.`,
      '<strong>What we collect.</strong> Your e-mail address, and if you fill them in, your name, business name, business type, the option you chose and the languages you need.',
      '<strong>Why.</strong> Only to e-mail you when the kit is ready, at the price shown here, and to ask you up to two short questions about what you need. No newsletter, no sharing, no sale of your data.',
      '<strong>How long.</strong> Until the kit launches plus 6 months, then deleted. Earlier if you withdraw consent.',
      `<strong>Your rights.</strong> You can withdraw consent at any time, and ask to see, correct or erase your data, on our <a href="privacy.html#rights">privacy page</a> (one form, a few seconds) or by writing to <a href="mailto:${SITE.email}">${SITE.email}</a>. Because we are a French company, the EU GDPR applies and you can complain to the CNIL; from 13 May 2027 you can also complain to the Data Protection Board of India.`,
      'Stored in a Google Sheet of READ FRANCE SAS (Google acts as our processor; servers may be outside India).',
    ],
    consent: 'I agree that READ FRANCE SAS uses these details to contact me about PlainDPDP early access, as described above.',
    submit: 'Join early access (no payment)', sending: 'Sending…',
    ok: 'Done. You are on the early-access list. We will write to you when the kit is ready (questions: contact@jalonel.com). Nothing has been charged.',
    err: 'That did not go through. Check your e-mail address and try again, or write to contact@jalonel.com.',
    errConsent: 'Please tick the consent box: we cannot add you without it.',
    noPay: 'No payment is taken today. The kit is not on sale yet.',
  },
  hi: {
    title: 'अर्ली एक्सेस से जुड़ें', offer: 'आपको कौन-सा विकल्प चाहिए?',
    pack: (p) => `स्टार्टर किट, ${inr(p)} एक बार`, packSub: 'सभी टेम्पलेट, 22 भाषाओं में सूचनाएँ, 12 महीने के अपडेट।',
    pro: (p) => `प्रो, ${inr(p)} प्रति माह`, proSub: 'होस्टेड सहमति लॉग, अधिकार-अनुरोध इनबॉक्स और अपडेटेड सूचनाएँ। किसी भी महीने बंद करें।',
    email: 'काम का ई-मेल', name: 'आपका नाम (वैकल्पिक)', business: 'व्यवसाय का नाम (वैकल्पिक)', btype: 'व्यवसाय का प्रकार',
    btypes: { d2c: 'ऑनलाइन दुकान या D2C ब्रांड', clinic: 'क्लिनिक, अस्पताल या फ़ार्मेसी', education: 'स्कूल, कोचिंग या एडटेक', saas: 'सॉफ़्टवेयर या ऐप', services: 'सेवा फ़र्म', agency: 'वेब या मार्केटिंग एजेंसी', 'ca-cs': 'CA, CS या लॉ प्रैक्टिस', manufacturing: 'मैन्युफ़ैक्चरिंग या ट्रेडिंग', ngo: 'NGO या ट्रस्ट', other: 'अन्य' },
    langs: 'आपको किन भाषाओं में सूचना चाहिए (वैकल्पिक)',
    noticeTitle: 'जुड़ने से पहले: हम इस जानकारी का उपयोग कैसे करते हैं',
    notice: [
      `<strong>हम कौन हैं।</strong> ${SITE.company.name} (पेरिस, फ़्रांस) PlainDPDP चलाता है और इस फ़ॉर्म के लिए डेटा फ़िड्युशरी है।`,
      '<strong>हम क्या लेते हैं।</strong> आपका ई-मेल पता, और यदि आप भरें तो आपका नाम, व्यवसाय का नाम, व्यवसाय का प्रकार, चुना गया विकल्प और ज़रूरी भाषाएँ।',
      '<strong>क्यों।</strong> केवल किट तैयार होने पर यहाँ दिखाई गई कीमत पर आपको ई-मेल करने के लिए, और आपकी ज़रूरत के बारे में अधिकतम दो छोटे प्रश्न पूछने के लिए। कोई न्यूज़लेटर नहीं, किसी के साथ साझा नहीं, डेटा की बिक्री नहीं।',
      '<strong>कितने समय तक।</strong> किट लॉन्च होने के बाद 6 महीने तक, फिर मिटा दिया जाएगा। सहमति वापस लेने पर उससे पहले।',
      `<strong>आपके अधिकार।</strong> आप किसी भी समय सहमति वापस ले सकते हैं और अपना डेटा देखने, सुधारने या मिटाने को कह सकते हैं, हमारे <a href="privacy.html#rights">गोपनीयता पेज</a> पर (एक फ़ॉर्म, कुछ सेकंड) या <a href="mailto:${SITE.email}">${SITE.email}</a> पर लिखकर। हम फ़्रांसीसी कंपनी हैं, इसलिए EU GDPR लागू है और आप CNIL से शिकायत कर सकते हैं; 13 मई 2027 से आप भारतीय डेटा संरक्षण बोर्ड से भी शिकायत कर सकते हैं।`,
      'डेटा READ FRANCE SAS की Google Sheet में रखा जाता है (Google हमारा प्रोसेसर है; सर्वर भारत के बाहर हो सकते हैं)।',
    ],
    consent: 'मैं सहमत हूँ कि READ FRANCE SAS ऊपर बताए अनुसार PlainDPDP अर्ली एक्सेस के बारे में मुझसे संपर्क करने के लिए इस जानकारी का उपयोग करे।',
    submit: 'अर्ली एक्सेस से जुड़ें (कोई भुगतान नहीं)', sending: 'भेजा जा रहा है…',
    ok: 'हो गया। आप अर्ली-एक्सेस सूची में हैं। किट तैयार होने पर हम आपको लिखेंगे (प्रश्न: contact@jalonel.com)। कोई शुल्क नहीं लिया गया है।',
    err: 'यह नहीं भेजा जा सका। अपना ई-मेल पता जाँचें और फिर कोशिश करें, या contact@jalonel.com पर लिखें।',
    errConsent: 'कृपया सहमति बॉक्स पर टिक करें: इसके बिना हम आपको नहीं जोड़ सकते।',
    noPay: 'आज कोई भुगतान नहीं लिया जाता। किट अभी बिक्री पर नहीं है।',
  },
};

export function preorderForm(lang) {
  const f = F[lang];
  const langs = LANGS22.map(([c, en, hi]) => box('langs', c, lang === 'hi' ? hi : en, false)).join('');
  return `<form id="preorder" class="preorder" data-section="preorder" novalidate data-lang="${lang}">
<h2 id="join">${f.title}</h2>
<p class="small">${f.noPay}</p>
<fieldset><legend>${f.offer}</legend>
<label class="offer"><input type="radio" name="offer" value="pack-4999" checked> <span><strong>${f.pack(SITE.prices.pack)}</strong><br><span class="small">${f.packSub}</span></span></label>
<label class="offer"><input type="radio" name="offer" value="pro-999" data-pro> <span><strong data-pro-label data-a="${esc(f.pro(SITE.prices.a))}" data-b="${esc(f.pro(SITE.prices.b))}">${f.pro(SITE.prices.a)}</strong><br><span class="small">${f.proSub}</span></span></label>
</fieldset>
<label class="fld" for="po-email"><span>${f.email}</span><input id="po-email" name="email" type="email" maxlength="254" autocomplete="email" required></label>
<label class="fld" for="po-name"><span>${f.name}</span><input id="po-name" name="name" type="text" maxlength="80" autocomplete="name"></label>
<label class="fld" for="po-business"><span>${f.business}</span><input id="po-business" name="business" type="text" maxlength="120" autocomplete="organization"></label>
<label class="fld" for="po-btype"><span>${f.btype}</span><select id="po-btype" name="btype">${Object.entries(f.btypes).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('')}</select></label>
<details class="langs" id="po-langs"><summary>${f.langs}</summary><div class="chks chks-3">${langs}</div></details>
<div class="hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>
<div class="consent-box">
<h3>${f.noticeTitle}</h3>
<ul>${f.notice.map((n) => `<li>${n}</li>`).join('')}</ul>
<label class="chk chk-consent"><input type="checkbox" name="consent" id="po-consent" required> <span>${f.consent}</span></label>
</div>
<p id="po-error" class="error" role="alert" hidden></p>
<div class="actions"><button type="submit" class="btn" data-sending="${esc(f.sending)}">${f.submit}</button></div>
<p id="po-ok" class="ok" role="status" hidden>${f.ok}</p>
<script type="application/json" id="po-i18n">${JSON.stringify({ err: f.err, errConsent: f.errConsent })}</script>
</form>`;
}

const R = {
  en: {
    title: 'Withdraw consent or make a request', type: 'What do you want to do?',
    types: { withdraw: 'Withdraw my consent (removes me from the early-access list)', erase: 'Erase my data', access: 'Get a summary of my data', correct: 'Correct my data', grievance: 'Raise a grievance' },
    email: 'The e-mail address you used', message: 'Details (optional)', submit: 'Send request',
    ok: { done_automatically: 'Done. Your details have been removed from our list. If you also want a written confirmation, write to contact@jalonel.com.', to_answer_by_email: 'Received. We will reply to this e-mail address within 30 days.' },
    err: 'That did not go through. Please write to contact@jalonel.com instead.',
  },
  hi: {
    title: 'सहमति वापस लें या अनुरोध करें', type: 'आप क्या करना चाहते हैं?',
    types: { withdraw: 'मेरी सहमति वापस लें (मुझे अर्ली-एक्सेस सूची से हटाएँ)', erase: 'मेरा डेटा मिटाएँ', access: 'मेरे डेटा का सारांश दें', correct: 'मेरा डेटा सुधारें', grievance: 'शिकायत दर्ज करें' },
    email: 'आपने जो ई-मेल पता दिया था', message: 'विवरण (वैकल्पिक)', submit: 'अनुरोध भेजें',
    ok: { done_automatically: 'हो गया। आपका विवरण हमारी सूची से हटा दिया गया है। लिखित पुष्टि चाहिए तो contact@jalonel.com पर लिखें।', to_answer_by_email: 'मिल गया। हम 30 दिनों के भीतर इसी ई-मेल पते पर उत्तर देंगे।' },
    err: 'यह नहीं भेजा जा सका। कृपया contact@jalonel.com पर लिखें।',
  },
};

export function rightsForm(lang) {
  const r = R[lang];
  return `<form id="rights" class="rights" novalidate data-lang="${lang}">
<h2 id="rights-title">${r.title}</h2>
<fieldset><legend>${r.type}</legend>
${Object.entries(r.types).map(([k, v], i) => `<label class="opt opt-wide"><input type="radio" name="type" value="${k}"${i === 0 ? ' checked' : ''}> <span>${esc(v)}</span></label>`).join('')}
</fieldset>
<label class="fld" for="r-email"><span>${r.email}</span><input id="r-email" name="email" type="email" maxlength="254" autocomplete="email" required></label>
<label class="fld" for="r-message"><span>${r.message}</span><textarea id="r-message" name="message" maxlength="1000" rows="3"></textarea></label>
<div class="hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>
<p id="r-error" class="error" role="alert" hidden></p>
<div class="actions"><button type="submit" class="btn">${r.submit}</button></div>
<p id="r-ok" class="ok" role="status" hidden></p>
<script type="application/json" id="r-i18n">${JSON.stringify({ ok: r.ok, err: r.err })}</script>
</form>`;
}
