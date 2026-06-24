// Shared numeric keypad script: targets active calculator inputs without changing calculation logic.

document.addEventListener('DOMContentLoaded', () => {
    const keypad = document.getElementById('shared-input-keypad');
    const statusElement = document.getElementById('shared-keypad-status');
    const decimalButton = keypad?.querySelector('[data-shared-keypad-action="decimal"]');
    const inputSelector = '[data-shared-keypad-input]';
    const unsupportedMode = 'unit-converter';

    if (!keypad || !statusElement || !decimalButton) {
        return;
    }

    let activeInput = null;

    const getVisiblePanel = () => Array.from(document.querySelectorAll('[data-mode-panel]'))
        .find((panel) => !panel.hidden);

    const isDigitsInput = (input) => input?.dataset.keypadType === 'digits';

    const getInputLabel = (input) => input?.dataset.keypadLabel || input?.getAttribute('aria-label') || 'Input';

    const getInsertionAnchor = (panel) => {
        if (!panel) {
            return null;
        }

        return panel.querySelector('[data-shared-keypad-anchor]');
    };

    const refreshLucideIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    };

    const setStatus = (label = 'None selected') => {
        statusElement.textContent = `Active input: ${label}`;
    };

    const updateDecimalState = () => {
        const shouldDisableDecimal = !activeInput || isDigitsInput(activeInput);
        decimalButton.disabled = shouldDisableDecimal;
        decimalButton.setAttribute('aria-disabled', String(shouldDisableDecimal));
    };

    const clearActiveHighlight = () => {
        if (activeInput) {
            activeInput.classList.remove('is-keypad-active');
            activeInput.removeAttribute('data-keypad-active');
        }
    };

    const placeKeypad = (panel = getVisiblePanel()) => {
        if (!panel || panel.dataset.modePanel === unsupportedMode) {
            keypad.hidden = true;
            return;
        }

        const anchor = getInsertionAnchor(panel);

        if (!anchor) {
            keypad.hidden = true;
            return;
        }

        anchor.insertAdjacentElement('afterend', keypad);
        keypad.hidden = false;
        refreshLucideIcons();
    };

    const getActiveModeForm = () => {
        const activePanel = activeInput?.closest('[data-mode-panel]');

        if (activeInput && activePanel && !activePanel.hidden && activePanel.dataset.modePanel !== unsupportedMode) {
            return activeInput.closest('form');
        }

        const visiblePanel = getVisiblePanel();

        if (!visiblePanel || visiblePanel.dataset.modePanel === unsupportedMode) {
            return null;
        }

        return visiblePanel.querySelector('form');
    };

    const clearActiveInput = () => {
        clearActiveHighlight();
        activeInput = null;
        setStatus();
        updateDecimalState();
    };

    const setActiveInput = (input) => {
        if (!input?.matches(inputSelector)) {
            return;
        }

        const panel = input.closest('[data-mode-panel]');

        if (!panel || panel.hidden || panel.dataset.modePanel === unsupportedMode) {
            return;
        }

        clearActiveHighlight();
        activeInput = input;
        activeInput.classList.add('is-keypad-active');
        activeInput.dataset.keypadActive = 'true';
        setStatus(getInputLabel(activeInput));
        placeKeypad(panel);
        updateDecimalState();
    };

    const focusActiveInput = () => {
        if (activeInput && document.activeElement !== activeInput) {
            activeInput.focus({ preventScroll: true });
        }
    };

    const getSelectionRange = (input) => {
        const valueLength = input.value.length;
        const start = typeof input.selectionStart === 'number' ? input.selectionStart : valueLength;
        const end = typeof input.selectionEnd === 'number' ? input.selectionEnd : valueLength;

        return {
            start,
            end,
        };
    };

    const setValueAndCursor = (input, value, cursorPosition) => {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        focusActiveInput();

        if (typeof input.setSelectionRange === 'function') {
            input.setSelectionRange(cursorPosition, cursorPosition);
        }
    };

    const insertIntoActiveInput = (text) => {
        if (!activeInput) {
            return;
        }

        const { start, end } = getSelectionRange(activeInput);
        const before = activeInput.value.slice(0, start);
        const after = activeInput.value.slice(end);
        let nextValue = `${before}${text}${after}`;
        let nextCursor = start + text.length;

        if (isDigitsInput(activeInput)) {
            const maxLength = Number(activeInput.dataset.keypadMax || activeInput.getAttribute('maxlength') || 3);
            const digitValue = nextValue.replace(/\D/g, '').slice(0, maxLength);
            nextCursor = Math.min(nextCursor, digitValue.length);
            nextValue = digitValue;
        }

        setValueAndCursor(activeInput, nextValue, nextCursor);
    };

    const insertDecimal = () => {
        if (!activeInput || isDigitsInput(activeInput)) {
            return;
        }

        const { start, end } = getSelectionRange(activeInput);
        const selectedText = activeInput.value.slice(start, end);

        if (activeInput.value.includes('.') && !selectedText.includes('.')) {
            return;
        }

        const decimalText = start === 0 && end === activeInput.value.length ? '0.' : '.';
        insertIntoActiveInput(decimalText);
    };

    const backspaceActiveInput = () => {
        if (!activeInput) {
            return;
        }

        const { start, end } = getSelectionRange(activeInput);

        if (start === 0 && end === 0) {
            return;
        }

        const deleteStart = start === end ? Math.max(0, start - 1) : start;
        const before = activeInput.value.slice(0, deleteStart);
        const after = activeInput.value.slice(end);
        setValueAndCursor(activeInput, `${before}${after}`, deleteStart);
    };

    const clearActiveInputValue = () => {
        if (!activeInput) {
            return;
        }

        setValueAndCursor(activeInput, '', 0);
    };

    const calculateActiveMode = () => {
        const form = getActiveModeForm();

        if (!form) {
            return;
        }

        if (typeof form.requestSubmit === 'function') {
            form.requestSubmit();
            return;
        }

        form.querySelector('button[type="submit"]')?.click();
    };

    const handleAction = (action) => {
        if (action === 'decimal') {
            insertDecimal();
        }

        if (action === 'backspace') {
            backspaceActiveInput();
        }

        if (action === 'clear') {
            clearActiveInputValue();
        }

        if (action === 'calculate') {
            calculateActiveMode();
        }
    };

    document.addEventListener('focusin', (event) => {
        if (event.target.matches(inputSelector)) {
            setActiveInput(event.target);
        }
    });

    document.addEventListener('pointerdown', (event) => {
        if (event.target.closest('#shared-input-keypad button')) {
            event.preventDefault();
        }
    });

    keypad.addEventListener('click', (event) => {
        const button = event.target.closest('button');

        if (!button || button.disabled) {
            return;
        }

        const value = button.dataset.sharedKeypadValue;
        const action = button.dataset.sharedKeypadAction;

        if (value) {
            insertIntoActiveInput(value);
            return;
        }

        if (action) {
            handleAction(action);
        }
    });

    document.querySelectorAll('[data-mode-select]').forEach((select) => {
        select.addEventListener('change', () => {
            clearActiveInput();
            window.setTimeout(() => placeKeypad(), 0);
        });
    });

    document.addEventListener('click', (event) => {
        const targetInput = event.target.closest(inputSelector);

        if (targetInput) {
            setActiveInput(targetInput);
        }
    });

    placeKeypad();
    updateDecimalState();
});
