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

export const initSphericalCalculator = () => {
    const sphericalForm = document.getElementById('spherical-form');
    const innerRadiusInput = document.getElementById('spherical-inner-radius');
    const innerRadiusUnitSelect = document.getElementById('spherical-inner-radius-unit');
    const outerRadiusInput = document.getElementById('spherical-outer-radius');
    const outerRadiusUnitSelect = document.getElementById('spherical-outer-radius-unit');
    const relativePermittivityInput = document.getElementById('spherical-relative-permittivity');
    const clearButton = document.getElementById('clear-spherical-calculator');
    const errorElement = document.getElementById('spherical-error');
    const resultCard = document.getElementById('spherical-result-card');
    const resultStateElement = document.getElementById('spherical-result-state');
    const primaryResultElement = document.getElementById('spherical-primary-result');
    const summaryElement = document.getElementById('spherical-summary');
    const resultElements = {
        pF: document.getElementById('spherical-result-pf'),
        nF: document.getElementById('spherical-result-nf'),
        uF: document.getElementById('spherical-result-uf'),
        F: document.getElementById('spherical-result-f'),
    };
    const breakdownElement = document.getElementById('spherical-breakdown');
    const technicalOutputElement = document.getElementById('spherical-technical-output');
    const copyButton = document.getElementById('copy-spherical-result');
    const copyStatusElement = document.getElementById('spherical-copy-status');

    if (!sphericalForm || !innerRadiusInput || !innerRadiusUnitSelect || !outerRadiusInput || !outerRadiusUnitSelect || !relativePermittivityInput || !clearButton || !errorElement || !resultCard || !resultStateElement || !primaryResultElement || !summaryElement || !resultElements.pF || !resultElements.nF || !resultElements.uF || !resultElements.F || !breakdownElement || !technicalOutputElement || !copyButton || !copyStatusElement) {
        return;
    }

    let copyPayload = '';
    let copyFeedbackTimeout = null;

    const calculatorInputs = [innerRadiusInput, outerRadiusInput, relativePermittivityInput];

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
        summaryElement.textContent = 'Enter spherical geometry and relative permittivity to calculate capacitance.';
        resultElements.pF.textContent = '--';
        resultElements.nF.textContent = '--';
        resultElements.uF.textContent = '--';
        resultElements.F.textContent = '--';
        breakdownElement.replaceChildren('Formula: C = 4πεab / (b - a), where ε = εr × ε0.');
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

    const calculateSpherical = () => {
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

        const parsedRelativePermittivity = parsePositiveValue(relativePermittivityInput, 'relative permittivity');

        if (!parsedRelativePermittivity.isValid) {
            showError(relativePermittivityInput, parsedRelativePermittivity.message);
            return;
        }

        const innerRadiusUnit = lengthUnits[innerRadiusUnitSelect.value] || lengthUnits.cm;
        const outerRadiusUnit = lengthUnits[outerRadiusUnitSelect.value] || lengthUnits.cm;
        const innerRadiusMeters = parsedInnerRadius.value * innerRadiusUnit.factor;
        const outerRadiusMeters = parsedOuterRadius.value * outerRadiusUnit.factor;

        if (outerRadiusMeters <= innerRadiusMeters) {
            showError(outerRadiusInput, 'outer radius must be greater than inner radius.');
            return;
        }

        const radiusDifferenceMeters = outerRadiusMeters - innerRadiusMeters;
        const relativePermittivity = parsedRelativePermittivity.value;
        const epsilon = relativePermittivity * EPSILON_0;
        const capacitanceFarads = 4 * Math.PI * epsilon * innerRadiusMeters * outerRadiusMeters / radiusDifferenceMeters;
        const formattedResults = formatCapacitanceResults(capacitanceFarads);
        const inputSummary = `a = ${formatNumber(parsedInnerRadius.value, 6)} ${innerRadiusUnit.label}, b = ${formatNumber(parsedOuterRadius.value, 6)} ${outerRadiusUnit.label}, εr = ${formatNumber(relativePermittivity, 6)}`;
        const conversionSummary = `Converted: a = ${formatNumber(innerRadiusMeters, 8)} m, b = ${formatNumber(outerRadiusMeters, 8)} m, b - a = ${formatNumber(radiusDifferenceMeters, 8)} m, ε = ${formatNumber(epsilon, 8)} F/m.`;
        const formulaSummary = `C = 4π εab / (b - a) = 4π × ${formatNumber(epsilon, 8)} × ${formatNumber(innerRadiusMeters, 8)} × ${formatNumber(outerRadiusMeters, 8)} / ${formatNumber(radiusDifferenceMeters, 8)} = ${formattedResults.F}.`;
        const formattedEpsilonZero = formatSiValue(EPSILON_0, 'F/m', 10);
        const formattedEpsilon = formatSiValue(epsilon, 'F/m', 10);
        const formattedInnerRadius = formatSiValue(innerRadiusMeters, 'm', 8);
        const formattedOuterRadius = formatSiValue(outerRadiusMeters, 'm', 8);
        const formattedRadiusDifference = formatSiValue(radiusDifferenceMeters, 'm', 8);
        const formattedCapacitanceFarads = formatSiValue(capacitanceFarads, 'F', 5);

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
                `εr = ${formatNumber(relativePermittivity, 6)}`,
            ]),
            createSolutionSection('Permittivity', [
                'ε = εr × ε0',
                `ε = ${formatNumber(relativePermittivity, 6)} × ${formattedEpsilonZero}`,
                `ε = ${formattedEpsilon}`,
            ]),
            createSolutionSection('Formula', [
                'C = 4π εab / (b - a)',
            ]),
            createSolutionSection('Substitution', [
                `b - a = ${formattedOuterRadius} - ${formattedInnerRadius} = ${formattedRadiusDifference}`,
                `C = (4π × ${formattedEpsilon} × ${formattedInnerRadius} × ${formattedOuterRadius}) / ${formattedRadiusDifference}`,
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
            createTechnicalDetail('Radius difference b - a', formattedRadiusDifference),
            createTechnicalDetail('Raw capacitance in farads', formattedCapacitanceFarads),
        );
        copyPayload = [
            'Spherical Capacitor',
            inputSummary,
            conversionSummary,
            formulaSummary,
            `Results: ${formattedResults.pF}, ${formattedResults.nF}, ${formattedResults.uF}, ${formattedResults.F}`,
        ].join('\n');
        document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: {
                mode: 'advanced-spherical',
                modeName: 'Spherical Capacitor',
                inputSummary,
                result: formattedResults.pF,
                restoreData: {
                    innerRadiusValue: innerRadiusInput.value.trim(),
                    innerRadiusUnit: innerRadiusUnitSelect.value,
                    outerRadiusValue: outerRadiusInput.value.trim(),
                    outerRadiusUnit: outerRadiusUnitSelect.value,
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
        innerRadiusUnitSelect.value = 'cm';
        outerRadiusInput.value = '';
        outerRadiusUnitSelect.value = 'cm';
        relativePermittivityInput.value = '1';
        clearError();
        clearResult();
        innerRadiusInput.focus();
    };

    sphericalForm.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateSpherical();
    });

    [innerRadiusInput, innerRadiusUnitSelect, outerRadiusInput, outerRadiusUnitSelect, relativePermittivityInput].forEach((control) => {
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
        if (event.detail?.mode !== 'advanced-spherical') {
            return;
        }

        const restoreData = event.detail.restoreData || {};

        innerRadiusInput.value = String(restoreData.innerRadiusValue ?? '');
        innerRadiusUnitSelect.value = lengthUnits[restoreData.innerRadiusUnit] ? restoreData.innerRadiusUnit : 'cm';
        outerRadiusInput.value = String(restoreData.outerRadiusValue ?? '');
        outerRadiusUnitSelect.value = lengthUnits[restoreData.outerRadiusUnit] ? restoreData.outerRadiusUnit : 'cm';
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
