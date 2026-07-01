const fs = require('fs');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const rootDir = path.resolve(__dirname, '..');
const screenshotsDir = path.join(rootDir, 'docs', 'screenshots');
const viewport = { width: 1440, height: 900 };
const xamppPhpPath = 'C:\\xampp\\php\\php.exe';

const requestedScreenshotFiles = [
    'home.png',
    'unit-converter.png',
    'series-capacitance.png',
    'parallel-capacitance.png',
    'code-decoder.png',
    'rc-time.png',
    'capacitive-reactance.png',
    'charge-calculator.png',
    'energy-stored.png',
    'formula-reference.png',
    'advanced-physics.png',
];

const ensureTrailingSlash = (url) => url.endsWith('/') ? url : `${url}/`;

const getAvailablePort = () => new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
        const address = server.address();
        server.close(() => resolve(address.port));
    });
});

const waitForServer = (url, timeoutMs = 15000) => new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;

    const tryRequest = () => {
        const request = http.get(url, (response) => {
            response.resume();
            resolve();
        });

        request.on('error', () => {
            if (Date.now() >= deadline) {
                reject(new Error(`Timed out waiting for screenshot server at ${url}`));
                return;
            }

            setTimeout(tryRequest, 250);
        });
    };

    tryRequest();
});

const startLocalServer = async () => {
    const port = await getAvailablePort();
    const phpExecutable = fs.existsSync(xamppPhpPath) ? xamppPhpPath : 'php';
    const baseUrl = `http://127.0.0.1:${port}/`;
    const serverProcess = spawn(
        phpExecutable,
        ['-S', `127.0.0.1:${port}`, '-t', rootDir],
        {
            cwd: rootDir,
            stdio: 'ignore',
            windowsHide: true,
        },
    );

    serverProcess.on('error', (error) => {
        throw error;
    });

    await waitForServer(baseUrl);

    return { baseUrl, serverProcess };
};

const stopLocalServer = (serverProcess) => {
    if (serverProcess && !serverProcess.killed) {
        serverProcess.kill();
    }
};

const installScreenshotDefaults = async (context) => {
    await context.addInitScript(() => {
        try {
            window.localStorage.removeItem('capacitanceCalculatorTheme:v1');
        } catch (error) {
            // Screenshots should still proceed if storage is unavailable.
        }

        document.addEventListener('DOMContentLoaded', () => {
            const screenshotStyle = document.createElement('style');
            screenshotStyle.textContent = `
                html {
                    scroll-behavior: auto !important;
                    scrollbar-width: none !important;
                }

                body {
                    scrollbar-width: none !important;
                }

                html::-webkit-scrollbar,
                body::-webkit-scrollbar {
                    display: none !important;
                }

                * {
                    caret-color: transparent !important;
                }
            `;
            document.head.append(screenshotStyle);
        });
    });
};

const waitForAnimationFrame = (page) => page.evaluate(() => new Promise((resolve) => {
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(resolve);
    });
}));

const waitForLucideIcons = async (page) => {
    await page.waitForFunction(() => {
        const visibleIconPlaceholders = Array.from(document.querySelectorAll('i[data-lucide]'))
            .filter((icon) => !icon.hidden);
        const renderedIcons = document.querySelectorAll('svg.lucide');

        return visibleIconPlaceholders.length === 0 || renderedIcons.length > 0;
    }, null, { timeout: 10000 });
};

const waitForReadyPage = async (page) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await waitForLucideIcons(page);
    await waitForAnimationFrame(page);
};

const selectCalculatorMode = async (page, mode) => {
    await page.locator('[data-mode-panel]:not([hidden]) [data-mode-select]').selectOption(mode);
    await page.locator(`[data-mode-panel="${mode}"]`).waitFor({ state: 'visible' });
    await waitForAnimationFrame(page);
};

const submitForm = async (page, formSelector) => {
    await page.locator(formSelector).locator('button[type="submit"]').click();
};

const fillCapacitorRows = async (page, listSelector, capacitors) => {
    for (const [index, capacitor] of capacitors.entries()) {
        const row = page.locator(`${listSelector} .series-row`).nth(index);

        await row.locator('.series-value-input').fill(capacitor.value);
        await row.locator('.series-unit-select').selectOption(capacitor.unit);
    }
};

const expectText = async (page, selector, expectedText) => {
    await page.locator(selector).waitFor({ state: 'visible' });
    await page.waitForFunction(
        ({ selector, expectedText }) => document.querySelector(selector)?.textContent?.trim() === expectedText,
        { selector, expectedText },
    );
};

const expectEnabled = async (page, selector) => {
    await page.waitForFunction(
        (selector) => {
            const element = document.querySelector(selector);

            return element && !element.disabled;
        },
        selector,
    );
};

