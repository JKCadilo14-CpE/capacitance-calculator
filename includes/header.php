<?php
$pageTitle = $pageTitle ?? 'Capacitance Calculator';
$assetBase = $assetBase ?? 'assets';
$homeHref = $homeHref ?? 'index.php';
$workspaceHref = $workspaceHref ?? 'index.php#calculator-title';
$formulaReferenceHref = $formulaReferenceHref ?? 'pages/formula-reference.php';
$advancedPhysicsHref = $advancedPhysicsHref ?? 'pages/advanced-physics.php';
$aboutHref = $aboutHref ?? 'pages/about.php';
$currentPage = $currentPage ?? 'home';
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?></title>
    <script>
        (function () {
            try {
                if (window.localStorage.getItem('capacitanceCalculatorTheme:v1') === 'light') {
                    document.documentElement.dataset.theme = 'light';
                }
            } catch (error) {
                delete document.documentElement.dataset.theme;
            }
        }());
    </script>
    <link rel="stylesheet" href="<?php echo htmlspecialchars($assetBase, ENT_QUOTES, 'UTF-8'); ?>/css/style.css">
    <link rel="stylesheet" href="<?php echo htmlspecialchars($assetBase, ENT_QUOTES, 'UTF-8'); ?>/css/calculator.css">
    <link rel="stylesheet" href="<?php echo htmlspecialchars($assetBase, ENT_QUOTES, 'UTF-8'); ?>/css/responsive.css">
    <link rel="icon" type="image/png" href="<?php echo htmlspecialchars($assetBase, ENT_QUOTES, 'UTF-8'); ?>/images/logo.svg">
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <header class="site-header">
        <nav class="site-nav" aria-label="Primary navigation">
            <a class="brand" href="<?php echo htmlspecialchars($homeHref, ENT_QUOTES, 'UTF-8'); ?>" aria-label="Capacitance Calculator home">
                <span class="brand-mark" aria-hidden="true">
                    <i data-lucide="sigma"></i>
                </span>
                <span>Capacitance Calculator</span>
            </a>

            <button class="menu-toggle" type="button" id="menu-toggle" aria-expanded="false" aria-controls="primary-nav-actions">
                <i data-lucide="menu" data-menu-icon="open" aria-hidden="true"></i>
                <i data-lucide="x" data-menu-icon="close" aria-hidden="true" hidden></i>
                <span>Menu</span>
            </button>

            <div class="nav-actions" id="primary-nav-actions" data-mobile-menu>
                <a href="<?php echo htmlspecialchars($homeHref, ENT_QUOTES, 'UTF-8'); ?>"<?php echo $currentPage === 'home' ? ' aria-current="page"' : ''; ?>>Home</a>
                <a href="<?php echo htmlspecialchars($formulaReferenceHref, ENT_QUOTES, 'UTF-8'); ?>"<?php echo $currentPage === 'formula-reference' ? ' aria-current="page"' : ''; ?>>Formula Reference</a>
                <a href="<?php echo htmlspecialchars($advancedPhysicsHref, ENT_QUOTES, 'UTF-8'); ?>"<?php echo $currentPage === 'advanced-physics' ? ' aria-current="page"' : ''; ?>>Advanced Physics</a>
                <a href="<?php echo htmlspecialchars($aboutHref, ENT_QUOTES, 'UTF-8'); ?>"<?php echo $currentPage === 'about' ? ' aria-current="page"' : ''; ?>>About</a>
                <button class="theme-toggle" type="button" id="theme-toggle" aria-label="Switch to light theme" aria-pressed="false">
                    <i data-lucide="moon" data-theme-icon="dark" aria-hidden="true"></i>
                    <i data-lucide="sun" data-theme-icon="light" aria-hidden="true"></i>
                    <span data-theme-toggle-label>Dark</span>
                </button>
            </div>
        </nav>
    </header>

    <main id="main-content" class="site-main">
