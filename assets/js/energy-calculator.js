// Energy stored calculator script: calculates E = 1/2 * C * V^2.
//DO NOT MODIFY THIS CODE ANYMORE UNLESS YOU KNOW WHAT YOU ARE DOING!!! MAKE SURE YOU HAVE ENOUGH SLEEP BEFORE TOUCHING THIS CODE!!!!
// This is a critical part of the calculator's functionality.

const energyCapacitanceUnits = window.PracticalCalculatorUtils.units.capacitanceWithMilli;

const energyUnits = window.PracticalCalculatorUtils.units.energy;

const energyVoltageUnits = window.PracticalCalculatorUtils.units.voltage;

const normalizeEnergyValue = (value) => window.PracticalCalculatorUtils.normalizeNumericValue(value);

const formatEnergyNumber = (value, maximumFractionDigits = 8) => {
    return window.PracticalCalculatorUtils.formatPrecisionNumber(value, maximumFractionDigits);
};

const parseEnergyValue = (input, label, options = {}) => {
    const normalizedValue = normalizeEnergyValue(input.value);

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
    const form = document.getElementById('energy-stored-form');
    const capacitanceInput = document.getElementById('energy-capacitance-value');
    const capacitanceUnitSelect = document.getElementById('energy-capacitance-unit');
    const voltageInput = document.getElementById('energy-voltage-value');
    const clearButton = document.getElementById('clear-energy-stored');
    const errorElement = document.getElementById('energy-stored-error');
    const resultCard = document.getElementById('energy-result-card');
    const resultStateElement = document.getElementById('energy-result-state');
    const primaryResultElement = document.getElementById('energy-primary-result');
    const summaryElement = document.getElementById('energy-summary');
    const joulesElement = document.getElementById('energy-result-joules');
    const millijoulesElement = document.getElementById('energy-result-millijoules');
    const microjoulesElement = document.getElementById('energy-result-microjoules');
    const breakdownElement = document.getElementById('energy-breakdown');
    const technicalDetailsElement = document.getElementById('energy-technical-details');
    const technicalOutputElement = document.getElementById('energy-technical-output');

    if (!form || !capacitanceInput || !capacitanceUnitSelect || !voltageInput || !clearButton || !errorElement || !resultCard || !resultStateElement || !primaryResultElement || !summaryElement || !joulesElement || !millijoulesElement || !microjoulesElement || !breakdownElement || !technicalDetailsElement || !technicalOutputElement) {
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
        summaryElement.textContent = 'Enter capacitance and voltage to calculate stored energy.';
        joulesElement.textContent = '--';
        millijoulesElement.textContent = '--';
        microjoulesElement.textContent = '--';
        breakdownElement.textContent = 'Formula: E = 1/2 × C × V².';
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

    const getSupportedCapacitanceUnit = (unit) => (energyCapacitanceUnits[unit] ? unit : 'uF');

    const calculateEnergyStored = () => {
        clearError();

        const parsedCapacitance = parseEnergyValue(capacitanceInput, 'Capacitance');

        if (!parsedCapacitance.isValid) {
            showError(capacitanceInput, parsedCapacitance.message);
            return;
        }

        const parsedVoltage = parseEnergyValue(voltageInput, 'Voltage', {
            allowZero: true,
        });

        if (!parsedVoltage.isValid) {
            showError(voltageInput, parsedVoltage.message);
            return;
        }

        const capacitanceUnit = energyCapacitanceUnits[capacitanceUnitSelect.value];
        const capacitanceFarads = parsedCapacitance.value * capacitanceUnit.factor;
        const voltage = parsedVoltage.value;
        const joules = 0.5 * capacitanceFarads * (voltage ** 2);
        const millijoules = joules / energyUnits.mJ.factor;
        const microjoules = joules / energyUnits.uJ.factor;
        const formattedJoules = formatEnergyNumber(joules, 8);

        resultCard.classList.add('has-result');
        resultStateElement.textContent = 'Calculated';
        primaryResultElement.textContent = `${formattedJoules} ${energyUnits.J.label}`;
        summaryElement.textContent = 'Calculated from capacitance and voltage.';
        joulesElement.textContent = `${formattedJoules} ${energyUnits.J.label}`;
        millijoulesElement.textContent = `${formatEnergyNumber(millijoules, 6)} ${energyUnits.mJ.label}`;
        microjoulesElement.textContent = `${formatEnergyNumber(microjoules, 4)} ${energyUnits.uJ.label}`;
        breakdownElement.textContent = `E = 1/2 × C × V². E = 0.5 × ${formatEnergyNumber(capacitanceFarads, 8)} ${energyCapacitanceUnits.F.label} × ${formatEnergyNumber(voltage, 4)}² = ${formattedJoules} ${energyUnits.J.label}.`;
        technicalOutputElement.textContent = `Capacitance: ${formatEnergyNumber(capacitanceFarads, 8)} ${energyCapacitanceUnits.F.label} · Voltage: ${formatEnergyNumber(voltage, 4)} ${energyVoltageUnits.V.label} · Raw energy: ${formattedJoules} ${energyUnits.J.label}`;
        window.PracticalCalculatorUtils.dispatchHistoryEntry({
            mode: 'energy-stored',
            modeName: 'Energy Stored',
            inputSummary: `${formatEnergyNumber(parsedCapacitance.value, 4)} ${capacitanceUnit.label}, ${formatEnergyNumber(voltage, 4)} ${energyVoltageUnits.V.label}`,
            result: `${formattedJoules} ${energyUnits.J.label}`,
            restoreData: {
                capacitanceValue: capacitanceInput.value.trim(),
                capacitanceUnit: capacitanceUnitSelect.value,
                voltageValue: voltageInput.value.trim(),
            },
        });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateEnergyStored();
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
        if (event.detail?.mode !== 'energy-stored') {
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