const prepareUnitConverter = async (page) => {
    await selectCalculatorMode(page, 'unit-converter');
    await page.locator('#unit-converter-form').focus();
    await page.keyboard.press('5');
    await page.keyboard.press('.');
    await page.keyboard.press('5');
    await page.keyboard.press('Enter');
    await expectText(page, '#converter-result', '0.0055 nF');
    await expectEnabled(page, '[data-copy-result="unit-converter"] [data-copy-button]');
};

const prepareSeriesCapacitance = async (page) => {
    await selectCalculatorMode(page, 'series');
    await fillCapacitorRows(page, '#series-capacitor-list', [
        { value: '10', unit: 'uF' },
        { value: '20', unit: 'uF' },
    ]);
    await submitForm(page, '#series-calculator-form');
    await expectText(page, '#series-result', '6.67 µF');
    await expectEnabled(page, '[data-copy-result="series"] [data-copy-button]');
};

const prepareParallelCapacitance = async (page) => {
    await selectCalculatorMode(page, 'parallel');
    await fillCapacitorRows(page, '#parallel-capacitor-list', [
        { value: '10', unit: 'uF' },
        { value: '20', unit: 'uF' },
    ]);
    await submitForm(page, '#parallel-calculator-form');
    await expectText(page, '#parallel-result', '30 µF');
    await expectEnabled(page, '[data-copy-result="parallel"] [data-copy-button]');
};

const prepareCodeDecoder = async (page) => {
    await selectCalculatorMode(page, 'code-decoder');
    await page.locator('#capacitor-code').fill('104');
    await submitForm(page, '#code-decoder-form');
    await expectText(page, '#code-decoder-primary-result', '100 nF');
    await expectEnabled(page, '[data-copy-result="code-decoder"] [data-copy-button]');
};

const prepareRcTime = async (page) => {
    await selectCalculatorMode(page, 'rc-time');
    await page.locator('#resistance-value').fill('10');
    await page.locator('#resistance-unit').selectOption('kohm');
    await page.locator('#rc-capacitance-value').fill('1');
    await page.locator('#rc-capacitance-unit').selectOption('uF');
    await submitForm(page, '#rc-time-form');
    await expectText(page, '#rc-primary-result', '10 ms');
    await expectEnabled(page, '[data-copy-result="rc-time"] [data-copy-button]');
};

const prepareCapacitiveReactance = async (page) => {
    await selectCalculatorMode(page, 'capacitive-reactance');
    await page.locator('#reactance-frequency-value').fill('1');
    await page.locator('#reactance-frequency-unit').selectOption('kHz');
    await page.locator('#reactance-capacitance-value').fill('100');
    await page.locator('#reactance-capacitance-unit').selectOption('nF');
    await submitForm(page, '#capacitive-reactance-form');
    await expectText(page, '#capacitive-reactance-primary-result', '1.59 kΩ');
    await expectEnabled(page, '[data-copy-result="capacitive-reactance"] [data-copy-button]');
    await page.locator('#capacitive-reactance-technical-details').evaluate((details) => {
        details.open = true;
    });
};

const prepareChargeCalculator = async (page) => {
    await selectCalculatorMode(page, 'charge-calculator');
    await page.locator('#charge-capacitance-value').fill('1000');
    await page.locator('#charge-capacitance-unit').selectOption('uF');
    await page.locator('#charge-voltage-value').fill('12');
    await submitForm(page, '#charge-calculator-form');
    await expectText(page, '#charge-primary-result', '0.012 C');
    await expectEnabled(page, '[data-copy-result="charge-calculator"] [data-copy-button]');
};

const prepareEnergyStored = async (page) => {
    await selectCalculatorMode(page, 'energy-stored');
    await page.locator('#energy-capacitance-value').fill('1000');
    await page.locator('#energy-capacitance-unit').selectOption('uF');
    await page.locator('#energy-voltage-value').fill('12');
    await submitForm(page, '#energy-stored-form');
    await expectText(page, '#energy-primary-result', '0.072 J');
    await expectEnabled(page, '[data-copy-result="energy-stored"] [data-copy-button]');
};

const prepareAdvancedPhysics = async (page) => {
    const toggle = page.locator('#parallel-plate-capacitor [data-advanced-calculator-toggle]');

    await toggle.click();
    await page.locator('#parallel-plate-calculator').waitFor({ state: 'visible' });
    await page.locator('#parallel-plate-area').fill('0.01');
    await page.locator('#parallel-plate-area-unit').selectOption('m2');
    await page.locator('#parallel-plate-distance').fill('0.001');
    await page.locator('#parallel-plate-distance-unit').selectOption('m');
    await page.locator('#parallel-plate-relative-permittivity').fill('1');
    await submitForm(page, '#parallel-plate-form');
    await expectText(page, '#parallel-plate-primary-result', '88.54 pF');
    await expectEnabled(page, '#copy-parallel-plate-result');
    await page.locator('#parallel-plate-technical-details').evaluate((details) => {
        details.open = true;
    });
};

