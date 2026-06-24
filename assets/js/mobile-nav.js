// Mobile navigation script: controls the header disclosure menu.

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('primary-nav-actions');
    const openIcon = toggle?.querySelector('[data-menu-icon="open"]');
    const closeIcon = toggle?.querySelector('[data-menu-icon="close"]');

    if (!toggle || !menu || !openIcon || !closeIcon) {
        return;
    }

    const setMenuOpen = (isOpen) => {
        toggle.setAttribute('aria-expanded', String(isOpen));
        menu.dataset.mobileMenuOpen = String(isOpen);
        openIcon.hidden = isOpen;
        closeIcon.hidden = !isOpen;
    };

    const isMenuOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    toggle.addEventListener('click', () => {
        setMenuOpen(!isMenuOpen());
    });

    menu.addEventListener('click', (event) => {
        if (event.target.closest('#theme-toggle')) {
            return;
        }

        if (event.target.closest('a')) {
            setMenuOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isMenuOpen()) {
            setMenuOpen(false);
            toggle.focus();
        }
    });

    document.addEventListener('click', (event) => {
        if (!isMenuOpen()) {
            return;
        }

        if (event.target.closest('.site-nav')) {
            return;
        }

        setMenuOpen(false);
    });

    setMenuOpen(false);
});
