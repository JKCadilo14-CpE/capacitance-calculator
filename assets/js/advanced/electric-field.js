import {
    EPSILON_0,
    areaUnits,
    capacitanceUnits,
    chargeUnits,
    copyText,
    createSolutionSection,
    createTechnicalDetail,
    fieldUnits,
    formatCapacitanceResults,
    formatNumber,
    formatScientificValue,
    formatSiValue,
    lengthUnits,
    parsePositiveValue,
} from './advanced-utils.js';

export const initElectricFieldCalculator = () => {
    const electricFieldForm = document.getElementById('electric-field-form');
    const modeSelect = document.getElementById('electric-field-mode');
    const voltageInput = document.getElementById('electric-field-voltage');
    const fieldStrengthInput = document.getElementById('electric-field-strength');
    const fieldStrengthUnitSelect = document.getElementById('electric-field-strength-unit');
    const distanceInput = document.getElementById('electric-field-distance');
    const distanceUnitSelect = document.getElementById('electric-field-distance-unit');
    const chargeInput = document.getElementById('electric-field-charge');
    const chargeUnitSelect = document.getElementById('electric-field-charge-unit');
    const clearButton = document.getElementById('clear-electric-field-calculator');
    const errorElement = document.getElementById('electric-field-error');
    const resultCard = document.getElementById('electric-field-result-card');
    const resultLabelElement = document.getElementById('electric-field-result-label');
    const resultStateElement = document.getElementById('electric-field-result-state');
    const primaryResultElement = document.getElementById('electric-field-primary-result');
    const summaryElement = document.getElementById('electric-field-summary');
    const resultItems = [
        document.getElementById('electric-field-result-item-1'),
        document.getElementById('electric-field-result-item-2'),
        document.getElementById('electric-field-result-item-3'),
        document.getElementById('electric-field-result-item-4'),
    ];
    const resultUnitElements = [
        document.getElementById('electric-field-result-unit-1'),
        document.getElementById('electric-field-result-unit-2'),
        document.getElementById('electric-field-result-unit-3'),
        document.getElementById('electric-field-result-unit-4'),
    ];
    const resultValueElements = [
        document.getElementById('electric-field-result-1'),
        document.getElementById('electric-field-result-2'),
        document.getElementById('electric-field-result-3'),
        document.getElementById('electric-field-result-4'),
    ];
    const breakdownElement = document.getElementById('electric-field-breakdown');
    const technicalOutputElement = document.getElementById('electric-field-technical-output');
    const copyButton = document.getElementById('copy-electric-field-result');
    const copyStatusElement = document.getElementById('electric-field-copy-status');

    if (!electricFieldForm || !modeSelect || !voltageInput || !fieldStrengthInput || !fieldStrengthUnitSelect || !distanceInput || !distanceUnitSelect || !chargeInput || !chargeUnitSelect || !clearButton || !errorElement || !resultCard || !resultLabelElement || !resultStateElement || !primaryResultElement || !summaryElement || resultItems.some((item) => !item) || resultUnitElements.some((element) => !element) || resultValueElements.some((element) => !element) || !breakdownElement || !technicalOutputElement || !copyButton || !copyStatusElement) {
        return;
    }

    const modeContent = {
        field: {
            label: 'Electric Field',
            modeName: 'Find Electric Field E',
            summary: 'Enter voltage and separation distance to calculate electric field strength.',
            formula: 'Formula: E = V / d.',
            units: ['V/m', 'kV/m', 'V/cm'],
        },
        voltage: {
            label: 'Voltage',
            modeName: 'Find Voltage V',
            summary: 'Enter electric field strength and distance to calculate voltage.',
            formula: 'Formula: V = E × d.',
            units: ['V', 'kV', 'mV'],
        },
        distance: {
            label: 'Distance',
            modeName: 'Find Distance d',
            summary: 'Enter voltage and electric field strength to calculate distance.',
            formula: 'Formula: d = V / E.',
            units: ['m', 'cm', 'mm'],
        },
        capacitance: {
            label: 'Capacitance',
            modeName: 'Find Capacitance C from Q and V',
            summary: 'Enter charge and voltage to calculate capacitance.',
            formula: 'Formula: C = Q / V.',
            units: ['F', 'µF', 'nF', 'pF'],
        },
    };

    let copyPayload = '';
    let copyFeedbackTimeout = null;

    const calculatorInputs = [voltageInput, fieldStrengthInput, distanceInput, chargeInput];
    const modeFieldGroups = Array.from(electricFieldForm.querySelectorAll('[data-electric-field-mode-field]'));

    const getMode = () => modeContent[modeSelect.value] ? modeSelect.value : 'field';

    const formatVoltage = (volts, maximumFractionDigits = 8) => `${formatNumber(volts, maximumFractionDigits)} V`;
    const formatFieldStrength = (fieldVm, maximumFractionDigits = 8) => `${formatNumber(fieldVm, maximumFractionDigits)} V/m`;
    const formatDistance = (meters, maximumFractionDigits = 8) => `${formatNumber(meters, maximumFractionDigits)} m`;
    const formatCharge = (coulombs, significantDigits = 5) => formatSiValue(coulombs, 'C', significantDigits);

    const formatElectricFieldResults = (fieldVm) => [
        {
            unit: 'V/m',
            value: `${formatNumber(fieldVm, 4)} V/m`,
        },
        {
            unit: 'kV/m',
            value: `${formatNumber(fieldVm / 1000, 6)} kV/m`,
        },
        {
            unit: 'V/cm',
            value: `${formatNumber(fieldVm / 100, 6)} V/cm`,
        },
    ];

    const formatVoltageResults = (volts) => [
        {
            unit: 'V',
            value: `${formatNumber(volts, 4)} V`,
        },
        {
            unit: 'kV',
            value: `${formatNumber(volts / 1000, 6)} kV`,
        },
        {
            unit: 'mV',
            value: `${formatNumber(volts * 1000, 4)} mV`,
        },
    ];

    const formatDistanceResults = (meters) => [
        {
            unit: 'm',
            value: `${formatNumber(meters, 8)} m`,
        },
        {
            unit: 'cm',
            value: `${formatNumber(meters / 1e-2, 6)} cm`,
        },
        {
            unit: 'mm',
            value: `${formatNumber(meters / 1e-3, 6)} mm`,
        },
    ];

    const formatCapacitanceFieldResults = (farads) => [
        {
            unit: 'F',
            value: `${formatNumber(farads, 8)} F`,
        },
        {
            unit: 'µF',
            value: `${formatNumber(farads / 1e-6, 6)} µF`,
        },
        {
            unit: 'nF',
            value: `${formatNumber(farads / 1e-9, 6)} nF`,
        },
        {
            unit: 'pF',
            value: `${formatNumber(farads / 1e-12, 4)} pF`,
        },
    ];

    const clearError = () => {
        errorElement.textContent = '';
        calculatorInputs.forEach((input) => {
            input.removeAttribute('aria-invalid');
        });
    };

    const clearCopyFeedback = () => {
        if (copyFeedbackTimeout) {
            window.clearTimeout(copyFeedbackTimeout);
            copyFeedbackTimeout = null;
        }

        copyStatusElement.textContent = '';
    };

    const setCopyFeedback = (message) => {
        clearCopyFeedback();
        copyStatusElement.textContent = message;
        copyFeedbackTimeout = window.setTimeout(() => {
            copyStatusElement.textContent = '';
            copyFeedbackTimeout = null;
        }, 2200);
    };

    const updateResultSlots = (mode, results = []) => {
        const units = modeContent[mode].units;

        resultItems.forEach((item, index) => {
            const unit = units[index];
            const result = results[index];

            item.hidden = !unit;
            resultUnitElements[index].textContent = unit || '--';
            resultValueElements[index].textContent = result ? result.value : '--';
        });
    };

    const clearResult = () => {
        const mode = getMode();

        resultCard.classList.remove('has-result');
        resultLabelElement.textContent = modeContent[mode].label;
        resultStateElement.textContent = 'Ready';
        primaryResultElement.textContent = '--';
        summaryElement.textContent = modeContent[mode].summary;
        updateResultSlots(mode);
        breakdownElement.replaceChildren(modeContent[mode].formula);
        technicalOutputElement.replaceChildren('Raw SI values will appear after calculation.');
        copyPayload = '';
        copyButton.disabled = true;
        clearCopyFeedback();
    };

    const showError = (input, message) => {
        clearError();
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
        clearResult();
        input.focus();
    };

    const updateModeVisibility = () => {
        const mode = getMode();

        modeFieldGroups.forEach((group) => {
            const visibleModes = String(group.dataset.electricFieldModeField || '').split(/\s+/);
            group.hidden = !visibleModes.includes(mode);
        });
        clearError();
        clearResult();
    };

    const setCalculatedResult = ({ mode, results, inputSummary, conversionSummary, formulaSummary, breakdownSections, technicalDetails }) => {
        resultCard.classList.add('has-result');
        resultLabelElement.textContent = modeContent[mode].label;
        resultStateElement.textContent = 'Calculated';
        primaryResultElement.textContent = results[0].value;
        summaryElement.textContent = `${inputSummary}.`;
        updateResultSlots(mode, results);
        breakdownElement.replaceChildren(...breakdownSections);
        technicalOutputElement.replaceChildren(...technicalDetails);
        copyPayload = [
            'Electric Field & Capacitance',
            modeContent[mode].modeName,
            inputSummary,
            conversionSummary,
            formulaSummary,
            `Results: ${results.map((result) => result.value).join(', ')}`,
        ].join('\n');
        document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: {
                mode: 'advanced-electric-field',
                modeName: 'Electric Field & Capacitance',
                inputSummary,
                result: results[0].value,
                restoreData: {
                    calculationMode: mode,
                    voltageValue: voltageInput.value.trim(),
                    fieldStrengthValue: fieldStrengthInput.value.trim(),
                    fieldStrengthUnit: fieldStrengthUnitSelect.value,
                    distanceValue: distanceInput.value.trim(),
                    distanceUnit: distanceUnitSelect.value,
                    chargeValue: chargeInput.value.trim(),
                    chargeUnit: chargeUnitSelect.value,
                },
                timestamp: Date.now(),
            },
        }));
        copyButton.disabled = false;
        clearCopyFeedback();
    };

    const calculateField = () => {
        const parsedVoltage = parsePositiveValue(voltageInput, 'voltage');

        if (!parsedVoltage.isValid) {
            showError(voltageInput, parsedVoltage.message);
            return;
        }

        const parsedDistance = parsePositiveValue(distanceInput, 'distance');

        if (!parsedDistance.isValid) {
            showError(distanceInput, parsedDistance.message);
            return;
        }

        const distanceUnit = lengthUnits[distanceUnitSelect.value] || lengthUnits.m;
        const voltage = parsedVoltage.value;
        const distanceMeters = parsedDistance.value * distanceUnit.factor;
        const fieldVm = voltage / distanceMeters;
        const results = formatElectricFieldResults(fieldVm);
        const formattedVoltage = formatVoltage(voltage);
        const formattedDistance = formatDistance(distanceMeters);
        const formattedField = formatFieldStrength(fieldVm);
        const inputSummary = `Find Electric Field E: V = ${formatNumber(voltage, 6)} V, d = ${formatNumber(parsedDistance.value, 6)} ${distanceUnit.label}`;
        const conversionSummary = `Converted: V = ${formatNumber(voltage, 8)} V, d = ${formatNumber(distanceMeters, 8)} m.`;
        const formulaSummary = `E = V / d = ${formatNumber(voltage, 8)} / ${formatNumber(distanceMeters, 8)} = ${results[0].value}.`;

        setCalculatedResult({
            mode: 'field',
            results,
            inputSummary,
            conversionSummary,
            formulaSummary,
            breakdownSections: [
                createSolutionSection('Given', [
                    `V = ${formattedVoltage}`,
                    `d = ${formattedDistance}`,
                ]),
                createSolutionSection('Formula', [
                    'E = V / d',
                ]),
                createSolutionSection('Substitution', [
                    `E = ${formattedVoltage} / ${formattedDistance}`,
                ]),
                createSolutionSection('Final', [
                    `E = ${formattedField}`,
                    `E ≈ ${results[0].value}`,
                ]),
            ],
            technicalDetails: [
                createTechnicalDetail('Calculation mode', modeContent.field.modeName),
                createTechnicalDetail('Voltage V', formattedVoltage),
                createTechnicalDetail('Converted distance d', formattedDistance),
                createTechnicalDetail('Raw electric field E', formattedField),
                createTechnicalDetail('Result conversions', results.map((result) => result.value).join(', ')),
            ],
        });
    };

    const calculateVoltage = () => {
        const parsedField = parsePositiveValue(fieldStrengthInput, 'electric field');

        if (!parsedField.isValid) {
            showError(fieldStrengthInput, parsedField.message);
            return;
        }

        const parsedDistance = parsePositiveValue(distanceInput, 'distance');

        if (!parsedDistance.isValid) {
            showError(distanceInput, parsedDistance.message);
            return;
        }

        const fieldUnit = fieldUnits[fieldStrengthUnitSelect.value] || fieldUnits.vm;
        const distanceUnit = lengthUnits[distanceUnitSelect.value] || lengthUnits.m;
        const fieldVm = parsedField.value * fieldUnit.factor;
        const distanceMeters = parsedDistance.value * distanceUnit.factor;
        const voltage = fieldVm * distanceMeters;
        const results = formatVoltageResults(voltage);
        const formattedField = formatFieldStrength(fieldVm);
        const formattedDistance = formatDistance(distanceMeters);
        const formattedVoltage = formatVoltage(voltage);
        const inputSummary = `Find Voltage V: E = ${formatNumber(parsedField.value, 6)} ${fieldUnit.label}, d = ${formatNumber(parsedDistance.value, 6)} ${distanceUnit.label}`;
        const conversionSummary = `Converted: E = ${formatNumber(fieldVm, 8)} V/m, d = ${formatNumber(distanceMeters, 8)} m.`;
        const formulaSummary = `V = E × d = ${formatNumber(fieldVm, 8)} × ${formatNumber(distanceMeters, 8)} = ${results[0].value}.`;

        setCalculatedResult({
            mode: 'voltage',
            results,
            inputSummary,
            conversionSummary,
            formulaSummary,
            breakdownSections: [
                createSolutionSection('Given', [
                    `E = ${formattedField}`,
                    `d = ${formattedDistance}`,
                ]),
                createSolutionSection('Formula', [
                    'V = E × d',
                ]),
                createSolutionSection('Substitution', [
                    `V = ${formattedField} × ${formattedDistance}`,
                ]),
                createSolutionSection('Final', [
                    `V = ${formattedVoltage}`,
                    `V ≈ ${results[0].value}`,
                ]),
            ],
            technicalDetails: [
                createTechnicalDetail('Calculation mode', modeContent.voltage.modeName),
                createTechnicalDetail('Converted electric field E', formattedField),
                createTechnicalDetail('Converted distance d', formattedDistance),
                createTechnicalDetail('Raw voltage V', formattedVoltage),
                createTechnicalDetail('Result conversions', results.map((result) => result.value).join(', ')),
            ],
        });
    };

    const calculateDistance = () => {
        const parsedVoltage = parsePositiveValue(voltageInput, 'voltage');

        if (!parsedVoltage.isValid) {
            showError(voltageInput, parsedVoltage.message);
            return;
        }

        const parsedField = parsePositiveValue(fieldStrengthInput, 'electric field');

        if (!parsedField.isValid) {
            showError(fieldStrengthInput, parsedField.message);
            return;
        }

        const fieldUnit = fieldUnits[fieldStrengthUnitSelect.value] || fieldUnits.vm;
        const voltage = parsedVoltage.value;
        const fieldVm = parsedField.value * fieldUnit.factor;
        const distanceMeters = voltage / fieldVm;
        const results = formatDistanceResults(distanceMeters);
        const formattedVoltage = formatVoltage(voltage);
        const formattedField = formatFieldStrength(fieldVm);
        const formattedDistance = formatDistance(distanceMeters);
        const inputSummary = `Find Distance d: V = ${formatNumber(voltage, 6)} V, E = ${formatNumber(parsedField.value, 6)} ${fieldUnit.label}`;
        const conversionSummary = `Converted: V = ${formatNumber(voltage, 8)} V, E = ${formatNumber(fieldVm, 8)} V/m.`;
        const formulaSummary = `d = V / E = ${formatNumber(voltage, 8)} / ${formatNumber(fieldVm, 8)} = ${results[0].value}.`;

        setCalculatedResult({
            mode: 'distance',
            results,
            inputSummary,
            conversionSummary,
            formulaSummary,
            breakdownSections: [
                createSolutionSection('Given', [
                    `V = ${formattedVoltage}`,
                    `E = ${formattedField}`,
                ]),
                createSolutionSection('Formula', [
                    'd = V / E',
                ]),
                createSolutionSection('Substitution', [
                    `d = ${formattedVoltage} / ${formattedField}`,
                ]),
                createSolutionSection('Final', [
                    `d = ${formattedDistance}`,
                    `d ≈ ${results[0].value}`,
                ]),
            ],
            technicalDetails: [
                createTechnicalDetail('Calculation mode', modeContent.distance.modeName),
                createTechnicalDetail('Voltage V', formattedVoltage),
                createTechnicalDetail('Converted electric field E', formattedField),
                createTechnicalDetail('Raw distance d', formattedDistance),
                createTechnicalDetail('Result conversions', results.map((result) => result.value).join(', ')),
            ],
        });
    };

    const calculateCapacitance = () => {
        const parsedCharge = parsePositiveValue(chargeInput, 'charge');

        if (!parsedCharge.isValid) {
            showError(chargeInput, parsedCharge.message);
            return;
        }

        const parsedVoltage = parsePositiveValue(voltageInput, 'voltage');

        if (!parsedVoltage.isValid) {
            showError(voltageInput, parsedVoltage.message);
            return;
        }

        const chargeUnit = chargeUnits[chargeUnitSelect.value] || chargeUnits.C;
        const chargeCoulombs = parsedCharge.value * chargeUnit.factor;
        const voltage = parsedVoltage.value;
        const capacitanceFarads = chargeCoulombs / voltage;
        const results = formatCapacitanceFieldResults(capacitanceFarads);
        const formattedCharge = formatCharge(chargeCoulombs);
        const formattedVoltage = formatVoltage(voltage);
        const formattedCapacitance = formatSiValue(capacitanceFarads, 'F', 5);
        const inputSummary = `Find Capacitance C: Q = ${formatNumber(parsedCharge.value, 6)} ${chargeUnit.label}, V = ${formatNumber(voltage, 6)} V`;
        const conversionSummary = `Converted: Q = ${formatNumber(chargeCoulombs, 8)} C, V = ${formatNumber(voltage, 8)} V.`;
        const formulaSummary = `C = Q / V = ${formatNumber(chargeCoulombs, 8)} / ${formatNumber(voltage, 8)} = ${results[0].value}.`;

        setCalculatedResult({
            mode: 'capacitance',
            results,
            inputSummary,
            conversionSummary,
            formulaSummary,
            breakdownSections: [
                createSolutionSection('Given', [
                    `Q = ${formattedCharge}`,
                    `V = ${formattedVoltage}`,
                ]),
                createSolutionSection('Formula', [
                    'C = Q / V',
                ]),
                createSolutionSection('Substitution', [
                    `C = ${formattedCharge} / ${formattedVoltage}`,
                ]),
                createSolutionSection('Final', [
                    `C = ${formattedCapacitance}`,
                    `C ≈ ${results[0].value}`,
                ]),
            ],
            technicalDetails: [
                createTechnicalDetail('Calculation mode', modeContent.capacitance.modeName),
                createTechnicalDetail('Converted charge Q', formattedCharge),
                createTechnicalDetail('Voltage V', formattedVoltage),
                createTechnicalDetail('Raw capacitance C', formattedCapacitance),
                createTechnicalDetail('Result conversions', results.map((result) => result.value).join(', ')),
            ],
        });
    };

    const calculateElectricFieldMode = () => {
        clearError();

        switch (getMode()) {
            case 'voltage':
                calculateVoltage();
                break;
            case 'distance':
                calculateDistance();
                break;
            case 'capacitance':
                calculateCapacitance();
                break;
            case 'field':
            default:
                calculateField();
                break;
        }
    };

    const resetCalculator = () => {
        modeSelect.value = 'field';
        voltageInput.value = '';
        fieldStrengthInput.value = '';
        fieldStrengthUnitSelect.value = 'vm';
        distanceInput.value = '';
        distanceUnitSelect.value = 'm';
        chargeInput.value = '';
        chargeUnitSelect.value = 'C';
        updateModeVisibility();
        voltageInput.focus();
    };

    electricFieldForm.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateElectricFieldMode();
    });

    modeSelect.addEventListener('change', updateModeVisibility);

    [voltageInput, fieldStrengthInput, distanceInput, chargeInput].forEach((input) => {
        input.addEventListener('input', () => {
            clearError();
            clearResult();
        });
    });

    [fieldStrengthUnitSelect, distanceUnitSelect, chargeUnitSelect].forEach((select) => {
        select.addEventListener('change', () => {
            clearError();
            clearResult();
        });
    });

    clearButton.addEventListener('click', resetCalculator);

    document.addEventListener('calculator:restore-history', (event) => {
        if (event.detail?.mode !== 'advanced-electric-field') {
            return;
        }

        const restoreData = event.detail.restoreData || {};
        const restoredMode = modeContent[restoreData.calculationMode] ? restoreData.calculationMode : 'field';

        modeSelect.value = restoredMode;
        voltageInput.value = String(restoreData.voltageValue ?? '');
        fieldStrengthInput.value = String(restoreData.fieldStrengthValue ?? '');
        fieldStrengthUnitSelect.value = fieldUnits[restoreData.fieldStrengthUnit] ? restoreData.fieldStrengthUnit : 'vm';
        distanceInput.value = String(restoreData.distanceValue ?? '');
        distanceUnitSelect.value = lengthUnits[restoreData.distanceUnit] ? restoreData.distanceUnit : 'm';
        chargeInput.value = String(restoreData.chargeValue ?? '');
        chargeUnitSelect.value = chargeUnits[restoreData.chargeUnit] ? restoreData.chargeUnit : 'C';
        updateModeVisibility();

        if (restoredMode === 'voltage' || restoredMode === 'distance') {
            fieldStrengthInput.focus();
        } else if (restoredMode === 'capacitance') {
            chargeInput.focus();
        } else {
            voltageInput.focus();
        }
    });

    copyButton.addEventListener('click', async () => {
        if (!copyPayload || !resultCard.classList.contains('has-result')) {
            copyButton.disabled = true;
            return;
        }

        try {
            await copyText(copyPayload);
            setCopyFeedback('Copied!');
        } catch (error) {
            setCopyFeedback('Copy failed');
        }
    });

    updateModeVisibility();
};
