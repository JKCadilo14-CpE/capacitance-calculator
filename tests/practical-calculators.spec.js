// @ts-check
const fs = require('fs/promises');
const { test, expect } = require('@playwright/test');

test.describe('Practical calculator regressions', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.__copiedText = '';

      const clipboard = {
        writeText: async (text) => {
          window.__copiedText = String(text);
        },
      };

      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        get: () => clipboard,
      });

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
  });

  const visitHome = async (page) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Capacitance Calculator', level: 1 })).toBeVisible();
  };

  const selectMode = async (page, mode) => {
    await page.locator('[data-mode-panel]:not([hidden]) [data-mode-select]').selectOption(mode);
    await expect(page.locator(`[data-mode-panel="${mode}"]`)).toBeVisible();
  };

  const submitForm = async (page, selector) => {
    await page.locator(selector).locator('button[type="submit"]').click();
  };

  const getCopiedText = (page) => page.evaluate(() => window.__copiedText || '');

  const copyResult = async (page, mode) => {
    const copyControls = page.locator(`[data-copy-result="${mode}"]`);

    await copyControls.locator('[data-copy-button]').click();
    await expect(copyControls.locator('[data-copy-status]')).toHaveText('Copied!');

    return getCopiedText(page);
  };

  const historyEntries = (page, mode) =>
    page.locator(`[data-history-mode="${mode}"] .history-entry`);

  const historyButton = (page, mode) =>
    page.locator(`[data-history-mode="${mode}"] .history-entry-button`).first();

  const expectHistoryDownloads = async (page, mode, txtFileName, csvFileName) => {
    const section = page.locator(`[data-history-mode="${mode}"]`);

    const txtDownloadPromise = page.waitForEvent('download');
    await section.getByRole('button', { name: /export .* history as txt/i }).click();
    const txtDownload = await txtDownloadPromise;
    expect(txtDownload.suggestedFilename()).toBe(txtFileName);
    const txtPath = await txtDownload.path();
    expect(txtPath ? await fs.readFile(txtPath, 'utf8') : '').toContain('Date:');

    const csvDownloadPromise = page.waitForEvent('download');
    await section.getByRole('button', { name: /export .* history as csv/i }).click();
    const csvDownload = await csvDownloadPromise;
    expect(csvDownload.suggestedFilename()).toBe(csvFileName);
    const csvPath = await csvDownload.path();
    expect(csvPath ? await fs.readFile(csvPath, 'utf8') : '').toContain('Mode,Input,Result,Timestamp');
  };

  const rowInput = (page, listSelector, index) =>
    page.locator(`${listSelector} .series-row`).nth(index).locator('.series-value-input');

  const rowUnit = (page, listSelector, index) =>
    page.locator(`${listSelector} .series-row`).nth(index).locator('.series-unit-select');

  const fillCapacitorRows = async (page, listSelector, values) => {
    for (const [index, capacitor] of values.entries()) {
      await rowInput(page, listSelector, index).fill(capacitor.value);
      await rowUnit(page, listSelector, index).selectOption(capacitor.unit);
    }
  };

  const fillRcTime = async (page, {
    resistanceValue = '10',
    resistanceUnit = 'kohm',
    capacitanceValue = '1',
    capacitanceUnit = 'uF',
  } = {}) => {
    await page.locator('#resistance-value').fill(resistanceValue);
    await page.locator('#resistance-unit').selectOption(resistanceUnit);
    await page.locator('#rc-capacitance-value').fill(capacitanceValue);
    await page.locator('#rc-capacitance-unit').selectOption(capacitanceUnit);
  };

  const fillReactance = async (page, {
    frequencyValue = '1',
    frequencyUnit = 'kHz',
    capacitanceValue = '100',
    capacitanceUnit = 'nF',
  } = {}) => {
    await page.locator('#reactance-frequency-value').fill(frequencyValue);
    await page.locator('#reactance-frequency-unit').selectOption(frequencyUnit);
    await page.locator('#reactance-capacitance-value').fill(capacitanceValue);
    await page.locator('#reactance-capacitance-unit').selectOption(capacitanceUnit);
  };

  const fillCharge = async (page, capacitanceValue = '1000', voltageValue = '12') => {
    await page.locator('#charge-capacitance-value').fill(capacitanceValue);
    await page.locator('#charge-capacitance-unit').selectOption('uF');
    await page.locator('#charge-voltage-value').fill(voltageValue);
  };

  const fillEnergy = async (page, capacitanceValue = '1000', voltageValue = '12') => {
    await page.locator('#energy-capacitance-value').fill(capacitanceValue);
    await page.locator('#energy-capacitance-unit').selectOption('uF');
    await page.locator('#energy-voltage-value').fill(voltageValue);
  };

  test('unit converter supports keypad, keyboard, swap, clear, backspace, decimal, zero, validation, history, copy, and export', async ({ page }) => {
    await visitHome(page);

    const form = page.locator('#unit-converter-form');
    const keypad = form.locator('.calculator-keypad');
    const copyButton = page.getByRole('button', { name: /copy unit converter result/i });

    await expect(copyButton).toBeDisabled();

    await keypad.getByRole('button', { name: '1' }).click();
    await keypad.getByRole('button', { name: '2' }).click();
    await keypad.getByRole('button', { name: 'Decimal point' }).click();
    await keypad.getByRole('button', { name: '3' }).click();
    await expect(page.locator('#calculator-input-display')).toHaveText('12.3');

    await keypad.getByRole('button', { name: 'Backspace' }).click();
    await expect(page.locator('#calculator-input-display')).toHaveText('12.');
    await keypad.getByRole('button', { name: 'Clear input' }).click();
    await expect(page.locator('#calculator-input-display')).toHaveText('0');
    await expect(page.locator('#converter-result')).toHaveText('--');

    await form.focus();
    await page.keyboard.press('5');
    await page.keyboard.press('.');
    await page.keyboard.press('5');
    await page.keyboard.press('Enter');
    await expect(page.locator('#converter-result')).toHaveText('0.0055 nF');
    await expect(page.locator('#converter-summary')).toHaveText('5.5 pF equals 0.0055 nF.');
    await expect(copyButton).toBeEnabled();
    expect(await copyResult(page, 'unit-converter')).toBe('Unit Converter\n5.5 pF → 0.0055 nF');

    await keypad.getByRole('button', { name: 'Clear input' }).click();
    await expect(copyButton).toBeDisabled();
    await keypad.getByRole('button', { name: 'Convert' }).click();
    await expect(page.locator('#converter-result')).toHaveText('0 nF');
    await expect(page.locator('#value-error')).toHaveText('');

    await keypad.getByRole('button', { name: 'Clear input' }).click();
    await keypad.getByRole('button', { name: '1' }).click();
    await keypad.getByRole('button', { name: '0' }).click();
    await page.locator('#swap-units').click();
    await expect(page.locator('#from-unit')).toHaveValue('nF');
    await expect(page.locator('#to-unit')).toHaveValue('pF');
    await keypad.getByRole('button', { name: 'Convert' }).click();
    await expect(page.locator('#converter-result')).toHaveText('10,000 pF');

    await page.evaluate(() => {
      document.dispatchEvent(new CustomEvent('calculator:restore-history', {
        detail: {
          mode: 'unit-converter',
          restoreData: { value: '-1', fromUnit: 'pF', toUnit: 'nF' },
        },
      }));
    });
    await keypad.getByRole('button', { name: 'Convert' }).click();
    await expect(page.locator('#value-error')).toHaveText('Enter zero or a positive capacitance value.');
    await expect(copyButton).toBeDisabled();

    await page.evaluate(() => {
      document.dispatchEvent(new CustomEvent('calculator:restore-history', {
        detail: {
          mode: 'unit-converter',
          restoreData: { value: '5.5', fromUnit: 'pF', toUnit: 'nF' },
        },
      }));
    });
    await expect(page.locator('#calculator-input-display')).toHaveText('5.5');
    await expect(page.locator('#converter-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();
    await keypad.getByRole('button', { name: 'Convert' }).click();
    await expect(historyEntries(page, 'unit-converter')).toHaveCount(4);
    await expect(historyEntries(page, 'unit-converter').first()).toContainText('0.0055 nF');
    await expectHistoryDownloads(page, 'unit-converter', 'unit-converter-history.txt', 'unit-converter-history.csv');
  });

  test('series capacitance protects dynamic rows, validation, calculation, history, restore, copy, and export', async ({ page }) => {
    await visitHome(page);
    await selectMode(page, 'series');

    const rows = page.locator('#series-capacitor-list .series-row');
    const copyButton = page.getByRole('button', { name: /copy series capacitance result/i });

    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0).locator('.series-row-label')).toHaveText('C1');
    await expect(rows.nth(1).locator('.series-row-label')).toHaveText('C2');
    await expect(page.getByRole('button', { name: 'Remove capacitor 1' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Remove capacitor 2' })).toBeDisabled();

    await page.getByRole('button', { name: /add capacitor/i }).click();
    await expect(rows).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Remove capacitor 2' })).toBeEnabled();
    await page.getByRole('button', { name: 'Remove capacitor 2' }).click();
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0).locator('.series-row-label')).toHaveText('C1');
    await expect(rows.nth(1).locator('.series-row-label')).toHaveText('C2');
    await expect(page.getByRole('button', { name: 'Remove capacitor 1' })).toBeDisabled();

    await submitForm(page, '#series-calculator-form');
    await expect(page.locator('#series-error')).toHaveText('C1 needs a capacitance value.');
    await expect(rowInput(page, '#series-capacitor-list', 0)).toHaveAttribute('aria-invalid', 'true');

    await rowInput(page, '#series-capacitor-list', 0).fill('abc');
    await submitForm(page, '#series-calculator-form');
    await expect(page.locator('#series-error')).toHaveText('C1 must be a valid number.');

    await rowInput(page, '#series-capacitor-list', 0).fill('0');
    await submitForm(page, '#series-calculator-form');
    await expect(page.locator('#series-error')).toHaveText('C1 must be greater than zero for a series calculation.');

    await rowInput(page, '#series-capacitor-list', 0).fill('-1');
    await submitForm(page, '#series-calculator-form');
    await expect(page.locator('#series-error')).toHaveText('C1 must be greater than zero for a series calculation.');

    await fillCapacitorRows(page, '#series-capacitor-list', [
      { value: '10', unit: 'uF' },
      { value: '20', unit: 'uF' },
    ]);
    await submitForm(page, '#series-calculator-form');
    await expect(page.locator('#series-result')).toHaveText('6.67 µF');
    await expect(page.locator('#series-breakdown')).toContainText('1/Ct = 1/C1 + 1/C2.');
    await expect(historyEntries(page, 'series')).toHaveCount(1);
    await expect(historyEntries(page, 'series').first()).toContainText('6.67 µF');
    await expect(copyButton).toBeEnabled();
    expect(await copyResult(page, 'series')).toBe('Series Capacitance\n10 µF, 20 µF → 6.67 µF');

    await rowInput(page, '#series-capacitor-list', 0).fill('11');
    await expect(copyButton).toBeDisabled();
    await fillCapacitorRows(page, '#series-capacitor-list', [
      { value: '10', unit: 'uF' },
      { value: '20', unit: 'uF' },
    ]);
    await submitForm(page, '#series-calculator-form');
    await historyButton(page, 'series').click();
    await expect(rowInput(page, '#series-capacitor-list', 0)).toHaveValue('10');
    await expect(rowInput(page, '#series-capacitor-list', 1)).toHaveValue('20');
    await expect(page.locator('#series-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();
    await expectHistoryDownloads(page, 'series', 'series-history.txt', 'series-history.csv');
  });

  test('parallel capacitance protects dynamic rows, validation, calculation, history, restore, copy, and export', async ({ page }) => {
    await visitHome(page);
    await selectMode(page, 'parallel');

    const rows = page.locator('#parallel-capacitor-list .series-row');
    const copyButton = page.getByRole('button', { name: /copy parallel capacitance result/i });

    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0).locator('.series-row-label')).toHaveText('C1');
    await expect(rows.nth(1).locator('.series-row-label')).toHaveText('C2');
    await expect(page.getByRole('button', { name: 'Remove capacitor 1' })).toBeDisabled();

    await page.getByRole('button', { name: /add capacitor/i }).click();
    await expect(rows).toHaveCount(3);
    await page.getByRole('button', { name: 'Remove capacitor 1' }).click();
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0).locator('.series-row-label')).toHaveText('C1');
    await expect(rows.nth(1).locator('.series-row-label')).toHaveText('C2');
    await expect(page.getByRole('button', { name: 'Remove capacitor 1' })).toBeDisabled();

    await submitForm(page, '#parallel-calculator-form');
    await expect(page.locator('#parallel-error')).toHaveText('C1 needs a capacitance value.');
    await expect(rowInput(page, '#parallel-capacitor-list', 0)).toHaveAttribute('aria-invalid', 'true');

    await rowInput(page, '#parallel-capacitor-list', 0).fill('abc');
    await submitForm(page, '#parallel-calculator-form');
    await expect(page.locator('#parallel-error')).toHaveText('C1 must be a valid number.');

    await rowInput(page, '#parallel-capacitor-list', 0).fill('0');
    await submitForm(page, '#parallel-calculator-form');
    await expect(page.locator('#parallel-error')).toHaveText('C1 must be greater than zero for a parallel calculation.');

    await rowInput(page, '#parallel-capacitor-list', 0).fill('-1');
    await submitForm(page, '#parallel-calculator-form');
    await expect(page.locator('#parallel-error')).toHaveText('C1 must be greater than zero for a parallel calculation.');

    await fillCapacitorRows(page, '#parallel-capacitor-list', [
      { value: '10', unit: 'uF' },
      { value: '20', unit: 'uF' },
    ]);
    await submitForm(page, '#parallel-calculator-form');
    await expect(page.locator('#parallel-result')).toHaveText('30 µF');
    await expect(page.locator('#parallel-breakdown')).toContainText('Ct = C1 + C2.');
    await expect(historyEntries(page, 'parallel')).toHaveCount(1);
    await expect(copyButton).toBeEnabled();
    expect(await copyResult(page, 'parallel')).toBe('Parallel Capacitance\n10 µF, 20 µF → 30 µF');

    await rowInput(page, '#parallel-capacitor-list', 0).fill('11');
    await expect(copyButton).toBeDisabled();
    await fillCapacitorRows(page, '#parallel-capacitor-list', [
      { value: '10', unit: 'uF' },
      { value: '20', unit: 'uF' },
    ]);
    await submitForm(page, '#parallel-calculator-form');
    await historyButton(page, 'parallel').click();
    await expect(rowInput(page, '#parallel-capacitor-list', 0)).toHaveValue('10');
    await expect(rowInput(page, '#parallel-capacitor-list', 1)).toHaveValue('20');
    await expect(page.locator('#parallel-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();
    await expectHistoryDownloads(page, 'parallel', 'parallel-history.txt', 'parallel-history.csv');
  });

  test('capacitor code decoder protects examples, digit handling, validation, history, restore, copy, and export', async ({ page }) => {
    await visitHome(page);
    await selectMode(page, 'code-decoder');

    const codeInput = page.locator('#capacitor-code');
    const copyButton = page.getByRole('button', { name: /copy capacitor code decoder result/i });

    await page.getByRole('button', { name: '104', exact: true }).click();
    await expect(page.locator('#code-decoder-primary-result')).toHaveText('100 nF');
    await expect(page.locator('#code-result-pf')).toHaveText('100,000 pF');
    await expect(page.locator('#code-result-uf')).toHaveText('0.1 µF');

    await page.getByRole('button', { name: '472', exact: true }).click();
    await expect(page.locator('#code-decoder-primary-result')).toHaveText('4.7 nF');

    await page.locator('#clear-code-decoder').click();
    await submitForm(page, '#code-decoder-form');
    await expect(page.locator('#code-decoder-error')).toHaveText('Enter a 3-digit capacitor code before decoding.');

    await codeInput.fill('10a');
    await submitForm(page, '#code-decoder-form');
    await expect(page.locator('#code-decoder-error')).toHaveText('Use digits only. Standard capacitor codes look like 104 or 472.');

    await codeInput.fill('10');
    await submitForm(page, '#code-decoder-form');
    await expect(page.locator('#code-decoder-error')).toHaveText('Enter exactly three digits.');

    await codeInput.fill('000');
    await submitForm(page, '#code-decoder-form');
    await expect(page.locator('#code-decoder-error')).toHaveText('Enter a code with nonzero significant figures.');

    await codeInput.fill('');
    await codeInput.focus();
    await expect(page.locator('#shared-input-keypad')).toBeVisible();
    await expect(page.locator('[data-shared-keypad-action="decimal"]')).toBeDisabled();
    for (const value of ['1', '2', '3', '4']) {
      await page.locator(`[data-shared-keypad-value="${value}"]`).click();
    }
    await expect(codeInput).toHaveValue('123');

    await codeInput.fill('104');
    await submitForm(page, '#code-decoder-form');
    await expect(page.locator('#code-decoder-primary-result')).toHaveText('100 nF');
    await expect(historyEntries(page, 'code-decoder')).toHaveCount(3);
    await expect(copyButton).toBeEnabled();
    expect(await copyResult(page, 'code-decoder')).toBe('Capacitor Code Decoder\n104 → 100 nF');

    await codeInput.fill('999');
    await expect(copyButton).toBeDisabled();
    await historyButton(page, 'code-decoder').click();
    await expect(codeInput).toHaveValue('104');
    await expect(page.locator('#code-decoder-primary-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();
    await expectHistoryDownloads(page, 'code-decoder', 'code-decoder-history.txt', 'code-decoder-history.csv');
  });

  test('rc time protects tau calculation, unit conversion, validation, shared keypad submit, history, restore, copy, and export', async ({ page }) => {
    await visitHome(page);
    await selectMode(page, 'rc-time');

    const copyButton = page.getByRole('button', { name: /copy rc time constant result/i });

    await expect(copyButton).toBeDisabled();
    await page.locator('#resistance-value').focus();
    await page.locator('[data-shared-keypad-value="1"]').click();
    await page.locator('[data-shared-keypad-value="0"]').click();
    await page.locator('#rc-capacitance-value').focus();
    await page.locator('[data-shared-keypad-value="1"]').click();
    await page.locator('[data-shared-keypad-action="calculate"]').click();
    await expect(page.locator('#rc-primary-result')).toHaveText('10 ms');

    await page.locator('#clear-rc-time').click();
    await expect(copyButton).toBeDisabled();
    await fillRcTime(page, {
      resistanceValue: '2',
      resistanceUnit: 'mohm',
      capacitanceValue: '500',
      capacitanceUnit: 'nF',
    });
    await submitForm(page, '#rc-time-form');
    await expect(page.locator('#rc-primary-result')).toHaveText('1 s');
    await expect(page.locator('#rc-result-seconds')).toHaveText('1 s');
    await expect(page.locator('#rc-result-milliseconds')).toHaveText('1,000 ms');
    await expect(copyButton).toBeEnabled();
    expect(await copyResult(page, 'rc-time')).toBe('RC Time Constant\n2 MΩ × 500 nF → 1 s');

    await page.locator('#clear-rc-time').click();
    await submitForm(page, '#rc-time-form');
    await expect(page.locator('#rc-time-error')).toHaveText('Enter a resistance value.');
    await expect(page.locator('#resistance-value')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#resistance-value').fill('abc');
    await submitForm(page, '#rc-time-form');
    await expect(page.locator('#rc-time-error')).toHaveText('Resistance must be a valid number.');

    await page.locator('#resistance-value').fill('0');
    await submitForm(page, '#rc-time-form');
    await expect(page.locator('#rc-time-error')).toHaveText('Resistance must be greater than zero.');

    await page.locator('#resistance-value').fill('10');
    await submitForm(page, '#rc-time-form');
    await expect(page.locator('#rc-time-error')).toHaveText('Enter a capacitance value.');

    await page.locator('#rc-capacitance-value').fill('-1');
    await submitForm(page, '#rc-time-form');
    await expect(page.locator('#rc-time-error')).toHaveText('Capacitance must be greater than zero.');

    await fillRcTime(page);
    await submitForm(page, '#rc-time-form');
    await expect(page.locator('#rc-primary-result')).toHaveText('10 ms');
    await expect(historyEntries(page, 'rc-time')).toHaveCount(3);
    await historyButton(page, 'rc-time').click();
    await expect(page.locator('#resistance-value')).toHaveValue('10');
    await expect(page.locator('#rc-capacitance-value')).toHaveValue('1');
    await expect(page.locator('#rc-primary-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();
    await expectHistoryDownloads(page, 'rc-time', 'rc-time-history.txt', 'rc-time-history.csv');
  });

  test('capacitive reactance protects Xc calculation, validation, shared keypad submit, history, restore, copy, and export', async ({ page }) => {
    await visitHome(page);
    await selectMode(page, 'capacitive-reactance');

    const copyButton = page.getByRole('button', { name: /copy capacitive reactance result/i });

    await expect(copyButton).toBeDisabled();
    await page.locator('#reactance-frequency-value').focus();
    await page.locator('[data-shared-keypad-value="1"]').click();
    await page.locator('#reactance-capacitance-value').focus();
    await page.locator('[data-shared-keypad-value="1"]').click();
    await page.locator('[data-shared-keypad-value="0"]').click();
    await page.locator('[data-shared-keypad-value="0"]').click();
    await page.locator('[data-shared-keypad-action="calculate"]').click();
    await expect(page.locator('#capacitive-reactance-primary-result')).toHaveText('1.59 kΩ');
    await expect(page.locator('#capacitive-reactance-result-ohms')).toHaveText('1,591.55 Ω');
    await expect(page.locator('#capacitive-reactance-result-kilohms')).toHaveText('1.59 kΩ');
    await expect(page.locator('#capacitive-reactance-result-megohms')).toHaveText('0.0016 MΩ');
    await expect(page.locator('#capacitive-reactance-breakdown')).toContainText('Xc = 1 / (2πfC).');
    await expect(page.locator('#capacitive-reactance-technical-output')).toContainText('Raw frequency');
    await expect(page.locator('#capacitive-reactance-technical-output')).toContainText('Angular frequency 2πf');
    await expect(copyButton).toBeEnabled();
    expect(await copyResult(page, 'capacitive-reactance')).toBe('Capacitive Reactance\n1 kHz, 100 nF → 1.59 kΩ');

    await page.locator('#clear-capacitive-reactance').click();
    await expect(copyButton).toBeDisabled();
    await fillReactance(page, {
      frequencyValue: '1000',
      frequencyUnit: 'Hz',
      capacitanceValue: '0.1',
      capacitanceUnit: 'uF',
    });
    await submitForm(page, '#capacitive-reactance-form');
    await expect(page.locator('#capacitive-reactance-primary-result')).toHaveText('1.59 kΩ');

    await page.locator('#clear-capacitive-reactance').click();
    await fillReactance(page, {
      frequencyValue: '1',
      frequencyUnit: 'MHz',
      capacitanceValue: '1',
      capacitanceUnit: 'mF',
    });
    await submitForm(page, '#capacitive-reactance-form');
    await expect(page.locator('#capacitive-reactance-primary-result')).toHaveText('0.0002 Ω');
    await expect(page.locator('#capacitive-reactance-result-ohms')).toHaveText('0.0002 Ω');

    await page.locator('#clear-capacitive-reactance').click();
    await submitForm(page, '#capacitive-reactance-form');
    await expect(page.locator('#capacitive-reactance-error')).toHaveText('Enter a frequency value.');
    await expect(page.locator('#reactance-frequency-value')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#reactance-frequency-value').fill('abc');
    await submitForm(page, '#capacitive-reactance-form');
    await expect(page.locator('#capacitive-reactance-error')).toHaveText('Frequency must be a valid number.');

    await page.locator('#reactance-frequency-value').fill('0');
    await submitForm(page, '#capacitive-reactance-form');
    await expect(page.locator('#capacitive-reactance-error')).toHaveText('Frequency must be greater than zero.');

    await page.locator('#reactance-frequency-value').fill('-1');
    await submitForm(page, '#capacitive-reactance-form');
    await expect(page.locator('#capacitive-reactance-error')).toHaveText('Frequency must be greater than zero.');

    await page.locator('#reactance-frequency-value').fill('1');
    await submitForm(page, '#capacitive-reactance-form');
    await expect(page.locator('#capacitive-reactance-error')).toHaveText('Enter a capacitance value.');

    await page.locator('#reactance-capacitance-value').fill('abc');
    await submitForm(page, '#capacitive-reactance-form');
    await expect(page.locator('#capacitive-reactance-error')).toHaveText('Capacitance must be a valid number.');

    await page.locator('#reactance-capacitance-value').fill('0');
    await submitForm(page, '#capacitive-reactance-form');
    await expect(page.locator('#capacitive-reactance-error')).toHaveText('Capacitance must be greater than zero.');

    await page.locator('#reactance-capacitance-value').fill('-1');
    await submitForm(page, '#capacitive-reactance-form');
    await expect(page.locator('#capacitive-reactance-error')).toHaveText('Capacitance must be greater than zero.');

    await fillReactance(page);
    await submitForm(page, '#capacitive-reactance-form');
    await expect(historyEntries(page, 'capacitive-reactance')).toHaveCount(4);
    await historyButton(page, 'capacitive-reactance').click();
    await expect(page.locator('#reactance-frequency-value')).toHaveValue('1');
    await expect(page.locator('#reactance-frequency-unit')).toHaveValue('kHz');
    await expect(page.locator('#reactance-capacitance-value')).toHaveValue('100');
    await expect(page.locator('#reactance-capacitance-unit')).toHaveValue('nF');
    await expect(page.locator('#capacitive-reactance-primary-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();
    await expectHistoryDownloads(page, 'capacitive-reactance', 'capacitive-reactance-history.txt', 'capacitive-reactance-history.csv');
  });

  test('charge calculator protects Q = C x V, zero voltage, validation, history, restore, copy, and export', async ({ page }) => {
    await visitHome(page);
    await selectMode(page, 'charge-calculator');

    const copyButton = page.getByRole('button', { name: /copy charge calculator result/i });

    await fillCharge(page);
    await submitForm(page, '#charge-calculator-form');
    await expect(page.locator('#charge-primary-result')).toHaveText('0.012 C');
    await expect(page.locator('#charge-result-millicoulombs')).toHaveText('12 mC');
    await expect(page.locator('#charge-result-microcoulombs')).toHaveText('12,000 µC');
    await expect(copyButton).toBeEnabled();
    expect(await copyResult(page, 'charge-calculator')).toBe('Charge Calculator\n1,000 µF, 12 V → 0.012 C');

    await page.locator('#clear-charge-calculator').click();
    await expect(copyButton).toBeDisabled();
    await fillCharge(page, '1000', '0');
    await submitForm(page, '#charge-calculator-form');
    await expect(page.locator('#charge-primary-result')).toHaveText('0 C');

    await page.locator('#clear-charge-calculator').click();
    await submitForm(page, '#charge-calculator-form');
    await expect(page.locator('#charge-calculator-error')).toHaveText('Enter a capacitance value.');

    await page.locator('#charge-capacitance-value').fill('0');
    await submitForm(page, '#charge-calculator-form');
    await expect(page.locator('#charge-calculator-error')).toHaveText('Capacitance must be greater than zero.');

    await page.locator('#charge-capacitance-value').fill('1000');
    await page.locator('#charge-voltage-value').fill('-1');
    await submitForm(page, '#charge-calculator-form');
    await expect(page.locator('#charge-calculator-error')).toHaveText('Voltage cannot be negative.');

    await fillCharge(page);
    await submitForm(page, '#charge-calculator-form');
    await expect(historyEntries(page, 'charge-calculator')).toHaveCount(3);
    await historyButton(page, 'charge-calculator').click();
    await expect(page.locator('#charge-capacitance-value')).toHaveValue('1000');
    await expect(page.locator('#charge-voltage-value')).toHaveValue('12');
    await expect(page.locator('#charge-primary-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();
    await expectHistoryDownloads(page, 'charge-calculator', 'charge-calculator-history.txt', 'charge-calculator-history.csv');
  });

  test('energy stored protects E = 1/2 x C x V^2, zero voltage, validation, history, restore, copy, and export', async ({ page }) => {
    await visitHome(page);
    await selectMode(page, 'energy-stored');

    const copyButton = page.getByRole('button', { name: /copy energy stored result/i });

    await fillEnergy(page);
    await submitForm(page, '#energy-stored-form');
    await expect(page.locator('#energy-primary-result')).toHaveText('0.072 J');
    await expect(page.locator('#energy-result-millijoules')).toHaveText('72 mJ');
    await expect(page.locator('#energy-result-microjoules')).toHaveText('72,000 µJ');
    await expect(copyButton).toBeEnabled();
    expect(await copyResult(page, 'energy-stored')).toBe('Energy Stored\n1,000 µF, 12 V → 0.072 J');

    await page.locator('#clear-energy-stored').click();
    await expect(copyButton).toBeDisabled();
    await fillEnergy(page, '1000', '0');
    await submitForm(page, '#energy-stored-form');
    await expect(page.locator('#energy-primary-result')).toHaveText('0 J');

    await page.locator('#clear-energy-stored').click();
    await submitForm(page, '#energy-stored-form');
    await expect(page.locator('#energy-stored-error')).toHaveText('Enter a capacitance value.');

    await page.locator('#energy-capacitance-value').fill('0');
    await submitForm(page, '#energy-stored-form');
    await expect(page.locator('#energy-stored-error')).toHaveText('Capacitance must be greater than zero.');

    await page.locator('#energy-capacitance-value').fill('1000');
    await page.locator('#energy-voltage-value').fill('-1');
    await submitForm(page, '#energy-stored-form');
    await expect(page.locator('#energy-stored-error')).toHaveText('Voltage cannot be negative.');

    await fillEnergy(page);
    await submitForm(page, '#energy-stored-form');
    await expect(historyEntries(page, 'energy-stored')).toHaveCount(3);
    await historyButton(page, 'energy-stored').click();
    await expect(page.locator('#energy-capacitance-value')).toHaveValue('1000');
    await expect(page.locator('#energy-voltage-value')).toHaveValue('12');
    await expect(page.locator('#energy-primary-result')).toHaveText('--');
    await expect(copyButton).toBeDisabled();
    await expectHistoryDownloads(page, 'energy-stored', 'energy-stored-history.txt', 'energy-stored-history.csv');
  });

  test('recent history keeps the five newest entries for each practical mode', async ({ page }) => {
    await visitHome(page);

    const modes = [
      ['unit-converter', 'Unit Converter'],
      ['series', 'Series'],
      ['parallel', 'Parallel'],
      ['code-decoder', 'Code Decoder'],
      ['rc-time', 'RC Time'],
      ['capacitive-reactance', 'Capacitive Reactance'],
      ['charge-calculator', 'Charge Calculator'],
      ['energy-stored', 'Energy Stored'],
    ];

    for (const [mode, modeName] of modes) {
      await page.evaluate(({ mode, modeName }) => {
        for (let index = 1; index <= 6; index += 1) {
          document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: {
              mode,
              modeName,
              inputSummary: `input ${index}`,
              result: `result ${index}`,
              timestamp: 1700000000000 + index,
            },
          }));
        }
      }, { mode, modeName });

      await expect(historyEntries(page, mode)).toHaveCount(5);
      await expect(historyEntries(page, mode).first()).toContainText('input 6');
      await expect(historyEntries(page, mode).last()).toContainText('input 2');
    }
  });
});
