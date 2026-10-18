export const SITE = {
  brand: 'PlainDPDP',
  origin: 'https://dpdp.jalonel.com',
  base: '/',
  endpoint: 'https://script.google.com/macros/s/AKfycbxtPsxjdWpguJKKJ5nPN0K1NZSUCmMKpjmrkhM49wNv-0ySFsfq6aHNN2bt3puvlk1nhQ/exec',
  consentVersion: 'ea-2026-10-13',
  updated: '13 October 2026',
  updatedIso: '2026-10-13',
  email: 'contact@jalonel.com',
  company: {
    name: 'READ FRANCE SAS',
    address: '11 rue Rouvet, 75019 Paris, France',
    siren: '988 741 773',
    rcs: 'RCS Paris',
    capital: '€1,000',
    president: 'Tanguy Warsmann',
  },
  prices: { pack: 4999, a: 999, b: 2999 },
};

// Official sources, cited on the pages. Checked on 2026-10-13 (see ventures/AS-IN-01/README.md in octave-global-ventures).
export const SOURCES = {
  act: { label: 'Digital Personal Data Protection Act, 2023 (No. 22 of 2023), Gazette of India, 11 August 2023', url: 'https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf' },
  commencement: { label: 'Notification G.S.R. 843(E) of 13 November 2025 bringing the Act into force in three phases (MeitY copy)', url: 'https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf' },
  rules: { label: 'Digital Personal Data Protection Rules, 2025, G.S.R. 846(E), Gazette of India, 13 November 2025', url: 'https://egazette.gov.in/WriteReadData/2025/267650.pdf' },
  board: { label: 'Notification G.S.R. 844(E) establishing the Data Protection Board of India', url: 'https://egazette.gov.in/WriteReadData/2025/267648.pdf' },
  pib: { label: 'Press Information Bureau release on the DPDP Rules, 14 November 2025', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190014' },
  eighth: { label: 'Eighth Schedule to the Constitution (22 languages), Ministry of Home Affairs', url: 'https://www.mha.gov.in/sites/default/files/Eighth_Schedule.pdf' },
};

export const LANGS22 = [
  ['as', 'Assamese', 'असमिया'], ['bn', 'Bengali', 'बांग्ला'], ['brx', 'Bodo', 'बोडो'], ['doi', 'Dogri', 'डोगरी'],
  ['gu', 'Gujarati', 'गुजराती'], ['hi', 'Hindi', 'हिंदी'], ['kn', 'Kannada', 'कन्नड़'], ['ks', 'Kashmiri', 'कश्मीरी'],
  ['kok', 'Konkani', 'कोंकणी'], ['mai', 'Maithili', 'मैथिली'], ['ml', 'Malayalam', 'मलयालम'], ['mni', 'Manipuri', 'मणिपुरी'],
  ['mr', 'Marathi', 'मराठी'], ['ne', 'Nepali', 'नेपाली'], ['or', 'Odia', 'ओड़िया'], ['pa', 'Punjabi', 'पंजाबी'],
  ['sa', 'Sanskrit', 'संस्कृत'], ['sat', 'Santali', 'संथाली'], ['sd', 'Sindhi', 'सिंधी'], ['ta', 'Tamil', 'तमिल'],
  ['te', 'Telugu', 'तेलुगु'], ['ur', 'Urdu', 'उर्दू'],
];
