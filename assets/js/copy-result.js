// Copy result controls: copies the latest successful calculator result only.
// DO NO TOUCH ANYMORE UNLESS YOU KNOW WHAT YOU ARE DOING!!! MAKE SURE YOU HAVE ENOUGH SLEEP BEDORE TOUCHING THIS CODE!!!!
// This is a critical part of the calculator's functionality.

document.addEventListener('DOMContentLoaded', () => {
    const modeTitles = {
        'unit-converter': 'Unit Converter',
        series: 'Series Capacitance',
        parallel: 'Parallel Capacitance',
        'code-decoder': 'Capacitor Code Decoder',
        'rc-time': 'RC Time Constant',
        'capacitive-reactance': 'Capacitive Reactance',
        'charge-calculator': 'Charge Calculator',
        'energy-stored': 'Energy Stored',
    };
    const resultStateSelectors = {
        'unit-converter': '#unit-converter-form',
        series: '#series-result-card',
        parallel: '#parallel-result-card',
        'code-decoder': '#code-decoder-result-card',
        'rc-time': '#rc-result-card',
        'capacitive-reactance': '#capacitive-reactance-result-card',
        'charge-calculator': '#charge-result-card',
        'energy-stored': '#energy-result-card',
    };
    const copyControls = Array.from(document.querySelectorAll('[data-copy-result]'));
    const latestResults = new Map();
    let feedbackTimeout = null;

    if (copyControls.length === 0) {
        return;
    }

    const getControlParts = (mode) => {
        const container = document.querySelector(`[data-copy-result="${mode}"]`);

        return {
            container,
            button: container?.querySelector('[data-copy-button]') || null,
            status: container?.querySelector('[data-copy-status]') || null,
        };
    };

    const hasCurrentResult = (mode) => {
        const resultElement = document.querySelector(resultStateSelectors[mode]);
        return Boolean(resultElement?.classList.contains('has-result'));
    };

    const clearFeedback = (status) => {
        if (feedbackTimeout) {
            window.clearTimeout(feedbackTimeout);
            feedbackTimeout = null;
        }

        if (status) {
            status.textContent = '';
        }
    };

    const setFeedback = (status, message) => {
        clearFeedback(status);

        if (!status) {
            return;
        }

        status.textContent = message;
        feedbackTimeout = window.setTimeout(() => {
            status.textContent = '';
            feedbackTimeout = null;
        }, 2200);
    };

    const updateCopyButton = (mode) => {
        const { button, status } = getControlParts(mode);

        if (!button) {
            return;
        }

        const canCopy = latestResults.has(mode) && hasCurrentResult(mode);
        button.disabled = !canCopy;

        if (!canCopy) {
            clearFeedback(status);
        }
    };

    const copyWithFallback = (text) => {
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

    const copyText = async (text) => {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(text);
            return;
        }

        copyWithFallback(text);
    };

    document.addEventListener('calculator:history-entry', (event) => {
        const { mode, inputSummary, result } = event.detail || {};

        if (!modeTitles[mode] || !inputSummary || !result) {
            return;
        }

        latestResults.set(mode, {
            inputSummary,
            result,
        });
        updateCopyButton(mode);
    });

    copyControls.forEach((container) => {
        const mode = container.dataset.copyResult;
        const button = container.querySelector('[data-copy-button]');
        const status = container.querySelector('[data-copy-status]');
        const resultElement = document.querySelector(resultStateSelectors[mode]);

        if (!modeTitles[mode] || !button || !resultElement) {
            return;
        }

        button.addEventListener('click', async () => {
            const latestResult = latestResults.get(mode);

            if (!latestResult || !hasCurrentResult(mode)) {
                updateCopyButton(mode);
                return;
            }

            const copyPayload = `${modeTitles[mode]}\n${latestResult.inputSummary} → ${latestResult.result}`;

            try {
                await copyText(copyPayload);
                setFeedback(status, 'Copied!');
            } catch (error) {
                setFeedback(status, 'Copy failed');
            }
        });

        const observer = new MutationObserver(() => {
            updateCopyButton(mode);
        });

        observer.observe(resultElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
        updateCopyButton(mode);
    });
});
