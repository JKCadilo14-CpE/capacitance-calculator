// Shared helpers for practical calculators.
// Keep this namespace small and explicit to avoid global script name collisions.

window.PracticalCalculatorUtils = (() => {
    const freezeUnitMap = (unitMap) => Object.freeze(
        Object.fromEntries(
            Object.entries(unitMap).map(([key, unit]) => [key, Object.freeze({ ...unit })]),
        ),
    );

    const units = Object.freeze({
        capacitance: freezeUnitMap({
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
        }),
        capacitanceWithMilli: freezeUnitMap({
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
        }),
        capacitanceFromPicofarads: freezeUnitMap({
            pF: {
                label: 'pF',
                factor: 1,
            },
            nF: {
                label: 'nF',
                factor: 1e3,
            },
            uF: {
                label: 'µF',
                factor: 1e6,
            },
            F: {
                label: 'F',
                factor: 1e12,
            },
        }),
        resistance: freezeUnitMap({
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
        }),
        voltage: freezeUnitMap({
            V: {
                label: 'V',
                factor: 1,
            },
        }),
        charge: freezeUnitMap({
            C: {
                label: 'C',
                factor: 1,
            },
            mC: {
                label: 'mC',
                factor: 1e-3,
            },
            uC: {
                label: 'µC',
                factor: 1e-6,
            },
            nC: {
                label: 'nC',
                factor: 1e-9,
            },
        }),
        energy: freezeUnitMap({
            J: {
                label: 'J',
                factor: 1,
            },
            mJ: {
                label: 'mJ',
                factor: 1e-3,
            },
            uJ: {
                label: 'µJ',
                factor: 1e-6,
            },
        }),
        time: freezeUnitMap({
            s: {
                label: 's',
                factor: 1,
            },
            ms: {
                label: 'ms',
                factor: 1e-3,
            },
            us: {
                label: 'µs',
                factor: 1e-6,
            },
        }),
    });

    const formatExponential = (value) => value.toExponential(4).replace(/\.?0+e/, 'e');

    const normalizeNumericValue = (value) => value.trim().replace(/,/g, '');

    const formatRoundedNumber = (value) => {
        if (value === 0 || Object.is(value, -0)) {
            return '0';
        }

        const absoluteValue = Math.abs(value);
        const maximumFractionDigits = absoluteValue >= 1 ? 2 : 4;
        const roundedValue = Number(value.toFixed(maximumFractionDigits));

        if (roundedValue === 0 || absoluteValue >= 1e12) {
            return formatExponential(value);
        }

        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits,
        }).format(roundedValue);
    };

    const formatPrecisionNumber = (value, maximumFractionDigits) => {
        if (value === 0 || Object.is(value, -0)) {
            return '0';
        }

        const absoluteValue = Math.abs(value);

        if (absoluteValue !== 0 && absoluteValue < 0.000001) {
            return formatExponential(value);
        }

        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits,
        }).format(value);
    };

    const formatIntegerNumber = (value) => new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
    }).format(value);

    const formatDecodedNumber = (value, options = {}) => {
        if (value === 0 || Object.is(value, -0)) {
            return '0';
        }

        if (options.forceInteger) {
            return formatIntegerNumber(value);
        }

        const absoluteValue = Math.abs(value);
        return formatPrecisionNumber(value, absoluteValue >= 1 ? 4 : 8);
    };

    const createHistoryEntry = ({
        mode,
        modeName,
        inputSummary,
        result,
        restoreData,
    }) => ({
        mode,
        modeName,
        inputSummary,
        result,
        restoreData,
        timestamp: Date.now(),
    });

    const dispatchHistoryEntry = (entry) => {
        document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: createHistoryEntry(entry),
        }));
    };

    const parseNumericInputValue = (input, label, options = {}) => {
        const normalizedValue = normalizeNumericValue(input.value);

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

    const clearInputErrorState = (errorElement, inputs) => {
        errorElement.textContent = '';
        inputs.forEach((input) => {
            input.removeAttribute('aria-invalid');
        });
    };

    const clearResultState = ({
        resultCard,
        resultStateElement,
        primaryResultElement,
        summaryElement,
        outputElements,
        breakdownElement,
        technicalOutputElement,
        technicalDetailsElement,
        summaryText,
        breakdownText,
        technicalText,
    }) => {
        resultCard.classList.remove('has-result');
        resultStateElement.textContent = 'Ready';
        primaryResultElement.textContent = '--';
        summaryElement.textContent = summaryText;
        outputElements.forEach((outputElement) => {
            outputElement.textContent = '--';
        });
        breakdownElement.textContent = breakdownText;
        technicalOutputElement.textContent = technicalText;
        technicalDetailsElement.open = false;
    };

    const resetCapacitanceVoltageFields = ({
        capacitanceInput,
        capacitanceUnitSelect,
        voltageInput,
        clearError,
        clearResult,
    }) => {
        capacitanceInput.value = '';
        capacitanceUnitSelect.value = 'uF';
        voltageInput.value = '';
        clearError();
        clearResult();
    };

    const showInputError = ({
        input,
        errorElement,
        message,
        clearResult,
    }) => {
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
        clearResult();
        input.focus();
    };

    const getSupportedUnitKey = (unitMap, unit, fallbackUnit) => (unitMap[unit] ? unit : fallbackUnit);

    const bindResultResetListeners = (controls, resetResultState) => {
        controls.forEach((control) => {
            control.addEventListener('input', resetResultState);
            control.addEventListener('change', resetResultState);
        });
    };

    return Object.freeze({
        bindResultResetListeners,
        clearInputErrorState,
        clearResultState,
        dispatchHistoryEntry,
        formatDecodedNumber,
        formatPrecisionNumber,
        formatRoundedNumber,
        getSupportedUnitKey,
        normalizeNumericValue,
        parseNumericInputValue,
        resetCapacitanceVoltageFields,
        showInputError,
        units,
    });
})();
