// Shared pure numeric helpers for practical calculators.
// Keep this namespace small and explicit to avoid global script name collisions.

window.PracticalCalculatorUtils = (() => {
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

    return Object.freeze({
        formatDecodedNumber,
        formatPrecisionNumber,
        formatRoundedNumber,
        normalizeNumericValue,
    });
})();
