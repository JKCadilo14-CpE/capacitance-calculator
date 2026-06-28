// Advanced Physics calculator workflow toggles.

const modeToPanelId = {
    'advanced-parallel-plate': 'parallel-plate-calculator',
    'advanced-cylindrical': 'cylindrical-calculator',
    'advanced-spherical': 'spherical-calculator',
    'advanced-dielectric': 'dielectric-calculator',
    'advanced-electric-field': 'electric-field-calculator',
};

const openLabel = 'Open Calculator';
const hideLabel = 'Hide Calculator';

const getMotionPreference = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

const getFirstUsefulControl = (panel) => {
    const selectors = [
        'input:not([type="hidden"]):not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
    ];

    for (const selector of selectors) {
        const control = Array.from(panel.querySelectorAll(selector))
            .find((candidate) => !candidate.closest('[hidden]'));

        if (control) {
            return control;
        }
    }

    return null;
};

const getHeaderBottom = () => document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;

const scrollPanelIntoView = (panel) => {
    const bounds = panel.getBoundingClientRect();
    const headerBottom = getHeaderBottom();
    const needsScroll = bounds.top < headerBottom || bounds.top > window.innerHeight * 0.7;

    if (!needsScroll) {
        return;
    }

    panel.scrollIntoView({
        block: 'start',
        behavior: getMotionPreference(),
    });
};

export const initAdvancedCalculatorToggles = () => {
    const toggleButtons = Array.from(document.querySelectorAll('[data-advanced-calculator-toggle]'));

    if (toggleButtons.length === 0) {
        return;
    }

    const panelById = new Map();
    const buttonByPanelId = new Map();

    const setButtonState = (button, isExpanded) => {
        const label = button.querySelector('[data-advanced-calculator-toggle-label]');

        button.setAttribute('aria-expanded', String(isExpanded));

        if (label) {
            label.textContent = isExpanded ? hideLabel : openLabel;
        }
    };

    const setPanelState = (panel, isExpanded) => {
        panel.hidden = !isExpanded;
    };

    const openPanel = (panelId, options = {}) => {
        const panel = panelById.get(panelId);
        const button = buttonByPanelId.get(panelId);

        if (!panel || !button) {
            return;
        }

        setPanelState(panel, true);
        setButtonState(button, true);

        if (options.scroll) {
            scrollPanelIntoView(panel);
        }

        if (options.focus) {
            window.requestAnimationFrame(() => {
                const control = getFirstUsefulControl(panel);

                if (control) {
                    control.focus({
                        preventScroll: true,
                    });
                }
            });
        }
    };

    const closePanel = (panelId) => {
        const panel = panelById.get(panelId);
        const button = buttonByPanelId.get(panelId);

        if (!panel || !button) {
            return;
        }

        setPanelState(panel, false);
        setButtonState(button, false);
    };

    toggleButtons.forEach((button) => {
        const panelId = button.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;

        if (!panel) {
            return;
        }

        panelById.set(panelId, panel);
        buttonByPanelId.set(panelId, button);
        setPanelState(panel, false);
        setButtonState(button, false);

        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                closePanel(panelId);
                return;
            }

            openPanel(panelId, {
                focus: true,
                scroll: true,
            });
        });
    });

    const openPanelFromHash = () => {
        const panelId = decodeURIComponent(window.location.hash.replace(/^#/, ''));

        if (!panelById.has(panelId)) {
            return;
        }

        openPanel(panelId, {
            focus: false,
            scroll: true,
        });
    };

    document.addEventListener('calculator:restore-history', (event) => {
        const panelId = modeToPanelId[event.detail?.mode];

        if (!panelId) {
            return;
        }

        openPanel(panelId, {
            focus: false,
            scroll: true,
        });
    });

    window.addEventListener('hashchange', openPanelFromHash);
    openPanelFromHash();
};
