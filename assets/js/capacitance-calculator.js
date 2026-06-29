// Capacitance calculator script: handles mode selection, series calculations, and parallel calculations.
// DO NO TOUCH ANYMORE UNLESS YOU KNOW WHAT YOU ARE DOING!!! MAKE SURE YOU HAVE ENOUGH SLEEP BEDORE TOUCHING THIS CODE!!!!
// This is a critical part of the calculator's functionality.

const seriesUnits = window.PracticalCalculatorUtils.units.capacitance;

const minimumSeriesRows = 2;
const minimumParallelRows = 2;

const formatSeriesNumber = (value) => {
    return window.PracticalCalculatorUtils.formatRoundedNumber(value);
};

const normalizeSeriesValue = (value) => window.PracticalCalculatorUtils.normalizeNumericValue(value);

const getReadableSeriesUnit = (valueInFarads) => {
    const absoluteValue = Math.abs(valueInFarads);

    if (absoluteValue >= 1 || absoluteValue === 0) {
        return 'F';
    }

    if (absoluteValue >= 1e-6) {
        return 'uF';
    }

    if (absoluteValue >= 1e-9) {
        return 'nF';
    }

    return 'pF';
};

const refreshLucideIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const modeSelects = Array.from(document.querySelectorAll('[data-mode-select]'));
    const modePanels = Array.from(document.querySelectorAll('[data-mode-panel]'));

    const setActiveMode = (mode) => {
        modeSelects.forEach((select) => {
            select.value = mode;
        });

        modePanels.forEach((panel) => {
            panel.hidden = panel.dataset.modePanel !== mode;
        });

        refreshLucideIcons();
    };

    modeSelects.forEach((select) => {
        select.addEventListener('change', () => {
            setActiveMode(select.value);
        });
    });

    if (modeSelects.length > 0 && modePanels.length > 0) {
        const activePanel = modePanels.find((panel) => !panel.hidden);
        setActiveMode(activePanel?.dataset.modePanel || modeSelects[0].value);
    }

    const form = document.getElementById('series-calculator-form');
    const list = document.getElementById('series-capacitor-list');
    const addButton = document.getElementById('add-series-capacitor');
    const errorElement = document.getElementById('series-error');
    const resultCard = document.getElementById('series-result-card');
    const resultElement = document.getElementById('series-result');
    const resultStateElement = document.getElementById('series-result-state');
    const summaryElement = document.getElementById('series-summary');
    const breakdownElement = document.getElementById('series-breakdown');
    const technicalDetailsElement = document.getElementById('series-technical-details');
    const rawFaradsElement = document.getElementById('series-raw-farads');

    if (!form || !list || !addButton || !errorElement || !resultCard || !resultElement || !resultStateElement || !summaryElement || !breakdownElement || !technicalDetailsElement || !rawFaradsElement) {
        return;
    }

    let capacitorCount = 0;

    const clearResult = () => {
        resultCard.classList.remove('has-result');
        resultElement.textContent = '--';
        resultStateElement.textContent = 'Ready';
        summaryElement.textContent = 'Enter at least two capacitor values to calculate the series total.';
        breakdownElement.textContent = 'Enter values for C1 and C2, then calculate to see the reciprocal breakdown.';
        rawFaradsElement.textContent = 'Raw total will appear after calculation.';
        technicalDetailsElement.open = false;
    };

    const clearError = () => {
        errorElement.textContent = '';
        list.querySelectorAll('input[aria-invalid="true"]').forEach((input) => {
            input.removeAttribute('aria-invalid');
        });
    };

    const resetCalculatedState = () => {
        clearError();
        clearResult();
    };

    const updateSeriesLabels = () => {
        const rows = Array.from(list.querySelectorAll('.series-row'));

        rows.forEach((row, index) => {
            const rowNumber = index + 1;
            const label = row.querySelector('.series-row-label');
            const badge = row.querySelector('.series-row-badge');
            const valueLabel = row.querySelector('.series-value-field label');
            const unitLabel = row.querySelector('.series-unit-field label');
            const input = row.querySelector('.series-value-input');
            const unit = row.querySelector('.series-unit-select');
            const removeButton = row.querySelector('.series-remove');

            row.dataset.index = String(rowNumber);

            if (label && input && unit) {
                label.textContent = `C${rowNumber}`;

                if (badge) {
                    badge.textContent = `Capacitor ${rowNumber}`;
                }

                input.id = `series-capacitor-${rowNumber}`;
                input.name = `series-capacitor-${rowNumber}`;
                input.setAttribute('aria-label', `Capacitor ${rowNumber} value`);
                input.dataset.sharedKeypadInput = '';
                input.dataset.keypadType = 'decimal';
                input.dataset.keypadLabel = `C${rowNumber}`;
                unit.id = `series-unit-${rowNumber}`;
                unit.name = `series-unit-${rowNumber}`;
                unit.setAttribute('aria-label', `Capacitor ${rowNumber} unit`);

                if (valueLabel) {
                    valueLabel.setAttribute('for', input.id);
                    valueLabel.textContent = `Capacitor ${rowNumber} value`;
                }

                if (unitLabel) {
                    unitLabel.setAttribute('for', unit.id);
                    unitLabel.textContent = `Capacitor ${rowNumber} unit`;
                }
            }

            if (removeButton) {
                const isMinimumRow = rows.length <= minimumSeriesRows;
                removeButton.disabled = isMinimumRow;
                removeButton.setAttribute('aria-label', `Remove capacitor ${rowNumber}`);
            }
        });
    };

    const createUnitOptions = () => Object.entries(seriesUnits)
        .map(([value, unit]) => `<option value="${value}">${unit.label}</option>`)
        .join('');

    const escapeAttributeValue = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const getSupportedCapacitanceUnit = (unit) => (seriesUnits[unit] ? unit : 'uF');

    const addSeriesRow = (value = '', unit = 'uF') => {
        capacitorCount += 1;

        const row = document.createElement('div');
        row.className = 'series-row';
        row.innerHTML = `
            <div class="series-row-header">
                <div class="series-row-title">
                    <span class="series-row-label">C${capacitorCount}</span>
                    <span class="series-row-badge">Capacitor ${capacitorCount}</span>
                </div>
                <button class="series-remove" type="button">
                    <i data-lucide="trash-2" aria-hidden="true"></i>
                </button>
            </div>
            <div class="series-row-controls">
                <div class="field-group series-value-field">
                    <label for="series-capacitor-${capacitorCount}">Value</label>
                    <input class="series-value-input" id="series-capacitor-${capacitorCount}" name="series-capacitor-${capacitorCount}" type="text" inputmode="decimal" autocomplete="off" placeholder="0.00" value="${escapeAttributeValue(value)}" data-shared-keypad-input data-keypad-type="decimal" data-keypad-label="C${capacitorCount}">
                </div>
                <div class="field-group series-unit-field">
                    <label for="series-unit-${capacitorCount}">Unit</label>
                    <select class="series-unit-select" id="series-unit-${capacitorCount}" name="series-unit-${capacitorCount}">
                        ${createUnitOptions()}
                    </select>
                </div>
            </div>
        `;

        row.querySelector('.series-unit-select').value = getSupportedCapacitanceUnit(unit);
        list.appendChild(row);
        updateSeriesLabels();
        refreshLucideIcons();
    };

    const removeSeriesRow = (row) => {
        if (list.querySelectorAll('.series-row').length <= minimumSeriesRows) {
            return;
        }

        row.remove();
        updateSeriesLabels();
        resetCalculatedState();
    };

    const setInputError = (input, message) => {
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
        input.focus();
    };

    const getSeriesValues = () => {
        const rows = Array.from(list.querySelectorAll('.series-row'));

        if (rows.length < minimumSeriesRows) {
            return {
                isValid: false,
                message: 'Add at least two capacitors for a series calculation.',
            };
        }

        const values = [];

        for (const [index, row] of rows.entries()) {
            const input = row.querySelector('.series-value-input');
            const unitSelect = row.querySelector('.series-unit-select');
            const rowLabel = `C${index + 1}`;
            const normalizedValue = normalizeSeriesValue(input.value);

            if (!normalizedValue) {
                setInputError(input, `${rowLabel} needs a capacitance value.`);
                return {
                    isValid: false,
                };
            }

            const numericValue = Number(normalizedValue);

            if (!Number.isFinite(numericValue)) {
                setInputError(input, `${rowLabel} must be a valid number.`);
                return {
                    isValid: false,
                };
            }

            if (numericValue <= 0) {
                setInputError(input, `${rowLabel} must be greater than zero for a series calculation.`);
                return {
                    isValid: false,
                };
            }

            values.push({
                inputValue: input.value.trim(),
                value: numericValue,
                unit: unitSelect.value,
                farads: numericValue * seriesUnits[unitSelect.value].factor,
            });
        }

        return {
            isValid: true,
            values,
        };
    };

    const calculateSeries = () => {
        clearError();

        const parsedValues = getSeriesValues();

        if (!parsedValues.isValid) {
            if (parsedValues.message) {
                errorElement.textContent = parsedValues.message;
            }

            clearResult();
            return;
        }

        const reciprocalSum = parsedValues.values.reduce((sum, capacitor) => sum + (1 / capacitor.farads), 0);
        const totalFarads = 1 / reciprocalSum;
        const readableUnit = getReadableSeriesUnit(totalFarads);
        const readableValue = totalFarads / seriesUnits[readableUnit].factor;
        const formattedReadableValue = formatSeriesNumber(readableValue);
        const formattedFarads = formatSeriesNumber(totalFarads);
        const formulaLabels = parsedValues.values
            .map((_, index) => `1/C${index + 1}`)
            .join(' + ');
        const reciprocalTerms = parsedValues.values
            .map((capacitor, index) => {
                const reciprocalValue = 1 / capacitor.farads;
                return `1/C${index + 1} = ${formatSeriesNumber(reciprocalValue)} F^-1`;
            })
            .join(' · ');

        resultCard.classList.add('has-result');
        resultElement.textContent = `${formattedReadableValue} ${seriesUnits[readableUnit].label}`;
        resultStateElement.textContent = 'Calculated';
        summaryElement.textContent = `Calculated from ${parsedValues.values.length} capacitors.`;
        breakdownElement.textContent = `1/Ct = ${formulaLabels}. ${reciprocalTerms}.`;
        rawFaradsElement.textContent = `Raw total: ${formattedFarads} F`;
        document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: {
                mode: 'series',
                modeName: 'Series',
                inputSummary: parsedValues.values
                    .map((capacitor) => `${formatSeriesNumber(capacitor.value)} ${seriesUnits[capacitor.unit].label}`)
                    .join(', '),
                result: `${formattedReadableValue} ${seriesUnits[readableUnit].label}`,
                restoreData: {
                    capacitors: parsedValues.values.map((capacitor) => ({
                        value: capacitor.inputValue,
                        unit: capacitor.unit,
                    })),
                },
                timestamp: Date.now(),
            },
        }));
    };

    const restoreSeriesHistory = (restoreData) => {
        const capacitors = Array.isArray(restoreData?.capacitors) ? restoreData.capacitors : [];

        list.replaceChildren();
        capacitorCount = 0;

        capacitors.forEach((capacitor) => {
            addSeriesRow(capacitor?.value ?? '', getSupportedCapacitanceUnit(capacitor?.unit));
        });

        while (list.querySelectorAll('.series-row').length < minimumSeriesRows) {
            addSeriesRow('', 'uF');
        }

        updateSeriesLabels();
        clearError();
        clearResult();
        list.querySelector('.series-value-input')?.focus();
    };

    addButton.addEventListener('click', () => {
        addSeriesRow();
        resetCalculatedState();
    });

    list.addEventListener('click', (event) => {
        const removeButton = event.target.closest('.series-remove');

        if (!removeButton) {
            return;
        }

        removeSeriesRow(removeButton.closest('.series-row'));
    });

    list.addEventListener('input', resetCalculatedState);
    list.addEventListener('change', resetCalculatedState);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateSeries();
    });

    addSeriesRow('', 'uF');
    addSeriesRow('', 'uF');

    const parallelForm = document.getElementById('parallel-calculator-form');
    const parallelList = document.getElementById('parallel-capacitor-list');
    const parallelAddButton = document.getElementById('add-parallel-capacitor');
    const parallelErrorElement = document.getElementById('parallel-error');
    const parallelResultCard = document.getElementById('parallel-result-card');
    const parallelResultElement = document.getElementById('parallel-result');
    const parallelResultStateElement = document.getElementById('parallel-result-state');
    const parallelSummaryElement = document.getElementById('parallel-summary');
    const parallelBreakdownElement = document.getElementById('parallel-breakdown');
    const parallelTechnicalDetailsElement = document.getElementById('parallel-technical-details');
    const parallelRawFaradsElement = document.getElementById('parallel-raw-farads');

    if (!parallelForm || !parallelList || !parallelAddButton || !parallelErrorElement || !parallelResultCard || !parallelResultElement || !parallelResultStateElement || !parallelSummaryElement || !parallelBreakdownElement || !parallelTechnicalDetailsElement || !parallelRawFaradsElement) {
        return;
    }

    let parallelCapacitorCount = 0;

    const clearParallelResult = () => {
        parallelResultCard.classList.remove('has-result');
        parallelResultElement.textContent = '--';
        parallelResultStateElement.textContent = 'Ready';
        parallelSummaryElement.textContent = 'Enter at least two capacitor values to calculate the parallel total.';
        parallelBreakdownElement.textContent = 'Enter values for C1 and C2, then calculate to see the addition breakdown.';
        parallelRawFaradsElement.textContent = 'Raw total will appear after calculation.';
        parallelTechnicalDetailsElement.open = false;
    };

    const clearParallelError = () => {
        parallelErrorElement.textContent = '';
        parallelList.querySelectorAll('input[aria-invalid="true"]').forEach((input) => {
            input.removeAttribute('aria-invalid');
        });
    };

    const resetParallelCalculatedState = () => {
        clearParallelError();
        clearParallelResult();
    };

    const updateParallelLabels = () => {
        const rows = Array.from(parallelList.querySelectorAll('.series-row'));

        rows.forEach((row, index) => {
            const rowNumber = index + 1;
            const label = row.querySelector('.series-row-label');
            const badge = row.querySelector('.series-row-badge');
            const valueLabel = row.querySelector('.series-value-field label');
            const unitLabel = row.querySelector('.series-unit-field label');
            const input = row.querySelector('.series-value-input');
            const unit = row.querySelector('.series-unit-select');
            const removeButton = row.querySelector('.series-remove');

            row.dataset.index = String(rowNumber);

            if (label && input && unit) {
                label.textContent = `C${rowNumber}`;

                if (badge) {
                    badge.textContent = `Capacitor ${rowNumber}`;
                }

                input.id = `parallel-capacitor-${rowNumber}`;
                input.name = `parallel-capacitor-${rowNumber}`;
                input.setAttribute('aria-label', `Capacitor ${rowNumber} value`);
                input.dataset.sharedKeypadInput = '';
                input.dataset.keypadType = 'decimal';
                input.dataset.keypadLabel = `C${rowNumber}`;
                unit.id = `parallel-unit-${rowNumber}`;
                unit.name = `parallel-unit-${rowNumber}`;
                unit.setAttribute('aria-label', `Capacitor ${rowNumber} unit`);

                if (valueLabel) {
                    valueLabel.setAttribute('for', input.id);
                    valueLabel.textContent = `Capacitor ${rowNumber} value`;
                }

                if (unitLabel) {
                    unitLabel.setAttribute('for', unit.id);
                    unitLabel.textContent = `Capacitor ${rowNumber} unit`;
                }
            }

            if (removeButton) {
                const isMinimumRow = rows.length <= minimumParallelRows;
                removeButton.disabled = isMinimumRow;
                removeButton.setAttribute('aria-label', `Remove capacitor ${rowNumber}`);
            }
        });
    };

    const addParallelRow = (value = '', unit = 'uF') => {
        parallelCapacitorCount += 1;

        const row = document.createElement('div');
        row.className = 'series-row parallel-row';
        row.innerHTML = `
            <div class="series-row-header">
                <div class="series-row-title">
                    <span class="series-row-label">C${parallelCapacitorCount}</span>
                    <span class="series-row-badge">Capacitor ${parallelCapacitorCount}</span>
                </div>
                <button class="series-remove parallel-remove" type="button">
                    <i data-lucide="trash-2" aria-hidden="true"></i>
                </button>
            </div>
            <div class="series-row-controls">
                <div class="field-group series-value-field">
                    <label for="parallel-capacitor-${parallelCapacitorCount}">Value</label>
                    <input class="series-value-input" id="parallel-capacitor-${parallelCapacitorCount}" name="parallel-capacitor-${parallelCapacitorCount}" type="text" inputmode="decimal" autocomplete="off" placeholder="0.00" value="${escapeAttributeValue(value)}" data-shared-keypad-input data-keypad-type="decimal" data-keypad-label="C${parallelCapacitorCount}">
                </div>
                <div class="field-group series-unit-field">
                    <label for="parallel-unit-${parallelCapacitorCount}">Unit</label>
                    <select class="series-unit-select" id="parallel-unit-${parallelCapacitorCount}" name="parallel-unit-${parallelCapacitorCount}">
                        ${createUnitOptions()}
                    </select>
                </div>
            </div>
        `;

        row.querySelector('.series-unit-select').value = getSupportedCapacitanceUnit(unit);
        parallelList.appendChild(row);
        updateParallelLabels();
        refreshLucideIcons();
    };

    const removeParallelRow = (row) => {
        if (parallelList.querySelectorAll('.series-row').length <= minimumParallelRows) {
            return;
        }

        row.remove();
        updateParallelLabels();
        resetParallelCalculatedState();
    };

    const setParallelInputError = (input, message) => {
        input.setAttribute('aria-invalid', 'true');
        parallelErrorElement.textContent = message;
        input.focus();
    };

    const getParallelValues = () => {
        const rows = Array.from(parallelList.querySelectorAll('.series-row'));

        if (rows.length < minimumParallelRows) {
            return {
                isValid: false,
                message: 'Add at least two capacitors for a parallel calculation.',
            };
        }

        const values = [];

        for (const [index, row] of rows.entries()) {
            const input = row.querySelector('.series-value-input');
            const unitSelect = row.querySelector('.series-unit-select');
            const rowLabel = `C${index + 1}`;
            const normalizedValue = normalizeSeriesValue(input.value);

            if (!normalizedValue) {
                setParallelInputError(input, `${rowLabel} needs a capacitance value.`);
                return {
                    isValid: false,
                };
            }

            const numericValue = Number(normalizedValue);

            if (!Number.isFinite(numericValue)) {
                setParallelInputError(input, `${rowLabel} must be a valid number.`);
                return {
                    isValid: false,
                };
            }

            if (numericValue <= 0) {
                setParallelInputError(input, `${rowLabel} must be greater than zero for a parallel calculation.`);
                return {
                    isValid: false,
                };
            }

            values.push({
                inputValue: input.value.trim(),
                value: numericValue,
                unit: unitSelect.value,
                farads: numericValue * seriesUnits[unitSelect.value].factor,
            });
        }

        return {
            isValid: true,
            values,
        };
    };

    const calculateParallel = () => {
        clearParallelError();

        const parsedValues = getParallelValues();

        if (!parsedValues.isValid) {
            if (parsedValues.message) {
                parallelErrorElement.textContent = parsedValues.message;
            }

            clearParallelResult();
            return;
        }

        const totalFarads = parsedValues.values.reduce((sum, capacitor) => sum + capacitor.farads, 0);
        const readableUnit = getReadableSeriesUnit(totalFarads);
        const readableValue = totalFarads / seriesUnits[readableUnit].factor;
        const formattedReadableValue = formatSeriesNumber(readableValue);
        const formattedFarads = formatSeriesNumber(totalFarads);
        const formulaLabels = parsedValues.values
            .map((_, index) => `C${index + 1}`)
            .join(' + ');
        const additionTerms = parsedValues.values
            .map((capacitor, index) => `C${index + 1} = ${formatSeriesNumber(capacitor.farads)} F`)
            .join(' · ');

        parallelResultCard.classList.add('has-result');
        parallelResultElement.textContent = `${formattedReadableValue} ${seriesUnits[readableUnit].label}`;
        parallelResultStateElement.textContent = 'Calculated';
        parallelSummaryElement.textContent = `Calculated from ${parsedValues.values.length} capacitors.`;
        parallelBreakdownElement.textContent = `Ct = ${formulaLabels}. ${additionTerms}.`;
        parallelRawFaradsElement.textContent = `Raw total: ${formattedFarads} F`;
        document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: {
                mode: 'parallel',
                modeName: 'Parallel',
                inputSummary: parsedValues.values
                    .map((capacitor) => `${formatSeriesNumber(capacitor.value)} ${seriesUnits[capacitor.unit].label}`)
                    .join(', '),
                result: `${formattedReadableValue} ${seriesUnits[readableUnit].label}`,
                restoreData: {
                    capacitors: parsedValues.values.map((capacitor) => ({
                        value: capacitor.inputValue,
                        unit: capacitor.unit,
                    })),
                },
                timestamp: Date.now(),
            },
        }));
    };

    const restoreParallelHistory = (restoreData) => {
        const capacitors = Array.isArray(restoreData?.capacitors) ? restoreData.capacitors : [];

        parallelList.replaceChildren();
        parallelCapacitorCount = 0;

        capacitors.forEach((capacitor) => {
            addParallelRow(capacitor?.value ?? '', getSupportedCapacitanceUnit(capacitor?.unit));
        });

        while (parallelList.querySelectorAll('.series-row').length < minimumParallelRows) {
            addParallelRow('', 'uF');
        }

        updateParallelLabels();
        clearParallelError();
        clearParallelResult();
        parallelList.querySelector('.series-value-input')?.focus();
    };

    parallelAddButton.addEventListener('click', () => {
        addParallelRow();
        resetParallelCalculatedState();
    });

    parallelList.addEventListener('click', (event) => {
        const removeButton = event.target.closest('.series-remove');

        if (!removeButton) {
            return;
        }

        removeParallelRow(removeButton.closest('.series-row'));
    });

    parallelList.addEventListener('input', resetParallelCalculatedState);
    parallelList.addEventListener('change', resetParallelCalculatedState);

    parallelForm.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateParallel();
    });

    document.addEventListener('calculator:restore-history', (event) => {
        if (event.detail?.mode === 'series') {
            restoreSeriesHistory(event.detail.restoreData);
        }

        if (event.detail?.mode === 'parallel') {
            restoreParallelHistory(event.detail.restoreData);
        }
    });

    addParallelRow('', 'uF');
    addParallelRow('', 'uF');
});
