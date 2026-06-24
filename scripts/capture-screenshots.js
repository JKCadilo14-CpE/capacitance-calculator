const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const rootDir = path.resolve(__dirname, '..');
const screenshotsDir = path.join(rootDir, 'docs', 'screenshots');
const baseUrl = process.env.SCREENSHOT_BASE_URL || 'http://localhost/Project2-calculator/';
const viewport = { width: 1440, height: 900 };

const screenshotTargets = [
    {
        name: 'Home page',
        fileName: 'home.png',
        url: baseUrl,
    },
    {
        name: 'Unit Converter',
        fileName: 'unit-converter.png',
        url: baseUrl,
        mode: 'unit-converter',
    },
    {
        name: 'Charge Calculator',
        fileName: 'charge-calculator.png',
        url: baseUrl,
        mode: 'charge-calculator',
    },
    {
        name: 'Energy Stored',
        fileName: 'energy-stored.png',
        url: baseUrl,
        mode: 'energy-stored',
    },
    {
        name: 'Formula Reference',
        fileName: 'formula-reference.png',
        url: new URL('pages/formula-reference.php', baseUrl).toString(),
    },
];

const waitForReadyPage = async (page) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);
};

const selectCalculatorMode = async (page, mode) => {
    const modeSelect = page.locator('select[data-mode-select]').first();
    await modeSelect.waitFor({ state: 'visible' });
    await modeSelect.selectOption(mode);
    await page.locator(`[data-mode-panel="${mode}"]`).waitFor({ state: 'visible' });
    await page.waitForTimeout(200);
};

const captureScreenshots = async () => {
    fs.mkdirSync(screenshotsDir, { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport });

    try {
        for (const target of screenshotTargets) {
            await page.goto(target.url, { waitUntil: 'networkidle' });
            await waitForReadyPage(page);

            if (target.mode) {
                await selectCalculatorMode(page, target.mode);
            }

            const outputPath = path.join(screenshotsDir, target.fileName);
            await page.screenshot({
                path: outputPath,
                fullPage: false,
            });

            console.log(`Captured ${target.name}: ${path.relative(rootDir, outputPath)}`);
        }
    } finally {
        await browser.close();
    }
};

captureScreenshots().catch((error) => {
    console.error('Screenshot capture failed.');
    console.error(error);
    process.exit(1);
});
