// Theme toggle: applies and persists dark/light theme preference.

document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'capacitanceCalculatorTheme:v1';
    const toggle = document.getElementById('theme-toggle');
    const label = toggle?.querySelector('[data-theme-toggle-label]');
    const darkIcon = toggle?.querySelector('[data-theme-icon="dark"]');
    const lightIcon = toggle?.querySelector('[data-theme-icon="light"]');

    if (!toggle || !label || !darkIcon || !lightIcon) {
        return;
    }

    const getStoredTheme = () => {
        try {
            return window.localStorage.getItem(storageKey);
        } catch (error) {
            return null;
        }
    };

    const storeTheme = (theme) => {
        try {
            window.localStorage.setItem(storageKey, theme);
        } catch (error) {
            // Theme still changes for the current page view when storage is unavailable.
        }
    };

    const getCurrentTheme = () => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

    const renderThemeToggle = (theme) => {
        const isLight = theme === 'light';

        toggle.setAttribute('aria-pressed', String(isLight));
        toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
        label.textContent = isLight ? 'Light' : 'Dark';
        darkIcon.hidden = isLight;
        lightIcon.hidden = !isLight;
    };

    const applyTheme = (theme, shouldStore = true) => {
        if (theme === 'light') {
            document.documentElement.dataset.theme = 'light';
        } else {
            delete document.documentElement.dataset.theme;
        }

        if (shouldStore) {
            storeTheme(theme);
        }

        renderThemeToggle(theme);
    };

    const storedTheme = getStoredTheme();
    applyTheme(storedTheme === 'light' ? 'light' : 'dark', false);

    toggle.addEventListener('click', () => {
        applyTheme(getCurrentTheme() === 'light' ? 'dark' : 'light');
    });
});
