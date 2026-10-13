# PlainDPDP

Free DPDP Act 2023 readiness check (15 questions, scored gap list) and privacy-notice generator (English, Hindi) for Indian small businesses, plus a fake-door early-access form for the paid kit. Published by READ FRANCE SAS (Paris), built and run by Octave, its AI agent. Independent of the Vread app and vread.fr.

Live: https://outils.vread.fr/plaindpdp/ (GitHub Pages of `VREAD-corp`, deployed by `.github/workflows/pages.yml` after unit and e2e tests).

Not legal advice: a self-help template kit, not a law firm. Legal facts were checked on 2026-10-13 against the Act (No. 22 of 2023), G.S.R. 843(E) (commencement), G.S.R. 846(E) (DPDP Rules 2025) and PIB release 2190014; see `site/src/config.mjs` for the URLs.

## Layout

| Path | What |
|---|---|
| `site/assets/core.js` | Scoring and notice builder, shared by the browser and the unit tests |
| `site/src/check-data.mjs` | The 15 questions (EN/HI), weights and section/rule references |
| `site/src/pages.mjs`, `components.mjs` | Page templates; `site/build.mjs` writes `dist/` |
| `site/assets/app.js` | Applies the price variant read from cro.js (`octaveCro.v('price')`: a = Pro ₹999/month, b = ₹2,999/month; starter kit ₹4,999 in both), forms, CRO goals (`check`, `notice`, `download`, `preorder`) |
| `site/assets/xp.js`, `cro.js` | `OCTAVE_XP` config (experiment `price`, a/b 50/50 drawn once per tab in sessionStorage, `?p=a\|b` forces it; a file because the CSP forbids inline scripts) and Octave's behaviour counters + A/B framework, vendored byte-identical from octave-checkout `gas/web/cro.js` (no cookie, no id, daily totals; checked by `tests/unit/cro.check.mjs`) |
| `site/assets/mesure.js` | Cookieless anonymous counters (same pattern as octave-checkout `gas/web/mesure.js`). Crawler/headless user agents (checked in the browser, never sent), `navigator.webdriver` and `octave_notrack=1` (query or localStorage, set by the e2e suite) are flagged and counted in the `Exclus` tab by reason; prerendered pages count only once opened. `summary` returns `stats` (visits), `excluded` and `views` per day (counted/excluded/raw) |
| `gas/src/Code.js` | Apps Script web app: `track`, `preorder`, `rights`, `ping`, `summary`/`purge_tests` (admin key), `cro`/`cro_init` |
| `gas/src/Cro.js` | CRO module vendored byte-identical from octave-checkout (`track` with `kind: 'cro'` → tabs `Comportement`, `Experiences`; `cro` summary with the key whose SHA-256 is Script Property `CRO_KEY_SHA256`; `summary` also returns `cro` for today or `from`..`to`). Checked by `tests/unit/cro-gas.check.mjs` |

## Backend

Apps Script project `plaindpdp-gas (READ FRANCE SAS)`, script id `15eL6ym9CFR-Z710WyiyVjSbnp9gpJcxDc9-eIGgeCTyhTuTYuySsCiJz`, owner vincent.cance@gmail.com, only scope `spreadsheets`. Web app `https://script.google.com/macros/s/AKfycbxtPsxjdWpguJKKJ5nPN0K1NZSUCmMKpjmrkhM49wNv-0ySFsfq6aHNN2bt3puvlk1nhQ/exec`. It creates its own Sheet on first use (tabs `Signups`, `Requests`, `Stats`). Separate from octave-checkout. Redeploy: `bash gas/scripts/deploy.sh` (same deployment id). The admin key lives in `~/.config/octave/plaindpdp.env` (never committed; the code holds only its SHA-256).

Read the numbers: `curl -sL -d "{\"action\":\"summary\",\"key\":\"$PLAINDPDP_ADMIN_KEY\"}" <exec url>` (counts only, no personal data).

## Tests

```bash
npm test                                                    # unit: scoring, generator
npx playwright test                                         # local build, 390 px and 1440 px
BASE_URL=https://outils.vread.fr/plaindpdp/ npx playwright test   # live: also form -> Sheet, withdrawal, tracking
```

Test sign-ups use `@example.com` addresses and are flagged `test` in the Sheet; remove them with the `purge_tests` action.
