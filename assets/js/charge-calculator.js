// Charge calculator script: calculates Q = C * V.
// DO NO TOUCH ANYMORE UNLESS YOU KNOW WHAT YOU ARE DOING!!! MAKE SURE YOU HAVE ENOUGH SLEEP BEDORE TOUCHING THIS CODE!!!!
// This is a critical part of the calculator's functionality.

const chargeCapacitanceUnits = {
    pF: {
        label: 'pF',
        factor: 1e-12,
    },
    nF: {
        label: 'nF',
        factor: 1e-9,
    },
    uF: {
        label: 'µF',
        factor: 1e-6,
    },
    mF: {
        label: 'mF',
        factor: 1e-3,
    },
    F: {
        label: 'F',
        factor: 1,
    },
};

const normalizeChargeValue = (value) => window.PracticalCalculatorUtils.normalizeNumericValue(value);

const formatChargeNumber = (value, maximumFractionDigits = 8) => {
    return window.PracticalCalculatorUtils.formatPrecisionNumber(value, maximumFractionDigits);
};

const parseChargeValue = (input, label, options = {}) => {
    const normalizedValue = normalizeChargeValue(input.value);

    if (!normalizedValue) {
        return {
            isValid: false,
            message: `Enter a ${label.toLowerCase()} value.`,
        };
    }

    const numericValue = Number(normalizedValue);

    if (!Number.isFinite(numericValue)) {
        return {
            isValid: false,
            message: `${label} must be a valid number.`,
        };
    }

    if (options.allowZero ? numericValue < 0 : numericValue <= 0) {
        return {
            isValid: false,
            message: options.allowZero
                ? `${label} cannot be negative.`
                : `${label} must be greater than zero.`,
        };
    }

    return {
        isValid: true,
        value: numericValue,
    };
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('charge-calculator-form');
    const capacitanceInput = document.getElementById('charge-capacitance-value');
    const capacitanceUnitSelect = document.getElementById('charge-capacitance-unit');
    const voltageInput = document.getElementById('charge-voltage-value');
    const clearButton = document.getElementById('clear-charge-calculator');
    const errorElement = document.getElementById('charge-calculator-error');
    const resultCard = document.getElementById('charge-result-card');
    const resultStateElement = document.getElementById('charge-result-state');
    const primaryResultElement = document.getElementById('charge-primary-result');
    const summaryElement = document.getElementById('charge-summary');
    const millicoulombsElement = document.getElementById('charge-result-millicoulombs');
    const microcoulombsElement = document.getElementById('charge-result-microcoulombs');
    const nanocoulombsElement = document.getElementById('charge-result-nanocoulombs');
    const breakdownElement = document.getElementById('charge-breakdown');
    const technicalDetailsElement = document.getElementById('charge-technical-details');
    const technicalOutputElement = document.getElementById('charge-technical-output');

    if (!form || !capacitanceInput || !capacitanceUnitSelect || !voltageInput || !clearButton || !errorElement || !resultCard || !resultStateElement || !primaryResultElement || !summaryElement || !millicoulombsElement || !microcoulombsElement || !nanocoulombsElement || !breakdownElement || !technicalDetailsElement || !technicalOutputElement) {
        return;
    }

    const clearError = () => {
        errorElement.textContent = '';
        capacitanceInput.removeAttribute('aria-invalid');
        voltageInput.removeAttribute('aria-invalid');
    };

    const clearResult = () => {
        resultCard.classList.remove('has-result');
        resultStateElement.textContent = 'Ready';
        primaryResultElement.textContent = '--';
        summaryElement.textContent = 'Enter capacitance and voltage to calculate charge.';
        millicoulombsElement.textContent = '--';
        microcoulombsElement.textContent = '--';
        nanocoulombsElement.textContent = '--';
        breakdownElement.textContent = 'Formula: Q = C × V.';
        technicalOutputElement.textContent = 'Raw values will appear after calculation.';
        technicalDetailsElement.open = false;
    };

    const resetCalculator = () => {
        capacitanceInput.value = '';
        capacitanceUnitSelect.value = 'uF';
        voltageInput.value = '';
        clearError();
        clearResult();
    };

    const showError = (input, message) => {
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
        clearResult();
        input.focus();
    };

    const getSupportedCapacitanceUnit = (unit) => (chargeCapacitanceUnits[unit] ? unit : 'uF');

    const calculateCharge = () => {
        clearError();

        const parsedCapacitance = parseChargeValue(capacitanceInput, 'Capacitance');

        if (!parsedCapacitance.isValid) {
            showError(capacitanceInput, parsedCapacitance.message);
            return;
        }

        const parsedVoltage = parseChargeValue(voltageInput, 'Voltage', {
            allowZero: true,
        });

        if (!parsedVoltage.isValid) {
            showError(voltageInput, parsedVoltage.message);
            return;
        }

        const capacitanceUnit = chargeCapacitanceUnits[capacitanceUnitSelect.value];
        const capacitanceFarads = parsedCapacitance.value * capacitanceUnit.factor;
        const voltage = parsedVoltage.value;
        const coulombs = capacitanceFarads * voltage;
        const millicoulombs = coulombs * 1e3;
        const microcoulombs = coulombs * 1e6;
        const nanocoulombs = coulombs * 1e9;
        const formattedCoulombs = formatChargeNumber(coulombs, 8);

        resultCard.classList.add('has-result');
        resultStateElement.textContent = 'Calculated';
        primaryResultElement.textContent = `${formattedCoulombs} C`;
        summaryElement.textContent = 'Calculated from capacitance and voltage.';
        millicoulombsElement.textContent = `${formatChargeNumber(millicoulombs, 6)} mC`;
        microcoulombsElement.textContent = `${formatChargeNumber(microcoulombs, 4)} µC`;
        nanocoulombsElement.textContent = `${formatChargeNumber(nanocoulombs, 2)} nC`;
        breakdownElement.textContent = `Q = C × V. Q = ${formatChargeNumber(capacitanceFarads, 8)} F × ${formatChargeNumber(voltage, 4)} V = ${formattedCoulombs} C.`;
        technicalOutputElement.textContent = `Capacitance: ${formatChargeNumber(capacitanceFarads, 8)} F · Voltage: ${formatChargeNumber(voltage, 4)} V · Raw charge: ${formattedCoulombs} C`;
        document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: {
                mode: 'charge-calculator',
                modeName: 'Charge Calculator',
                inputSummary: `${formatChargeNumber(parsedCapacitance.value, 4)} ${capacitanceUnit.label}, ${formatChargeNumber(voltage, 4)} V`,
                result: `${formattedCoulombs} C`,
                restoreData: {
                    capacitanceValue: capacitanceInput.value.trim(),
                    capacitanceUnit: capacitanceUnitSelect.value,
                    voltageValue: voltageInput.value.trim(),
                },
                timestamp: Date.now(),
            },
        }));
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateCharge();
    });

    [capacitanceInput, capacitanceUnitSelect, voltageInput].forEach((control) => {
        control.addEventListener('input', () => {
            clearError();
            clearResult();
        });
        control.addEventListener('change', () => {
            clearError();
            clearResult();
        });
    });

    clearButton.addEventListener('click', () => {
        resetCalculator();
        capacitanceInput.focus();
    });

    document.addEventListener('calculator:restore-history', (event) => {
        if (event.detail?.mode !== 'charge-calculator') {
            return;
        }

        const restoreData = event.detail.restoreData || {};
        capacitanceInput.value = String(restoreData.capacitanceValue ?? '');
        capacitanceUnitSelect.value = getSupportedCapacitanceUnit(restoreData.capacitanceUnit);
        voltageInput.value = String(restoreData.voltageValue ?? '');
        clearError();
        clearResult();
        capacitanceInput.focus();
    });
});
