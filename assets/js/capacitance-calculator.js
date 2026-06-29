// Capacitance calculator script: handles mode selection, series calculations, and parallel calculations.
// DO NO TOUCH ANYMORE UNLESS YOU KNOW WHAT YOU ARE DOING!!! MAKE SURE YOU HAVE ENOUGH SLEEP BEDORE TOUCHING THIS CODE!!!!
// This is a critical part of the calculator's functionality.

const seriesUnits = window.PracticalCalculatorUtils.units.capacitance;

const minimumSeriesRows = 2;
const minimumParallelRows = 2;

const formatSeriesNumber = (value) => {
    return window.PracticalCalculatorUtils.formatRoundedNumber(value);
};

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

const createSeriesUnitOptions = () => Object.entries(seriesUnits)
    .map(([value, unit]) => `<option value="${value}">${unit.label}</option>`)
    .join('');

const escapeCapacitanceAttributeValue = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const getSupportedSeriesUnit = (unit) => {
    return window.PracticalCalculatorUtils.getSupportedUnitKey(seriesUnits, unit, 'uF');
};

const clearCapacitanceResult = ({
    resultCard,
    resultElement,
    resultStateElement,
    summaryElement,
    breakdownElement,
    rawFaradsElement,
    technicalDetailsElement,
    summaryText,
    breakdownText,
}) => {
    resultCard.classList.remove('has-result');
    resultElement.textContent = '--';
    resultStateElement.textContent = 'Ready';
    summaryElement.textContent = summaryText;
    breakdownElement.textContent = breakdownText;
    rawFaradsElement.textContent = 'Raw total will appear after calculation.';
    technicalDetailsElement.open = false;
};

const clearCapacitanceError = (errorElement, list) => {
    errorElement.textContent = '';
    list.querySelectorAll('input[aria-invalid="true"]').forEach((input) => {
        input.removeAttribute('aria-invalid');
    });
};

const updateCapacitanceRowLabels = ({
    list,
    idPrefix,
    minimumRows,
}) => {
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

            input.id = `${idPrefix}-capacitor-${rowNumber}`;
            input.name = `${idPrefix}-capacitor-${rowNumber}`;
            input.setAttribute('aria-label', `Capacitor ${rowNumber} value`);
            input.dataset.sharedKeypadInput = '';
            input.dataset.keypadType = 'decimal';
            input.dataset.keypadLabel = `C${rowNumber}`;
            unit.id = `${idPrefix}-unit-${rowNumber}`;
            unit.name = `${idPrefix}-unit-${rowNumber}`;
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
            const isMinimumRow = rows.length <= minimumRows;
            removeButton.disabled = isMinimumRow;
            removeButton.setAttribute('aria-label', `Remove capacitor ${rowNumber}`);
        }
    });
};

const createCapacitanceRowElement = ({
    rowNumber,
    idPrefix,
    rowClassName,
    removeClassName,
    value,
}) => {
    const row = document.createElement('div');
    row.className = rowClassName;
    row.innerHTML = `
        <div class="series-row-header">
            <div class="series-row-title">
                <span class="series-row-label">C${rowNumber}</span>
                <span class="series-row-badge">Capacitor ${rowNumber}</span>
            </div>
            <button class="${removeClassName}" type="button">
                <i data-lucide="trash-2" aria-hidden="true"></i>
            </button>
        </div>
        <div class="series-row-controls">
            <div class="field-group series-value-field">
                <label for="${idPrefix}-capacitor-${rowNumber}">Value</label>
                <input class="series-value-input" id="${idPrefix}-capacitor-${rowNumber}" name="${idPrefix}-capacitor-${rowNumber}" type="text" inputmode="decimal" autocomplete="off" placeholder="0.00" value="${escapeCapacitanceAttributeValue(value)}" data-shared-keypad-input data-keypad-type="decimal" data-keypad-label="C${rowNumber}">
            </div>
            <div class="field-group series-unit-field">
                <label for="${idPrefix}-unit-${rowNumber}">Unit</label>
                <select class="series-unit-select" id="${idPrefix}-unit-${rowNumber}" name="${idPrefix}-unit-${rowNumber}">
                    ${createSeriesUnitOptions()}
                </select>
            </div>
        </div>
    `;

    return row;
};

