// Starter main script: bootstraps shared UI behavior and initializes Lucide icons.

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
});
