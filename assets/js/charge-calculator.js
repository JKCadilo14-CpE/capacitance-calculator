// Charge calculator script: calculates Q = C * V.
// DO NO TOUCH ANYMORE UNLESS YOU KNOW WHAT YOU ARE DOING!!! MAKE SURE YOU HAVE ENOUGH SLEEP BEDORE TOUCHING THIS CODE!!!!
// This is a critical part of the calculator's functionality.

const chargeCapacitanceUnits = window.PracticalCalculatorUtils.units.capacitanceWithMilli;

const chargeUnits = window.PracticalCalculatorUtils.units.charge;

const chargeVoltageUnits = window.PracticalCalculatorUtils.units.voltage;

const formatChargeNumber = (value, maximumFractionDigits = 8) => {
    return window.PracticalCalculatorUtils.formatPrecisionNumber(value, maximumFractionDigits);
};

const parseChargeValue = (input, label, options = {}) => {
    return window.PracticalCalculatorUtils.parseNumericInputValue(input, label, options);
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
        window.PracticalCalculatorUtils.clearInputErrorState(errorElement, [
            capacitanceInput,
            voltageInput,
        ]);
    };

    const clearResult = () => {
        window.PracticalCalculatorUtils.clearResultState({
            resultCard,
            resultStateElement,
            primaryResultElement,
            summaryElement,
            outputElements: [
                millicoulombsElement,
                microcoulombsElement,
                nanocoulombsElement,
            ],
            breakdownElement,
            technicalOutputElement,
            technicalDetailsElement,
            summaryText: 'Enter capacitance and voltage to calculate charge.',
            breakdownText: 'Formula: Q = C × V.',
            technicalText: 'Raw values will appear after calculation.',
        });
    };

    const resetCalculator = () => {
        window.PracticalCalculatorUtils.resetCapacitanceVoltageFields({
            capacitanceInput,
            capacitanceUnitSelect,
            voltageInput,
            clearError,
            clearResult,
        });
    };

    const showError = (input, message) => {
        window.PracticalCalculatorUtils.showInputError({
            input,
            errorElement,
            message,
            clearResult,
        });
    };

    const getSupportedCapacitanceUnit = (unit) => {
        return window.PracticalCalculatorUtils.getSupportedUnitKey(chargeCapacitanceUnits, unit, 'uF');
    };

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
        const millicoulombs = coulombs / chargeUnits.mC.factor;
        const microcoulombs = coulombs / chargeUnits.uC.factor;
        const nanocoulombs = coulombs / chargeUnits.nC.factor;
        const formattedCoulombs = formatChargeNumber(coulombs, 8);

        resultCard.classList.add('has-result');
        resultStateElement.textContent = 'Calculated';
        primaryResultElement.textContent = `${formattedCoulombs} ${chargeUnits.C.label}`;
        summaryElement.textContent = 'Calculated from capacitance and voltage.';
        millicoulombsElement.textContent = `${formatChargeNumber(millicoulombs, 6)} ${chargeUnits.mC.label}`;
        microcoulombsElement.textContent = `${formatChargeNumber(microcoulombs, 4)} ${chargeUnits.uC.label}`;
        nanocoulombsElement.textContent = `${formatChargeNumber(nanocoulombs, 2)} ${chargeUnits.nC.label}`;
        breakdownElement.textContent = `Q = C × V. Q = ${formatChargeNumber(capacitanceFarads, 8)} ${chargeCapacitanceUnits.F.label} × ${formatChargeNumber(voltage, 4)} ${chargeVoltageUnits.V.label} = ${formattedCoulombs} ${chargeUnits.C.label}.`;
        technicalOutputElement.textContent = `Capacitance: ${formatChargeNumber(capacitanceFarads, 8)} ${chargeCapacitanceUnits.F.label} · Voltage: ${formatChargeNumber(voltage, 4)} ${chargeVoltageUnits.V.label} · Raw charge: ${formattedCoulombs} ${chargeUnits.C.label}`;
        window.PracticalCalculatorUtils.dispatchHistoryEntry({
            mode: 'charge-calculator',
            modeName: 'Charge Calculator',
            inputSummary: `${formatChargeNumber(parsedCapacitance.value, 4)} ${capacitanceUnit.label}, ${formatChargeNumber(voltage, 4)} ${chargeVoltageUnits.V.label}`,
            result: `${formattedCoulombs} ${chargeUnits.C.label}`,
            restoreData: {
                capacitanceValue: capacitanceInput.value.trim(),
                capacitanceUnit: capacitanceUnitSelect.value,
                voltageValue: voltageInput.value.trim(),
            },
        });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateCharge();
    });

    window.PracticalCalculatorUtils.bindResultResetListeners([
        capacitanceInput,
        capacitanceUnitSelect,
        voltageInput,
    ], () => {
        clearError();
        clearResult();
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