const parseCapacitanceRows = ({
    list,
    errorElement,
    minimumRows,
    modeName,
    minimumRowsMessage,
}) => {
    const rows = Array.from(list.querySelectorAll('.series-row'));

    if (rows.length < minimumRows) {
        return {
            isValid: false,
            message: minimumRowsMessage,
        };
    }

    const values = [];

    for (const [index, row] of rows.entries()) {
        const input = row.querySelector('.series-value-input');
        const unitSelect = row.querySelector('.series-unit-select');
        const rowLabel = `C${index + 1}`;
        const normalizedValue = window.PracticalCalculatorUtils.normalizeNumericValue(input.value);

        if (!normalizedValue) {
            input.setAttribute('aria-invalid', 'true');
            errorElement.textContent = `${rowLabel} needs a capacitance value.`;
            input.focus();
            return {
                isValid: false,
            };
        }

        const numericValue = Number(normalizedValue);

        if (!Number.isFinite(numericValue)) {
            input.setAttribute('aria-invalid', 'true');
            errorElement.textContent = `${rowLabel} must be a valid number.`;
            input.focus();
            return {
                isValid: false,
            };
        }

        if (numericValue <= 0) {
            input.setAttribute('aria-invalid', 'true');
            errorElement.textContent = `${rowLabel} must be greater than zero for a ${modeName} calculation.`;
            input.focus();
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
        clearCapacitanceResult({
            resultCard,
            resultElement,
            resultStateElement,
            summaryElement,
            breakdownElement,
            rawFaradsElement,
            technicalDetailsElement,
            summaryText: 'Enter at least two capacitor values to calculate the series total.',
            breakdownText: 'Enter values for C1 and C2, then calculate to see the reciprocal breakdown.',
        });
    };

    const clearError = () => {
        clearCapacitanceError(errorElement, list);
    };

    const resetCalculatedState = () => {
        clearError();
        clearResult();
    };

    const updateSeriesLabels = () => {
        updateCapacitanceRowLabels({
            list,
            idPrefix: 'series',
            minimumRows: minimumSeriesRows,
        });
    };

    const addSeriesRow = (value = '', unit = 'uF') => {
        capacitorCount += 1;

        const row = createCapacitanceRowElement({
            rowNumber: capacitorCount,
            idPrefix: 'series',
            rowClassName: 'series-row',
            removeClassName: 'series-remove',
            value,
        });

        row.querySelector('.series-unit-select').value = getSupportedSeriesUnit(unit);
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

    const getSeriesValues = () => {
        return parseCapacitanceRows({
            list,
            errorElement,
            minimumRows: minimumSeriesRows,
            modeName: 'series',
            minimumRowsMessage: 'Add at least two capacitors for a series calculation.',
        });
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
        window.PracticalCalculatorUtils.dispatchHistoryEntry({
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
        });
    };

    const restoreSeriesHistory = (restoreData) => {
        const capacitors = Array.isArray(restoreData?.capacitors) ? restoreData.capacitors : [];

        list.replaceChildren();
        capacitorCount = 0;

        capacitors.forEach((capacitor) => {
            addSeriesRow(capacitor?.value ?? '', getSupportedSeriesUnit(capacitor?.unit));
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
        clearCapacitanceResult({
            resultCard: parallelResultCard,
            resultElement: parallelResultElement,
            resultStateElement: parallelResultStateElement,
            summaryElement: parallelSummaryElement,
            breakdownElement: parallelBreakdownElement,
            rawFaradsElement: parallelRawFaradsElement,
            technicalDetailsElement: parallelTechnicalDetailsElement,
            summaryText: 'Enter at least two capacitor values to calculate the parallel total.',
            breakdownText: 'Enter values for C1 and C2, then calculate to see the addition breakdown.',
        });
    };

    const clearParallelError = () => {
        clearCapacitanceError(parallelErrorElement, parallelList);
    };

    const resetParallelCalculatedState = () => {
        clearParallelError();
        clearParallelResult();
    };

    const updateParallelLabels = () => {
        updateCapacitanceRowLabels({
            list: parallelList,
            idPrefix: 'parallel',
            minimumRows: minimumParallelRows,
        });
    };

    const addParallelRow = (value = '', unit = 'uF') => {
        parallelCapacitorCount += 1;

        const row = createCapacitanceRowElement({
            rowNumber: parallelCapacitorCount,
            idPrefix: 'parallel',
            rowClassName: 'series-row parallel-row',
            removeClassName: 'series-remove parallel-remove',
            value,
        });

        row.querySelector('.series-unit-select').value = getSupportedSeriesUnit(unit);
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

    const getParallelValues = () => {
        return parseCapacitanceRows({
            list: parallelList,
            errorElement: parallelErrorElement,
            minimumRows: minimumParallelRows,
            modeName: 'parallel',
            minimumRowsMessage: 'Add at least two capacitors for a parallel calculation.',
        });
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
        window.PracticalCalculatorUtils.dispatchHistoryEntry({
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
        });
    };

    const restoreParallelHistory = (restoreData) => {
        const capacitors = Array.isArray(restoreData?.capacitors) ? restoreData.capacitors : [];

        parallelList.replaceChildren();
        parallelCapacitorCount = 0;

        capacitors.forEach((capacitor) => {
            addParallelRow(capacitor?.value ?? '', getSupportedSeriesUnit(capacitor?.unit));
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
