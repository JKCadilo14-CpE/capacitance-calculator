// @ts-check
const fs = require('fs/promises');
const path = require('path');
const { test, expect } = require('@playwright/test');

test.describe('Capacitance Calculator smoke', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    const advancedPhysicsScript = await fs.readFile(
      path.join(__dirname, '..', 'assets', 'js', 'advanced-physics.js'),
      'utf8',
    );

    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const testStyle = document.createElement('style');
        testStyle.textContent = 'html { scroll-behavior: auto !important; }';
        document.head.append(testStyle);
      });
    });

    await page.route('**/lucide.min.js', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: 'window.lucide = { createIcons() {} };',
      });
    });

    await page.route('**/assets/js/advanced-physics.js', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: advancedPhysicsScript,
      });
    });
  });

  const advancedFormPanels = {
    '#parallel-plate-form': {
      card: '#parallel-plate-capacitor',
      panel: '#parallel-plate-calculator',
    },
    '#cylindrical-form': {
      card: '#cylindrical-capacitor',
      panel: '#cylindrical-calculator',
    },
    '#spherical-form': {
      card: '#spherical-capacitor',
      panel: '#spherical-calculator',
    },
    '#dielectric-form': {
      card: '#dielectric-materials',
      panel: '#dielectric-calculator',
    },
    '#electric-field-form': {
      card: '#electric-field-capacitance',
      panel: '#electric-field-calculator',
    },
  };

  const ensureAdvancedCalculatorOpen = async (page, formSelector) => {
    const config = advancedFormPanels[formSelector];

    if (!config) {
      return;
    }

    const panel = page.locator(config.panel);

    if (await panel.isVisible()) {
      return;
    }

    const toggleButton = page.locator(`${config.card} [data-advanced-calculator-toggle]`);
    await expect(toggleButton).toContainText('Open Calculator');
    await toggleButton.click();
    await expect(panel).toBeVisible();
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  };

  const fillParallelPlateCalculator = async (page, { area, areaUnit, distance, distanceUnit, relativePermittivity }) => {
    await ensureAdvancedCalculatorOpen(page, '#parallel-plate-form');
    await page.getByLabel('Plate area A').fill(String(area));
    await page.getByLabel('Area unit').selectOption(areaUnit);
    await page.getByLabel('Plate separation d').fill(String(distance));
    await page.locator('#parallel-plate-distance-unit').selectOption(distanceUnit);
    await page.locator('#parallel-plate-relative-permittivity').fill(String(relativePermittivity));
  };

  const fillCylindricalCalculator = async (page, { innerRadius, innerRadiusUnit, outerRadius, outerRadiusUnit, length, lengthUnit, relativePermittivity }) => {
    await ensureAdvancedCalculatorOpen(page, '#cylindrical-form');
    await page.locator('#cylindrical-inner-radius').fill(String(innerRadius));
    await page.locator('#cylindrical-inner-radius-unit').selectOption(innerRadiusUnit);
    await page.locator('#cylindrical-outer-radius').fill(String(outerRadius));
    await page.locator('#cylindrical-outer-radius-unit').selectOption(outerRadiusUnit);
    await page.locator('#cylindrical-length').fill(String(length));
    await page.locator('#cylindrical-length-unit').selectOption(lengthUnit);
    await page.locator('#cylindrical-relative-permittivity').fill(String(relativePermittivity));
  };

  const fillSphericalCalculator = async (page, { innerRadius, innerRadiusUnit, outerRadius, outerRadiusUnit, relativePermittivity }) => {
    await ensureAdvancedCalculatorOpen(page, '#spherical-form');
    await page.locator('#spherical-inner-radius').fill(String(innerRadius));
    await page.locator('#spherical-inner-radius-unit').selectOption(innerRadiusUnit);
    await page.locator('#spherical-outer-radius').fill(String(outerRadius));
    await page.locator('#spherical-outer-radius-unit').selectOption(outerRadiusUnit);
    await page.locator('#spherical-relative-permittivity').fill(String(relativePermittivity));
  };

  const readDownloadText = async (download) => {
    const path = await download.path();

    if (!path) {
      return '';
    }

    return fs.readFile(path, 'utf8');
  };

  const submitCalculatorForm = async (page, selector) => {
    await ensureAdvancedCalculatorOpen(page, selector);

    return page.locator(selector).evaluate((form) => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
  };

  const activateControl = (locator) => locator.evaluate((control) => control.click());

  const visitAdvancedPhysics = async (page) => {
    await page.goto('/pages/advanced-physics.php', { waitUntil: 'load' });
    await page.waitForTimeout(250);
  };

  const advancedTopicLinks = [
    { name: 'Parallel Plate Capacitor', card: '#parallel-plate-capacitor' },
    { name: 'Cylindrical Capacitor', card: '#cylindrical-capacitor' },
    { name: 'Spherical Capacitor', card: '#spherical-capacitor' },
    { name: 'Dielectric Materials', card: '#dielectric-materials' },
    { name: 'Electric Field & Capacitance', card: '#electric-field-capacitance' },
  ];

  const advancedUiCases = [
    {
      name: 'Parallel Plate Capacitor',
      card: '#parallel-plate-capacitor',
      panel: '#parallel-plate-calculator',
      form: '#parallel-plate-form',
      firstFocus: '#parallel-plate-area',
      primaryOutput: '#parallel-plate-primary-result',
      resultCard: '#parallel-plate-result-card',
      copyButton: '#copy-parallel-plate-result',
      copyStatus: '#parallel-plate-copy-status',
      historyMode: 'advanced-parallel-plate',
      expectedResult: '88.54 pF',
      expectedCopyText: 'Parallel Plate Capacitor',
      restoreSelector: '#parallel-plate-area',
      restoreValue: '0.01',
      fillExample: async (page) => fillParallelPlateCalculator(page, {
        area: '0.01',
        areaUnit: 'm2',
        distance: '0.001',
        distanceUnit: 'm',
        relativePermittivity: '1',
      }),
    },
    {
      name: 'Cylindrical Capacitor',
      card: '#cylindrical-capacitor',
      panel: '#cylindrical-calculator',
      form: '#cylindrical-form',
      firstFocus: '#cylindrical-inner-radius',
      primaryOutput: '#cylindrical-primary-result',
      resultCard: '#cylindrical-result-card',
      copyButton: '#copy-cylindrical-result',
      copyStatus: '#cylindrical-copy-status',
      historyMode: 'advanced-cylindrical',
      expectedResult: '3.46 pF',
      expectedCopyText: 'Cylindrical Capacitor',
      restoreSelector: '#cylindrical-inner-radius',
      restoreValue: '1',
      fillExample: async (page) => fillCylindricalCalculator(page, {
        innerRadius: '1',
        innerRadiusUnit: 'mm',
        outerRadius: '5',
        outerRadiusUnit: 'mm',
        length: '10',
        lengthUnit: 'cm',
        relativePermittivity: '1',
      }),
    },
    {
      name: 'Spherical Capacitor',
      card: '#spherical-capacitor',
      panel: '#spherical-calculator',
      form: '#spherical-form',
      firstFocus: '#spherical-inner-radius',
      primaryOutput: '#spherical-primary-result',
      resultCard: '#spherical-result-card',
      copyButton: '#copy-spherical-result',
      copyStatus: '#spherical-copy-status',
      historyMode: 'advanced-spherical',
      expectedResult: '1.39 pF',
      expectedCopyText: 'Spherical Capacitor',
      restoreSelector: '#spherical-inner-radius',
      restoreValue: '1',
      fillExample: async (page) => fillSphericalCalculator(page, {
        innerRadius: '1',
        innerRadiusUnit: 'cm',
        outerRadius: '5',
        outerRadiusUnit: 'cm',
        relativePermittivity: '1',
      }),
    },
    {
      name: 'Dielectric Materials',
      card: '#dielectric-materials',
      panel: '#dielectric-calculator',
      form: '#dielectric-form',
      firstFocus: '#dielectric-baseline-capacitance',
      primaryOutput: '#dielectric-primary-result',
      resultCard: '#dielectric-result-card',
      copyButton: '#copy-dielectric-result',
      copyStatus: '#dielectric-copy-status',
      historyMode: 'advanced-dielectric',
      expectedResult: '350 pF',
      expectedCopyText: 'Dielectric Materials',
      restoreSelector: '#dielectric-baseline-capacitance',
      restoreValue: '100',
      fillExample: async (page) => {
        await ensureAdvancedCalculatorOpen(page, '#dielectric-form');
        await page.locator('#dielectric-material-preset').selectOption('paper');
        await page.locator('#dielectric-baseline-capacitance').fill('100');
        await page.locator('#dielectric-baseline-unit').selectOption('pF');
      },
    },
    {
      name: 'Electric Field & Capacitance',
      card: '#electric-field-capacitance',
      panel: '#electric-field-calculator',
      form: '#electric-field-form',
      firstFocus: '#electric-field-voltage',
      primaryOutput: '#electric-field-primary-result',
      resultCard: '#electric-field-result-card',
      copyButton: '#copy-electric-field-result',
      copyStatus: '#electric-field-copy-status',
      historyMode: 'advanced-electric-field',
      expectedResult: '1,200 V/m',
      expectedCopyText: 'Electric Field & Capacitance',
      restoreSelector: '#electric-field-voltage',
      restoreValue: '12',
      fillExample: async (page) => {
        await ensureAdvancedCalculatorOpen(page, '#electric-field-form');
        await page.locator('#electric-field-mode').selectOption('field');
        await page.locator('#electric-field-voltage').fill('12');
        await page.locator('#electric-field-distance').fill('0.01');
        await page.locator('#electric-field-distance-unit').selectOption('m');
      },
    },
  ];

  const expectNoHorizontalOverflow = async (page) => {
    await expect.poll(async () => page.evaluate(() => {
      const documentElement = document.documentElement;
      return documentElement.scrollWidth <= documentElement.clientWidth + 1;
    })).toBeTruthy();
  };

  const expectTargetBelowStickyHeader = async (page, selector) => {
    await expect.poll(async () => page.locator(selector).evaluate((target) => {
      const header = document.querySelector('.site-header');
      const bounds = target.getBoundingClientRect();
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0;

      return bounds.top >= headerBottom - 1 && bounds.top < window.innerHeight;
    })).toBeTruthy();
  };

  const openCalculatorPanel = async (page, uiCase) => {
    const panel = page.locator(uiCase.panel);
    const toggleButton = page.locator(`${uiCase.card} [data-advanced-calculator-toggle]`);

    if (await panel.isVisible()) {
      return;
    }

    await expect(toggleButton).toContainText('Open Calculator');
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    await toggleButton.click();
    await expect(panel).toBeVisible();
    await expect(toggleButton).toContainText('Hide Calculator');
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(uiCase.firstFocus)).toBeFocused();
  };

  const hideCalculatorPanel = async (page, uiCase) => {
    const panel = page.locator(uiCase.panel);
    const toggleButton = page.locator(`${uiCase.card} [data-advanced-calculator-toggle]`);

    if (await panel.isHidden()) {
      return;
    }

    await toggleButton.click();
    await expect(panel).toBeHidden();
    await expect(toggleButton).toContainText('Open Calculator');
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  };

  const calculateAdvancedExample = async (page, uiCase) => {
    await openCalculatorPanel(page, uiCase);
    await uiCase.fillExample(page);
    await submitCalculatorForm(page, uiCase.form);
    await expect(page.locator(uiCase.primaryOutput)).toHaveText(uiCase.expectedResult);
  };

  const installClipboardSpy = async (page) => {
    await page.evaluate(() => {
      window.__advancedCopiedText = '';

      const clipboard = {
        writeText: async (text) => {
          window.__advancedCopiedText = String(text);
        },
      };

      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        get: () => clipboard,
      });
    });
  };

  const getCopiedText = (page) => page.evaluate(() => window.__advancedCopiedText || '');

  test('home page loads with title and calculator mode selector', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });

    expect(response, 'home page response').not.toBeNull();
    expect(response.ok(), 'home page response is OK').toBeTruthy();

    await expect(page).toHaveTitle(/Capacitance Calculator/i);
    await expect(page.getByRole('heading', { name: 'Capacitance Calculator', level: 1 })).toBeVisible();

    const modeSelector = page.getByRole('combobox', { name: /select calculator mode/i }).first();
    await expect(modeSelector).toBeVisible();
    await expect(modeSelector).toContainText('Unit Converter');
    await expect(modeSelector).toContainText('Capacitive Reactance');

    await modeSelector.selectOption('capacitive-reactance');
    await expect(page.locator('#capacitive-reactance-panel')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Capacitive Reactance Calculator' })).toBeVisible();
  });

  test('formula reference includes capacitive reactance', async ({ page }) => {
    await page.goto('/pages/formula-reference.php', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Capacitance Formulas Made Friendly', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Capacitive Reactance' })).toHaveAttribute('href', '#capacitive-reactance');
    await expect(page.locator('#capacitive-reactance')).toContainText('Xc = 1 / (2πfC)');
    await expect(page.locator('#capacitive-reactance')).toContainText('1.59 kΩ');
  });

  test('advanced physics page is reachable and organized for future calculators', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await page.getByRole('link', { name: 'Advanced Physics' }).click();
    await expect(page).toHaveURL(/\/pages\/advanced-physics\.php$/);
    await expect(page.getByRole('heading', { name: 'Advanced Physics', level: 1 })).toBeVisible();

    await expect(page.locator('.advanced-physics-card')).toHaveCount(5);
    await expect(page.getByRole('heading', { name: 'Theory', exact: true })).toHaveCount(5);
    await expect(page.getByRole('heading', { name: 'Formula', exact: true })).toHaveCount(5);
    await expect(page.getByRole('heading', { name: 'Applications', exact: true })).toHaveCount(5);
    await expect(page.locator('.advanced-calculator-section')).toHaveCount(5);
    await expect(page.locator('.advanced-calculator-section[hidden]')).toHaveCount(5);
    await expect(page.getByRole('button', { name: 'Open Calculator' })).toHaveCount(5);

    await expect(page.getByRole('link', { name: 'Advanced Physics' })).toHaveAttribute('aria-current', 'page');

    const topicsNav = page.getByRole('navigation', { name: /advanced physics overview and topics/i });
    await expect(topicsNav.getByRole('link', { name: 'Parallel Plate Capacitor' })).toHaveAttribute('href', '#parallel-plate-capacitor');
    await topicsNav.getByRole('link', { name: 'Cylindrical Capacitor' }).click();
    await expect(page.locator('#cylindrical-calculator')).toBeHidden();

    await page.goto('/pages/advanced-physics.php#spherical-calculator', { waitUntil: 'load' });
    await expect(page.locator('#spherical-calculator')).toBeVisible();
    await expect(page.locator('#spherical-capacitor').getByRole('button', { name: 'Hide Calculator' })).toHaveAttribute('aria-expanded', 'true');
    await page.goto('/pages/advanced-physics.php', { waitUntil: 'load' });
    await expect(page.locator('.advanced-calculator-section[hidden]')).toHaveCount(5);

    const jumpLink = page.locator('#parallel-plate-capacitor [data-advanced-calculator-toggle]');
    await expect(jumpLink).toBeVisible();
    await expect(jumpLink).toHaveAttribute('aria-controls', 'parallel-plate-calculator');
    await expect(jumpLink).toHaveAttribute('aria-expanded', 'false');
    await jumpLink.click();
    await expect(jumpLink).toHaveAttribute('aria-expanded', 'true');
    await expect(jumpLink).toContainText('Hide Calculator');
    await expect(page.locator('#parallel-plate-calculator')).toBeVisible();
    await expect(page.getByLabel('Plate area A')).toBeFocused();
    await expect.poll(async () => page.locator('#parallel-plate-calculator').evaluate((section) => {
      const header = document.querySelector('.site-header');
      const bounds = section.getBoundingClientRect();
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0;

      return bounds.bottom > headerBottom && bounds.top < window.innerHeight;
    })).toBeTruthy();
    await jumpLink.click();
    await expect(jumpLink).toHaveAttribute('aria-expanded', 'false');
    await expect(jumpLink).toContainText('Open Calculator');
    await expect(page.locator('#parallel-plate-calculator')).toBeHidden();

    const followsMainCalculatorPattern = await page.locator('#parallel-plate-capacitor').evaluate((card) => {
      const result = card.querySelector('#parallel-plate-result-card');
      const form = card.querySelector('#parallel-plate-form');
      const inputGrid = card.querySelector('.advanced-calculator-input-grid');
      const actions = card.querySelector('.form-actions');
      const history = card.querySelector('.advanced-recent-calculations');
      const breakdown = card.querySelector('#parallel-plate-breakdown');

      if (!result || !form || !inputGrid || !actions || !history || !breakdown) {
        return false;
      }

      return Boolean(
        result.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        inputGrid.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        form.compareDocumentPosition(history) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        history.compareDocumentPosition(breakdown) & Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    expect(followsMainCalculatorPattern, 'parallel plate calculator layout order').toBeTruthy();

    const cylindricalJumpLink = page.locator('#cylindrical-capacitor [data-advanced-calculator-toggle]');
    await expect(cylindricalJumpLink).toBeVisible();
    await expect(cylindricalJumpLink).toHaveAttribute('aria-controls', 'cylindrical-calculator');

    const cylindricalFollowsMainCalculatorPattern = await page.locator('#cylindrical-capacitor').evaluate((card) => {
      const result = card.querySelector('#cylindrical-result-card');
      const form = card.querySelector('#cylindrical-form');
      const inputGrid = card.querySelector('.advanced-calculator-input-grid');
      const actions = card.querySelector('.form-actions');
      const history = card.querySelector('[data-history-mode="advanced-cylindrical"]');
      const breakdown = card.querySelector('#cylindrical-breakdown');

      if (!result || !form || !inputGrid || !actions || !history || !breakdown) {
        return false;
      }

      return Boolean(
        result.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        inputGrid.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        form.compareDocumentPosition(history) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        history.compareDocumentPosition(breakdown) & Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    expect(cylindricalFollowsMainCalculatorPattern, 'cylindrical calculator layout order').toBeTruthy();

    const sphericalJumpLink = page.locator('#spherical-capacitor [data-advanced-calculator-toggle]');
    await expect(sphericalJumpLink).toBeVisible();
    await expect(sphericalJumpLink).toHaveAttribute('aria-controls', 'spherical-calculator');

    const sphericalFollowsMainCalculatorPattern = await page.locator('#spherical-capacitor').evaluate((card) => {
      const result = card.querySelector('#spherical-result-card');
      const form = card.querySelector('#spherical-form');
      const inputGrid = card.querySelector('.advanced-calculator-input-grid');
      const actions = card.querySelector('.form-actions');
      const history = card.querySelector('[data-history-mode="advanced-spherical"]');
      const breakdown = card.querySelector('#spherical-breakdown');

      if (!result || !form || !inputGrid || !actions || !history || !breakdown) {
        return false;
      }

      return Boolean(
        result.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        inputGrid.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        form.compareDocumentPosition(history) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        history.compareDocumentPosition(breakdown) & Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    expect(sphericalFollowsMainCalculatorPattern, 'spherical calculator layout order').toBeTruthy();

    const dielectricJumpLink = page.locator('#dielectric-materials [data-advanced-calculator-toggle]');
    await expect(dielectricJumpLink).toBeVisible();
    await expect(dielectricJumpLink).toHaveAttribute('aria-controls', 'dielectric-calculator');

    const dielectricFollowsMainCalculatorPattern = await page.locator('#dielectric-materials').evaluate((card) => {
      const result = card.querySelector('#dielectric-result-card');
      const form = card.querySelector('#dielectric-form');
      const inputGrid = card.querySelector('.advanced-calculator-input-grid');
      const actions = card.querySelector('.form-actions');
      const history = card.querySelector('[data-history-mode="advanced-dielectric"]');
      const breakdown = card.querySelector('#dielectric-breakdown');

      if (!result || !form || !inputGrid || !actions || !history || !breakdown) {
        return false;
      }

      return Boolean(
        result.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        inputGrid.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        form.compareDocumentPosition(history) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        history.compareDocumentPosition(breakdown) & Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    expect(dielectricFollowsMainCalculatorPattern, 'dielectric calculator layout order').toBeTruthy();

    const electricFieldJumpLink = page.locator('#electric-field-capacitance [data-advanced-calculator-toggle]');
    await expect(electricFieldJumpLink).toBeVisible();
    await expect(electricFieldJumpLink).toHaveAttribute('aria-controls', 'electric-field-calculator');

    const electricFieldFollowsMainCalculatorPattern = await page.locator('#electric-field-capacitance').evaluate((card) => {
      const result = card.querySelector('#electric-field-result-card');
      const form = card.querySelector('#electric-field-form');
      const inputGrid = card.querySelector('.advanced-calculator-input-grid');
      const actions = card.querySelector('.form-actions');
      const history = card.querySelector('[data-history-mode="advanced-electric-field"]');
      const breakdown = card.querySelector('#electric-field-breakdown');

      if (!result || !form || !inputGrid || !actions || !history || !breakdown) {
        return false;
      }

      return Boolean(
        result.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        inputGrid.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        form.compareDocumentPosition(history) & Node.DOCUMENT_POSITION_FOLLOWING
      ) && Boolean(
        history.compareDocumentPosition(breakdown) & Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    expect(electricFieldFollowsMainCalculatorPattern, 'electric field calculator layout order').toBeTruthy();
  });

  test('advanced physics topic navigation scrolls to each topic card', async ({ page }) => {
    await visitAdvancedPhysics(page);

    const topicsNav = page.locator('#advanced-topics');
    await expect(topicsNav).toBeVisible();

    for (const topic of advancedTopicLinks) {
      const link = topicsNav.getByRole('link', { name: topic.name });
      await expect(link).toHaveAttribute('href', topic.card);

      await link.click();
      await expect(page).toHaveURL(new RegExp(`${topic.card.slice(1)}$`));
      await expectTargetBelowStickyHeader(page, topic.card);
      await expect(page.locator(`${topic.card} .advanced-calculator-section`)).toBeHidden();
    }
  });

  test('advanced physics calculator workflows expand and collapse independently', async ({ page }) => {
    await visitAdvancedPhysics(page);

    for (const uiCase of advancedUiCases) {
      await expect(page.locator(uiCase.panel)).toBeHidden();
      await expect(page.locator(`${uiCase.card} [data-advanced-calculator-toggle]`)).toHaveAttribute('aria-expanded', 'false');
    }

    for (const uiCase of advancedUiCases) {
      await openCalculatorPanel(page, uiCase);

      for (const otherCase of advancedUiCases) {
        const expectation = otherCase === uiCase ? expect(page.locator(otherCase.panel)).toBeVisible() : expect(page.locator(otherCase.panel)).toBeHidden();
        await expectation;
      }

      await hideCalculatorPanel(page, uiCase);
    }
  });

  test('advanced physics back-to-topics links return to the topics panel', async ({ page }) => {
    await visitAdvancedPhysics(page);

    const backLinks = page.locator('.advanced-back-to-topics');
    await expect(backLinks).toHaveCount(5);

    for (let index = 0; index < advancedTopicLinks.length; index += 1) {
      const backLink = backLinks.nth(index);
      await expect(backLink).toHaveAttribute('href', '#advanced-topics');

      await backLink.scrollIntoViewIfNeeded();
      await backLink.click();
      await expect(page).toHaveURL(/#advanced-topics$/);
      await expectTargetBelowStickyHeader(page, '#advanced-topics');
    }
  });

  test('advanced physics mobile sticky jump to topics behaves responsively', async ({ page }) => {
    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 760 });
      await visitAdvancedPhysics(page);

      const stickyTopicsLink = page.locator('.advanced-mobile-topics-link');
      await expect(stickyTopicsLink).toBeVisible();
      await expect(stickyTopicsLink).toHaveAttribute('href', '#advanced-topics');
      await stickyTopicsLink.focus();
      await expect(stickyTopicsLink).toBeFocused();

      await page.locator('#electric-field-capacitance').scrollIntoViewIfNeeded();
      await stickyTopicsLink.click();
      await expect(page).toHaveURL(/#advanced-topics$/);
      await expectTargetBelowStickyHeader(page, '#advanced-topics');
      await expectNoHorizontalOverflow(page);
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await visitAdvancedPhysics(page);
    await expect(page.locator('.advanced-mobile-topics-link')).toBeHidden();
  });

  test('advanced physics result card polish remains wired after valid calculations', async ({ page }) => {
    await visitAdvancedPhysics(page);
    await installClipboardSpy(page);

    for (const uiCase of advancedUiCases) {
      await calculateAdvancedExample(page, uiCase);

      const resultCard = page.locator(uiCase.resultCard);
      const copyButton = page.locator(uiCase.copyButton);

      await expect(resultCard.locator('.advanced-primary-caption')).toHaveText('Primary Result');
      await expect(page.locator(uiCase.primaryOutput)).toBeVisible();
      await expect(page.locator(uiCase.primaryOutput)).not.toHaveText('--');
      await expect(resultCard.locator('.advanced-result-section-label')).toContainText('Other Units');
      await expect(resultCard.locator('.advanced-result-label [aria-hidden="true"]')).toHaveCount(1);
      await expect(copyButton).toBeEnabled();

      await copyButton.click();
      await expect(page.locator(uiCase.copyStatus)).toHaveText('Copied!');

      const copiedText = await getCopiedText(page);
      expect(copiedText).toContain(uiCase.expectedCopyText);
      expect(copiedText).toContain(uiCase.expectedResult);
    }
  });

  test('advanced physics hidden history restore opens the matching workflow without recalculating', async ({ page }) => {
    await visitAdvancedPhysics(page);

    for (const uiCase of advancedUiCases) {
      await calculateAdvancedExample(page, uiCase);
      await hideCalculatorPanel(page, uiCase);

      const historyButton = page.locator(`[data-history-mode="${uiCase.historyMode}"] .history-entry-button`).first();
      await activateControl(historyButton);

      await expect(page.locator(uiCase.panel)).toBeVisible();
      await expect(page.locator(`${uiCase.card} [data-advanced-calculator-toggle]`)).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator(uiCase.restoreSelector)).toHaveValue(uiCase.restoreValue);
      await expect(page.locator(uiCase.primaryOutput)).toHaveText('--');
      await expect(page.locator(uiCase.copyButton)).toBeDisabled();

      await hideCalculatorPanel(page, uiCase);
    }
  });

  test('advanced calculator toggles respect reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await visitAdvancedPhysics(page);

    const toggleButton = page.locator('#parallel-plate-capacitor [data-advanced-calculator-toggle]');
    const panel = page.locator('#parallel-plate-calculator');

    await expect(panel).toBeHidden();
    await toggleButton.click();
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    await expect(toggleButton).toContainText('Hide Calculator');
    await expect(panel).toBeVisible();
    await expect(page.getByLabel('Plate area A')).toBeFocused();
    await expect(panel).not.toHaveClass(/is-expanding|is-collapsing/);

    await toggleButton.click();
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    await expect(toggleButton).toContainText('Open Calculator');
    await expect(panel).toBeHidden();
    await expect(panel).not.toHaveClass(/is-expanding|is-collapsing/);
  });

  test('parallel plate calculator solves SI and converted-unit examples', async ({ page }) => {
    await visitAdvancedPhysics(page);
    await ensureAdvancedCalculatorOpen(page, '#parallel-plate-form');

    const copyButton = page.getByRole('button', { name: /copy parallel plate capacitor result/i });
    await expect(copyButton).toBeDisabled();

    await fillParallelPlateCalculator(page, {
      area: '0.01',
      areaUnit: 'm2',
      distance: '0.001',
      distanceUnit: 'm',
      relativePermittivity: '1',
    });
    await submitCalculatorForm(page, '#parallel-plate-form');

    await expect(page.locator('#parallel-plate-primary-result')).toHaveText('88.54 pF');
    await expect(page.locator('#parallel-plate-result-nf')).toHaveText('0.0885 nF');
    await expect(page.locator('#parallel-plate-result-uf')).toHaveText('0.00008854 µF');
    await expect(page.locator('#parallel-plate-result-f')).toHaveText(/8\.8542e-11 F/);
    const breakdown = page.locator('#parallel-plate-breakdown');
    const technicalOutput = page.locator('#parallel-plate-technical-output');

    await expect(breakdown).toContainText('Given');
    await expect(breakdown).toContainText('Permittivity');
    await expect(breakdown).toContainText('Formula');
    await expect(breakdown).toContainText('Substitution');
    await expect(breakdown).toContainText('Final');
    await expect(breakdown).toContainText('A = 0.01 m²');
    await expect(breakdown).toContainText('ε = 1 × 8.854187817 × 10⁻¹² F/m');
    await expect(breakdown).toContainText('C ≈ 88.54 pF');
    await expect(breakdown).not.toContainText(/e-1[12]/);
    await expect(technicalOutput).toContainText('Vacuum permittivity ε0');
    await expect(technicalOutput).toContainText('Relative permittivity εr');
    await expect(technicalOutput).toContainText('Absolute permittivity ε');
    await expect(technicalOutput).toContainText('Converted area A');
    await expect(technicalOutput).toContainText('Converted distance d');
    await expect(technicalOutput).toContainText('Raw capacitance in farads');
    await expect(technicalOutput).toContainText('8.854187817 × 10⁻¹² F/m');
    await expect(technicalOutput).toContainText('8.8542 × 10⁻¹¹ F');
    await expect(technicalOutput).not.toContainText(/e-1[12]/);
    await expect(page.locator('#parallel-plate-history-list .history-entry')).toHaveCount(1);
    await expect(page.locator('#parallel-plate-history-list .history-entry').first()).toContainText('88.54 pF');
    await expect(copyButton).toBeEnabled();

    await page.locator('#parallel-plate-form').getByRole('button', { name: 'Clear', exact: true }).click();
    await expect(copyButton).toBeDisabled();
    await expect(page.locator('#parallel-plate-technical-output')).toHaveText('Raw SI values will appear after calculation.');
    await expect(page.locator('#parallel-plate-history-list .history-entry')).toHaveCount(1);

    await fillParallelPlateCalculator(page, {
      area: '100',
      areaUnit: 'cm2',
      distance: '1',
      distanceUnit: 'mm',
      relativePermittivity: '1',
    });
    await submitCalculatorForm(page, '#parallel-plate-form');

    await expect(page.locator('#parallel-plate-primary-result')).toHaveText('88.54 pF');
    await expect(page.locator('#parallel-plate-breakdown')).toContainText('A = 0.01 m²');
    await expect(page.locator('#parallel-plate-breakdown')).toContainText('d = 0.001 m');
    await expect(page.locator('#parallel-plate-history-list .history-entry')).toHaveCount(2);
  });

  test('parallel plate history persists, restores, exports, and clears', async ({ page }) => {
    await visitAdvancedPhysics(page);
    await ensureAdvancedCalculatorOpen(page, '#parallel-plate-form');

    const historySection = page.locator('[data-history-mode="advanced-parallel-plate"]');
    const historyEntries = historySection.locator('.history-entry');
    const exportTxtButton = historySection.getByRole('button', { name: /export parallel plate history as txt/i });
    const exportCsvButton = historySection.getByRole('button', { name: /export parallel plate history as csv/i });
    const clearHistoryButton = historySection.getByRole('button', { name: /clear parallel plate history/i });

    await expect(historySection.getByText('No saved calculations yet.')).toBeVisible();
    await expect(exportTxtButton).toBeDisabled();
    await expect(exportCsvButton).toBeDisabled();

    await fillParallelPlateCalculator(page, {
      area: '0.01',
      areaUnit: 'm2',
      distance: '0.001',
      distanceUnit: 'm',
      relativePermittivity: '1',
    });
    await submitCalculatorForm(page, '#parallel-plate-form');

    await expect(historyEntries).toHaveCount(1);
    await expect(historyEntries.first()).toContainText('A = 0.01 m²');
    await expect(historyEntries.first()).toContainText('88.54 pF');
    await expect(exportTxtButton).toBeEnabled();
    await expect(exportCsvButton).toBeEnabled();

    await activateControl(historySection.locator('.history-entry-button').first());
    await expect(page.getByLabel('Plate area A')).toHaveValue('0.01');
    await expect(page.getByLabel('Area unit')).toHaveValue('m2');
    await expect(page.getByLabel('Plate separation d')).toHaveValue('0.001');
    await expect(page.locator('#parallel-plate-distance-unit')).toHaveValue('m');
    await expect(page.locator('#parallel-plate-relative-permittivity')).toHaveValue('1');
    await expect(page.locator('#parallel-plate-primary-result')).toHaveText('--');
    await expect(page.getByRole('button', { name: /copy parallel plate capacitor result/i })).toBeDisabled();

    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(250);
    await expect(page.locator('#parallel-plate-calculator')).toBeHidden();
    await expect(historyEntries).toHaveCount(1);
    await expect(historyEntries.first()).toContainText('88.54 pF');
    await activateControl(historySection.locator('.history-entry-button').first());
    await expect(page.locator('#parallel-plate-calculator')).toBeVisible();
    await expect(page.getByLabel('Plate area A')).toHaveValue('0.01');
    await expect(page.getByLabel('Plate area A')).toBeFocused();
    await expect(page.locator('#parallel-plate-primary-result')).toHaveText('--');

    const [txtDownload] = await Promise.all([
      page.waitForEvent('download'),
      activateControl(exportTxtButton),
    ]);
    const txtContent = await readDownloadText(txtDownload);
    expect(txtDownload.suggestedFilename()).toBe('advanced-parallel-plate-history.txt');
    expect(txtContent).toContain('Parallel Plate Capacitor');
    expect(txtContent).toContain('A = 0.01 m²');
    expect(txtContent).toContain('88.54 pF');

    const [csvDownload] = await Promise.all([
      page.waitForEvent('download'),
      activateControl(exportCsvButton),
    ]);
    const csvContent = await readDownloadText(csvDownload);
    expect(csvDownload.suggestedFilename()).toBe('advanced-parallel-plate-history.csv');
    expect(csvContent).toContain('Mode,Input,Result,Timestamp');
    expect(csvContent).toContain('Parallel Plate Capacitor');
    expect(csvContent).toContain('88.54 pF');

    await activateControl(clearHistoryButton);
    await expect(historyEntries).toHaveCount(0);
    await expect(historySection.getByText('No saved calculations yet.')).toBeVisible();
    await expect(exportTxtButton).toBeDisabled();
    await expect(exportCsvButton).toBeDisabled();
  });

  test('cylindrical calculator solves, explains, persists, restores, exports, and clears', async ({ page }) => {
    await visitAdvancedPhysics(page);
    await ensureAdvancedCalculatorOpen(page, '#cylindrical-form');

    const historySection = page.locator('[data-history-mode="advanced-cylindrical"]');
    const historyEntries = historySection.locator('.history-entry');
    const copyButton = page.getByRole('button', { name: /copy cylindrical capacitor result/i });
    const exportTxtButton = historySection.getByRole('button', { name: /export cylindrical history as txt/i });
    const exportCsvButton = historySection.getByRole('button', { name: /export cylindrical history as csv/i });
    const clearHistoryButton = historySection.getByRole('button', { name: /clear cylindrical history/i });

    await expect(copyButton).toBeDisabled();
    await expect(exportTxtButton).toBeDisabled();
    await expect(exportCsvButton).toBeDisabled();

    await fillCylindricalCalculator(page, {
      innerRadius: '1',
      innerRadiusUnit: 'mm',
      outerRadius: '5',
      outerRadiusUnit: 'mm',
      length: '10',
      lengthUnit: 'cm',
      relativePermittivity: '1',
    });
    await submitCalculatorForm(page, '#cylindrical-form');

    await expect(page.locator('#cylindrical-primary-result')).toHaveText('3.46 pF');
    await expect(page.locator('#cylindrical-result-nf')).toHaveText('0.0035 nF');
    await expect(page.locator('#cylindrical-result-uf')).toHaveText('0.00000346 µF');
    await expect(page.locator('#cylindrical-result-f')).toHaveText(/3\.4566e-12 F/);
    await expect(page.locator('#cylindrical-breakdown')).toContainText('C = 2π ε L / ln(b/a)');
    await expect(page.locator('#cylindrical-breakdown')).toContainText('ln(b/a) = 1.60943791');
    await expect(page.locator('#cylindrical-breakdown')).toContainText('C ≈ 3.46 pF');
    await expect(page.locator('#cylindrical-technical-output')).toContainText('Converted inner radius a');
    await expect(page.locator('#cylindrical-technical-output')).toContainText('Radius ratio b/a');
    await expect(page.locator('#cylindrical-technical-output')).toContainText('Logarithmic term ln(b/a)');
    await expect(copyButton).toBeEnabled();
    await expect(historyEntries).toHaveCount(1);
    await expect(historyEntries.first()).toContainText('a = 1 mm');
    await expect(historyEntries.first()).toContainText('3.46 pF');
    await expect(exportTxtButton).toBeEnabled();
    await expect(exportCsvButton).toBeEnabled();

    await activateControl(historySection.locator('.history-entry-button').first());
    await expect(page.locator('#cylindrical-inner-radius')).toHaveValue('1');
    await expect(page.locator('#cylindrical-inner-radius-unit')).toHaveValue('mm');
    await expect(page.locator('#cylindrical-outer-radius')).toHaveValue('5');
    await expect(page.locator('#cylindrical-outer-radius-unit')).toHaveValue('mm');
    await expect(page.locator('#cylindrical-length')).toHaveValue('10');
    await expect(page.locator('#cylindrical-length-unit')).toHaveValue('cm');
    await expect(page.locator('#cylindrical-relative-permittivity')).toHaveValue('1');
    await expect(page.locator('#cylindrical-primary-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();

    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(250);
    await ensureAdvancedCalculatorOpen(page, '#cylindrical-form');
    await expect(historyEntries).toHaveCount(1);
    await expect(historyEntries.first()).toContainText('3.46 pF');

    const [txtDownload] = await Promise.all([
      page.waitForEvent('download'),
      activateControl(exportTxtButton),
    ]);
    const txtContent = await readDownloadText(txtDownload);
    expect(txtDownload.suggestedFilename()).toBe('advanced-cylindrical-history.txt');
    expect(txtContent).toContain('Cylindrical Capacitor');
    expect(txtContent).toContain('a = 1 mm');
    expect(txtContent).toContain('3.46 pF');

    const [csvDownload] = await Promise.all([
      page.waitForEvent('download'),
      activateControl(exportCsvButton),
    ]);
    const csvContent = await readDownloadText(csvDownload);
    expect(csvDownload.suggestedFilename()).toBe('advanced-cylindrical-history.csv');
    expect(csvContent).toContain('Mode,Input,Result,Timestamp');
    expect(csvContent).toContain('Cylindrical Capacitor');
    expect(csvContent).toContain('3.46 pF');

    await activateControl(clearHistoryButton);
    await expect(historyEntries).toHaveCount(0);
    await expect(historySection.getByText('No saved calculations yet.')).toBeVisible();
    await expect(exportTxtButton).toBeDisabled();
    await expect(exportCsvButton).toBeDisabled();
  });

  test('cylindrical calculator validates blank, zero, negative, invalid, and radius order values', async ({ page }) => {
    await visitAdvancedPhysics(page);

    await submitCalculatorForm(page, '#cylindrical-form');
    await expect(page.locator('#cylindrical-error')).toHaveText('Enter inner radius.');
    await expect(page.locator('#cylindrical-inner-radius')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#cylindrical-inner-radius').fill('0');
    await submitCalculatorForm(page, '#cylindrical-form');
    await expect(page.locator('#cylindrical-error')).toHaveText('inner radius must be greater than zero.');

    await page.locator('#cylindrical-inner-radius').fill('1');
    await page.locator('#cylindrical-outer-radius').fill('-5');
    await submitCalculatorForm(page, '#cylindrical-form');
    await expect(page.locator('#cylindrical-error')).toHaveText('outer radius cannot be negative.');
    await expect(page.locator('#cylindrical-outer-radius')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#cylindrical-outer-radius').fill('5');
    await page.locator('#cylindrical-length').fill('abc');
    await submitCalculatorForm(page, '#cylindrical-form');
    await expect(page.locator('#cylindrical-error')).toHaveText('length must be a valid number.');
    await expect(page.locator('#cylindrical-length')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#cylindrical-length').fill('10');
    await page.locator('#cylindrical-outer-radius').fill('1');
    await submitCalculatorForm(page, '#cylindrical-form');
    await expect(page.locator('#cylindrical-error')).toHaveText('outer radius must be greater than inner radius.');
    await expect(page.locator('#cylindrical-outer-radius')).toHaveAttribute('aria-invalid', 'true');
  });

  test('spherical calculator solves, explains, persists, restores, exports, and clears', async ({ page }) => {
    await visitAdvancedPhysics(page);
    await ensureAdvancedCalculatorOpen(page, '#spherical-form');

    const historySection = page.locator('[data-history-mode="advanced-spherical"]');
    const historyEntries = historySection.locator('.history-entry');
    const copyButton = page.getByRole('button', { name: /copy spherical capacitor result/i });
    const exportTxtButton = historySection.getByRole('button', { name: /export spherical history as txt/i });
    const exportCsvButton = historySection.getByRole('button', { name: /export spherical history as csv/i });
    const clearHistoryButton = historySection.getByRole('button', { name: /clear spherical history/i });

    await expect(copyButton).toBeDisabled();
    await expect(exportTxtButton).toBeDisabled();
    await expect(exportCsvButton).toBeDisabled();

    await fillSphericalCalculator(page, {
      innerRadius: '1',
      innerRadiusUnit: 'cm',
      outerRadius: '5',
      outerRadiusUnit: 'cm',
      relativePermittivity: '1',
    });
    await submitCalculatorForm(page, '#spherical-form');

    await expect(page.locator('#spherical-primary-result')).toHaveText('1.39 pF');
    await expect(page.locator('#spherical-result-nf')).toHaveText('0.0014 nF');
    await expect(page.locator('#spherical-result-uf')).toHaveText('0.00000139 µF');
    await expect(page.locator('#spherical-result-f')).toHaveText(/1\.3908e-12 F/);
    await expect(page.locator('#spherical-breakdown')).toContainText('C = 4π εab / (b - a)');
    await expect(page.locator('#spherical-breakdown')).toContainText('b - a = 0.05 m - 0.01 m = 0.04 m');
    await expect(page.locator('#spherical-breakdown')).toContainText('C ≈ 1.39 pF');
    await expect(page.locator('#spherical-technical-output')).toContainText('Converted inner radius a');
    await expect(page.locator('#spherical-technical-output')).toContainText('Converted outer radius b');
    await expect(page.locator('#spherical-technical-output')).toContainText('Radius difference b - a');
    await expect(copyButton).toBeEnabled();
    await expect(historyEntries).toHaveCount(1);
    await expect(historyEntries.first()).toContainText('a = 1 cm');
    await expect(historyEntries.first()).toContainText('1.39 pF');
    await expect(exportTxtButton).toBeEnabled();
    await expect(exportCsvButton).toBeEnabled();

    await activateControl(historySection.locator('.history-entry-button').first());
    await expect(page.locator('#spherical-inner-radius')).toHaveValue('1');
    await expect(page.locator('#spherical-inner-radius-unit')).toHaveValue('cm');
    await expect(page.locator('#spherical-outer-radius')).toHaveValue('5');
    await expect(page.locator('#spherical-outer-radius-unit')).toHaveValue('cm');
    await expect(page.locator('#spherical-relative-permittivity')).toHaveValue('1');
    await expect(page.locator('#spherical-primary-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();

    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(250);
    await ensureAdvancedCalculatorOpen(page, '#spherical-form');
    await expect(historyEntries).toHaveCount(1);
    await expect(historyEntries.first()).toContainText('1.39 pF');

    const [txtDownload] = await Promise.all([
      page.waitForEvent('download'),
      activateControl(exportTxtButton),
    ]);
    const txtContent = await readDownloadText(txtDownload);
    expect(txtDownload.suggestedFilename()).toBe('advanced-spherical-history.txt');
    expect(txtContent).toContain('Spherical Capacitor');
    expect(txtContent).toContain('a = 1 cm');
    expect(txtContent).toContain('1.39 pF');

    const [csvDownload] = await Promise.all([
      page.waitForEvent('download'),
      activateControl(exportCsvButton),
    ]);
    const csvContent = await readDownloadText(csvDownload);
    expect(csvDownload.suggestedFilename()).toBe('advanced-spherical-history.csv');
    expect(csvContent).toContain('Mode,Input,Result,Timestamp');
    expect(csvContent).toContain('Spherical Capacitor');
    expect(csvContent).toContain('1.39 pF');

    await activateControl(clearHistoryButton);
    await expect(historyEntries).toHaveCount(0);
    await expect(historySection.getByText('No saved calculations yet.')).toBeVisible();
    await expect(exportTxtButton).toBeDisabled();
    await expect(exportCsvButton).toBeDisabled();
  });

  test('dielectric calculator solves, explains, presets, persists, restores, exports, and clears', async ({ page }) => {
    await visitAdvancedPhysics(page);
    await ensureAdvancedCalculatorOpen(page, '#dielectric-form');

    const historySection = page.locator('[data-history-mode="advanced-dielectric"]');
    const historyEntries = historySection.locator('.history-entry');
    const copyButton = page.getByRole('button', { name: /copy dielectric materials result/i });
    const exportTxtButton = historySection.getByRole('button', { name: /export dielectric history as txt/i });
    const exportCsvButton = historySection.getByRole('button', { name: /export dielectric history as csv/i });
    const clearHistoryButton = historySection.getByRole('button', { name: /clear dielectric history/i });

    await expect(copyButton).toBeDisabled();
    await expect(exportTxtButton).toBeDisabled();
    await expect(exportCsvButton).toBeDisabled();

    await page.locator('#dielectric-material-preset').selectOption('paper');
    await expect(page.locator('#dielectric-relative-permittivity')).toHaveValue('3.5');

    await page.locator('#dielectric-baseline-capacitance').fill('100');
    await page.locator('#dielectric-baseline-unit').selectOption('pF');
    await submitCalculatorForm(page, '#dielectric-form');

    await expect(page.locator('#dielectric-primary-result')).toHaveText('350 pF');
    await expect(page.locator('#dielectric-result-nf')).toHaveText('0.35 nF');
    await expect(page.locator('#dielectric-result-uf')).toHaveText('0.00035 µF');
    await expect(page.locator('#dielectric-result-f')).toHaveText(/3\.5e-10 F/);
    await expect(page.locator('#dielectric-breakdown')).toContainText('Given');
    await expect(page.locator('#dielectric-breakdown')).toContainText('Permittivity');
    await expect(page.locator('#dielectric-breakdown')).toContainText('Formula');
    await expect(page.locator('#dielectric-breakdown')).toContainText('Substitution');
    await expect(page.locator('#dielectric-breakdown')).toContainText('Final');
    await expect(page.locator('#dielectric-breakdown')).toContainText('C = κ × C0');
    await expect(page.locator('#dielectric-breakdown')).toContainText('C ≈ 350 pF');
    await expect(page.locator('#dielectric-technical-output')).toContainText('Vacuum permittivity ε0');
    await expect(page.locator('#dielectric-technical-output')).toContainText('Dielectric constant κ / εr');
    await expect(page.locator('#dielectric-technical-output')).toContainText('Absolute permittivity ε');
    await expect(page.locator('#dielectric-technical-output')).toContainText('Selected material');
    await expect(page.locator('#dielectric-technical-output')).toContainText('Baseline capacitance C0');
    await expect(page.locator('#dielectric-technical-output')).toContainText('Result capacitance in farads');
    await expect(page.locator('#dielectric-technical-output')).toContainText('3.5 × 10⁻¹⁰ F');
    await expect(copyButton).toBeEnabled();
    await expect(historyEntries).toHaveCount(1);
    await expect(historyEntries.first()).toContainText('C0 = 100 pF');
    await expect(historyEntries.first()).toContainText('350 pF');
    await expect(exportTxtButton).toBeEnabled();
    await expect(exportCsvButton).toBeEnabled();

    await activateControl(historySection.locator('.history-entry-button').first());
    await expect(page.locator('#dielectric-baseline-capacitance')).toHaveValue('100');
    await expect(page.locator('#dielectric-baseline-unit')).toHaveValue('pF');
    await expect(page.locator('#dielectric-material-preset')).toHaveValue('paper');
    await expect(page.locator('#dielectric-relative-permittivity')).toHaveValue('3.5');
    await expect(page.locator('#dielectric-primary-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();

    await page.locator('#dielectric-relative-permittivity').fill('5');
    await expect(page.locator('#dielectric-material-preset')).toHaveValue('custom');
    await expect(page.locator('#dielectric-primary-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();

    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(250);
    await ensureAdvancedCalculatorOpen(page, '#dielectric-form');
    await expect(historyEntries).toHaveCount(1);
    await expect(historyEntries.first()).toContainText('350 pF');

    const [txtDownload] = await Promise.all([
      page.waitForEvent('download'),
      activateControl(exportTxtButton),
    ]);
    const txtContent = await readDownloadText(txtDownload);
    expect(txtDownload.suggestedFilename()).toBe('advanced-dielectric-history.txt');
    expect(txtContent).toContain('Dielectric Materials');
    expect(txtContent).toContain('C0 = 100 pF');
    expect(txtContent).toContain('350 pF');

    const [csvDownload] = await Promise.all([
      page.waitForEvent('download'),
      activateControl(exportCsvButton),
    ]);
    const csvContent = await readDownloadText(csvDownload);
    expect(csvDownload.suggestedFilename()).toBe('advanced-dielectric-history.csv');
    expect(csvContent).toContain('Mode,Input,Result,Timestamp');
    expect(csvContent).toContain('Dielectric Materials');
    expect(csvContent).toContain('350 pF');

    await activateControl(clearHistoryButton);
    await expect(historyEntries).toHaveCount(0);
    await expect(historySection.getByText('No saved calculations yet.')).toBeVisible();
    await expect(exportTxtButton).toBeDisabled();
    await expect(exportCsvButton).toBeDisabled();
  });

  test('dielectric calculator validates blank, zero, negative, and invalid values', async ({ page }) => {
    await visitAdvancedPhysics(page);

    await submitCalculatorForm(page, '#dielectric-form');
    await expect(page.locator('#dielectric-error')).toHaveText('Enter baseline capacitance.');
    await expect(page.locator('#dielectric-baseline-capacitance')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#dielectric-baseline-capacitance').fill('0');
    await submitCalculatorForm(page, '#dielectric-form');
    await expect(page.locator('#dielectric-error')).toHaveText('baseline capacitance must be greater than zero.');

    await page.locator('#dielectric-baseline-capacitance').fill('100');
    await page.locator('#dielectric-relative-permittivity').fill('-3.5');
    await submitCalculatorForm(page, '#dielectric-form');
    await expect(page.locator('#dielectric-error')).toHaveText('dielectric constant cannot be negative.');
    await expect(page.locator('#dielectric-relative-permittivity')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#dielectric-relative-permittivity').fill('0');
    await submitCalculatorForm(page, '#dielectric-form');
    await expect(page.locator('#dielectric-error')).toHaveText('dielectric constant must be greater than zero.');

    await page.locator('#dielectric-relative-permittivity').fill('abc');
    await submitCalculatorForm(page, '#dielectric-form');
    await expect(page.locator('#dielectric-error')).toHaveText('dielectric constant must be a valid number.');
    await expect(page.locator('#dielectric-relative-permittivity')).toHaveAttribute('aria-invalid', 'true');
  });

  test('electric field calculator solves all modes, persists, restores, exports, and clears', async ({ page }) => {
    await visitAdvancedPhysics(page);
    await ensureAdvancedCalculatorOpen(page, '#electric-field-form');

    const historySection = page.locator('[data-history-mode="advanced-electric-field"]');
    const historyEntries = historySection.locator('.history-entry');
    const copyButton = page.getByRole('button', { name: /copy electric field and capacitance result/i });
    const exportTxtButton = historySection.getByRole('button', { name: /export electric field history as txt/i });
    const exportCsvButton = historySection.getByRole('button', { name: /export electric field history as csv/i });
    const clearHistoryButton = historySection.getByRole('button', { name: /clear electric field history/i });

    await expect(copyButton).toBeDisabled();
    await expect(exportTxtButton).toBeDisabled();
    await expect(exportCsvButton).toBeDisabled();
    await expect(page.locator('#electric-field-voltage')).toBeVisible();
    await expect(page.locator('#electric-field-distance')).toBeVisible();

    await page.locator('#electric-field-voltage').fill('12');
    await page.locator('#electric-field-distance').fill('0.01');
    await page.locator('#electric-field-distance-unit').selectOption('m');
    await submitCalculatorForm(page, '#electric-field-form');

    await expect(page.locator('#electric-field-primary-result')).toHaveText('1,200 V/m');
    await expect(page.locator('#electric-field-result-2')).toHaveText('1.2 kV/m');
    await expect(page.locator('#electric-field-result-3')).toHaveText('12 V/cm');
    await expect(page.locator('#electric-field-breakdown')).toContainText('E = V / d');
    await expect(page.locator('#electric-field-breakdown')).toContainText('E ≈ 1,200 V/m');
    await expect(page.locator('#electric-field-technical-output')).toContainText('Calculation mode');
    await expect(page.locator('#electric-field-technical-output')).toContainText('Raw electric field E');
    await expect(copyButton).toBeEnabled();
    await expect(historyEntries).toHaveCount(1);
    await expect(historyEntries.first()).toContainText('1,200 V/m');

    await page.locator('#electric-field-mode').selectOption('voltage');
    await expect(page.locator('#electric-field-primary-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();
    await expect(page.locator('#electric-field-strength')).toBeVisible();
    await expect(page.locator('#electric-field-distance')).toBeVisible();
    await page.locator('#electric-field-strength').fill('1200');
    await page.locator('#electric-field-strength-unit').selectOption('vm');
    await page.locator('#electric-field-distance').fill('0.01');
    await page.locator('#electric-field-distance-unit').selectOption('m');
    await submitCalculatorForm(page, '#electric-field-form');

    await expect(page.locator('#electric-field-primary-result')).toHaveText('12 V');
    await expect(page.locator('#electric-field-result-2')).toHaveText('0.012 kV');
    await expect(page.locator('#electric-field-result-3')).toHaveText('12,000 mV');
    await expect(page.locator('#electric-field-breakdown')).toContainText('V = E × d');

    await page.locator('#electric-field-mode').selectOption('distance');
    await page.locator('#electric-field-voltage').fill('12');
    await page.locator('#electric-field-strength').fill('1200');
    await page.locator('#electric-field-strength-unit').selectOption('vm');
    await submitCalculatorForm(page, '#electric-field-form');

    await expect(page.locator('#electric-field-primary-result')).toHaveText('0.01 m');
    await expect(page.locator('#electric-field-result-2')).toHaveText('1 cm');
    await expect(page.locator('#electric-field-result-3')).toHaveText('10 mm');
    await expect(page.locator('#electric-field-breakdown')).toContainText('d = V / E');

    await page.locator('#electric-field-mode').selectOption('capacitance');
    await expect(page.locator('#electric-field-charge')).toBeVisible();
    await expect(page.locator('#electric-field-distance')).toBeHidden();
    await page.locator('#electric-field-charge').fill('0.001');
    await page.locator('#electric-field-charge-unit').selectOption('C');
    await page.locator('#electric-field-voltage').fill('10');
    await submitCalculatorForm(page, '#electric-field-form');

    await expect(page.locator('#electric-field-primary-result')).toHaveText('0.0001 F');
    await expect(page.locator('#electric-field-result-2')).toHaveText('100 µF');
    await expect(page.locator('#electric-field-result-3')).toHaveText('100,000 nF');
    await expect(page.locator('#electric-field-result-4')).toHaveText('100,000,000 pF');
    await expect(page.locator('#electric-field-breakdown')).toContainText('C = Q / V');
    await expect(page.locator('#electric-field-technical-output')).toContainText('Raw capacitance C');
    await expect(historyEntries).toHaveCount(4);
    await expect(exportTxtButton).toBeEnabled();
    await expect(exportCsvButton).toBeEnabled();

    await activateControl(historySection.locator('.history-entry-button').filter({ hasText: '0.0001 F' }).first());
    await expect(page.locator('#electric-field-mode')).toHaveValue('capacitance');
    await expect(page.locator('#electric-field-charge')).toHaveValue('0.001');
    await expect(page.locator('#electric-field-charge-unit')).toHaveValue('C');
    await expect(page.locator('#electric-field-voltage')).toHaveValue('10');
    await expect(page.locator('#electric-field-primary-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();

    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(250);
    await ensureAdvancedCalculatorOpen(page, '#electric-field-form');
    await expect(historyEntries).toHaveCount(4);
    await expect(historyEntries.first()).toContainText('0.0001 F');

    const [txtDownload] = await Promise.all([
      page.waitForEvent('download'),
      activateControl(exportTxtButton),
    ]);
    const txtContent = await readDownloadText(txtDownload);
    expect(txtDownload.suggestedFilename()).toBe('advanced-electric-field-history.txt');
    expect(txtContent).toContain('Electric Field & Capacitance');
    expect(txtContent).toContain('Find Capacitance C');
    expect(txtContent).toContain('0.0001 F');

    const [csvDownload] = await Promise.all([
      page.waitForEvent('download'),
      activateControl(exportCsvButton),
    ]);
    const csvContent = await readDownloadText(csvDownload);
    expect(csvDownload.suggestedFilename()).toBe('advanced-electric-field-history.csv');
    expect(csvContent).toContain('Mode,Input,Result,Timestamp');
    expect(csvContent).toContain('Electric Field & Capacitance');
    expect(csvContent).toContain('0.0001 F');

    await activateControl(clearHistoryButton);
    await expect(historyEntries).toHaveCount(0);
    await expect(historySection.getByText('No saved calculations yet.')).toBeVisible();
    await expect(exportTxtButton).toBeDisabled();
    await expect(exportCsvButton).toBeDisabled();
  });

  test('electric field calculator validates blank, zero, negative, and invalid values by mode', async ({ page }) => {
    await visitAdvancedPhysics(page);

    await submitCalculatorForm(page, '#electric-field-form');
    await expect(page.locator('#electric-field-error')).toHaveText('Enter voltage.');
    await expect(page.locator('#electric-field-voltage')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#electric-field-voltage').fill('0');
    await submitCalculatorForm(page, '#electric-field-form');
    await expect(page.locator('#electric-field-error')).toHaveText('voltage must be greater than zero.');

    await page.locator('#electric-field-voltage').fill('12');
    await page.locator('#electric-field-distance').fill('-0.01');
    await submitCalculatorForm(page, '#electric-field-form');
    await expect(page.locator('#electric-field-error')).toHaveText('distance cannot be negative.');
    await expect(page.locator('#electric-field-distance')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#electric-field-mode').selectOption('voltage');
    await page.locator('#electric-field-strength').fill('abc');
    await submitCalculatorForm(page, '#electric-field-form');
    await expect(page.locator('#electric-field-error')).toHaveText('electric field must be a valid number.');
    await expect(page.locator('#electric-field-strength')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#electric-field-strength').fill('1200');
    await page.locator('#electric-field-distance').fill('0');
    await submitCalculatorForm(page, '#electric-field-form');
    await expect(page.locator('#electric-field-error')).toHaveText('distance must be greater than zero.');

    await page.locator('#electric-field-mode').selectOption('capacitance');
    await submitCalculatorForm(page, '#electric-field-form');
    await expect(page.locator('#electric-field-error')).toHaveText('Enter charge.');
    await expect(page.locator('#electric-field-charge')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#electric-field-charge').fill('0.001');
    await page.locator('#electric-field-voltage').fill('-10');
    await submitCalculatorForm(page, '#electric-field-form');
    await expect(page.locator('#electric-field-error')).toHaveText('voltage cannot be negative.');
    await expect(page.locator('#electric-field-voltage')).toHaveAttribute('aria-invalid', 'true');
  });

  test('spherical calculator validates blank, zero, negative, invalid, and radius order values', async ({ page }) => {
    await visitAdvancedPhysics(page);

    await submitCalculatorForm(page, '#spherical-form');
    await expect(page.locator('#spherical-error')).toHaveText('Enter inner radius.');
    await expect(page.locator('#spherical-inner-radius')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#spherical-inner-radius').fill('0');
    await submitCalculatorForm(page, '#spherical-form');
    await expect(page.locator('#spherical-error')).toHaveText('inner radius must be greater than zero.');

    await page.locator('#spherical-inner-radius').fill('1');
    await page.locator('#spherical-outer-radius').fill('-5');
    await submitCalculatorForm(page, '#spherical-form');
    await expect(page.locator('#spherical-error')).toHaveText('outer radius cannot be negative.');
    await expect(page.locator('#spherical-outer-radius')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#spherical-outer-radius').fill('5');
    await page.locator('#spherical-relative-permittivity').fill('abc');
    await submitCalculatorForm(page, '#spherical-form');
    await expect(page.locator('#spherical-error')).toHaveText('relative permittivity must be a valid number.');
    await expect(page.locator('#spherical-relative-permittivity')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#spherical-relative-permittivity').fill('1');
    await page.locator('#spherical-outer-radius').fill('1');
    await submitCalculatorForm(page, '#spherical-form');
    await expect(page.locator('#spherical-error')).toHaveText('outer radius must be greater than inner radius.');
    await expect(page.locator('#spherical-outer-radius')).toHaveAttribute('aria-invalid', 'true');
  });

  test('parallel plate calculator validates blank, zero, negative, and invalid values', async ({ page }) => {
    await visitAdvancedPhysics(page);

    await submitCalculatorForm(page, '#parallel-plate-form');
    await expect(page.locator('#parallel-plate-error')).toHaveText('Enter plate area.');
    await expect(page.getByLabel('Plate area A')).toHaveAttribute('aria-invalid', 'true');

    await page.getByLabel('Plate area A').fill('0');
    await submitCalculatorForm(page, '#parallel-plate-form');
    await expect(page.locator('#parallel-plate-error')).toHaveText('plate area must be greater than zero.');

    await page.getByLabel('Plate area A').fill('0.01');
    await page.getByLabel('Plate separation d').fill('-1');
    await submitCalculatorForm(page, '#parallel-plate-form');
    await expect(page.locator('#parallel-plate-error')).toHaveText('plate separation cannot be negative.');
    await expect(page.getByLabel('Plate separation d')).toHaveAttribute('aria-invalid', 'true');

    await page.getByLabel('Plate separation d').fill('0.001');
    await page.locator('#parallel-plate-relative-permittivity').fill('abc');
    await submitCalculatorForm(page, '#parallel-plate-form');
    await expect(page.locator('#parallel-plate-error')).toHaveText('relative permittivity must be a valid number.');
    await expect(page.locator('#parallel-plate-relative-permittivity')).toHaveAttribute('aria-invalid', 'true');
  });

  test('advanced physics page supports the shared light theme toggle', async ({ page }) => {
    await visitAdvancedPhysics(page);

    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');

    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
  });

  test('advanced physics page avoids horizontal overflow on common viewport widths', async ({ page }) => {
    for (const width of [320, 640, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await visitAdvancedPhysics(page);

      const hasHorizontalOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );

      expect(hasHorizontalOverflow, `no horizontal overflow at ${width}px`).toBeFalsy();
      await expect(page.locator('.advanced-physics-card')).toHaveCount(5);
    }
  });
});
