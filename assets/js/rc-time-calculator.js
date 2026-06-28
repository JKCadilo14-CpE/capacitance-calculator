// RC time calculator script: calculates the time constant tau = R * C.
// DO NO TOUCH ANYMORE UNLESS YOU KNOW WHAT YOU ARE DOING!!! MAKE SURE YOU HAVE ENOUGH SLEEP BEDORE TOUCHING THIS CODE!!!!
// This is a critical part of the calculator's functionality.

const resistanceUnits = {
    ohm: {
        label: 'Ω',
        factor: 1,
    },
    kohm: {
        label: 'kΩ',
        factor: 1e3,
    },
    mohm: {
        label: 'MΩ',
        factor: 1e6,
    },
};

const rcCapacitanceUnits = {
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
    F: {
        label: 'F',
        factor: 1,
    },
};

const normalizeRcValue = (value) => value.trim().replace(/,/g, '');

const formatRcNumber = (value, maximumFractionDigits = 6) => {
    if (value === 0 || Object.is(value, -0)) {
        return '0';
    }

    const absoluteValue = Math.abs(value);

    if (absoluteValue !== 0 && absoluteValue < 0.000001) {
        return value.toExponential(4).replace(/\.?0+e/, 'e');
    }

    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits,
    }).format(value);
};

const getReadableTime = (seconds) => {
    if (seconds >= 1) {
        return {
            value: seconds,
            unit: 's',
        };
    }

    if (seconds >= 0.001) {
        return {
            value: seconds * 1e3,
            unit: 'ms',
        };
    }

    if (seconds >= 0.000001) {
        return {
            value: seconds * 1e6,
            unit: 'µs',
        };
    }

    return {
        value: seconds,
        unit: 's',
    };
};

const parsePositiveRcValue = (input, label) => {
    const normalizedValue = normalizeRcValue(input.value);

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

    if (numericValue <= 0) {
        return {
            isValid: false,
            message: `${label} must be greater than zero.`,
        };
    }

    return {
        isValid: true,
        value: numericValue,
    };
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
        errorElement.textContent = '';
        resistanceInput.removeAttribute('aria-invalid');
        capacitanceInput.removeAttribute('aria-invalid');
    };

    const clearResult = () => {
        resultCard.classList.remove('has-result');
        resultStateElement.textContent = 'Ready';
        primaryResultElement.textContent = '--';
        summaryElement.textContent = 'Enter resistance and capacitance to calculate τ.';
        secondsElement.textContent = '--';
        millisecondsElement.textContent = '--';
        microsecondsElement.textContent = '--';
        breakdownElement.textContent = 'Formula: τ = R × C.';
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
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
        clearResult();
        input.focus();
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
        const milliseconds = seconds * 1e3;
        const microseconds = seconds * 1e6;
        const readableTime = getReadableTime(seconds);

        resultCard.classList.add('has-result');
        resultStateElement.textContent = 'Calculated';
        primaryResultElement.textContent = `${formatRcNumber(readableTime.value)} ${readableTime.unit}`;
        summaryElement.textContent = 'Calculated from resistance and capacitance.';
        secondsElement.textContent = `${formatRcNumber(seconds, 8)} s`;
        millisecondsElement.textContent = `${formatRcNumber(milliseconds, 4)} ms`;
        microsecondsElement.textContent = `${formatRcNumber(microseconds, 2)} µs`;
        breakdownElement.textContent = `τ = R × C. τ = ${formatRcNumber(resistanceOhms, 2)} Ω × ${formatRcNumber(capacitanceFarads, 8)} F = ${formatRcNumber(seconds, 8)} s.`;
        document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: {
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
                timestamp: Date.now(),
            },
        }));
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateRcTime();
    });

    [resistanceInput, capacitanceInput, resistanceUnitSelect, capacitanceUnitSelect].forEach((control) => {
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
        resistanceInput.focus();
    });

    document.addEventListener('calculator:restore-history', (event) => {
        if (event.detail?.mode !== 'rc-time') {
            return;
        }

        const restoreData = event.detail.restoreData || {};
        resistanceInput.value = String(restoreData.resistanceValue ?? '');
        resistanceUnitSelect.value = resistanceUnits[restoreData.resistanceUnit] ? restoreData.resistanceUnit : 'kohm';
        capacitanceInput.value = String(restoreData.capacitanceValue ?? '');
        capacitanceUnitSelect.value = rcCapacitanceUnits[restoreData.capacitanceUnit] ? restoreData.capacitanceUnit : 'uF';
        clearError();
        clearResult();
        resistanceInput.focus();
    });
});
