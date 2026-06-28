// Advanced Physics shared constants and helpers.

export const EPSILON_0 = 8.854187817e-12;
export const areaUnits = {
    m2: {
        label: 'm²',
        factor: 1,
    },
    cm2: {
        label: 'cm²',
        factor: 1e-4,
    },
    mm2: {
        label: 'mm²',
        factor: 1e-6,
    },
};
export const fieldUnits = {
    vm: {
        label: 'V/m',
        factor: 1,
    },
    kvm: {
        label: 'kV/m',
        factor: 1000,
    },
    vcm: {
        label: 'V/cm',
        factor: 100,
    },
};
export const chargeUnits = {
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
};
export const lengthUnits = {
    m: {
        label: 'm',
        factor: 1,
    },
    cm: {
        label: 'cm',
        factor: 1e-2,
    },
    mm: {
        label: 'mm',
        factor: 1e-3,
    },
};
export const capacitanceUnits = {
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

export const normalizeValue = (value) => value.trim().replace(/,/g, '');

export const formatNumber = (value, maximumFractionDigits = 4) => {
    if (value === 0 || Object.is(value, -0)) {
        return '0';
    }

    const absoluteValue = Math.abs(value);

    if (absoluteValue !== 0 && (absoluteValue < 0.000001 || absoluteValue >= 1000000000)) {
        return value.toExponential(4).replace(/\.?0+e/, 'e');
    }

    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits,
    }).format(value);
};

export const toSuperscript = (value) => String(value).replace(/-/g, '⁻').replace(/[0-9]/g, (digit) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(digit)]);

export const formatScientificValue = (value, significantDigits = 5) => {
    if (value === 0 || Object.is(value, -0)) {
        return '0';
    }

    const [coefficient, exponent] = value.toExponential(significantDigits - 1).split('e');
    const trimmedCoefficient = coefficient.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');

    return `${trimmedCoefficient} × 10${toSuperscript(Number(exponent))}`;
};

export const formatSiValue = (value, unit = '', significantDigits = 5) => {
    const formattedValue = Math.abs(value) !== 0 && Math.abs(value) < 0.000001
        ? formatScientificValue(value, significantDigits)
        : formatNumber(value, 8);

    return unit ? `${formattedValue} ${unit}` : formattedValue;
};

export const formatCapacitanceResults = (capacitanceFarads) => ({
    pF: `${formatNumber(capacitanceFarads / 1e-12, 2)} pF`,
    nF: `${formatNumber(capacitanceFarads / 1e-9, 4)} nF`,
    uF: `${formatNumber(capacitanceFarads / 1e-6, 8)} µF`,
    F: `${formatNumber(capacitanceFarads, 8)} F`,
});

export const createSolutionSection = (title, lines) => {
    const section = document.createElement('section');
    section.className = 'advanced-solution-section';

    const heading = document.createElement('h5');
    heading.className = 'advanced-solution-heading';
    heading.textContent = title;
    section.append(heading);

    lines.forEach((line) => {
        const row = document.createElement('p');
        row.className = 'advanced-solution-line';
        row.textContent = line;
        section.append(row);
    });

    return section;
};

export const createTechnicalDetail = (label, value) => {
    const row = document.createElement('span');
    row.className = 'advanced-technical-row';

    const labelElement = document.createElement('span');
    labelElement.className = 'advanced-technical-label';
    labelElement.textContent = label;

    const valueElement = document.createElement('span');
    valueElement.className = 'advanced-technical-value';
    valueElement.textContent = value;

    row.append(labelElement, valueElement);

    return row;
};

export const parsePositiveValue = (input, label) => {
    const normalizedValue = normalizeValue(input.value);

    if (!normalizedValue) {
        return {
            isValid: false,
            message: `Enter ${label}.`,
        };
    }

    const numericValue = Number(normalizedValue);

    if (!Number.isFinite(numericValue)) {
        return {
            isValid: false,
            message: `${label} must be a valid number.`,
        };
    }

    if (numericValue === 0) {
        return {
            isValid: false,
            message: `${label} must be greater than zero.`,
        };
    }

    if (numericValue < 0) {
        return {
            isValid: false,
            message: `${label} cannot be negative.`,
        };
    }

    return {
        isValid: true,
        value: numericValue,
    };
};

export const copyWithFallback = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '-9999px';

    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const didCopy = document.execCommand('copy');
    textarea.remove();

    if (!didCopy) {
        throw new Error('Copy command failed.');
    }
};

export const copyText = async (text) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        return;
    }

    copyWithFallback(text);
};
