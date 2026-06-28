<?php
$pageTitle = 'Advanced Physics | Capacitance Calculator';
$assetBase = '../assets';
$homeHref = '../index.php';
$workspaceHref = '../index.php#calculator-title';
$formulaReferenceHref = 'formula-reference.php';
$advancedPhysicsHref = 'advanced-physics.php';
$aboutHref = 'about.php';
$currentPage = 'advanced-physics';
include __DIR__ . '/../includes/header.php';
?>

<section class="hero-section advanced-physics-hero" aria-labelledby="page-title">
    <div class="hero-content">
        <p class="eyebrow">Advanced Physics</p>
        <h1 id="page-title">Advanced Physics</h1>
        <p class="hero-copy">
            Advanced capacitor theory and geometry models for students studying
            electromagnetics and physics. This section connects capacitance to
            fields, materials, and idealized conductor shapes beyond everyday
            electronics calculations.
        </p>
    </div>

    <nav class="reference-toc advanced-topics-panel panel" id="advanced-topics" aria-label="Advanced physics overview and topics">
        <div class="about-summary advanced-topics-summary">
            <i data-lucide="graduation-cap" aria-hidden="true"></i>
            <p>
                A theory-first learning area designed to grow into interactive
                geometry calculators without changing the main calculator workspace.
            </p>
        </div>

        <h2>Jump to Topics</h2>
        <a href="#parallel-plate-capacitor">Parallel Plate Capacitor</a>
        <a href="#cylindrical-capacitor">Cylindrical Capacitor</a>
        <a href="#spherical-capacitor">Spherical Capacitor</a>
        <a href="#dielectric-materials">Dielectric Materials</a>
        <a href="#electric-field-capacitance">Electric Field &amp; Capacitance</a>
    </nav>
</section>

<a class="button button-secondary advanced-mobile-topics-link" href="#advanced-topics">
    <i data-lucide="list" aria-hidden="true"></i>
    <span>Jump to Topics</span>
</a>

