// @ts-check
const fs = require('fs');
const { defineConfig, devices } = require('@playwright/test');

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8080/';
const xamppPhpPath = 'C:\\xampp\\php\\php.exe';
const defaultPhpCommand =
  process.platform === 'win32' && fs.existsSync(xamppPhpPath)
    ? `"${xamppPhpPath}" -S 127.0.0.1:8080 -t .`
    : 'php -S 127.0.0.1:8080 -t .';
const webServerCommand = process.env.PLAYWRIGHT_WEBSERVER_COMMAND || defaultPhpCommand;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: webServerCommand,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
