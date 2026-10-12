// Shared fixtures: one mixed answer set with a hand-computed score, and one generator input.
// Weights: inventory 2, basis 2, notice 3, languages 1, consent 3, withdraw 2, records 2, processors 2,
// security 3, breach 3, retention 2, contact 1, grievance 2, rights 2, children 3 (answered "na").
// Points: 2 + 1 + 0 + 0 + 3 + 1 + 0 + 2 + 1.5 + 0 + 2 + 1 + 0 + 1 = 14.5 out of 30 (children left out) = 48.33 -> 48.
export const MIXED = {
  inventory: 'yes', basis: 'partly', notice: 'no', languages: 'unsure', consent: 'yes', withdraw: 'partly', records: 'no',
  processors: 'yes', security: 'partly', breach: 'no', retention: 'yes', contact: 'yes', grievance: 'no', rights: 'partly', children: 'na',
};
export const MIXED_PCT = 48;
export const MIXED_BAND = 'partial';
// Gaps sorted by points lost (weight x (1 - value)), ties in question order.
export const MIXED_GAPS = ['notice', 'breach', 'records', 'grievance', 'security', 'basis', 'languages', 'withdraw', 'rights'];

export const GEN = {
  bizName: 'Kaveri Coaching Centre', contactName: 'R. Iyer', contactRole: 'Grievance Officer', contactEmail: 'privacy@kaveri-coaching.example.com',
  contactPhone: '+91 98450 00000', grievanceDays: 21, data: ['name', 'phone', 'education', 'dob'], purposes: ['account', 'transactional', 'legal'],
  share: ['messaging', 'hosting'], crossBorder: true, consentManager: 'ExampleCM', children: true, marketing: false, date: '2026-10-13',
};
export const GEN_MUST = ['Privacy notice: Kaveri Coaching Centre', 'Education records (classes, marks, attendance)', 'Date of birth or age', 'to create and manage your account',
  'to keep the records that tax and other laws require', 'SMS, e-mail and WhatsApp messaging providers', 'section 16 of the DPDP Act', 'through ExampleCM, a Consent Manager registered with the Data Protection Board of India',
  'verifiable consent of your parent or lawful guardian', '(section 11)', '(section 12)', '(section 13)', '(section 14)', 'Name: R. Iyer', 'Role: Grievance Officer',
  'E-mail: privacy@kaveri-coaching.example.com', 'within 21 days', 'Data Protection Board of India', 'section 13(3)', 'Eighth Schedule', 'write to privacy@kaveri-coaching.example.com'];
export const GEN_MUST_NOT = ['Health information', 'Location', 'Payment gateway', 'Marketing messages', 'Our services are not meant for anyone under 18', 'We do not work with a Consent Manager yet'];
