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
const animationFallbackMs = 360;

const getMotionPreference = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    const animationCleanupByPanel = new WeakMap();

    const setButtonState = (button, isExpanded) => {
        const label = button.querySelector('[data-advanced-calculator-toggle-label]');

        button.setAttribute('aria-expanded', String(isExpanded));

        if (label) {
            label.textContent = isExpanded ? hideLabel : openLabel;
        }
    };

    const cancelPanelAnimation = (panel) => {
        const cleanup = animationCleanupByPanel.get(panel);

        if (cleanup) {
            cleanup();
        }

        animationCleanupByPanel.delete(panel);
        panel.classList.remove('is-expanding', 'is-collapsing');
        panel.style.height = '';
        panel.style.overflow = '';
        panel.style.opacity = '';
        panel.style.transform = '';
    };

    const finishPanelAnimation = (panel, cleanup) => {
        cleanup();
        animationCleanupByPanel.delete(panel);
    };

    const setPanelState = (panel, isExpanded) => {
        cancelPanelAnimation(panel);
        panel.hidden = !isExpanded;
    };

    const animatePanelOpen = (panel, onReady = () => {}) => {
        cancelPanelAnimation(panel);

        if (!panel.hidden) {
            onReady();
            return;
        }

        panel.hidden = false;

        if (prefersReducedMotion()) {
            onReady();
            return;
        }

        let frame = 0;
        let timeout = 0;

        const cleanup = () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(timeout);
            panel.removeEventListener('transitionend', handleTransitionEnd);
            panel.classList.remove('is-expanding');
            panel.style.height = '';
            panel.style.overflow = '';
            panel.style.opacity = '';
            panel.style.transform = '';
        };

        const complete = () => {
            finishPanelAnimation(panel, cleanup);
            onReady();
        };

        function handleTransitionEnd(event) {
            if (event.target === panel && event.propertyName === 'height') {
                complete();
            }
        }

        panel.classList.add('is-expanding');
        panel.style.height = '0px';
        panel.style.overflow = 'hidden';
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(-0.25rem)';
        panel.addEventListener('transitionend', handleTransitionEnd);
        timeout = window.setTimeout(complete, animationFallbackMs);
        animationCleanupByPanel.set(panel, cleanup);

        frame = window.requestAnimationFrame(() => {
            panel.style.height = `${panel.scrollHeight}px`;
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        });
    };

    const animatePanelClose = (panel) => {
        cancelPanelAnimation(panel);

        if (panel.hidden) {
            return;
        }

        if (prefersReducedMotion()) {
            panel.hidden = true;
            return;
        }

        let frame = 0;
        let timeout = 0;

        const cleanup = () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(timeout);
            panel.removeEventListener('transitionend', handleTransitionEnd);
            panel.classList.remove('is-collapsing');
            panel.style.height = '';
            panel.style.overflow = '';
            panel.style.opacity = '';
            panel.style.transform = '';
        };

        const complete = () => {
            finishPanelAnimation(panel, cleanup);
            panel.hidden = true;
        };

        function handleTransitionEnd(event) {
            if (event.target === panel && event.propertyName === 'height') {
                complete();
            }
        }

        panel.classList.add('is-collapsing');
        panel.style.height = `${panel.scrollHeight}px`;
        panel.style.overflow = 'hidden';
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
        panel.addEventListener('transitionend', handleTransitionEnd);
        timeout = window.setTimeout(complete, animationFallbackMs);
        animationCleanupByPanel.set(panel, cleanup);

        panel.offsetHeight;

        frame = window.requestAnimationFrame(() => {
            panel.style.height = '0px';
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(-0.25rem)';
        });
    };

    const openPanel = (panelId, options = {}) => {
        const panel = panelById.get(panelId);
        const button = buttonByPanelId.get(panelId);

        if (!panel || !button) {
            return;
        }

        setButtonState(button, true);

        animatePanelOpen(panel, () => {
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
        });
    };

    const closePanel = (panelId) => {
        const panel = panelById.get(panelId);
        const button = buttonByPanelId.get(panelId);

        if (!panel || !button) {
            return;
        }

        setButtonState(button, false);
        animatePanelClose(panel);
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
