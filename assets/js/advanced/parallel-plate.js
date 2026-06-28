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

export const initParallelPlateCalculator = () => {
    const parallelPlateForm = document.getElementById('parallel-plate-form');
    const areaInput = document.getElementById('parallel-plate-area');
    const areaUnitSelect = document.getElementById('parallel-plate-area-unit');
    const distanceInput = document.getElementById('parallel-plate-distance');
    const distanceUnitSelect = document.getElementById('parallel-plate-distance-unit');
    const relativePermittivityInput = document.getElementById('parallel-plate-relative-permittivity');
    const clearButton = document.getElementById('clear-parallel-plate-calculator');
    const errorElement = document.getElementById('parallel-plate-error');
    const resultCard = document.getElementById('parallel-plate-result-card');
    const resultStateElement = document.getElementById('parallel-plate-result-state');
    const primaryResultElement = document.getElementById('parallel-plate-primary-result');
    const summaryElement = document.getElementById('parallel-plate-summary');
    const resultElements = {
        pF: document.getElementById('parallel-plate-result-pf'),
        nF: document.getElementById('parallel-plate-result-nf'),
        uF: document.getElementById('parallel-plate-result-uf'),
        F: document.getElementById('parallel-plate-result-f'),
    };
    const breakdownElement = document.getElementById('parallel-plate-breakdown');
    const technicalOutputElement = document.getElementById('parallel-plate-technical-output');
    const copyButton = document.getElementById('copy-parallel-plate-result');
    const copyStatusElement = document.getElementById('parallel-plate-copy-status');

    if (!parallelPlateForm || !areaInput || !areaUnitSelect || !distanceInput || !distanceUnitSelect || !relativePermittivityInput || !clearButton || !errorElement || !resultCard || !resultStateElement || !primaryResultElement || !summaryElement || !resultElements.pF || !resultElements.nF || !resultElements.uF || !resultElements.F || !breakdownElement || !technicalOutputElement || !copyButton || !copyStatusElement) {
        return;
    }

    let copyPayload = '';
    let copyFeedbackTimeout = null;

    const clearError = () => {
        errorElement.textContent = '';
        [areaInput, distanceInput, relativePermittivityInput].forEach((input) => {
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
        summaryElement.textContent = 'Enter plate geometry and relative permittivity to calculate capacitance.';
        resultElements.pF.textContent = '--';
        resultElements.nF.textContent = '--';
        resultElements.uF.textContent = '--';
        resultElements.F.textContent = '--';
        breakdownElement.replaceChildren('Formula: C = εA / d, where ε = εr × ε0.');
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

    const calculateParallelPlate = () => {
        clearError();

        const parsedArea = parsePositiveValue(areaInput, 'plate area');

        if (!parsedArea.isValid) {
            showError(areaInput, parsedArea.message);
            return;
        }

        const parsedDistance = parsePositiveValue(distanceInput, 'plate separation');

        if (!parsedDistance.isValid) {
            showError(distanceInput, parsedDistance.message);
            return;
        }

        const parsedRelativePermittivity = parsePositiveValue(relativePermittivityInput, 'relative permittivity');

        if (!parsedRelativePermittivity.isValid) {
            showError(relativePermittivityInput, parsedRelativePermittivity.message);
            return;
        }

        const areaUnit = areaUnits[areaUnitSelect.value] || areaUnits.m2;
        const distanceUnit = lengthUnits[distanceUnitSelect.value] || lengthUnits.m;
        const areaMetersSquared = parsedArea.value * areaUnit.factor;
        const distanceMeters = parsedDistance.value * distanceUnit.factor;
        const relativePermittivity = parsedRelativePermittivity.value;
        const epsilon = relativePermittivity * EPSILON_0;
        const capacitanceFarads = epsilon * areaMetersSquared / distanceMeters;
        const formattedResults = formatCapacitanceResults(capacitanceFarads);
        const inputSummary = `A = ${formatNumber(parsedArea.value, 6)} ${areaUnit.label}, d = ${formatNumber(parsedDistance.value, 6)} ${distanceUnit.label}, εr = ${formatNumber(relativePermittivity, 6)}`;
        const conversionSummary = `Converted: A = ${formatNumber(areaMetersSquared, 8)} m², d = ${formatNumber(distanceMeters, 8)} m, ε = ${formatNumber(epsilon, 8)} F/m.`;
        const formulaSummary = `C = εA / d = ${formatNumber(epsilon, 8)} × ${formatNumber(areaMetersSquared, 8)} / ${formatNumber(distanceMeters, 8)} = ${formattedResults.F}.`;
        const formattedEpsilonZero = formatSiValue(EPSILON_0, 'F/m', 10);
        const formattedEpsilon = formatSiValue(epsilon, 'F/m', 10);
        const formattedArea = formatSiValue(areaMetersSquared, 'm²', 8);
        const formattedDistance = formatSiValue(distanceMeters, 'm', 8);
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
                `A = ${formattedArea}`,
                `d = ${formattedDistance}`,
                `εr = ${formatNumber(relativePermittivity, 6)}`,
            ]),
            createSolutionSection('Permittivity', [
                'ε = εr × ε0',
                `ε = ${formatNumber(relativePermittivity, 6)} × ${formattedEpsilonZero}`,
                `ε = ${formattedEpsilon}`,
            ]),
            createSolutionSection('Formula', [
                'C = εA / d',
            ]),
            createSolutionSection('Substitution', [
                `C = (${formattedEpsilon} × ${formattedArea}) / ${formattedDistance}`,
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
            createTechnicalDetail('Converted area A', formattedArea),
            createTechnicalDetail('Converted distance d', formattedDistance),
            createTechnicalDetail('Raw capacitance in farads', formattedCapacitanceFarads),
        );
        copyPayload = [
            'Parallel Plate Capacitor',
            inputSummary,
            conversionSummary,
            formulaSummary,
            `Results: ${formattedResults.pF}, ${formattedResults.nF}, ${formattedResults.uF}, ${formattedResults.F}`,
        ].join('\n');
        document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: {
                mode: 'advanced-parallel-plate',
                modeName: 'Parallel Plate Capacitor',
                inputSummary,
                result: formattedResults.pF,
                restoreData: {
                    areaValue: areaInput.value.trim(),
                    areaUnit: areaUnitSelect.value,
                    distanceValue: distanceInput.value.trim(),
                    distanceUnit: distanceUnitSelect.value,
                    relativePermittivityValue: relativePermittivityInput.value.trim(),
                },
                timestamp: Date.now(),
            },
        }));
        copyButton.disabled = false;
        clearCopyFeedback();
    };

    const resetCalculator = () => {
        areaInput.value = '';
        areaUnitSelect.value = 'm2';
        distanceInput.value = '';
        distanceUnitSelect.value = 'm';
        relativePermittivityInput.value = '1';
        clearError();
        clearResult();
        areaInput.focus();
    };

    parallelPlateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateParallelPlate();
    });

    [areaInput, areaUnitSelect, distanceInput, distanceUnitSelect, relativePermittivityInput].forEach((control) => {
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
        if (event.detail?.mode !== 'advanced-parallel-plate') {
            return;
        }

        const restoreData = event.detail.restoreData || {};

        areaInput.value = String(restoreData.areaValue ?? '');
        areaUnitSelect.value = areaUnits[restoreData.areaUnit] ? restoreData.areaUnit : 'm2';
        distanceInput.value = String(restoreData.distanceValue ?? '');
        distanceUnitSelect.value = lengthUnits[restoreData.distanceUnit] ? restoreData.distanceUnit : 'm';
        relativePermittivityInput.value = String(restoreData.relativePermittivityValue ?? '1');
        clearError();
        clearResult();
        areaInput.focus();
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
