<?php
$pageTitle = 'About | Capacitance Calculator';
$assetBase = '../assets';
$homeHref = '../index.php';
$workspaceHref = '../index.php#calculator-title';
$formulaReferenceHref = 'formula-reference.php';
$aboutHref = 'about.php';
$currentPage = 'about';
include __DIR__ . '/../includes/header.php';
?>

<section class="hero-section about-hero" aria-labelledby="page-title">
    <div class="hero-content">
        <p class="eyebrow">About The Project</p>
        <h1 id="page-title">Capacitance Calculator</h1>
        <p class="hero-copy">
            A browser-based electronics tool for converting capacitance units,
            solving common capacitor calculations, decoding capacitor markings,
            calculating circuit timing, charge, and stored energy, and learning
            the formulas behind each result.
        </p>
    </div>

    <aside class="about-summary panel" aria-label="Project summary">
        <i data-lucide="graduation-cap" aria-hidden="true"></i>
        <p>
            Built for learning, quick checks, and practical reference while
            studying or prototyping capacitor circuits.
        </p>
    </aside>
</section>

<section class="about-grid" aria-label="About Capacitance Calculator">
    <article class="formula-card about-card panel">
        <div class="formula-card-header">
            <i data-lucide="info" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">What It Is</p>
                <h2>A focused capacitance toolkit</h2>
            </div>
        </div>
        <p>
            Capacitance Calculator is a plain PHP and JavaScript web app that
            brings seven common capacitor tools into one responsive workspace.
            It keeps calculations approachable while still showing useful
            engineering details such as formulas, unit conversions, result
            breakdowns, and raw values where helpful.
        </p>
    </article>

    <article class="formula-card about-card panel">
        <div class="formula-card-header">
            <i data-lucide="users" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Who It Is For</p>
                <h2>Students, hobbyists, and makers</h2>
            </div>
        </div>
        <p>
            The project is designed for electronics students, beginners,
            hobbyists, makers, and anyone who wants a clearer way to work with
            capacitance values without memorizing every formula at once.
        </p>
    </article>

    <article class="formula-card about-card panel">
        <div class="formula-card-header">
            <i data-lucide="lightbulb" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Why It Was Built</p>
                <h2>Make capacitor math easier to use</h2>
            </div>
        </div>
        <p>
            Capacitor calculations often involve small units, prefixes, and
            formulas that can feel abstract at first. This app was built to
            make those calculations faster to perform, easier to read, and more
            comfortable on phones during hands-on study or prototyping.
        </p>
    </article>

    <article class="formula-card about-card panel">
        <div class="formula-card-header">
            <i data-lucide="sparkles" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Main Features</p>
                <h2>Tools for everyday capacitor work</h2>
            </div>
        </div>
        <ul class="about-list">
            <li>Unit Converter for pF, nF, µF, and F.</li>
            <li>Series and Parallel capacitance calculators.</li>
            <li>Capacitor Code Decoder for standard 3-digit markings.</li>
            <li>RC Time Constant calculator for simple timing circuits.</li>
            <li>Charge Calculator using Q = C × V.</li>
            <li>Energy Stored calculator using E = 1/2 × C × V².</li>
            <li>Formula Reference page for beginner-friendly explanations.</li>
            <li>Local history with restore, export, and copy result tools.</li>
            <li>Mobile-friendly keypads and dark/light theme support.</li>
        </ul>
    </article>

    <article class="formula-card about-card panel">
        <div class="formula-card-header">
            <i data-lucide="code-2" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Technologies Used</p>
                <h2>Simple web stack</h2>
            </div>
        </div>
        <ul class="about-list about-tech-list">
            <li>PHP includes for shared layout.</li>
            <li>HTML5 semantic page structure.</li>
            <li>CSS custom properties for dark/light themes.</li>
            <li>Vanilla JavaScript for calculator behavior.</li>
            <li>Lucide Icons via CDN.</li>
            <li>XAMPP for local development.</li>
            <li>Playwright for browser testing.</li>
        </ul>
    </article>

    <article class="formula-card about-card about-note panel">
        <div class="formula-card-header">
            <i data-lucide="book-open-check" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Educational Use</p>
                <h2>Reference first, final design second</h2>
            </div>
        </div>
        <p>
            Calculations in this project are intended for educational and
            reference use. For critical circuit designs, verify results with
            datasheets, component tolerances, measurement tools, and accepted
            engineering practices, especially when working with charged
            capacitors or higher-voltage circuits.
        </p>
    </article>
</section>

<?php include __DIR__ . '/../includes/footer.php'; ?>
