// Capacitive reactance calculator script: calculates Xc = 1 / (2πfC).

const reactanceFrequencyUnits = window.PracticalCalculatorUtils.units.frequency;
const reactanceCapacitanceUnits = window.PracticalCalculatorUtils.units.capacitanceWithMilli;
const reactanceResistanceUnits = window.PracticalCalculatorUtils.units.resistance;

const formatReactanceNumber = (value) => {
    return window.PracticalCalculatorUtils.formatRoundedNumber(value);
};

const formatReactanceTechnicalNumber = (value, maximumFractionDigits = 8) => {
    return window.PracticalCalculatorUtils.formatPrecisionNumber(value, maximumFractionDigits);
};

const getReadableReactanceUnit = (ohms) => {
    if (ohms >= reactanceResistanceUnits.mohm.factor) {
        return 'mohm';
    }

    if (ohms >= reactanceResistanceUnits.kohm.factor) {
        return 'kohm';
    }

    return 'ohm';
};

const parsePositiveReactanceValue = (input, label) => {
    return window.PracticalCalculatorUtils.parseNumericInputValue(input, label);
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('capacitive-reactance-form');
    const frequencyInput = document.getElementById('reactance-frequency-value');
    const frequencyUnitSelect = document.getElementById('reactance-frequency-unit');
    const capacitanceInput = document.getElementById('reactance-capacitance-value');
    const capacitanceUnitSelect = document.getElementById('reactance-capacitance-unit');
    const clearButton = document.getElementById('clear-capacitive-reactance');
    const errorElement = document.getElementById('capacitive-reactance-error');
    const resultCard = document.getElementById('capacitive-reactance-result-card');
    const resultStateElement = document.getElementById('capacitive-reactance-result-state');
    const primaryResultElement = document.getElementById('capacitive-reactance-primary-result');
    const summaryElement = document.getElementById('capacitive-reactance-summary');
    const ohmsElement = document.getElementById('capacitive-reactance-result-ohms');
    const kilohmsElement = document.getElementById('capacitive-reactance-result-kilohms');
    const megohmsElement = document.getElementById('capacitive-reactance-result-megohms');
    const breakdownElement = document.getElementById('capacitive-reactance-breakdown');
    const technicalDetailsElement = document.getElementById('capacitive-reactance-technical-details');
    const technicalOutputElement = document.getElementById('capacitive-reactance-technical-output');

    if (!form || !frequencyInput || !frequencyUnitSelect || !capacitanceInput || !capacitanceUnitSelect || !clearButton || !errorElement || !resultCard || !resultStateElement || !primaryResultElement || !summaryElement || !ohmsElement || !kilohmsElement || !megohmsElement || !breakdownElement || !technicalDetailsElement || !technicalOutputElement) {
        return;
    }

    const clearError = () => {
        window.PracticalCalculatorUtils.clearInputErrorState(errorElement, [
            frequencyInput,
            capacitanceInput,
        ]);
    };

    const clearResult = () => {
        window.PracticalCalculatorUtils.clearResultState({
            resultCard,
            resultStateElement,
            primaryResultElement,
            summaryElement,
            outputElements: [
                ohmsElement,
                kilohmsElement,
                megohmsElement,
            ],
            breakdownElement,
            technicalOutputElement,
            technicalDetailsElement,
            summaryText: 'Enter frequency and capacitance to calculate Xc.',
            breakdownText: 'Formula: Xc = 1 / (2πfC).',
            technicalText: 'Raw values will appear after calculation.',
        });
    };

    const resetCalculator = () => {
        frequencyInput.value = '';
        frequencyUnitSelect.value = 'kHz';
        capacitanceInput.value = '';
        capacitanceUnitSelect.value = 'nF';
        clearError();
        clearResult();
    };

    const showError = (input, message) => {
        window.PracticalCalculatorUtils.showInputError({
            input,
            errorElement,
            message,
            clearResult,
        });
    };

    const calculateReactance = () => {
        clearError();

        const parsedFrequency = parsePositiveReactanceValue(frequencyInput, 'Frequency');

        if (!parsedFrequency.isValid) {
            showError(frequencyInput, parsedFrequency.message);
            return;
        }

        const parsedCapacitance = parsePositiveReactanceValue(capacitanceInput, 'Capacitance');

        if (!parsedCapacitance.isValid) {
            showError(capacitanceInput, parsedCapacitance.message);
            return;
        }

        const frequencyUnit = reactanceFrequencyUnits[frequencyUnitSelect.value];
        const capacitanceUnit = reactanceCapacitanceUnits[capacitanceUnitSelect.value];
        const frequencyHertz = parsedFrequency.value * frequencyUnit.factor;
        const capacitanceFarads = parsedCapacitance.value * capacitanceUnit.factor;
        const angularFrequency = 2 * Math.PI * frequencyHertz;
        const reactanceOhms = 1 / (angularFrequency * capacitanceFarads);
        const readableUnitKey = getReadableReactanceUnit(reactanceOhms);
        const readableUnit = reactanceResistanceUnits[readableUnitKey];
        const readableValue = reactanceOhms / readableUnit.factor;
        const formattedResult = `${formatReactanceNumber(readableValue)} ${readableUnit.label}`;

        resultCard.classList.add('has-result');
        resultStateElement.textContent = 'Calculated';
        primaryResultElement.textContent = formattedResult;
        summaryElement.textContent = 'Calculated from frequency and capacitance.';
        ohmsElement.textContent = `${formatReactanceNumber(reactanceOhms)} ${reactanceResistanceUnits.ohm.label}`;
        kilohmsElement.textContent = `${formatReactanceNumber(reactanceOhms / reactanceResistanceUnits.kohm.factor)} ${reactanceResistanceUnits.kohm.label}`;
        megohmsElement.textContent = `${formatReactanceNumber(reactanceOhms / reactanceResistanceUnits.mohm.factor)} ${reactanceResistanceUnits.mohm.label}`;
        breakdownElement.textContent = `Xc = 1 / (2πfC). Xc = 1 / (2π × ${formatReactanceTechnicalNumber(frequencyHertz, 4)} ${reactanceFrequencyUnits.Hz.label} × ${formatReactanceTechnicalNumber(capacitanceFarads, 8)} ${reactanceCapacitanceUnits.F.label}) = ${formattedResult}.`;
        technicalOutputElement.textContent = [
            `Raw frequency: ${formatReactanceTechnicalNumber(frequencyHertz, 4)} ${reactanceFrequencyUnits.Hz.label}`,
            `Raw capacitance: ${formatReactanceTechnicalNumber(capacitanceFarads, 8)} ${reactanceCapacitanceUnits.F.label}`,
            `Angular frequency 2πf: ${formatReactanceTechnicalNumber(angularFrequency, 4)} rad/s`,
            `Reactance: ${formatReactanceTechnicalNumber(reactanceOhms, 8)} ${reactanceResistanceUnits.ohm.label}`,
        ].join(' · ');

        window.PracticalCalculatorUtils.dispatchHistoryEntry({
            mode: 'capacitive-reactance',
            modeName: 'Capacitive Reactance',
            inputSummary: `${formatReactanceNumber(parsedFrequency.value)} ${frequencyUnit.label}, ${formatReactanceNumber(parsedCapacitance.value)} ${capacitanceUnit.label}`,
            result: formattedResult,
            restoreData: {
                frequencyValue: frequencyInput.value.trim(),
                frequencyUnit: frequencyUnitSelect.value,
                capacitanceValue: capacitanceInput.value.trim(),
                capacitanceUnit: capacitanceUnitSelect.value,
            },
        });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateReactance();
    });

    window.PracticalCalculatorUtils.bindResultResetListeners([
        frequencyInput,
        frequencyUnitSelect,
        capacitanceInput,
        capacitanceUnitSelect,
    ], () => {
        clearError();
        clearResult();
    });

    clearButton.addEventListener('click', () => {
        resetCalculator();
        frequencyInput.focus();
    });

    document.addEventListener('calculator:restore-history', (event) => {
        if (event.detail?.mode !== 'capacitive-reactance') {
            return;
        }

        const restoreData = event.detail.restoreData || {};
        frequencyInput.value = String(restoreData.frequencyValue ?? '');
        frequencyUnitSelect.value = window.PracticalCalculatorUtils.getSupportedUnitKey(reactanceFrequencyUnits, restoreData.frequencyUnit, 'kHz');
        capacitanceInput.value = String(restoreData.capacitanceValue ?? '');
        capacitanceUnitSelect.value = window.PracticalCalculatorUtils.getSupportedUnitKey(reactanceCapacitanceUnits, restoreData.capacitanceUnit, 'nF');
        clearError();
        clearResult();
        frequencyInput.focus();
    });
});
