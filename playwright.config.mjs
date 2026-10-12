import { defineConfig, devices } from '@playwright/test';
// BASE_URL=https://outils.vread.fr/plaindpdp/ npx playwright test   -> runs against the live site (tracking + Sheet checks)
const live = process.env.BASE_URL;
export default defineConfig({
  testDir: 'tests/e2e',
  workers: 1,
  timeout: 90_000,
  retries: live ? 1 : 0,
  reporter: [['list']],
  use: { baseURL: live ?? 'http://localhost:4810/plaindpdp/', acceptDownloads: true, screenshot: 'only-on-failure' },
  projects: [
    { name: 'mobile-390', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: 'desktop-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: live ? undefined : { command: 'node site/build.mjs && node site/serve.mjs 4810', url: 'http://localhost:4810/plaindpdp/', reuseExistingServer: true },
});