const getAdvancedPhysicsClip = async (page) => page.evaluate(() => {
    const firstTopic = document.querySelector('#parallel-plate-capacitor');
    const pageWidth = document.documentElement.clientWidth;
    const topicBottom = firstTopic
        ? firstTopic.getBoundingClientRect().bottom + window.scrollY
        : document.documentElement.clientHeight;

    return {
        x: 0,
        y: 0,
        width: pageWidth,
        height: Math.ceil(topicBottom + 32),
    };
});

const getCapacitiveReactanceClip = async (page) => page.evaluate(() => {
    const technicalDetails = document.querySelector('#capacitive-reactance-technical-details');
    const pageWidth = document.documentElement.clientWidth;
    const detailsBottom = technicalDetails
        ? technicalDetails.getBoundingClientRect().bottom + window.scrollY
        : document.documentElement.clientHeight;

    return {
        x: 0,
        y: 0,
        width: pageWidth,
        height: Math.ceil(detailsBottom + 32),
    };
});

const makeScreenshotTargets = (baseUrl) => [
    {
        name: 'Home page',
        fileName: 'home.png',
        url: baseUrl,
    },
    {
        name: 'Unit Converter',
        fileName: 'unit-converter.png',
        url: baseUrl,
        prepare: prepareUnitConverter,
    },
    {
        name: 'Series Capacitance',
        fileName: 'series-capacitance.png',
        url: baseUrl,
        prepare: prepareSeriesCapacitance,
    },
    {
        name: 'Parallel Capacitance',
        fileName: 'parallel-capacitance.png',
        url: baseUrl,
        prepare: prepareParallelCapacitance,
    },
    {
        name: 'Capacitor Code Decoder',
        fileName: 'code-decoder.png',
        url: baseUrl,
        prepare: prepareCodeDecoder,
    },
    {
        name: 'RC Time',
        fileName: 'rc-time.png',
        url: baseUrl,
        prepare: prepareRcTime,
    },
    {
        name: 'Capacitive Reactance',
        fileName: 'capacitive-reactance.png',
        url: baseUrl,
        prepare: prepareCapacitiveReactance,
        clip: getCapacitiveReactanceClip,
    },
    {
        name: 'Charge Calculator',
        fileName: 'charge-calculator.png',
        url: baseUrl,
        prepare: prepareChargeCalculator,
    },
    {
        name: 'Energy Stored',
        fileName: 'energy-stored.png',
        url: baseUrl,
        prepare: prepareEnergyStored,
    },
    {
        name: 'Formula Reference',
        fileName: 'formula-reference.png',
        url: new URL('pages/formula-reference.php', baseUrl).toString(),
    },
    {
        name: 'Advanced Physics',
        fileName: 'advanced-physics.png',
        url: new URL('pages/advanced-physics.php', baseUrl).toString(),
        prepare: prepareAdvancedPhysics,
        clip: getAdvancedPhysicsClip,
    },
];

const captureTarget = async (browser, target) => {
    const context = await browser.newContext({ viewport });
    await installScreenshotDefaults(context);

    const page = await context.newPage();

    try {
        await page.goto(target.url, { waitUntil: 'networkidle' });
        await waitForReadyPage(page);

        if (target.prepare) {
            await target.prepare(page);
            await waitForReadyPage(page);
        }

        await page.locator('.site-header').waitFor({ state: 'visible' });
        await page.evaluate(() => window.scrollTo(0, 0));
        await waitForAnimationFrame(page);

        const outputPath = path.join(screenshotsDir, target.fileName);
        const screenshotOptions = {
            path: outputPath,
            animations: 'disabled',
            caret: 'hide',
        };

        if (target.clip) {
            screenshotOptions.clip = await target.clip(page);
            screenshotOptions.fullPage = true;
        } else {
            screenshotOptions.fullPage = false;
        }

        await page.screenshot(screenshotOptions);

        console.log(`Captured ${target.name}: ${path.relative(rootDir, outputPath)}`);
    } finally {
        await context.close();
    }
};

const captureScreenshots = async () => {
    fs.mkdirSync(screenshotsDir, { recursive: true });

    let baseUrl = process.env.SCREENSHOT_BASE_URL
        ? ensureTrailingSlash(process.env.SCREENSHOT_BASE_URL)
        : null;
    let serverProcess = null;

    if (!baseUrl) {
        const server = await startLocalServer();
        baseUrl = server.baseUrl;
        serverProcess = server.serverProcess;
    }

    const screenshotTargets = makeScreenshotTargets(baseUrl);
    const targetFileNames = screenshotTargets.map((target) => target.fileName);

    if (requestedScreenshotFiles.some((fileName) => !targetFileNames.includes(fileName))) {
        throw new Error('Screenshot target list does not match the requested README screenshot set.');
    }

    const browser = await chromium.launch();

    try {
        for (const target of screenshotTargets) {
            await captureTarget(browser, target);
        }
    } finally {
        await browser.close();
        stopLocalServer(serverProcess);
    }
};

captureScreenshots().catch((error) => {
    console.error('Screenshot capture failed.');
    console.error(error);
    process.exit(1);
});
