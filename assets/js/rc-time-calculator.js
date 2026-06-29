// RC time calculator script: calculates the time constant tau = R * C.
// DO NO TOUCH ANYMORE UNLESS YOU KNOW WHAT YOU ARE DOING!!! MAKE SURE YOU HAVE ENOUGH SLEEP BEDORE TOUCHING THIS CODE!!!!
// This is a critical part of the calculator's functionality.

const resistanceUnits = window.PracticalCalculatorUtils.units.resistance;

const rcCapacitanceUnits = window.PracticalCalculatorUtils.units.capacitance;

const timeUnits = window.PracticalCalculatorUtils.units.time;

const formatRcNumber = (value, maximumFractionDigits = 6) => {
    return window.PracticalCalculatorUtils.formatPrecisionNumber(value, maximumFractionDigits);
};

const getReadableTime = (seconds) => {
    if (seconds >= 1) {
        return {
            value: seconds,
            unit: timeUnits.s.label,
        };
    }

    if (seconds >= 0.001) {
        return {
            value: seconds / timeUnits.ms.factor,
            unit: timeUnits.ms.label,
        };
    }

    if (seconds >= 0.000001) {
        return {
            value: seconds / timeUnits.us.factor,
            unit: timeUnits.us.label,
        };
    }

    return {
        value: seconds,
        unit: timeUnits.s.label,
    };
};

const parsePositiveRcValue = (input, label) => {
    return window.PracticalCalculatorUtils.parseNumericInputValue(input, label);
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rc-time-form');
    const resistanceInput = document.getElementById('resistance-value');
    const resistanceUnitSelect = document.getElementById('resistance-unit');
    const capacitanceInput = document.getElementById('rc-capacitance-value');
    const capacitanceUnitSelect = document.getElementById('rc-capacitance-unit');
    const clearButton = document.getElementById('clear-rc-time');
    const errorElement = document.getElementById('rc-time-error');
    const resultCard = document.getElementById('rc-result-card');
    const resultStateElement = document.getElementById('rc-result-state');
    const primaryResultElement = document.getElementById('rc-primary-result');
    const summaryElement = document.getElementById('rc-summary');
    const secondsElement = document.getElementById('rc-result-seconds');
    const millisecondsElement = document.getElementById('rc-result-milliseconds');
    const microsecondsElement = document.getElementById('rc-result-microseconds');
    const breakdownElement = document.getElementById('rc-breakdown');

    if (!form || !resistanceInput || !resistanceUnitSelect || !capacitanceInput || !capacitanceUnitSelect || !clearButton || !errorElement || !resultCard || !resultStateElement || !primaryResultElement || !summaryElement || !secondsElement || !millisecondsElement || !microsecondsElement || !breakdownElement) {
        return;
    }

    const clearError = () => {
        window.PracticalCalculatorUtils.clearInputErrorState(errorElement, [
            resistanceInput,
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
                secondsElement,
                millisecondsElement,
                microsecondsElement,
            ],
            breakdownElement,
            summaryText: 'Enter resistance and capacitance to calculate τ.',
            breakdownText: 'Formula: τ = R × C.',
        });
    };

    const resetCalculator = () => {
        resistanceInput.value = '';
        resistanceUnitSelect.value = 'kohm';
        capacitanceInput.value = '';
        capacitanceUnitSelect.value = 'uF';
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

    const calculateRcTime = () => {
        clearError();

        const parsedResistance = parsePositiveRcValue(resistanceInput, 'Resistance');

        if (!parsedResistance.isValid) {
            showError(resistanceInput, parsedResistance.message);
            return;
        }

        const parsedCapacitance = parsePositiveRcValue(capacitanceInput, 'Capacitance');

        if (!parsedCapacitance.isValid) {
            showError(capacitanceInput, parsedCapacitance.message);
            return;
        }

        const resistanceUnit = resistanceUnits[resistanceUnitSelect.value];
        const capacitanceUnit = rcCapacitanceUnits[capacitanceUnitSelect.value];
        const resistanceOhms = parsedResistance.value * resistanceUnit.factor;
        const capacitanceFarads = parsedCapacitance.value * capacitanceUnit.factor;
        const seconds = resistanceOhms * capacitanceFarads;
        const milliseconds = seconds / timeUnits.ms.factor;
        const microseconds = seconds / timeUnits.us.factor;
        const readableTime = getReadableTime(seconds);

        resultCard.classList.add('has-result');
        resultStateElement.textContent = 'Calculated';
        primaryResultElement.textContent = `${formatRcNumber(readableTime.value)} ${readableTime.unit}`;
        summaryElement.textContent = 'Calculated from resistance and capacitance.';
        secondsElement.textContent = `${formatRcNumber(seconds, 8)} ${timeUnits.s.label}`;
        millisecondsElement.textContent = `${formatRcNumber(milliseconds, 4)} ${timeUnits.ms.label}`;
        microsecondsElement.textContent = `${formatRcNumber(microseconds, 2)} ${timeUnits.us.label}`;
        breakdownElement.textContent = `τ = R × C. τ = ${formatRcNumber(resistanceOhms, 2)} ${resistanceUnits.ohm.label} × ${formatRcNumber(capacitanceFarads, 8)} ${rcCapacitanceUnits.F.label} = ${formatRcNumber(seconds, 8)} ${timeUnits.s.label}.`;
        window.PracticalCalculatorUtils.dispatchHistoryEntry({
            mode: 'rc-time',
            modeName: 'RC Time',
            inputSummary: `${formatRcNumber(parsedResistance.value, 2)} ${resistanceUnit.label} × ${formatRcNumber(parsedCapacitance.value, 4)} ${capacitanceUnit.label}`,
            result: `${formatRcNumber(readableTime.value)} ${readableTime.unit}`,
            restoreData: {
                resistanceValue: resistanceInput.value.trim(),
                resistanceUnit: resistanceUnitSelect.value,
                capacitanceValue: capacitanceInput.value.trim(),
                capacitanceUnit: capacitanceUnitSelect.value,
            },
        });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateRcTime();
    });

    window.PracticalCalculatorUtils.bindResultResetListeners([
        resistanceInput,
        capacitanceInput,
        resistanceUnitSelect,
        capacitanceUnitSelect,
    ], () => {
        clearError();
        clearResult();
    });

    clearButton.addEventListener('click', () => {
        resetCalculator();
        resistanceInput.focus();
    });

    document.addEventListener('calculator:restore-history', (event) => {
        if (event.detail?.mode !== 'rc-time') {
            return;
        }

        const restoreData = event.detail.restoreData || {};
        resistanceInput.value = String(restoreData.resistanceValue ?? '');
        resistanceUnitSelect.value = window.PracticalCalculatorUtils.getSupportedUnitKey(resistanceUnits, restoreData.resistanceUnit, 'kohm');
        capacitanceInput.value = String(restoreData.capacitanceValue ?? '');
        capacitanceUnitSelect.value = window.PracticalCalculatorUtils.getSupportedUnitKey(rcCapacitanceUnits, restoreData.capacitanceUnit, 'uF');
        clearError();
        clearResult();
        resistanceInput.focus();
    });
});
