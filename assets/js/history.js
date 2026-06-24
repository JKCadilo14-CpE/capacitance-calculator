// Recent calculations history: stores successful calculator results in localStorage.

document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'capacitanceCalculatorHistory:v1';
    const maximumEntries = 5;
    const historySections = Array.from(document.querySelectorAll('[data-history-mode]'));
    const modeDisplayNames = {
        'unit-converter': 'Unit Converter',
        series: 'Series Capacitance',
        parallel: 'Parallel Capacitance',
        'code-decoder': 'Capacitor Code Decoder',
        'rc-time': 'RC Time Constant',
        'charge-calculator': 'Charge Calculator',
        'energy-stored': 'Energy Stored',
    };

    if (historySections.length === 0) {
        return;
    }

    const emptyHistory = () => ({
        'unit-converter': [],
        series: [],
        parallel: [],
        'code-decoder': [],
        'rc-time': [],
        'charge-calculator': [],
        'energy-stored': [],
    });

    const readHistory = () => {
        try {
            const savedHistory = window.localStorage.getItem(storageKey);
            const parsedHistory = savedHistory ? JSON.parse(savedHistory) : {};

            return {
                ...emptyHistory(),
                ...parsedHistory,
            };
        } catch (error) {
            return emptyHistory();
        }
    };

    const writeHistory = (history) => {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(history));
            return true;
        } catch (error) {
            return false;
        }
    };

    const formatTimestamp = (timestamp) => {
        const ageInMs = Date.now() - timestamp;

        if (ageInMs >= 0 && ageInMs < 60000) {
            return 'Just now';
        }

        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        }).format(new Date(timestamp));
    };

    const formatExportTimestamp = (timestamp) => new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(timestamp));

    const formatIsoTimestamp = (timestamp) => new Date(timestamp).toISOString();

    const getModeDisplayName = (mode, entry = {}) => modeDisplayNames[mode] || entry.modeName || 'Calculator';

    const getExportFileBaseName = (mode) => `${mode}-history`;

    const escapeCsvField = (value) => {
        const text = String(value ?? '');

        if (/[",\r\n]/.test(text)) {
            return `"${text.replace(/"/g, '""')}"`;
        }

        return text;
    };

    const buildTextExport = (mode, entries) => entries
        .map((entry) => [
            getModeDisplayName(mode, entry),
            `${entry.inputSummary} → ${entry.result}`,
            `Date: ${formatExportTimestamp(entry.timestamp)}`,
        ].join('\n'))
        .join('\n\n');

    const buildCsvExport = (mode, entries) => {
        const rows = [
            ['Mode', 'Input', 'Result', 'Timestamp'],
            ...entries.map((entry) => [
                getModeDisplayName(mode, entry),
                entry.inputSummary,
                entry.result,
                formatIsoTimestamp(entry.timestamp),
            ]),
        ];

        return rows
            .map((row) => row.map(escapeCsvField).join(','))
            .join('\r\n');
    };

    const downloadFile = (fileName, content, mimeType) => {
        const blob = new Blob([content], {
            type: mimeType,
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const exportHistory = (mode, format) => {
        const entries = readHistory()[mode] || [];

        if (entries.length === 0) {
            return;
        }

        if (format === 'txt') {
            downloadFile(
                `${getExportFileBaseName(mode)}.txt`,
                buildTextExport(mode, entries),
                'text/plain;charset=utf-8',
            );
        }

        if (format === 'csv') {
            downloadFile(
                `${getExportFileBaseName(mode)}.csv`,
                `\uFEFF${buildCsvExport(mode, entries)}`,
                'text/csv;charset=utf-8',
            );
        }
    };

    const switchToMode = (mode) => {
        const modeSelect = document.querySelector('[data-mode-select]');

        if (!modeSelect) {
            return;
        }

        modeSelect.value = mode;
        modeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const restoreHistoryEntry = (mode, restoreData) => {
        if (!restoreData) {
            return;
        }

        switchToMode(mode);
        document.dispatchEvent(new CustomEvent('calculator:restore-history', {
            detail: {
                mode,
                restoreData,
            },
        }));
    };

    const createHistoryItem = (entry, historyMode) => {
        const item = document.createElement('li');
        item.className = 'history-entry';
        const isRestorable = Boolean(entry.restoreData);

        const meta = document.createElement('div');
        meta.className = 'history-entry-meta';

        const mode = document.createElement('span');
        mode.textContent = entry.modeName;

        const time = document.createElement('time');
        time.dateTime = new Date(entry.timestamp).toISOString();
        time.textContent = formatTimestamp(entry.timestamp);

        meta.append(mode, time);

        const calculation = document.createElement('p');
        calculation.className = 'history-entry-calculation';
        calculation.textContent = `${entry.inputSummary} → ${entry.result}`;

        if (isRestorable) {
            item.classList.add('is-restorable');

            const button = document.createElement('button');
            button.className = 'history-entry-button';
            button.type = 'button';
            button.setAttribute('aria-label', `Restore ${entry.modeName}: ${entry.inputSummary} to ${entry.result}`);
            button.append(meta, calculation);
            button.addEventListener('click', () => {
                restoreHistoryEntry(historyMode, entry.restoreData);
            });

            item.append(button);
        } else {
            item.classList.add('is-legacy');

            const hint = document.createElement('span');
            hint.className = 'history-entry-hint';
            hint.textContent = 'Saved result only';

            item.append(meta, calculation, hint);
        }

        return item;
    };

    const renderHistory = () => {
        const history = readHistory();

        historySections.forEach((section) => {
            const mode = section.dataset.historyMode;
            const entries = history[mode] || [];
            const emptyElement = section.querySelector('[data-history-empty]');
            const listElement = section.querySelector('[data-history-list]');
            const clearButton = section.querySelector('[data-history-clear]');
            const exportButtons = Array.from(section.querySelectorAll('[data-history-export]'));

            if (!emptyElement || !listElement || !clearButton) {
                return;
            }

            listElement.replaceChildren(...entries.map((entry) => createHistoryItem(entry, mode)));
            emptyElement.hidden = entries.length > 0;
            listElement.hidden = entries.length === 0;
            clearButton.hidden = entries.length === 0;
            exportButtons.forEach((button) => {
                button.disabled = entries.length === 0;
            });
        });
    };

    const saveHistoryEntry = (entry) => {
        if (!entry?.mode || !entry?.modeName || !entry?.inputSummary || !entry?.result) {
            return;
        }

        const history = readHistory();
        const modeEntries = history[entry.mode] || [];

        const historyEntry = {
            modeName: entry.modeName,
            inputSummary: entry.inputSummary,
            result: entry.result,
            timestamp: entry.timestamp || Date.now(),
        };

        if (entry.restoreData && typeof entry.restoreData === 'object') {
            historyEntry.restoreData = entry.restoreData;
        }

        history[entry.mode] = [
            historyEntry,
            ...modeEntries,
        ].slice(0, maximumEntries);

        writeHistory(history);
        renderHistory();
    };

    document.addEventListener('calculator:history-entry', (event) => {
        saveHistoryEntry(event.detail);
    });

    historySections.forEach((section) => {
        const clearButton = section.querySelector('[data-history-clear]');

        clearButton?.addEventListener('click', () => {
            const history = readHistory();
            history[section.dataset.historyMode] = [];
            writeHistory(history);
            renderHistory();
        });

        section.querySelectorAll('[data-history-export]').forEach((button) => {
            button.addEventListener('click', () => {
                exportHistory(section.dataset.historyMode, button.dataset.historyExport);
            });
        });
    });

    renderHistory();
});
