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

export const initDielectricCalculator = () => {
    const dielectricForm = document.getElementById('dielectric-form');
    const baselineCapacitanceInput = document.getElementById('dielectric-baseline-capacitance');
    const baselineUnitSelect = document.getElementById('dielectric-baseline-unit');
    const materialPresetSelect = document.getElementById('dielectric-material-preset');
    const relativePermittivityInput = document.getElementById('dielectric-relative-permittivity');
    const clearButton = document.getElementById('clear-dielectric-calculator');
    const errorElement = document.getElementById('dielectric-error');
    const resultCard = document.getElementById('dielectric-result-card');
    const resultStateElement = document.getElementById('dielectric-result-state');
    const primaryResultElement = document.getElementById('dielectric-primary-result');
    const summaryElement = document.getElementById('dielectric-summary');
    const resultElements = {
        pF: document.getElementById('dielectric-result-pf'),
        nF: document.getElementById('dielectric-result-nf'),
        uF: document.getElementById('dielectric-result-uf'),
        F: document.getElementById('dielectric-result-f'),
    };
    const breakdownElement = document.getElementById('dielectric-breakdown');
    const technicalOutputElement = document.getElementById('dielectric-technical-output');
    const copyButton = document.getElementById('copy-dielectric-result');
    const copyStatusElement = document.getElementById('dielectric-copy-status');

    if (!dielectricForm || !baselineCapacitanceInput || !baselineUnitSelect || !materialPresetSelect || !relativePermittivityInput || !clearButton || !errorElement || !resultCard || !resultStateElement || !primaryResultElement || !summaryElement || !resultElements.pF || !resultElements.nF || !resultElements.uF || !resultElements.F || !breakdownElement || !technicalOutputElement || !copyButton || !copyStatusElement) {
        return;
    }

    let copyPayload = '';
    let copyFeedbackTimeout = null;

    const calculatorInputs = [baselineCapacitanceInput, relativePermittivityInput];

    const getSelectedMaterialLabel = () => {
        const selectedOption = materialPresetSelect.options[materialPresetSelect.selectedIndex];

        return selectedOption ? selectedOption.textContent.trim() : 'Custom';
    };

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
        summaryElement.textContent = 'Enter a baseline capacitance and dielectric constant to calculate the material-adjusted capacitance.';
        resultElements.pF.textContent = '--';
        resultElements.nF.textContent = '--';
        resultElements.uF.textContent = '--';
        resultElements.F.textContent = '--';
        breakdownElement.replaceChildren('Formula: ε = κ × ε0 and C = κ × C0.');
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

    const calculateDielectric = () => {
        clearError();

        const parsedBaselineCapacitance = parsePositiveValue(baselineCapacitanceInput, 'baseline capacitance');

        if (!parsedBaselineCapacitance.isValid) {
            showError(baselineCapacitanceInput, parsedBaselineCapacitance.message);
            return;
        }

        const parsedRelativePermittivity = parsePositiveValue(relativePermittivityInput, 'dielectric constant');

        if (!parsedRelativePermittivity.isValid) {
            showError(relativePermittivityInput, parsedRelativePermittivity.message);
            return;
        }

        const baselineUnit = capacitanceUnits[baselineUnitSelect.value] || capacitanceUnits.pF;
        const baselineCapacitanceFarads = parsedBaselineCapacitance.value * baselineUnit.factor;
        const relativePermittivity = parsedRelativePermittivity.value;
        const epsilon = relativePermittivity * EPSILON_0;
        const capacitanceFarads = relativePermittivity * baselineCapacitanceFarads;
        const formattedResults = formatCapacitanceResults(capacitanceFarads);
        const selectedMaterialLabel = getSelectedMaterialLabel();
        const inputSummary = `C0 = ${formatNumber(parsedBaselineCapacitance.value, 6)} ${baselineUnit.label}, κ = ${formatNumber(relativePermittivity, 6)}, material = ${selectedMaterialLabel}`;
        const conversionSummary = `Converted: C0 = ${formatNumber(baselineCapacitanceFarads, 8)} F, ε = ${formatNumber(epsilon, 8)} F/m.`;
        const formulaSummary = `C = κ × C0 = ${formatNumber(relativePermittivity, 6)} × ${formatNumber(baselineCapacitanceFarads, 8)} F = ${formattedResults.F}.`;
        const formattedEpsilonZero = formatSiValue(EPSILON_0, 'F/m', 10);
        const formattedEpsilon = formatSiValue(epsilon, 'F/m', 10);
        const formattedBaselineCapacitance = formatSiValue(baselineCapacitanceFarads, 'F', 5);
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
                `C0 = ${formattedBaselineCapacitance}`,
                `κ = ${formatNumber(relativePermittivity, 6)}`,
                `Material = ${selectedMaterialLabel}`,
            ]),
            createSolutionSection('Permittivity', [
                'ε = κ × ε0',
                `ε = ${formatNumber(relativePermittivity, 6)} × ${formattedEpsilonZero}`,
                `ε = ${formattedEpsilon}`,
            ]),
            createSolutionSection('Formula', [
                'C = κ × C0',
            ]),
            createSolutionSection('Substitution', [
                `C = ${formatNumber(relativePermittivity, 6)} × ${formattedBaselineCapacitance}`,
            ]),
            createSolutionSection('Final', [
                `C = ${formattedCapacitanceFarads}`,
                `C ≈ ${formattedResults.pF}`,
            ]),
        );
        technicalOutputElement.replaceChildren(
            createTechnicalDetail('Vacuum permittivity ε0', formattedEpsilonZero),
            createTechnicalDetail('Dielectric constant κ / εr', formatNumber(relativePermittivity, 6)),
            createTechnicalDetail('Absolute permittivity ε', formattedEpsilon),
            createTechnicalDetail('Selected material', selectedMaterialLabel),
            createTechnicalDetail('Baseline capacitance C0', formattedBaselineCapacitance),
            createTechnicalDetail('Result capacitance in farads', formattedCapacitanceFarads),
        );
        copyPayload = [
            'Dielectric Materials',
            inputSummary,
            conversionSummary,
            formulaSummary,
            `Results: ${formattedResults.pF}, ${formattedResults.nF}, ${formattedResults.uF}, ${formattedResults.F}`,
        ].join('\n');
        document.dispatchEvent(new CustomEvent('calculator:history-entry', {
            detail: {
                mode: 'advanced-dielectric',
                modeName: 'Dielectric Materials',
                inputSummary,
                result: formattedResults.pF,
                restoreData: {
                    baselineCapacitanceValue: baselineCapacitanceInput.value.trim(),
                    baselineUnit: baselineUnitSelect.value,
                    materialPreset: materialPresetSelect.value,
                    relativePermittivityValue: relativePermittivityInput.value.trim(),
                },
                timestamp: Date.now(),
            },
        }));
        copyButton.disabled = false;
        clearCopyFeedback();
    };

    const resetCalculator = () => {
        baselineCapacitanceInput.value = '';
        baselineUnitSelect.value = 'pF';
        materialPresetSelect.value = 'vacuum-air';
        relativePermittivityInput.value = '1';
        clearError();
        clearResult();
        baselineCapacitanceInput.focus();
    };

    dielectricForm.addEventListener('submit', (event) => {
        event.preventDefault();
        calculateDielectric();
    });

    baselineCapacitanceInput.addEventListener('input', () => {
        clearError();
        clearResult();
    });

    baselineUnitSelect.addEventListener('change', () => {
        clearError();
        clearResult();
    });

    materialPresetSelect.addEventListener('change', () => {
        const selectedOption = materialPresetSelect.options[materialPresetSelect.selectedIndex];
        const presetKappa = selectedOption?.dataset.kappa;

        if (presetKappa) {
            relativePermittivityInput.value = presetKappa;
        }

        clearError();
        clearResult();
    });

    relativePermittivityInput.addEventListener('input', () => {
        materialPresetSelect.value = 'custom';
        clearError();
        clearResult();
    });

    clearButton.addEventListener('click', resetCalculator);

    document.addEventListener('calculator:restore-history', (event) => {
        if (event.detail?.mode !== 'advanced-dielectric') {
            return;
        }

        const restoreData = event.detail.restoreData || {};
        const restoredMaterialPreset = String(restoreData.materialPreset ?? '');
        const hasRestoredMaterialPreset = Array.from(materialPresetSelect.options).some((option) => option.value === restoredMaterialPreset);

        baselineCapacitanceInput.value = String(restoreData.baselineCapacitanceValue ?? '');
        baselineUnitSelect.value = capacitanceUnits[restoreData.baselineUnit] ? restoreData.baselineUnit : 'pF';
        materialPresetSelect.value = hasRestoredMaterialPreset ? restoredMaterialPreset : 'custom';
        relativePermittivityInput.value = String(restoreData.relativePermittivityValue ?? '1');
        clearError();
        clearResult();
        baselineCapacitanceInput.focus();
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
