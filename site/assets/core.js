/* PlainDPDP core: readiness-check scoring and privacy-notice builder.
   Plain script for the browser (window.PD) and CommonJS for the unit tests. No dependencies. */
(function (root) {
  'use strict';

  /* ---------- readiness check ---------- */
  // answer values: 'yes' = 1, 'partly' = 0.5, 'no' / 'unsure' = 0, 'na' = left out of the score.
  var VALUE = { yes: 1, partly: 0.5, no: 0, unsure: 0 };

  function band(pct) { return pct >= 75 ? 'good' : pct >= 40 ? 'partial' : 'low'; }

  /** items: [{id, w, v}] -> {score, max, pct, band, answered, gaps:[{id, w, v, lost}]} (gaps sorted: biggest loss first). */
  function score(items) {
    var s = 0, max = 0, answered = 0, gaps = [];
    items.forEach(function (it, i) {
      if (!it.v) return;
      answered++;
      if (it.v === 'na') return;
      var val = VALUE[it.v];
      if (val === undefined) throw new Error('bad answer ' + it.v);
      s += it.w * val; max += it.w;
      if (val < 1) gaps.push({ id: it.id, w: it.w, v: it.v, lost: it.w * (1 - val), i: i });
    });
    gaps.sort(function (a, b) { return b.lost - a.lost || a.i - b.i; });
    var pct = max ? Math.round((s / max) * 100) : 0;
    return { score: s, max: max, pct: pct, band: band(pct), answered: answered, gaps: gaps };
  }

  /* ---------- privacy-notice builder ---------- */
  var T = {
    en: {
      title: 'Privacy notice: {name}',
      updated: 'Version of {date}',
      intro: '{name} ("we", "us") decides why and how your personal data is processed, so we are a Data Fiduciary under the Digital Personal Data Protection Act, 2023 (the DPDP Act). This notice explains what we collect, why we collect it, and how you can withdraw consent, use your rights and complain.',
      site: 'Our website or app: {website}. You can use it, or the contact details in section 9, to withdraw consent, use your rights and complain.',
      langOpt: 'You can read this notice in English, or ask us for it in any of the 22 languages listed in the Eighth Schedule to the Constitution of India, by writing to {email}.',
      hData: '1. Personal data we collect',
      dataLead: 'We collect only the items below:',
      hPurpose: '2. Why we use it, and what it lets us do for you',
      purposeLead: 'We ask for your consent to use the data above for these purposes:',
      purposeLimit: 'We will not use your personal data for any other purpose unless we give you a new notice and ask for your consent again, or the law allows or requires it.',
      hMarketing: 'Marketing messages',
      marketing: 'We send offers and newsletters only if you separately agree to receive them. You can stop them at any time by replying STOP or using the unsubscribe link, and this does not affect your orders or account.',
      hShare: '3. Who processes it for us',
      shareLead: 'We use these service providers (Data Processors). Each one works for us under a written contract and may use your data only on our instructions:',
      shareNone: 'We do not share your personal data with other businesses, except where the law requires it.',
      crossBorder: 'Some of these providers may store or process your data outside India. We transfer data abroad only as permitted under section 16 of the DPDP Act.',
      hKeep: '4. How long we keep it',
      keep: 'We keep your personal data only as long as it is needed for the purposes above. We erase it, and ask our processors to erase it, when you withdraw consent or when the purpose is no longer being served, whichever is earlier, unless a law requires us to keep it longer (for example, tax and accounting records). As Rule 8(3) of the DPDP Rules 2025 requires, we keep the personal data, traffic data and logs of each processing for at least one year from the date of that processing, and then erase them unless another law requires longer.',
      hSecure: '5. How we protect it',
      secure: 'We take reasonable security safeguards to prevent a personal data breach, including access control, encryption where appropriate, and logs of who accesses the data. If a breach affects your data, we will inform you and the Data Protection Board of India as the law requires.',
      hChild: '6. Children',
      childYes: 'If you are under 18, we need the verifiable consent of your parent or lawful guardian before we process your personal data. We do not track or monitor the behaviour of children and do not show them targeted advertising.',
      childNo: 'Our services are not meant for anyone under 18. If we find that we hold a child\'s personal data without verifiable consent from a parent or lawful guardian, we will erase it.',
      hWithdraw: '7. Withdrawing your consent',
      withdraw: 'You can withdraw your consent at any time, as easily as you gave it: {how}. Withdrawal does not affect anything we lawfully did before it. Once you withdraw, we and our processors will stop processing your data within a reasonable time, unless the law requires or allows us to continue. If you withdraw consent for data that a service needs, we may no longer be able to provide that service.',
      withdrawHowDefault: 'write to {email}',
      hCm: 'Consent Managers',
      cmYes: 'You can also give, manage, review or withdraw your consent to us through {cm}, a Consent Manager registered with the Data Protection Board of India.',
      cmNo: 'The DPDP Act lets you give, manage, review or withdraw consent through a Consent Manager registered with the Data Protection Board of India. We do not work with a Consent Manager yet; if we start, we will name it in this notice.',
      hRights: '8. Your rights',
      rightsLead: 'Under the DPDP Act you have the right to:',
      rights: [
        'get a summary of the personal data we process about you, the processing we do, and the other Data Fiduciaries and Data Processors we have shared it with (section 11);',
        'have your personal data corrected, completed, updated or erased (section 12);',
        'have your grievances answered by us (section 13);',
        'nominate another person to use your rights if you die or become unable to do so (section 14).'
      ],
      rightsHow: 'To use any of these rights, write to {email}. We may ask you for information to confirm your identity.',
      duties: 'The DPDP Act also asks you not to file false or frivolous complaints and to give correct information when you ask us to correct your data (section 15).',
      hContact: '9. Contact and grievances',
      contactLead: 'For any question about how we process your personal data, or to raise a grievance, contact:',
      grievanceTime: 'We will reply to your grievance within {days} days.',
      hBoard: '10. Complaint to the Data Protection Board of India',
      board: 'If you are not satisfied with our reply, or we do not reply in time, you can complain to the Data Protection Board of India, which receives complaints digitally (section 28 of the DPDP Act). You need to use our grievance process first (section 13(3)).',
      hChanges: '11. Changes to this notice',
      changes: 'If we change this notice in a way that affects how we use your data, we will tell you and, where the law requires, ask for your consent again.',
      fields: { name: 'Name', role: 'Role', email: 'E-mail', phone: 'Phone', address: 'Address', website: 'Website' }
    },
    hi: {
      title: 'गोपनीयता सूचना: {name}',
      updated: '{date} का संस्करण',
      intro: '{name} ("हम") यह तय करता है कि आपका व्यक्तिगत डेटा क्यों और कैसे प्रोसेस किया जाए, इसलिए डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (DPDP अधिनियम) के तहत हम डेटा फ़िड्युशरी हैं। यह सूचना बताती है कि हम कौन-सा डेटा लेते हैं, क्यों लेते हैं, और आप अपनी सहमति कैसे वापस ले सकते हैं, अपने अधिकारों का उपयोग कैसे कर सकते हैं और शिकायत कैसे कर सकते हैं।',
      site: 'हमारी वेबसाइट या ऐप: {website}। सहमति वापस लेने, अपने अधिकारों का उपयोग करने और शिकायत करने के लिए आप इसका, या धारा 9 में दिए संपर्क विवरण का उपयोग कर सकते हैं।',
      langOpt: 'आप यह सूचना अंग्रेज़ी में पढ़ सकते हैं, या {email} पर लिखकर इसे भारत के संविधान की आठवीं अनुसूची में दी गई 22 भाषाओं में से किसी भी भाषा में माँग सकते हैं।',
      hData: '1. हम कौन-सा व्यक्तिगत डेटा लेते हैं',
      dataLead: 'हम केवल नीचे दी गई जानकारी लेते हैं:',
      hPurpose: '2. हम इसका उपयोग क्यों करते हैं, और इससे आपको क्या सेवा मिलती है',
      purposeLead: 'हम ऊपर दिए गए डेटा का इन उद्देश्यों के लिए उपयोग करने हेतु आपकी सहमति माँगते हैं:',
      purposeLimit: 'हम आपके व्यक्तिगत डेटा का उपयोग किसी अन्य उद्देश्य के लिए नहीं करेंगे, जब तक कि हम आपको नई सूचना देकर फिर से आपकी सहमति न लें, या कानून इसकी अनुमति या अपेक्षा न करे।',
      hMarketing: 'मार्केटिंग संदेश',
      marketing: 'ऑफ़र और न्यूज़लेटर हम तभी भेजते हैं जब आप इसके लिए अलग से सहमति दें। आप किसी भी समय STOP लिखकर या अनसब्सक्राइब लिंक से इन्हें बंद कर सकते हैं; इससे आपके ऑर्डर या अकाउंट पर कोई असर नहीं पड़ता।',
      hShare: '3. हमारे लिए डेटा कौन प्रोसेस करता है',
      shareLead: 'हम इन सेवा प्रदाताओं (डेटा प्रोसेसर) का उपयोग करते हैं। हर प्रदाता लिखित अनुबंध के तहत हमारे लिए काम करता है और आपके डेटा का उपयोग केवल हमारे निर्देश पर कर सकता है:',
      shareNone: 'हम आपका व्यक्तिगत डेटा अन्य व्यवसायों के साथ साझा नहीं करते, सिवाय उन मामलों के जहाँ कानून इसकी अपेक्षा करता है।',
      crossBorder: 'इनमें से कुछ प्रदाता आपका डेटा भारत के बाहर स्टोर या प्रोसेस कर सकते हैं। हम डेटा विदेश केवल DPDP अधिनियम की धारा 16 के तहत अनुमति होने पर ही भेजते हैं।',
      hKeep: '4. हम इसे कितने समय तक रखते हैं',
      keep: 'हम आपका व्यक्तिगत डेटा केवल तब तक रखते हैं जब तक ऊपर दिए गए उद्देश्यों के लिए उसकी ज़रूरत है। आपके सहमति वापस लेने पर, या उद्देश्य पूरा हो जाने पर (जो भी पहले हो), हम उसे मिटा देते हैं और अपने प्रोसेसरों से भी मिटवाते हैं, जब तक कि किसी कानून के तहत उसे अधिक समय तक रखना ज़रूरी न हो (जैसे टैक्स और लेखा रिकॉर्ड)। DPDP नियम 2025 के नियम 8(3) के अनुसार हम हर प्रोसेसिंग का व्यक्तिगत डेटा, ट्रैफ़िक डेटा और लॉग उस प्रोसेसिंग की तारीख़ से कम से कम एक वर्ष तक रखते हैं, और फिर उन्हें मिटा देते हैं, जब तक कोई अन्य कानून अधिक समय तक रखने को न कहे।',
      hSecure: '5. हम इसकी सुरक्षा कैसे करते हैं',
      secure: 'व्यक्तिगत डेटा के उल्लंघन (ब्रीच) को रोकने के लिए हम उचित सुरक्षा उपाय अपनाते हैं, जैसे एक्सेस नियंत्रण, जहाँ उचित हो वहाँ एन्क्रिप्शन, और डेटा तक किसने पहुँच की इसका लॉग। यदि किसी ब्रीच से आपका डेटा प्रभावित होता है, तो हम कानून के अनुसार आपको और भारतीय डेटा संरक्षण बोर्ड को सूचित करेंगे।',
      hChild: '6. बच्चे',
      childYes: 'यदि आपकी आयु 18 वर्ष से कम है, तो आपका व्यक्तिगत डेटा प्रोसेस करने से पहले हमें आपके माता-पिता या वैध अभिभावक की सत्यापन-योग्य सहमति चाहिए। हम बच्चों के व्यवहार की ट्रैकिंग या निगरानी नहीं करते और उन्हें लक्षित विज्ञापन नहीं दिखाते।',
      childNo: 'हमारी सेवाएँ 18 वर्ष से कम आयु के किसी व्यक्ति के लिए नहीं हैं। यदि हमें पता चलता है कि हमारे पास माता-पिता या वैध अभिभावक की सत्यापन-योग्य सहमति के बिना किसी बच्चे का व्यक्तिगत डेटा है, तो हम उसे मिटा देंगे।',
      hWithdraw: '7. अपनी सहमति वापस लेना',
      withdraw: 'आप किसी भी समय अपनी सहमति वापस ले सकते हैं, उतनी ही आसानी से जितनी आसानी से आपने दी थी: {how}। सहमति वापस लेने से उससे पहले कानूनी रूप से किए गए प्रोसेसिंग पर असर नहीं पड़ता। सहमति वापस लेने के बाद हम और हमारे प्रोसेसर उचित समय के भीतर आपके डेटा की प्रोसेसिंग बंद कर देंगे, जब तक कि कानून हमें जारी रखने की अपेक्षा या अनुमति न दे। यदि आप किसी सेवा के लिए ज़रूरी डेटा की सहमति वापस लेते हैं, तो हो सकता है कि हम वह सेवा न दे पाएँ।',
      withdrawHowDefault: '{email} पर लिखें',
      hCm: 'सहमति प्रबंधक (Consent Manager)',
      cmYes: 'आप {cm} के माध्यम से भी, जो भारतीय डेटा संरक्षण बोर्ड के पास पंजीकृत सहमति प्रबंधक है, हमें अपनी सहमति दे सकते हैं, उसका प्रबंधन और समीक्षा कर सकते हैं, या उसे वापस ले सकते हैं।',
      cmNo: 'DPDP अधिनियम के तहत आप भारतीय डेटा संरक्षण बोर्ड के पास पंजीकृत किसी सहमति प्रबंधक (Consent Manager) के माध्यम से सहमति दे सकते हैं, उसका प्रबंधन और समीक्षा कर सकते हैं, या उसे वापस ले सकते हैं। अभी हम किसी सहमति प्रबंधक के साथ काम नहीं करते; यदि शुरू करेंगे, तो उसका नाम इस सूचना में देंगे।',
      hRights: '8. आपके अधिकार',
      rightsLead: 'DPDP अधिनियम के तहत आपको ये अधिकार हैं:',
      rights: [
        'हम आपके बारे में कौन-सा व्यक्तिगत डेटा प्रोसेस करते हैं, कैसी प्रोसेसिंग करते हैं, और किन अन्य डेटा फ़िड्युशरी व डेटा प्रोसेसरों के साथ उसे साझा किया है, इसका सारांश पाना (धारा 11);',
        'अपने व्यक्तिगत डेटा को सुधरवाना, पूरा करवाना, अपडेट करवाना या मिटवाना (धारा 12);',
        'अपनी शिकायतों का हमसे उत्तर पाना (धारा 13);',
        'मृत्यु या असमर्थता की स्थिति में अपने अधिकारों का उपयोग करने के लिए किसी अन्य व्यक्ति को नामित करना (धारा 14)।'
      ],
      rightsHow: 'इनमें से किसी भी अधिकार का उपयोग करने के लिए {email} पर लिखें। आपकी पहचान की पुष्टि के लिए हम आपसे कुछ जानकारी माँग सकते हैं।',
      duties: 'DPDP अधिनियम आपसे यह भी अपेक्षा करता है कि आप झूठी या तुच्छ शिकायत दर्ज न करें और डेटा सुधरवाते समय सही जानकारी दें (धारा 15)।',
      hContact: '9. संपर्क और शिकायतें',
      contactLead: 'हम आपका व्यक्तिगत डेटा कैसे प्रोसेस करते हैं, इस बारे में किसी भी प्रश्न या शिकायत के लिए संपर्क करें:',
      grievanceTime: 'हम आपकी शिकायत का उत्तर {days} दिनों के भीतर देंगे।',
      hBoard: '10. भारतीय डेटा संरक्षण बोर्ड से शिकायत',
      board: 'यदि आप हमारे उत्तर से संतुष्ट नहीं हैं, या हम समय पर उत्तर नहीं देते, तो आप भारतीय डेटा संरक्षण बोर्ड से शिकायत कर सकते हैं, जो शिकायतें डिजिटल रूप से लेता है (DPDP अधिनियम की धारा 28)। इससे पहले आपको हमारी शिकायत प्रक्रिया का उपयोग करना होगा (धारा 13(3))।',
      hChanges: '11. इस सूचना में बदलाव',
      changes: 'यदि हम इस सूचना में ऐसा बदलाव करते हैं जिससे आपके डेटा के उपयोग पर असर पड़ता है, तो हम आपको बताएँगे और जहाँ कानून अपेक्षा करता है, वहाँ फिर से आपकी सहमति लेंगे।',
      fields: { name: 'नाम', role: 'पद', email: 'ई-मेल', phone: 'फ़ोन', address: 'पता', website: 'वेबसाइट' }
    }
  };

  // Option labels shared by the generator form and the notice (the notice uses these words).
  var OPTIONS = {
    data: {
      name: { en: 'Name', hi: 'नाम' },
      phone: { en: 'Mobile number', hi: 'मोबाइल नंबर' },
      email: { en: 'E-mail address', hi: 'ई-मेल पता' },
      address: { en: 'Postal or delivery address', hi: 'डाक या डिलीवरी पता' },
      dob: { en: 'Date of birth or age', hi: 'जन्मतिथि या आयु' },
      orders: { en: 'Order, booking and payment history (we do not store full card or UPI details; our payment gateway handles them)', hi: 'ऑर्डर, बुकिंग और भुगतान का इतिहास (हम पूरा कार्ड या UPI विवरण स्टोर नहीं करते; यह हमारा पेमेंट गेटवे संभालता है)' },
      device: { en: 'Device and usage data: IP address, browser, pages visited, cookies', hi: 'डिवाइस और उपयोग डेटा: IP पता, ब्राउज़र, देखे गए पेज, कुकीज़' },
      location: { en: 'Location', hi: 'लोकेशन' },
      govid: { en: 'Government ID details (for example PAN or Aadhaar), only where a law or the service requires it', hi: 'सरकारी पहचान पत्र का विवरण (जैसे PAN या आधार), केवल जहाँ कानून या सेवा के लिए आवश्यक हो' },
      health: { en: 'Health information you share with us', hi: 'आपके द्वारा साझा की गई स्वास्थ्य जानकारी' },
      education: { en: 'Education records (classes, marks, attendance)', hi: 'शिक्षा संबंधी रिकॉर्ड (कक्षा, अंक, उपस्थिति)' },
      photos: { en: 'Photos, videos or documents you upload', hi: 'आपके द्वारा अपलोड की गई फ़ोटो, वीडियो या दस्तावेज़' },
      messages: { en: 'Messages and call records with our support team', hi: 'हमारी सहायता टीम के साथ संदेश और कॉल रिकॉर्ड' }
    },
    purpose: {
      deliver: { en: 'to process your orders or bookings and deliver our goods or services to you', hi: 'आपके ऑर्डर या बुकिंग को प्रोसेस करने और आप तक हमारा सामान या सेवाएँ पहुँचाने के लिए' },
      account: { en: 'to create and manage your account', hi: 'आपका अकाउंट बनाने और संभालने के लिए' },
      transactional: { en: 'to send you service messages such as OTPs, invoices, appointment reminders and delivery updates', hi: 'आपको सेवा संदेश भेजने के लिए, जैसे OTP, बिल, अपॉइंटमेंट रिमाइंडर और डिलीवरी अपडेट' },
      support: { en: 'to answer your questions and complaints', hi: 'आपके प्रश्नों और शिकायतों का उत्तर देने के लिए' },
      payments: { en: 'to collect payments and issue refunds', hi: 'भुगतान लेने और रिफ़ंड देने के लिए' },
      analytics: { en: 'to understand how our website or app is used, so we can improve it', hi: 'यह समझने के लिए कि हमारी वेबसाइट या ऐप का उपयोग कैसे होता है, ताकि हम उसे बेहतर बना सकें' },
      security: { en: 'to prevent fraud and keep our systems secure', hi: 'धोखाधड़ी रोकने और अपने सिस्टम सुरक्षित रखने के लिए' },
      legal: { en: 'to keep the records that tax and other laws require', hi: 'टैक्स और अन्य कानूनों के तहत आवश्यक रिकॉर्ड रखने के लिए' }
    },
    share: {
      payment: { en: 'Payment gateway', hi: 'पेमेंट गेटवे' },
      logistics: { en: 'Courier and logistics partners', hi: 'कूरियर और लॉजिस्टिक्स पार्टनर' },
      hosting: { en: 'Cloud hosting and IT service providers', hi: 'क्लाउड होस्टिंग और IT सेवा प्रदाता' },
      messaging: { en: 'SMS, e-mail and WhatsApp messaging providers', hi: 'SMS, ई-मेल और WhatsApp संदेश सेवा प्रदाता' },
      analytics: { en: 'Website analytics provider', hi: 'वेबसाइट एनालिटिक्स प्रदाता' },
      accounting: { en: 'Accountant or accounting software', hi: 'अकाउंटेंट या अकाउंटिंग सॉफ़्टवेयर' },
      crm: { en: 'Customer support or CRM software', hi: 'कस्टमर सपोर्ट या CRM सॉफ़्टवेयर' }
    }
  };

  var DEFAULTS = { grievanceDays: 90 };

  function fill(s, v) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return v[k] !== undefined ? v[k] : '{' + k + '}'; }); }
  function clean(s, max) { return String(s === undefined || s === null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, max || 300); }
  function others(s) { return clean(s, 400).split(/\s*[;\n]\s*|\s*,\s*(?=\S)/).filter(Boolean).slice(0, 8); }

  /** Validates the generator input. Returns a list of missing field keys (empty = ok). */
  function missing(inp) {
    var m = [];
    if (!clean(inp.bizName)) m.push('bizName');
    if (!clean(inp.contactEmail)) m.push('contactEmail');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean(inp.contactEmail))) m.push('contactEmail');
    if (!(inp.data || []).length && !clean(inp.dataOther)) m.push('data');
    if (!(inp.purposes || []).length && !clean(inp.purposeOther)) m.push('purposes');
    return m;
  }

  /** Builds the notice as structured sections: [{h, p:[...], ul:[...]}] plus title/updated. */
  function buildNotice(inp) {
    var lang = inp.lang === 'hi' ? 'hi' : 'en';
    var t = T[lang];
    var name = clean(inp.bizName, 120);
    var email = clean(inp.contactEmail, 120);
    var v = { name: name, email: email, website: clean(inp.website, 120), date: clean(inp.date, 40), cm: clean(inp.consentManager, 80), days: Number(inp.grievanceDays) || DEFAULTS.grievanceDays };
    var pick = function (group, keys) { return (keys || []).filter(function (k) { return OPTIONS[group][k]; }).map(function (k) { return OPTIONS[group][k][lang]; }); };
    var data = pick('data', inp.data).concat(others(inp.dataOther));
    var purposes = pick('purpose', inp.purposes).concat(others(inp.purposeOther));
    var share = pick('share', inp.share).concat(others(inp.shareOther));
    var how = clean(inp.withdrawHow, 200) || fill(t.withdrawHowDefault, v);
    v.how = how;

    var S = [];
    var head = { p: [fill(t.intro, v)].concat(v.website ? [fill(t.site, v)] : []).concat([fill(t.langOpt, v)]) };
    S.push(head);
    S.push({ h: t.hData, p: [t.dataLead], ul: data });
    var pur = { h: t.hPurpose, p: [t.purposeLead], ul: purposes, p2: [t.purposeLimit] };
    S.push(pur);
    if (inp.marketing) S.push({ h: t.hMarketing, p: [t.marketing] });
    if (share.length) {
      var sh = { h: t.hShare, p: [t.shareLead], ul: share };
      if (inp.crossBorder) sh.p2 = [t.crossBorder];
      S.push(sh);
    } else S.push({ h: t.hShare, p: [t.shareNone] });
    S.push({ h: t.hKeep, p: [t.keep] });
    S.push({ h: t.hSecure, p: [t.secure] });
    S.push({ h: t.hChild, p: [inp.children ? t.childYes : t.childNo] });
    S.push({ h: t.hWithdraw, p: [fill(t.withdraw, v)] });
    S.push({ h: t.hCm, p: [v.cm ? fill(t.cmYes, v) : t.cmNo] });
    S.push({ h: t.hRights, p: [t.rightsLead], ul: t.rights.slice(), p2: [fill(t.rightsHow, v), t.duties] });
    var f = t.fields;
    var contact = [];
    if (clean(inp.contactName)) contact.push(f.name + ': ' + clean(inp.contactName, 100));
    if (clean(inp.contactRole)) contact.push(f.role + ': ' + clean(inp.contactRole, 100));
    contact.push(f.email + ': ' + email);
    if (clean(inp.contactPhone)) contact.push(f.phone + ': ' + clean(inp.contactPhone, 40));
    if (clean(inp.bizAddress)) contact.push(f.address + ': ' + clean(inp.bizAddress, 200));
    S.push({ h: t.hContact, p: [t.contactLead], ul: contact, p2: [fill(t.grievanceTime, v)] });
    S.push({ h: t.hBoard, p: [fill(t.board, v)] });
    S.push({ h: t.hChanges, p: [t.changes] });
    return { lang: lang, title: fill(t.title, v), updated: v.date ? fill(t.updated, v) : '', sections: S };
  }

  function toText(n) {
    var out = [n.title];
    if (n.updated) out.push(n.updated);
    n.sections.forEach(function (s) {
      out.push('');
      if (s.h) out.push(s.h);
      (s.p || []).forEach(function (p) { out.push(p); });
      (s.ul || []).forEach(function (li) { out.push('- ' + li); });
      (s.p2 || []).forEach(function (p) { out.push(p); });
    });
    return out.join('\n') + '\n';
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function linkify(s) { return esc(s).replace(/https?:\/\/[^\s<]+[^\s<.,;)]/g, function (u) { return '<a href="' + u + '" rel="nofollow">' + u + '</a>'; }); }

  function toHtml(n) {
    var h = ['<article lang="' + n.lang + '" class="notice">', '<h2>' + esc(n.title) + '</h2>'];
    if (n.updated) h.push('<p class="notice-date">' + esc(n.updated) + '</p>');
    n.sections.forEach(function (s) {
      if (s.h) h.push('<h3>' + esc(s.h) + '</h3>');
      (s.p || []).forEach(function (p) { h.push('<p>' + linkify(p) + '</p>'); });
      if (s.ul && s.ul.length) h.push('<ul>' + s.ul.map(function (li) { return '<li>' + linkify(li) + '</li>'; }).join('') + '</ul>');
      (s.p2 || []).forEach(function (p) { h.push('<p>' + linkify(p) + '</p>'); });
    });
    h.push('</article>');
    return h.join('\n');
  }

  var PD = { score: score, band: band, buildNotice: buildNotice, toText: toText, toHtml: toHtml, missing: missing, OPTIONS: OPTIONS, DEFAULTS: DEFAULTS, T: T };
  if (typeof module === 'object' && module.exports) module.exports = PD; else root.PD = PD;
})(typeof self !== 'undefined' ? self : this);
