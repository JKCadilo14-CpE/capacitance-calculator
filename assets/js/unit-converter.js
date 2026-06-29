// Unit converter script: converts capacitance values between pF, nF, µF, and F.
// DO NO TOUCH ANYMORE UNLESS YOU KNOW WHAT YOU ARE DOING!!! MAKE SURE YOU HAVE ENOUGH SLEEP BEDORE TOUCHING THIS CODE!!!!
// This is a critical part of the calculator's functionality.

const capacitanceUnits = window.PracticalCalculatorUtils.units.capacitance;

const formatNumber = (value) => {
    return window.PracticalCalculatorUtils.formatRoundedNumber(value);
};

const normalizeValue = (value) => window.PracticalCalculatorUtils.normalizeNumericValue(value);

const parseCapacitanceValue = (rawValue) => {
    const normalizedValue = normalizeValue(rawValue);

    if (!normalizedValue) {
        return {
            isValid: false,
            message: 'Enter a capacitance value before converting.',
        };
    }

    const numericValue = Number(normalizedValue);

    if (!Number.isFinite(numericValue)) {
        return {
            isValid: false,
            message: 'Enter a valid numeric capacitance value.',
        };
    }

    if (numericValue < 0) {
        return {
            isValid: false,
            message: 'Enter zero or a positive capacitance value.',
        };
    }

    return {
        isValid: true,
        value: numericValue,
    };
};

const convertCapacitance = (value, fromUnit, toUnit) => {
    const valueInFarads = value * capacitanceUnits[fromUnit].factor;
    return valueInFarads / capacitanceUnits[toUnit].factor;
};

const setError = (displayElement, errorElement, message) => {
    displayElement.setAttribute('aria-invalid', 'true');
    errorElement.textContent = message;
};

const clearError = (displayElement, errorElement) => {
    displayElement.removeAttribute('aria-invalid');
    errorElement.textContent = '';
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('unit-converter-form');
    const displayScreen = form?.querySelector('.calculator-display');
    const inputDisplay = document.getElementById('calculator-input-display');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const swapButton = document.getElementById('swap-units');
    const errorElement = document.getElementById('value-error');
    const resultElement = document.getElementById('converter-result');
    const summaryElement = document.getElementById('converter-summary');
    const keypad = form?.querySelector('.calculator-keypad');
    const converterPanel = form?.closest('[data-mode-panel]');

    if (!form || !displayScreen || !inputDisplay || !fromUnitSelect || !toUnitSelect || !swapButton || !errorElement || !resultElement || !summaryElement || !keypad) {
        return;
    }

    let inputValue = '0';

    const renderInput = () => {
        inputDisplay.textContent = inputValue;
    };

    const resetResult = () => {
        form.classList.remove('has-result');
        resultElement.textContent = '--';
        summaryElement.textContent = 'Waiting for input.';
    };

    const resetCalculator = () => {
        inputValue = '0';
        renderInput();
        clearError(displayScreen, errorElement);
        resetResult();
    };

    const appendDigit = (digit) => {
        inputValue = inputValue === '0' ? digit : `${inputValue}${digit}`;
        clearError(displayScreen, errorElement);
        resetResult();
        renderInput();
    };

    const appendDecimal = () => {
        if (inputValue.includes('.')) {
            return;
        }

        inputValue = `${inputValue}.`;
        clearError(displayScreen, errorElement);
        resetResult();
        renderInput();
    };

    const backspaceInput = () => {
        inputValue = inputValue.length > 1 ? inputValue.slice(0, -1) : '0';
        clearError(displayScreen, errorElement);
        resetResult();
        renderInput();
    };

    const handleConversion = () => {
        const parsedValue = parseCapacitanceValue(inputValue);

        if (!parsedValue.isValid) {
            setError(displayScreen, errorElement, parsedValue.message);
            resetResult();
            return;
        }

        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        const convertedValue = convertCapacitance(parsedValue.value, fromUnit, toUnit);
        const formattedInput = formatNumber(parsedValue.value);
        const formattedResult = formatNumber(convertedValue);

        clearError(displayScreen, errorElement);
        form.classList.add('has-result');
        resultElement.textContent = `${formattedResult} ${capacitanceUnits[toUnit].label}`;
        summaryElement.textContent = `${formattedInput} ${capacitanceUnits[fromUnit].label} equals ${formattedResult} ${capacitanceUnits[toUnit].label}.`;
        document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: {
                mode: 'unit-converter',
                modeName: 'Unit Converter',
                inputSummary: `${formattedInput} ${capacitanceUnits[fromUnit].label}`,
                result: `${formattedResult} ${capacitanceUnits[toUnit].label}`,
                restoreData: {
                    value: inputValue,
                    fromUnit,
                    toUnit,
                },
                timestamp: Date.now(),
            },
        }));
    };

    const swapUnits = () => {
        const currentFromUnit = fromUnitSelect.value;
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = currentFromUnit;
        clearError(displayScreen, errorElement);
        resetResult();
    };

    const handleAction = (action) => {
        if (action === 'decimal') {
            appendDecimal();
        }

        if (action === 'backspace') {
            backspaceInput();
        }

        if (action === 'clear') {
            resetCalculator();
        }

        if (action === 'convert') {
            handleConversion();
        }
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        handleConversion();
    });

    keypad.addEventListener('click', (event) => {
        const key = event.target.closest('button');

        if (!key) {
            return;
        }

        const digit = key.dataset.value;
        const action = key.dataset.action;

        if (digit) {
            appendDigit(digit);
            return;
        }

        if (action) {
            handleAction(action);
        }
    });

    [fromUnitSelect, toUnitSelect].forEach((control) => {
        control.addEventListener('change', () => {
            clearError(displayScreen, errorElement);
            resetResult();
        });
    });

    swapButton.addEventListener('click', swapUnits);

    document.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement;
        const activeTag = activeElement?.tagName;

        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        if (converterPanel?.hidden) {
            return;
        }

        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
            return;
        }

        if (activeTag === 'BUTTON' && (event.key === 'Enter' || event.key === ' ')) {
            return;
        }

        if (/^\d$/.test(event.key)) {
            event.preventDefault();
            appendDigit(event.key);
            return;
        }

        if (event.key === '.') {
            event.preventDefault();
            appendDecimal();
            return;
        }

        if (event.key === 'Backspace') {
            event.preventDefault();
            backspaceInput();
            return;
        }

        if (event.key === 'Delete' || event.key === 'Escape' || event.key.toLowerCase() === 'c') {
            event.preventDefault();
            resetCalculator();
            return;
        }

        if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            handleConversion();
        }
    });

    document.addEventListener('calculator:restore-history', (event) => {
        if (event.detail?.mode !== 'unit-converter') {
            return;
        }

        const restoreData = event.detail.restoreData || {};
        inputValue = String(restoreData.value ?? '0') || '0';
        fromUnitSelect.value = capacitanceUnits[restoreData.fromUnit] ? restoreData.fromUnit : 'pF';
        toUnitSelect.value = capacitanceUnits[restoreData.toUnit] ? restoreData.toUnit : 'nF';
        renderInput();
        clearError(displayScreen, errorElement);
        resetResult();
        form.focus?.();
    });

    renderInput();
});
