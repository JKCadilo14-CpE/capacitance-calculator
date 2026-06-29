// Capacitor code decoder script: decodes standard 3-digit capacitor codes.
// DO NO TOUCH ANYMORE UNLESS YOU KNOW WHAT YOU ARE DOING!!! MAKE SURE YOU HAVE ENOUGH SLEEP BEDORE TOUCHING THIS CODE!!!!
// This is a critical part of the calculator's functionality.

const codeDecoderUnits = window.PracticalCalculatorUtils.units.capacitanceFromPicofarads;

const formatDecodedValue = (value, options = {}) => {
    return window.PracticalCalculatorUtils.formatDecodedNumber(value, options);
};

const getReadableDecodedUnit = (valueInPf) => {
    if (valueInPf >= codeDecoderUnits.uF.factor) {
        return 'uF';
    }

    if (valueInPf >= codeDecoderUnits.nF.factor) {
        return 'nF';
    }

    return 'pF';
};

const parseCapacitorCode = (rawCode) => {
    const code = rawCode.trim();

    if (!code) {
        return {
            isValid: false,
            message: 'Enter a 3-digit capacitor code before decoding.',
        };
    }

    if (!/^\d+$/.test(code)) {
        return {
            isValid: false,
            message: 'Use digits only. Standard capacitor codes look like 104 or 472.',
        };
    }

    if (!/^\d{3}$/.test(code)) {
        return {
            isValid: false,
            message: 'Enter exactly three digits.',
        };
    }

    const significantFigures = Number(code.slice(0, 2));
    const multiplier = Number(code.slice(2));
    const valueInPf = significantFigures * (10 ** multiplier);

    if (valueInPf === 0) {
        return {
            isValid: false,
            message: 'Enter a code with nonzero significant figures.',
        };
    }

    return {
        isValid: true,
        code,
        significantFigures,
        multiplier,
        valueInPf,
    };
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('code-decoder-form');
    const input = document.getElementById('capacitor-code');
    const clearButton = document.getElementById('clear-code-decoder');
    const errorElement = document.getElementById('code-decoder-error');
    const resultCard = document.getElementById('code-decoder-result-card');
    const stateElement = document.getElementById('code-decoder-state');
    const primaryResultElement = document.getElementById('code-decoder-primary-result');
    const summaryElement = document.getElementById('code-decoder-summary');
    const breakdownElement = document.getElementById('code-decoder-breakdown');
    const resultElements = {
        pF: document.getElementById('code-result-pf'),
        nF: document.getElementById('code-result-nf'),
        uF: document.getElementById('code-result-uf'),
        F: document.getElementById('code-result-f'),
    };
    const exampleButtons = Array.from(document.querySelectorAll('.code-example'));

    if (!form || !input || !clearButton || !errorElement || !resultCard || !stateElement || !primaryResultElement || !summaryElement || !breakdownElement || Object.values(resultElements).some((element) => !element)) {
        return;
    }

    const clearError = () => {
        window.PracticalCalculatorUtils.clearInputErrorState(errorElement, [input]);
    };

    const resetResultCard = (summaryText, breakdownText) => {
        window.PracticalCalculatorUtils.clearResultState({
            resultCard,
            resultStateElement: stateElement,
            primaryResultElement,
            summaryElement,
            outputElements: Object.values(resultElements),
            breakdownElement,
            summaryText,
            breakdownText,
        });
    };

    const clearDecodedResult = () => {
        clearError();
        resetResultCard(
            'Enter a 3-digit code to decode its capacitance.',
            'Example: 104 means 10 × 10^4 pF.',
        );
    };

    const resetDecoder = () => {
        input.value = '';
        clearDecodedResult();
    };

    const showError = (message) => {
        window.PracticalCalculatorUtils.showInputError({
            input,
            errorElement,
            message,
            clearResult: () => {
                resetResultCard(
                    'Fix the code and try again.',
                    'Use exactly three digits: first two significant figures, third digit multiplier.',
                );
            },
        });
    };

    const decodeCode = () => {
        const parsedCode = parseCapacitorCode(input.value);

        if (!parsedCode.isValid) {
            showError(parsedCode.message);
            return;
        }

        const values = {
            pF: parsedCode.valueInPf,
            nF: parsedCode.valueInPf / codeDecoderUnits.nF.factor,
            uF: parsedCode.valueInPf / codeDecoderUnits.uF.factor,
            F: parsedCode.valueInPf / codeDecoderUnits.F.factor,
        };
        const readableUnit = getReadableDecodedUnit(parsedCode.valueInPf);
        const readableValue = parsedCode.valueInPf / codeDecoderUnits[readableUnit].factor;

        clearError();
        resultCard.classList.add('has-result');
        stateElement.textContent = 'Decoded';
        primaryResultElement.textContent = `${formatDecodedValue(readableValue)} ${codeDecoderUnits[readableUnit].label}`;
        summaryElement.textContent = `Decoded from code ${parsedCode.code}.`;
        resultElements.pF.textContent = `${formatDecodedValue(values.pF, { forceInteger: true })} pF`;
        resultElements.nF.textContent = `${formatDecodedValue(values.nF)} nF`;
        resultElements.uF.textContent = `${formatDecodedValue(values.uF)} µF`;
        resultElements.F.textContent = `${formatDecodedValue(values.F)} F`;
        breakdownElement.textContent = `${parsedCode.code}: ${parsedCode.significantFigures} × 10^${parsedCode.multiplier} pF = ${formatDecodedValue(parsedCode.valueInPf, { forceInteger: true })} pF.`;
        window.PracticalCalculatorUtils.dispatchHistoryEntry({
            mode: 'code-decoder',
            modeName: 'Code Decoder',
            inputSummary: parsedCode.code,
            result: `${formatDecodedValue(readableValue)} ${codeDecoderUnits[readableUnit].label}`,
            restoreData: {
                code: parsedCode.code,
            },
        });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        decodeCode();
    });

    input.addEventListener('input', () => {
        clearError();
        resultCard.classList.remove('has-result');
        stateElement.textContent = 'Ready';
    });

    clearButton.addEventListener('click', () => {
        resetDecoder();
        input.focus();
    });

    exampleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            input.value = button.dataset.code;
            decodeCode();
        });
    });

    document.addEventListener('calculator:restore-history', (event) => {
        if (event.detail?.mode !== 'code-decoder') {
            return;
        }

        input.value = String(event.detail.restoreData?.code ?? '').slice(0, 3);
        clearDecodedResult();
        input.focus();
    });
});
