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

export const initCylindricalCalculator = () => {
    const cylindricalForm = document.getElementById('cylindrical-form');
    const innerRadiusInput = document.getElementById('cylindrical-inner-radius');
    const innerRadiusUnitSelect = document.getElementById('cylindrical-inner-radius-unit');
    const outerRadiusInput = document.getElementById('cylindrical-outer-radius');
    const outerRadiusUnitSelect = document.getElementById('cylindrical-outer-radius-unit');
    const lengthInput = document.getElementById('cylindrical-length');
    const lengthUnitSelect = document.getElementById('cylindrical-length-unit');
    const relativePermittivityInput = document.getElementById('cylindrical-relative-permittivity');
    const clearButton = document.getElementById('clear-cylindrical-calculator');
    const errorElement = document.getElementById('cylindrical-error');
    const resultCard = document.getElementById('cylindrical-result-card');
    const resultStateElement = document.getElementById('cylindrical-result-state');
    const primaryResultElement = document.getElementById('cylindrical-primary-result');
    const summaryElement = document.getElementById('cylindrical-summary');
    const resultElements = {
        pF: document.getElementById('cylindrical-result-pf'),
        nF: document.getElementById('cylindrical-result-nf'),
        uF: document.getElementById('cylindrical-result-uf'),
        F: document.getElementById('cylindrical-result-f'),
    };
    const breakdownElement = document.getElementById('cylindrical-breakdown');
    const technicalOutputElement = document.getElementById('cylindrical-technical-output');
    const copyButton = document.getElementById('copy-cylindrical-result');
    const copyStatusElement = document.getElementById('cylindrical-copy-status');

    if (!cylindricalForm || !innerRadiusInput || !innerRadiusUnitSelect || !outerRadiusInput || !outerRadiusUnitSelect || !lengthInput || !lengthUnitSelect || !relativePermittivityInput || !clearButton || !errorElement || !resultCard || !resultStateElement || !primaryResultElement || !summaryElement || !resultElements.pF || !resultElements.nF || !resultElements.uF || !resultElements.F || !breakdownElement || !technicalOutputElement || !copyButton || !copyStatusElement) {
        return;
    }

    let copyPayload = '';
    let copyFeedbackTimeout = null;

    const calculatorInputs = [innerRadiusInput, outerRadiusInput, lengthInput, relativePermittivityInput];

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

    const clearResult = () => {
        resultCard.classList.remove('has-result');
        resultStateElement.textContent = 'Ready';
        primaryResultElement.textContent = '--';
        summaryElement.textContent = 'Enter cylindrical geometry and relative permittivity to calculate capacitance.';
        resultElements.pF.textContent = '--';
        resultElements.nF.textContent = '--';
        resultElements.uF.textContent = '--';
        resultElements.F.textContent = '--';
        breakdownElement.replaceChildren('Formula: C = 2πεL / ln(b/a), where ε = εr × ε0.');
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

    const calculateCylindrical = () => {
        clearError();

        const parsedInnerRadius = parsePositiveValue(innerRadiusInput, 'inner radius');

        if (!parsedInnerRadius.isValid) {
            showError(innerRadiusInput, parsedInnerRadius.message);
            return;
        }

        const parsedOuterRadius = parsePositiveValue(outerRadiusInput, 'outer radius');

        if (!parsedOuterRadius.isValid) {
            showError(outerRadiusInput, parsedOuterRadius.message);
            return;
        }

        const parsedLength = parsePositiveValue(lengthInput, 'length');

        if (!parsedLength.isValid) {
            showError(lengthInput, parsedLength.message);
            return;
        }

        const parsedRelativePermittivity = parsePositiveValue(relativePermittivityInput, 'relative permittivity');

        if (!parsedRelativePermittivity.isValid) {
            showError(relativePermittivityInput, parsedRelativePermittivity.message);
            return;
        }

        const innerRadiusUnit = lengthUnits[innerRadiusUnitSelect.value] || lengthUnits.mm;
        const outerRadiusUnit = lengthUnits[outerRadiusUnitSelect.value] || lengthUnits.mm;
        const lengthUnit = lengthUnits[lengthUnitSelect.value] || lengthUnits.cm;
        const innerRadiusMeters = parsedInnerRadius.value * innerRadiusUnit.factor;
        const outerRadiusMeters = parsedOuterRadius.value * outerRadiusUnit.factor;
        const lengthMeters = parsedLength.value * lengthUnit.factor;

        if (outerRadiusMeters <= innerRadiusMeters) {
            showError(outerRadiusInput, 'outer radius must be greater than inner radius.');
            return;
        }

        const relativePermittivity = parsedRelativePermittivity.value;
        const epsilon = relativePermittivity * EPSILON_0;
        const radiusRatio = outerRadiusMeters / innerRadiusMeters;
        const logarithmicTerm = Math.log(radiusRatio);
        const capacitanceFarads = 2 * Math.PI * epsilon * lengthMeters / logarithmicTerm;
        const formattedResults = formatCapacitanceResults(capacitanceFarads);
        const inputSummary = `a = ${formatNumber(parsedInnerRadius.value, 6)} ${innerRadiusUnit.label}, b = ${formatNumber(parsedOuterRadius.value, 6)} ${outerRadiusUnit.label}, L = ${formatNumber(parsedLength.value, 6)} ${lengthUnit.label}, εr = ${formatNumber(relativePermittivity, 6)}`;
        const conversionSummary = `Converted: a = ${formatNumber(innerRadiusMeters, 8)} m, b = ${formatNumber(outerRadiusMeters, 8)} m, L = ${formatNumber(lengthMeters, 8)} m, ε = ${formatNumber(epsilon, 8)} F/m.`;
        const formulaSummary = `C = 2π ε L / ln(b/a) = 2π × ${formatNumber(epsilon, 8)} × ${formatNumber(lengthMeters, 8)} / ln(${formatNumber(radiusRatio, 8)}) = ${formattedResults.F}.`;
        const formattedEpsilonZero = formatSiValue(EPSILON_0, 'F/m', 10);
        const formattedEpsilon = formatSiValue(epsilon, 'F/m', 10);
        const formattedInnerRadius = formatSiValue(innerRadiusMeters, 'm', 8);
        const formattedOuterRadius = formatSiValue(outerRadiusMeters, 'm', 8);
        const formattedLength = formatSiValue(lengthMeters, 'm', 8);
        const formattedCapacitanceFarads = formatSiValue(capacitanceFarads, 'F', 5);
        const formattedRadiusRatio = formatNumber(radiusRatio, 8);
        const formattedLogarithmicTerm = formatNumber(logarithmicTerm, 8);

        resultCard.classList.add('has-result');
        resultStateElement.textContent = 'Calculated';
        primaryResultElement.textContent = formattedResults.pF;
        summaryElement.textContent = `${inputSummary}.`;
        resultElements.pF.textContent = formattedResults.pF;
        resultElements.nF.textContent = formattedResults.nF;
        resultElements.uF.textContent = formattedResults.uF;
        resultElements.F.textContent = formattedResults.F;
        breakdownElement.replaceChildren(
            createSolutionSection('Given', [
                `a = ${formattedInnerRadius}`,
                `b = ${formattedOuterRadius}`,
                `L = ${formattedLength}`,
                `εr = ${formatNumber(relativePermittivity, 6)}`,
            ]),
            createSolutionSection('Permittivity', [
                'ε = εr × ε0',
                `ε = ${formatNumber(relativePermittivity, 6)} × ${formattedEpsilonZero}`,
                `ε = ${formattedEpsilon}`,
            ]),
            createSolutionSection('Formula', [
                'C = 2π ε L / ln(b/a)',
            ]),
            createSolutionSection('Substitution', [
                `b/a = ${formattedOuterRadius} / ${formattedInnerRadius} = ${formattedRadiusRatio}`,
                `ln(b/a) = ${formattedLogarithmicTerm}`,
                `C = (2π × ${formattedEpsilon} × ${formattedLength}) / ${formattedLogarithmicTerm}`,
            ]),
            createSolutionSection('Final', [
                `C = ${formattedCapacitanceFarads}`,
                `C ≈ ${formattedResults.pF}`,
            ]),
        );
        technicalOutputElement.replaceChildren(
            createTechnicalDetail('Vacuum permittivity ε0', formattedEpsilonZero),
            createTechnicalDetail('Relative permittivity εr', formatNumber(relativePermittivity, 6)),
            createTechnicalDetail('Absolute permittivity ε', formattedEpsilon),
            createTechnicalDetail('Converted inner radius a', formattedInnerRadius),
            createTechnicalDetail('Converted outer radius b', formattedOuterRadius),
            createTechnicalDetail('Converted length L', formattedLength),
            createTechnicalDetail('Radius ratio b/a', formattedRadiusRatio),
            createTechnicalDetail('Logarithmic term ln(b/a)', formattedLogarithmicTerm),
            createTechnicalDetail('Raw capacitance in farads', formattedCapacitanceFarads),
        );
        copyPayload = [
            'Cylindrical Capacitor',
            inputSummary,
            conversionSummary,
            formulaSummary,
            `Results: ${formattedResults.pF}, ${formattedResults.nF}, ${formattedResults.uF}, ${formattedResults.F}`,
        ].join('\n');
        document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: {
                mode: 'advanced-cylindrical',
                modeName: 'Cylindrical Capacitor',
                inputSummary,
                result: formattedResults.pF,
                restoreData: {
                    innerRadiusValue: innerRadiusInput.value.trim(),
                    innerRadiusUnit: innerRadiusUnitSelect.value,
                    outerRadiusValue: outerRadiusInput.value.trim(),
                    outerRadiusUnit: outerRadiusUnitSelect.value,
                    lengthValue: lengthInput.value.trim(),
                    lengthUnit: lengthUnitSelect.value,
                    relativePermittivityValue: relativePermittivityInput.value.trim(),
                },
                timestamp: Date.now(),
            },
        }));
        copyButton.disabled = false;
        clearCopyFeedback();
    };

    const resetCalculator = () => {
        innerRadiusInput.value = '';
        innerRadiusUnitSelect.value = 'mm';
        outerRadiusInput.value = '';
        outerRadiusUnitSelect.value = 'mm';
        lengthInput.value = '';
        lengthUnitSelect.value = 'cm';
        relativePermittivityInput.value = '1';
        clearError();
        clearResult();
        innerRadiusInput.focus();
    };

    cylindricalForm.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateCylindrical();
    });

    [innerRadiusInput, innerRadiusUnitSelect, outerRadiusInput, outerRadiusUnitSelect, lengthInput, lengthUnitSelect, relativePermittivityInput].forEach((control) => {
        control.addEventListener('input', () => {
            clearError();
            clearResult();
        });
        control.addEventListener('change', () => {
            clearError();
            clearResult();
        });
    });

    clearButton.addEventListener('click', resetCalculator);

    document.addEventListener('calculator:restore-history', (event) => {
        if (event.detail?.mode !== 'advanced-cylindrical') {
            return;
        }

        const restoreData = event.detail.restoreData || {};

        innerRadiusInput.value = String(restoreData.innerRadiusValue ?? '');
        innerRadiusUnitSelect.value = lengthUnits[restoreData.innerRadiusUnit] ? restoreData.innerRadiusUnit : 'mm';
        outerRadiusInput.value = String(restoreData.outerRadiusValue ?? '');
        outerRadiusUnitSelect.value = lengthUnits[restoreData.outerRadiusUnit] ? restoreData.outerRadiusUnit : 'mm';
        lengthInput.value = String(restoreData.lengthValue ?? '');
        lengthUnitSelect.value = lengthUnits[restoreData.lengthUnit] ? restoreData.lengthUnit : 'cm';
        relativePermittivityInput.value = String(restoreData.relativePermittivityValue ?? '1');
        clearError();
        clearResult();
        innerRadiusInput.focus();
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

    clearResult();
};