<section class="advanced-physics-grid" aria-label="Advanced physics topics">
    <article class="formula-card advanced-physics-card panel" id="parallel-plate-capacitor">
        <div class="formula-card-header">
            <i data-lucide="plus-circle" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Geometry Model</p>
                <h2>Parallel Plate Capacitor</h2>
            </div>
        </div>

        <div class="advanced-card-meta" aria-label="Topic difficulty">
            <span class="difficulty-badge difficulty-badge-intermediate">Intermediate</span>
        </div>

        <div class="advanced-card-actions">
            <button class="button button-secondary advanced-jump-link advanced-calculator-toggle" type="button" aria-expanded="false" aria-controls="parallel-plate-calculator" data-advanced-calculator-toggle>
                <i data-lucide="arrow-down-circle" aria-hidden="true"></i>
                <span data-advanced-calculator-toggle-label>Open Calculator</span>
            </button>
        </div>

        <div class="advanced-illustration-placeholder" aria-label="Parallel plate illustration placeholder">
            <i data-lucide="list-plus" aria-hidden="true"></i>
            <span>Two conductive plates separated by a dielectric gap</span>
        </div>

        <div class="reference-detail">
            <h3>Theory</h3>
            <p>
                A parallel plate capacitor stores charge on two broad
                conducting surfaces. When the plate spacing is small compared
                with plate area, the electric field between the plates is
                nearly uniform.
            </p>
        </div>

        <div class="reference-detail">
            <h3>Formula</h3>
            <div class="formula-block" aria-label="Parallel plate capacitance formula">
                <code>C = &epsilon;A / d</code>
                <code>&epsilon; = &kappa;&epsilon;0</code>
            </div>
        </div>

        <div class="reference-detail">
            <h3>Applications</h3>
            <ul class="advanced-applications">
                <li>Capacitive sensors and touch surfaces.</li>
                <li>PCB copper areas that create small parasitic capacitance.</li>
                <li>Introductory electric field and energy density models.</li>
            </ul>
        </div>

        <div class="reference-detail advanced-calculator-section" id="parallel-plate-calculator" hidden>
            <h3>Interactive Calculator</h3>
            <div class="series-result-card calculator-result-display advanced-calculator-result" id="parallel-plate-result-card" aria-live="polite" aria-atomic="true">
                <div class="series-result-header">
                    <span class="advanced-result-label">
                        <i data-lucide="rectangle-horizontal" aria-hidden="true"></i>
                        <span class="result-label">Capacitance</span>
                    </span>
                </div>

                <div class="advanced-primary-result-panel">
                    <div class="advanced-primary-result-meta">
                        <span class="advanced-primary-caption">Primary Result</span>
                        <span class="series-result-state advanced-result-status" id="parallel-plate-result-state">Ready</span>
                    </div>
                    <output class="series-result-value advanced-primary-result" id="parallel-plate-primary-result">--</output>
                </div>
                <p class="result-summary" id="parallel-plate-summary">Enter plate geometry and relative permittivity to calculate capacitance.</p>

                <p class="advanced-result-section-label">Other Units</p>
                <div class="decoder-result-grid advanced-result-grid" aria-label="Capacitance results by unit">
                    <div class="decoder-result-unit">
                        <span>pF</span>
                        <output id="parallel-plate-result-pf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>nF</span>
                        <output id="parallel-plate-result-nf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>µF</span>
                        <output id="parallel-plate-result-uf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>F</span>
                        <output id="parallel-plate-result-f">--</output>
                    </div>
                </div>

                <div class="copy-result-actions advanced-copy-actions">
                    <button class="button button-secondary copy-result-button" type="button" id="copy-parallel-plate-result" aria-label="Copy Parallel Plate Capacitor result" disabled>
                        <i data-lucide="copy" aria-hidden="true"></i>
                        Copy Result
                    </button>
                    <span class="copy-result-status" id="parallel-plate-copy-status" aria-live="polite"></span>
                </div>
            </div>

            <form class="calculator-input-section advanced-calculator-form" id="parallel-plate-form" novalidate>
                <div class="advanced-calculator-input-grid">
                    <div class="field-group">
                        <label for="parallel-plate-area">Plate area A</label>
                        <input id="parallel-plate-area" name="area" type="text" inputmode="decimal" autocomplete="off" aria-describedby="parallel-plate-area-help parallel-plate-error">
                        <p class="field-help" id="parallel-plate-area-help">Area of one plate before unit conversion.</p>
                    </div>

                    <div class="field-group">
                        <label for="parallel-plate-area-unit">Area unit</label>
                        <select id="parallel-plate-area-unit" name="areaUnit">
                            <option value="m2">m²</option>
                            <option value="cm2">cm²</option>
                            <option value="mm2">mm²</option>
                        </select>
                    </div>

                    <div class="field-group">
                        <label for="parallel-plate-distance">Plate separation d</label>
                        <input id="parallel-plate-distance" name="distance" type="text" inputmode="decimal" autocomplete="off" aria-describedby="parallel-plate-distance-help parallel-plate-error">
                        <p class="field-help" id="parallel-plate-distance-help">Distance between the conductive plates.</p>
                    </div>

                    <div class="field-group">
                        <label for="parallel-plate-distance-unit">Distance unit</label>
                        <select id="parallel-plate-distance-unit" name="distanceUnit">
                            <option value="m">m</option>
                            <option value="cm">cm</option>
                            <option value="mm">mm</option>
                        </select>
                    </div>

                    <div class="field-group advanced-calculator-wide-field">
                        <label for="parallel-plate-relative-permittivity">Relative permittivity εr</label>
                        <input id="parallel-plate-relative-permittivity" name="relativePermittivity" type="text" inputmode="decimal" autocomplete="off" value="1" aria-describedby="parallel-plate-permittivity-help parallel-plate-error">
                        <p class="field-help" id="parallel-plate-permittivity-help">Use 1 for air or vacuum.</p>
                    </div>
                </div>

                <p class="field-error" id="parallel-plate-error" role="alert"></p>

                <div class="form-actions">
                    <button class="button button-primary" type="submit">
                        <i data-lucide="calculator" aria-hidden="true"></i>
                        Calculate
                    </button>
                    <button class="button button-secondary" type="button" id="clear-parallel-plate-calculator">
                        Clear
                    </button>
                </div>
            </form>

            <section class="calculation-history-placeholder advanced-recent-calculations" data-history-mode="advanced-parallel-plate" aria-labelledby="parallel-plate-history-title">
                <h4 id="parallel-plate-history-title">Recent Calculations</h4>
                <p id="parallel-plate-history-empty" data-history-empty>No saved calculations yet.</p>
                <ol class="history-list" id="parallel-plate-history-list" data-history-list aria-label="Recent Parallel Plate calculations"></ol>
                <div class="history-actions">
                    <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Parallel Plate history as TXT" disabled>
                        Export TXT
                    </button>
                    <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Parallel Plate history as CSV" disabled>
                        Export CSV
                    </button>
                    <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Parallel Plate history">
                        Clear History
                    </button>
                </div>
            </section>

            <section class="calculator-explanation-section advanced-explanation-section" aria-labelledby="parallel-plate-explanation-title">
                <h4 id="parallel-plate-explanation-title">Formula / Technical Details</h4>
                <div class="series-breakdown advanced-breakdown" id="parallel-plate-breakdown">
                    Formula: C = εA / d, where ε = εr × ε0.
                </div>
                <details class="series-technical-details" id="parallel-plate-technical-details">
                    <summary>Technical Details</summary>
                    <output id="parallel-plate-technical-output">Raw SI values will appear after calculation.</output>
                </details>
            </section>
        </div>

        <div class="advanced-back-to-topics-row">
            <a class="button button-secondary advanced-jump-link advanced-back-to-topics" href="#advanced-topics">
                <i data-lucide="arrow-up-circle" aria-hidden="true"></i>
                <span>Back to Topics</span>
            </a>
        </div>
    </article>

    <article class="formula-card advanced-physics-card panel" id="cylindrical-capacitor">
        <div class="formula-card-header">
            <i data-lucide="link" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Geometry Model</p>
                <h2>Cylindrical Capacitor</h2>
            </div>
        </div>

        <div class="advanced-card-meta" aria-label="Topic difficulty">
            <span class="difficulty-badge difficulty-badge-advanced">Advanced</span>
        </div>

        <div class="advanced-card-actions">
            <button class="button button-secondary advanced-jump-link advanced-calculator-toggle" type="button" aria-expanded="false" aria-controls="cylindrical-calculator" data-advanced-calculator-toggle>
                <i data-lucide="arrow-down-circle" aria-hidden="true"></i>
                <span data-advanced-calculator-toggle-label>Open Calculator</span>
            </button>
        </div>

        <div class="advanced-illustration-placeholder" aria-label="Cylindrical capacitor illustration placeholder">
            <i data-lucide="circle-dot" aria-hidden="true"></i>
            <span>One cylindrical conductor nested inside another</span>
        </div>

        <div class="reference-detail">
            <h3>Theory</h3>
            <p>
                A cylindrical capacitor models conductors arranged around a
                common axis. The electric field changes with radius, so the
                capacitance depends on the logarithmic ratio between outer and
                inner conductor radii.
            </p>
        </div>

        <div class="reference-detail">
            <h3>Formula</h3>
            <div class="formula-block" aria-label="Cylindrical capacitance formula">
                <code>C = 2&pi;&epsilon;L / ln(b/a)</code>
                <code>a = inner radius, b = outer radius</code>
            </div>
        </div>

        <div class="reference-detail">
            <h3>Applications</h3>
            <ul class="advanced-applications">
                <li>Coaxial cable capacitance per length.</li>
                <li>Cylindrical probes and shielded conductors.</li>
                <li>Radial field examples in electromagnetics courses.</li>
            </ul>
        </div>

        <div class="reference-detail advanced-calculator-section" id="cylindrical-calculator" hidden>
            <h3>Interactive Calculator</h3>
            <div class="series-result-card calculator-result-display advanced-calculator-result" id="cylindrical-result-card" aria-live="polite" aria-atomic="true">
                <div class="series-result-header">
                    <span class="advanced-result-label">
                        <i data-lucide="cylinder" aria-hidden="true"></i>
                        <span class="result-label">Capacitance</span>
                    </span>
                </div>

                <div class="advanced-primary-result-panel">
                    <div class="advanced-primary-result-meta">
                        <span class="advanced-primary-caption">Primary Result</span>
                        <span class="series-result-state advanced-result-status" id="cylindrical-result-state">Ready</span>
                    </div>
                    <output class="series-result-value advanced-primary-result" id="cylindrical-primary-result">--</output>
                </div>
                <p class="result-summary" id="cylindrical-summary">Enter cylindrical geometry and relative permittivity to calculate capacitance.</p>

                <p class="advanced-result-section-label">Other Units</p>
                <div class="decoder-result-grid advanced-result-grid" aria-label="Cylindrical capacitance results by unit">
                    <div class="decoder-result-unit">
                        <span>pF</span>
                        <output id="cylindrical-result-pf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>nF</span>
                        <output id="cylindrical-result-nf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>µF</span>
                        <output id="cylindrical-result-uf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>F</span>
                        <output id="cylindrical-result-f">--</output>
                    </div>
                </div>

                <div class="copy-result-actions advanced-copy-actions">
                    <button class="button button-secondary copy-result-button" type="button" id="copy-cylindrical-result" aria-label="Copy Cylindrical Capacitor result" disabled>
                        <i data-lucide="copy" aria-hidden="true"></i>
                        Copy Result
                    </button>
                    <span class="copy-result-status" id="cylindrical-copy-status" aria-live="polite"></span>
                </div>
            </div>

            <form class="calculator-input-section advanced-calculator-form" id="cylindrical-form" novalidate>
                <div class="advanced-calculator-input-grid">
                    <div class="field-group">
                        <label for="cylindrical-inner-radius">Inner radius a</label>
                        <input id="cylindrical-inner-radius" name="innerRadius" type="text" inputmode="decimal" autocomplete="off" aria-describedby="cylindrical-inner-radius-help cylindrical-error">
                        <p class="field-help" id="cylindrical-inner-radius-help">Radius of the inner conductor before unit conversion.</p>
                    </div>

                    <div class="field-group">
                        <label for="cylindrical-inner-radius-unit">Inner radius unit</label>
                        <select id="cylindrical-inner-radius-unit" name="innerRadiusUnit">
                            <option value="m">m</option>
                            <option value="cm">cm</option>
                            <option value="mm" selected>mm</option>
                        </select>
                    </div>

                    <div class="field-group">
                        <label for="cylindrical-outer-radius">Outer radius b</label>
                        <input id="cylindrical-outer-radius" name="outerRadius" type="text" inputmode="decimal" autocomplete="off" aria-describedby="cylindrical-outer-radius-help cylindrical-error">
                        <p class="field-help" id="cylindrical-outer-radius-help">Must be larger than the inner radius.</p>
                    </div>

                    <div class="field-group">
                        <label for="cylindrical-outer-radius-unit">Outer radius unit</label>
                        <select id="cylindrical-outer-radius-unit" name="outerRadiusUnit">
                            <option value="m">m</option>
                            <option value="cm">cm</option>
                            <option value="mm" selected>mm</option>
                        </select>
                    </div>

                    <div class="field-group">
                        <label for="cylindrical-length">Length L</label>
                        <input id="cylindrical-length" name="length" type="text" inputmode="decimal" autocomplete="off" aria-describedby="cylindrical-length-help cylindrical-error">
                        <p class="field-help" id="cylindrical-length-help">Active length of the overlapping cylindrical conductors.</p>
                    </div>

                    <div class="field-group">
                        <label for="cylindrical-length-unit">Length unit</label>
                        <select id="cylindrical-length-unit" name="lengthUnit">
                            <option value="m">m</option>
                            <option value="cm" selected>cm</option>
                            <option value="mm">mm</option>
                        </select>
                    </div>

                    <div class="field-group advanced-calculator-wide-field">
                        <label for="cylindrical-relative-permittivity">Relative permittivity εr</label>
                        <input id="cylindrical-relative-permittivity" name="relativePermittivity" type="text" inputmode="decimal" autocomplete="off" value="1" aria-describedby="cylindrical-permittivity-help cylindrical-error">
                        <p class="field-help" id="cylindrical-permittivity-help">Use 1 for air or vacuum.</p>
                    </div>
                </div>

                <p class="field-error" id="cylindrical-error" role="alert"></p>

                <div class="form-actions">
                    <button class="button button-primary" type="submit">
                        <i data-lucide="calculator" aria-hidden="true"></i>
                        Calculate
                    </button>
                    <button class="button button-secondary" type="button" id="clear-cylindrical-calculator">
                        Clear
                    </button>
                </div>
            </form>

            <section class="calculation-history-placeholder advanced-recent-calculations" data-history-mode="advanced-cylindrical" aria-labelledby="cylindrical-history-title">
                <h4 id="cylindrical-history-title">Recent Calculations</h4>
                <p id="cylindrical-history-empty" data-history-empty>No saved calculations yet.</p>
                <ol class="history-list" id="cylindrical-history-list" data-history-list aria-label="Recent Cylindrical calculations"></ol>
                <div class="history-actions">
                    <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Cylindrical history as TXT" disabled>
                        Export TXT
                    </button>
                    <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Cylindrical history as CSV" disabled>
                        Export CSV
                    </button>
                    <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Cylindrical history">
                        Clear History
                    </button>
                </div>
            </section>

            <section class="calculator-explanation-section advanced-explanation-section" aria-labelledby="cylindrical-explanation-title">
                <h4 id="cylindrical-explanation-title">Formula / Technical Details</h4>
                <div class="series-breakdown advanced-breakdown" id="cylindrical-breakdown">
                    Formula: C = 2πεL / ln(b/a), where ε = εr × ε0.
                </div>
                <details class="series-technical-details" id="cylindrical-technical-details">
                    <summary>Technical Details</summary>
                    <output id="cylindrical-technical-output">Raw SI values will appear after calculation.</output>
                </details>
            </section>
        </div>

        <div class="advanced-back-to-topics-row">
            <a class="button button-secondary advanced-jump-link advanced-back-to-topics" href="#advanced-topics">
                <i data-lucide="arrow-up-circle" aria-hidden="true"></i>
                <span>Back to Topics</span>
            </a>
        </div>
    </article>

    <article class="formula-card advanced-physics-card panel" id="spherical-capacitor">
        <div class="formula-card-header">
            <i data-lucide="circle-dot" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Geometry Model</p>
                <h2>Spherical Capacitor</h2>
            </div>
        </div>

        <div class="advanced-card-meta" aria-label="Topic difficulty">
            <span class="difficulty-badge difficulty-badge-advanced">Advanced</span>
        </div>

        <div class="advanced-card-actions">
            <button class="button button-secondary advanced-jump-link advanced-calculator-toggle" type="button" aria-expanded="false" aria-controls="spherical-calculator" data-advanced-calculator-toggle>
                <i data-lucide="arrow-down-circle" aria-hidden="true"></i>
                <span data-advanced-calculator-toggle-label>Open Calculator</span>
            </button>
        </div>

        <div class="advanced-illustration-placeholder" aria-label="Spherical capacitor illustration placeholder">
            <i data-lucide="circle-dot" aria-hidden="true"></i>
            <span>Concentric spherical conductors with radial field lines</span>
        </div>

        <div class="reference-detail">
            <h3>Theory</h3>
            <p>
                A spherical capacitor uses two concentric conducting shells.
                It is useful for studying radial symmetry because the field
                points outward or inward from the center instead of staying
                uniform across a flat gap.
            </p>
        </div>

        <div class="reference-detail">
            <h3>Formula</h3>
            <div class="formula-block" aria-label="Spherical capacitance formula">
                <code>C = 4&pi;&epsilon;ab / (b - a)</code>
                <code>a = inner radius, b = outer radius</code>
            </div>
        </div>

        <div class="reference-detail">
            <h3>Applications</h3>
            <ul class="advanced-applications">
                <li>Idealized isolated conductor and shell models.</li>
                <li>Radial electric field and potential examples.</li>
                <li>Physics problems involving symmetry and Gauss law.</li>
            </ul>
        </div>

        <div class="reference-detail advanced-calculator-section" id="spherical-calculator" hidden>
            <h3>Interactive Calculator</h3>
            <div class="series-result-card calculator-result-display advanced-calculator-result" id="spherical-result-card" aria-live="polite" aria-atomic="true">
                <div class="series-result-header">
                    <span class="advanced-result-label">
                        <i data-lucide="circle" aria-hidden="true"></i>
                        <span class="result-label">Capacitance</span>
                    </span>
                </div>

                <div class="advanced-primary-result-panel">
                    <div class="advanced-primary-result-meta">
                        <span class="advanced-primary-caption">Primary Result</span>
                        <span class="series-result-state advanced-result-status" id="spherical-result-state">Ready</span>
                    </div>
                    <output class="series-result-value advanced-primary-result" id="spherical-primary-result">--</output>
                </div>
                <p class="result-summary" id="spherical-summary">Enter spherical geometry and relative permittivity to calculate capacitance.</p>

                <p class="advanced-result-section-label">Other Units</p>
                <div class="decoder-result-grid advanced-result-grid" aria-label="Spherical capacitance results by unit">
                    <div class="decoder-result-unit">
                        <span>pF</span>
                        <output id="spherical-result-pf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>nF</span>
                        <output id="spherical-result-nf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>µF</span>
                        <output id="spherical-result-uf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>F</span>
                        <output id="spherical-result-f">--</output>
                    </div>
                </div>

                <div class="copy-result-actions advanced-copy-actions">
                    <button class="button button-secondary copy-result-button" type="button" id="copy-spherical-result" aria-label="Copy Spherical Capacitor result" disabled>
                        <i data-lucide="copy" aria-hidden="true"></i>
                        Copy Result
                    </button>
                    <span class="copy-result-status" id="spherical-copy-status" aria-live="polite"></span>
                </div>
            </div>

            <form class="calculator-input-section advanced-calculator-form" id="spherical-form" novalidate>
                <div class="advanced-calculator-input-grid">
                    <div class="field-group">
                        <label for="spherical-inner-radius">Inner radius a</label>
                        <input id="spherical-inner-radius" name="innerRadius" type="text" inputmode="decimal" autocomplete="off" aria-describedby="spherical-inner-radius-help spherical-error">
                        <p class="field-help" id="spherical-inner-radius-help">Radius of the inner spherical conductor before unit conversion.</p>
                    </div>

                    <div class="field-group">
                        <label for="spherical-inner-radius-unit">Inner radius unit</label>
                        <select id="spherical-inner-radius-unit" name="innerRadiusUnit">
                            <option value="m">m</option>
                            <option value="cm" selected>cm</option>
                            <option value="mm">mm</option>
                        </select>
                    </div>

                    <div class="field-group">
                        <label for="spherical-outer-radius">Outer radius b</label>
                        <input id="spherical-outer-radius" name="outerRadius" type="text" inputmode="decimal" autocomplete="off" aria-describedby="spherical-outer-radius-help spherical-error">
                        <p class="field-help" id="spherical-outer-radius-help">Must be larger than the inner radius.</p>
                    </div>

                    <div class="field-group">
                        <label for="spherical-outer-radius-unit">Outer radius unit</label>
                        <select id="spherical-outer-radius-unit" name="outerRadiusUnit">
                            <option value="m">m</option>
                            <option value="cm" selected>cm</option>
                            <option value="mm">mm</option>
                        </select>
                    </div>

                    <div class="field-group advanced-calculator-wide-field">
                        <label for="spherical-relative-permittivity">Relative permittivity εr</label>
                        <input id="spherical-relative-permittivity" name="relativePermittivity" type="text" inputmode="decimal" autocomplete="off" value="1" aria-describedby="spherical-permittivity-help spherical-error">
                        <p class="field-help" id="spherical-permittivity-help">Use 1 for air or vacuum.</p>
                    </div>
                </div>

                <p class="field-error" id="spherical-error" role="alert"></p>

                <div class="form-actions">
                    <button class="button button-primary" type="submit">
                        <i data-lucide="calculator" aria-hidden="true"></i>
                        Calculate
                    </button>
                    <button class="button button-secondary" type="button" id="clear-spherical-calculator">
                        Clear
                    </button>
                </div>
            </form>

            <section class="calculation-history-placeholder advanced-recent-calculations" data-history-mode="advanced-spherical" aria-labelledby="spherical-history-title">
                <h4 id="spherical-history-title">Recent Calculations</h4>
                <p id="spherical-history-empty" data-history-empty>No saved calculations yet.</p>
                <ol class="history-list" id="spherical-history-list" data-history-list aria-label="Recent Spherical calculations"></ol>
                <div class="history-actions">
                    <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Spherical history as TXT" disabled>
                        Export TXT
                    </button>
                    <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Spherical history as CSV" disabled>
                        Export CSV
                    </button>
                    <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Spherical history">
                        Clear History
                    </button>
                </div>
            </section>

            <section class="calculator-explanation-section advanced-explanation-section" aria-labelledby="spherical-explanation-title">
                <h4 id="spherical-explanation-title">Formula / Technical Details</h4>
                <div class="series-breakdown advanced-breakdown" id="spherical-breakdown">
                    Formula: C = 4πεab / (b - a), where ε = εr × ε0.
                </div>
                <details class="series-technical-details" id="spherical-technical-details">
                    <summary>Technical Details</summary>
                    <output id="spherical-technical-output">Raw SI values will appear after calculation.</output>
                </details>
            </section>
        </div>

        <div class="advanced-back-to-topics-row">
            <a class="button button-secondary advanced-jump-link advanced-back-to-topics" href="#advanced-topics">
                <i data-lucide="arrow-up-circle" aria-hidden="true"></i>
                <span>Back to Topics</span>
            </a>
        </div>
    </article>

    <article class="formula-card advanced-physics-card panel" id="dielectric-materials">
        <div class="formula-card-header">
            <i data-lucide="book-open-check" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Material Model</p>
                <h2>Dielectric Materials</h2>
            </div>
        </div>

        <div class="advanced-card-meta" aria-label="Topic difficulty">
            <span class="difficulty-badge difficulty-badge-intermediate">Intermediate</span>
        </div>

        <div class="advanced-card-actions">
            <button class="button button-secondary advanced-jump-link advanced-calculator-toggle" type="button" aria-expanded="false" aria-controls="dielectric-calculator" data-advanced-calculator-toggle>
                <i data-lucide="arrow-down-circle" aria-hidden="true"></i>
                <span data-advanced-calculator-toggle-label>Open Calculator</span>
            </button>
        </div>

        <div class="advanced-illustration-placeholder" aria-label="Dielectric material illustration placeholder">
            <i data-lucide="info" aria-hidden="true"></i>
            <span>Insulating material placed between capacitor conductors</span>
        </div>

        <div class="reference-detail">
            <h3>Theory</h3>
            <p>
                A dielectric is an insulating material that polarizes in an
                electric field. Its dielectric constant, also called relative
                permittivity, tells how much more capacitance the material can
                provide compared with vacuum.
            </p>
        </div>

        <div class="reference-detail">
            <h3>Formula</h3>
            <div class="formula-block" aria-label="Dielectric permittivity formulas">
                <code>&epsilon; = &kappa;&epsilon;0</code>
                <code>C = &kappa;C0</code>
            </div>
        </div>

        <div class="reference-detail">
            <h3>Applications</h3>
            <ul class="advanced-applications">
                <li>Selecting capacitor dielectrics for stability and size.</li>
                <li>Comparing ceramic, film, air, and vacuum behavior.</li>
                <li>Understanding how material choice changes capacitance.</li>
            </ul>
        </div>

        <div class="reference-detail advanced-calculator-section" id="dielectric-calculator" hidden>
            <h3>Interactive Calculator</h3>
            <div class="series-result-card calculator-result-display advanced-calculator-result" id="dielectric-result-card" aria-live="polite" aria-atomic="true">
                <div class="series-result-header">
                    <span class="advanced-result-label">
                        <i data-lucide="layers" aria-hidden="true"></i>
                        <span class="result-label">Adjusted Capacitance</span>
                    </span>
                </div>

                <div class="advanced-primary-result-panel">
                    <div class="advanced-primary-result-meta">
                        <span class="advanced-primary-caption">Primary Result</span>
                        <span class="series-result-state advanced-result-status" id="dielectric-result-state">Ready</span>
                    </div>
                    <output class="series-result-value advanced-primary-result" id="dielectric-primary-result">--</output>
                </div>
                <p class="result-summary" id="dielectric-summary">Enter a baseline capacitance and dielectric constant to calculate the material-adjusted capacitance.</p>

                <p class="advanced-result-section-label">Other Units</p>
                <div class="decoder-result-grid advanced-result-grid" aria-label="Dielectric-adjusted capacitance results by unit">
                    <div class="decoder-result-unit">
                        <span>pF</span>
                        <output id="dielectric-result-pf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>nF</span>
                        <output id="dielectric-result-nf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>µF</span>
                        <output id="dielectric-result-uf">--</output>
                    </div>
                    <div class="decoder-result-unit">
                        <span>F</span>
                        <output id="dielectric-result-f">--</output>
                    </div>
                </div>

                <div class="copy-result-actions advanced-copy-actions">
                    <button class="button button-secondary copy-result-button" type="button" id="copy-dielectric-result" aria-label="Copy Dielectric Materials result" disabled>
                        <i data-lucide="copy" aria-hidden="true"></i>
                        Copy Result
                    </button>
                    <span class="copy-result-status" id="dielectric-copy-status" aria-live="polite"></span>
                </div>
            </div>

            <form class="calculator-input-section advanced-calculator-form" id="dielectric-form" novalidate>
                <div class="advanced-calculator-input-grid">
                    <div class="field-group">
                        <label for="dielectric-baseline-capacitance">Baseline capacitance C0</label>
                        <input id="dielectric-baseline-capacitance" name="baselineCapacitance" type="text" inputmode="decimal" autocomplete="off" aria-describedby="dielectric-baseline-help dielectric-error">
                        <p class="field-help" id="dielectric-baseline-help">Capacitance before adding or changing the dielectric material.</p>
                    </div>

                    <div class="field-group">
                        <label for="dielectric-baseline-unit">Capacitance unit</label>
                        <select id="dielectric-baseline-unit" name="baselineUnit">
                            <option value="pF" selected>pF</option>
                            <option value="nF">nF</option>
                            <option value="uF">µF</option>
                            <option value="F">F</option>
                        </select>
                    </div>

                    <div class="field-group">
                        <label for="dielectric-material-preset">Material preset</label>
                        <select id="dielectric-material-preset" name="materialPreset" aria-describedby="dielectric-material-help">
                            <option value="custom">Custom</option>
                            <option value="vacuum-air" data-kappa="1" selected>Vacuum/Air = 1</option>
                            <option value="paper" data-kappa="3.5">Paper ≈ 3.5</option>
                            <option value="glass" data-kappa="5">Glass ≈ 5</option>
                            <option value="ceramic" data-kappa="10">Ceramic ≈ 10</option>
                            <option value="water" data-kappa="80">Water ≈ 80</option>
                        </select>
                        <p class="field-help" id="dielectric-material-help">Choose a common material or use Custom for measured values.</p>
                    </div>

                    <div class="field-group">
                        <label for="dielectric-relative-permittivity">Dielectric constant κ / εr</label>
                        <input id="dielectric-relative-permittivity" name="relativePermittivity" type="text" inputmode="decimal" autocomplete="off" value="1" aria-describedby="dielectric-permittivity-help dielectric-error">
                        <p class="field-help" id="dielectric-permittivity-help">Multiplier relative to vacuum permittivity.</p>
                    </div>
                </div>

                <p class="field-error" id="dielectric-error" role="alert"></p>

                <div class="form-actions">
                    <button class="button button-primary" type="submit">
                        <i data-lucide="calculator" aria-hidden="true"></i>
                        Calculate
                    </button>
                    <button class="button button-secondary" type="button" id="clear-dielectric-calculator">
                        Clear
                    </button>
                </div>
            </form>

            <section class="calculation-history-placeholder advanced-recent-calculations" data-history-mode="advanced-dielectric" aria-labelledby="dielectric-history-title">
                <h4 id="dielectric-history-title">Recent Calculations</h4>
                <p id="dielectric-history-empty" data-history-empty>No saved calculations yet.</p>
                <ol class="history-list" id="dielectric-history-list" data-history-list aria-label="Recent Dielectric calculations"></ol>
                <div class="history-actions">
                    <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Dielectric history as TXT" disabled>
                        Export TXT
                    </button>
                    <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Dielectric history as CSV" disabled>
                        Export CSV
                    </button>
                    <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Dielectric history">
                        Clear History
                    </button>
                </div>
            </section>

            <section class="calculator-explanation-section advanced-explanation-section" aria-labelledby="dielectric-explanation-title">
                <h4 id="dielectric-explanation-title">Formula / Technical Details</h4>
                <div class="series-breakdown advanced-breakdown" id="dielectric-breakdown">
                    Formula: ε = κ × ε0 and C = κ × C0.
                </div>
                <details class="series-technical-details" id="dielectric-technical-details">
                    <summary>Technical Details</summary>
                    <output id="dielectric-technical-output">Raw SI values will appear after calculation.</output>
                </details>
            </section>
        </div>

        <div class="advanced-back-to-topics-row">
            <a class="button button-secondary advanced-jump-link advanced-back-to-topics" href="#advanced-topics">
                <i data-lucide="arrow-up-circle" aria-hidden="true"></i>
                <span>Back to Topics</span>
            </a>
        </div>
    </article>

    <article class="formula-card advanced-physics-card panel" id="electric-field-capacitance">
        <div class="formula-card-header">
            <i data-lucide="activity" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Field Concept</p>
                <h2>Electric Field &amp; Capacitance</h2>
            </div>
        </div>

        <div class="advanced-card-meta" aria-label="Topic difficulty">
            <span class="difficulty-badge difficulty-badge-advanced">Advanced</span>
        </div>

        <div class="advanced-card-actions">
            <button class="button button-secondary advanced-jump-link advanced-calculator-toggle" type="button" aria-expanded="false" aria-controls="electric-field-calculator" data-advanced-calculator-toggle>
                <i data-lucide="arrow-down-circle" aria-hidden="true"></i>
                <span data-advanced-calculator-toggle-label>Open Calculator</span>
            </button>
        </div>

        <div class="advanced-illustration-placeholder" aria-label="Electric field illustration placeholder">
            <i data-lucide="zap" aria-hidden="true"></i>
            <span>Stored charge, voltage difference, and electric field strength</span>
        </div>

        <div class="reference-detail">
            <h3>Theory</h3>
            <p>
                Capacitance connects stored charge to electric potential. In
                many simple models, a stronger electric field means a greater
                voltage difference across the same distance, while capacitance
                describes how much charge is needed to create that voltage.
            </p>
        </div>

        <div class="reference-detail">
            <h3>Formula</h3>
            <div class="formula-block" aria-label="Electric field and capacitance formulas">
                <code>E = V / d</code>
                <code>V = E &times; d</code>
                <code>d = V / E</code>
                <code>C = Q / V</code>
            </div>
        </div>

        <div class="reference-detail">
            <h3>Applications</h3>
            <ul class="advanced-applications">
                <li>Connecting voltage, stored charge, and field strength.</li>
                <li>Reasoning about insulation spacing and breakdown limits.</li>
                <li>Studying energy stored in an electric field.</li>
            </ul>
        </div>

        <div class="reference-detail advanced-calculator-section" id="electric-field-calculator" hidden>
            <h3>Interactive Calculator</h3>
            <div class="series-result-card calculator-result-display advanced-calculator-result" id="electric-field-result-card" aria-live="polite" aria-atomic="true">
                <div class="series-result-header">
                    <span class="advanced-result-label">
                        <i data-lucide="zap" aria-hidden="true"></i>
                        <span class="result-label" id="electric-field-result-label">Electric Field</span>
                    </span>
                </div>

                <div class="advanced-primary-result-panel">
                    <div class="advanced-primary-result-meta">
                        <span class="advanced-primary-caption">Primary Result</span>
                        <span class="series-result-state advanced-result-status" id="electric-field-result-state">Ready</span>
                    </div>
                    <output class="series-result-value advanced-primary-result" id="electric-field-primary-result">--</output>
                </div>
                <p class="result-summary" id="electric-field-summary">Choose a mode and enter values to connect field strength, voltage, distance, charge, and capacitance.</p>

                <p class="advanced-result-section-label">Other Units</p>
                <div class="decoder-result-grid advanced-result-grid" aria-label="Electric field and capacitance results by unit">
                    <div class="decoder-result-unit" id="electric-field-result-item-1">
                        <span id="electric-field-result-unit-1">V/m</span>
                        <output id="electric-field-result-1">--</output>
                    </div>
                    <div class="decoder-result-unit" id="electric-field-result-item-2">
                        <span id="electric-field-result-unit-2">kV/m</span>
                        <output id="electric-field-result-2">--</output>
                    </div>
                    <div class="decoder-result-unit" id="electric-field-result-item-3">
                        <span id="electric-field-result-unit-3">V/cm</span>
                        <output id="electric-field-result-3">--</output>
                    </div>
                    <div class="decoder-result-unit" id="electric-field-result-item-4" hidden>
                        <span id="electric-field-result-unit-4">--</span>
                        <output id="electric-field-result-4">--</output>
                    </div>
                </div>

                <div class="copy-result-actions advanced-copy-actions">
                    <button class="button button-secondary copy-result-button" type="button" id="copy-electric-field-result" aria-label="Copy Electric Field and Capacitance result" disabled>
                        <i data-lucide="copy" aria-hidden="true"></i>
                        Copy Result
                    </button>
                    <span class="copy-result-status" id="electric-field-copy-status" aria-live="polite"></span>
                </div>
            </div>

            <form class="calculator-input-section advanced-calculator-form" id="electric-field-form" novalidate>
                <div class="advanced-calculator-input-grid">
                    <div class="field-group advanced-calculator-wide-field">
                        <label for="electric-field-mode">Calculator mode</label>
                        <select id="electric-field-mode" name="mode">
                            <option value="field">Find Electric Field E</option>
                            <option value="voltage">Find Voltage V</option>
                            <option value="distance">Find Distance d</option>
                            <option value="capacitance">Find Capacitance C from Q and V</option>
                        </select>
                    </div>

                    <div class="field-group" data-electric-field-mode-field="field distance capacitance">
                        <label for="electric-field-voltage">Voltage V</label>
                        <input id="electric-field-voltage" name="voltage" type="text" inputmode="decimal" autocomplete="off" aria-describedby="electric-field-voltage-help electric-field-error">
                        <p class="field-help" id="electric-field-voltage-help">Voltage in volts.</p>
                    </div>

                    <div class="field-group" data-electric-field-mode-field="voltage distance">
                        <label for="electric-field-strength">Electric field E</label>
                        <input id="electric-field-strength" name="fieldStrength" type="text" inputmode="decimal" autocomplete="off" aria-describedby="electric-field-strength-help electric-field-error">
                        <p class="field-help" id="electric-field-strength-help">Field strength before unit conversion.</p>
                    </div>

                    <div class="field-group" data-electric-field-mode-field="voltage distance">
                        <label for="electric-field-strength-unit">Field unit</label>
                        <select id="electric-field-strength-unit" name="fieldStrengthUnit">
                            <option value="vm">V/m</option>
                            <option value="kvm">kV/m</option>
                            <option value="vcm">V/cm</option>
                        </select>
                    </div>

                    <div class="field-group" data-electric-field-mode-field="field voltage">
                        <label for="electric-field-distance">Distance d</label>
                        <input id="electric-field-distance" name="distance" type="text" inputmode="decimal" autocomplete="off" aria-describedby="electric-field-distance-help electric-field-error">
                        <p class="field-help" id="electric-field-distance-help">Separation distance before unit conversion.</p>
                    </div>

                    <div class="field-group" data-electric-field-mode-field="field voltage">
                        <label for="electric-field-distance-unit">Field distance unit</label>
                        <select id="electric-field-distance-unit" name="distanceUnit">
                            <option value="m">m</option>
                            <option value="cm">cm</option>
                            <option value="mm">mm</option>
                        </select>
                    </div>

                    <div class="field-group" data-electric-field-mode-field="capacitance">
                        <label for="electric-field-charge">Charge Q</label>
                        <input id="electric-field-charge" name="charge" type="text" inputmode="decimal" autocomplete="off" aria-describedby="electric-field-charge-help electric-field-error">
                        <p class="field-help" id="electric-field-charge-help">Stored charge before unit conversion.</p>
                    </div>

                    <div class="field-group" data-electric-field-mode-field="capacitance">
                        <label for="electric-field-charge-unit">Charge unit</label>
                        <select id="electric-field-charge-unit" name="chargeUnit">
                            <option value="C">C</option>
                            <option value="mC">mC</option>
                            <option value="uC">µC</option>
                            <option value="nC">nC</option>
                        </select>
                    </div>
                </div>

                <p class="field-error" id="electric-field-error" role="alert"></p>

                <div class="form-actions">
                    <button class="button button-primary" type="submit">
                        <i data-lucide="calculator" aria-hidden="true"></i>
                        Calculate
                    </button>
                    <button class="button button-secondary" type="button" id="clear-electric-field-calculator">
                        Clear
                    </button>
                </div>
            </form>

            <section class="calculation-history-placeholder advanced-recent-calculations" data-history-mode="advanced-electric-field" aria-labelledby="electric-field-history-title">
                <h4 id="electric-field-history-title">Recent Calculations</h4>
                <p id="electric-field-history-empty" data-history-empty>No saved calculations yet.</p>
                <ol class="history-list" id="electric-field-history-list" data-history-list aria-label="Recent Electric Field calculations"></ol>
                <div class="history-actions">
                    <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Electric Field history as TXT" disabled>
                        Export TXT
                    </button>
                    <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Electric Field history as CSV" disabled>
                        Export CSV
                    </button>
                    <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Electric Field history">
                        Clear History
                    </button>
                </div>
            </section>

            <section class="calculator-explanation-section advanced-explanation-section" aria-labelledby="electric-field-explanation-title">
                <h4 id="electric-field-explanation-title">Formula / Technical Details</h4>
                <div class="series-breakdown advanced-breakdown" id="electric-field-breakdown">
                    Formula: E = V / d, V = E × d, d = V / E, and C = Q / V.
                </div>
                <details class="series-technical-details" id="electric-field-technical-details">
                    <summary>Technical Details</summary>
                    <output id="electric-field-technical-output">Raw SI values will appear after calculation.</output>
                </details>
            </section>
        </div>

        <div class="advanced-back-to-topics-row">
            <a class="button button-secondary advanced-jump-link advanced-back-to-topics" href="#advanced-topics">
                <i data-lucide="arrow-up-circle" aria-hidden="true"></i>
                <span>Back to Topics</span>
            </a>
        </div>
    </article>
</section>

<script src="<?php echo htmlspecialchars($assetBase, ENT_QUOTES, 'UTF-8'); ?>/js/advanced-physics.js"></script>
<?php include __DIR__ . '/../includes/footer.php'; ?>
