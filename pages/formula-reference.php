<?php
$pageTitle = 'Formula Reference | Capacitance Calculator';
$assetBase = '../assets';
$homeHref = '../index.php';
$workspaceHref = '../index.php#calculator-title';
$formulaReferenceHref = 'formula-reference.php';
$advancedPhysicsHref = 'advanced-physics.php';
$aboutHref = 'about.php';
$currentPage = 'formula-reference';
include __DIR__ . '/../includes/header.php';
?>

<section class="hero-section formula-reference-hero" aria-labelledby="page-title">
    <div class="hero-content">
        <p class="eyebrow">Formula Reference</p>
        <h1 id="page-title">Capacitance Formulas Made Friendly</h1>
        <p class="hero-copy">
            A quick guide to the supported calculator modes. Each section
            explains what the formula means, shows a simple example, and
            points out when you would use it in an electronics project.
        </p>
    </div>

    <nav class="reference-toc panel" aria-label="Formula topics">
        <h2>On this page</h2>
        <a href="#unit-conversion">Unit Converter</a>
        <a href="#series-capacitance">Series Capacitance</a>
        <a href="#parallel-capacitance">Parallel Capacitance</a>
        <a href="#capacitor-code-decoder">Capacitor Code Decoder</a>
        <a href="#rc-time-constant">RC Time Constant</a>
        <a href="#capacitive-reactance">Capacitive Reactance</a>
        <a href="#charge-calculator">Charge Calculator</a>
        <a href="#energy-stored">Energy Stored</a>
    </nav>
</section>

<section class="formula-reference-grid" aria-label="Formula reference cards">
    <article class="formula-card panel" id="unit-conversion">
        <div class="formula-card-header">
            <i data-lucide="repeat-2" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Unit Converter</p>
                <h2>Unit Converter</h2>
            </div>
        </div>

        <div class="formula-block" aria-label="Unit conversion formula">
            <code>value in F = input × source unit factor</code>
            <code>converted value = value in F ÷ target unit factor</code>
        </div>

        <p>
            The Unit Converter works with capacitance units at different
            scales. The safest way to convert is to pass through farads first,
            then convert from farads into the unit you want.
        </p>

        <div class="reference-detail">
            <h3>Example calculation</h3>
            <p><strong>1000 pF</strong> equals <strong>1 nF</strong>.</p>
        </div>

        <div class="reference-detail">
            <h3>When to use it</h3>
            <p>
                Use unit conversion when two parts, datasheets, or calculator
                results use different prefixes and you want to compare them
                clearly.
            </p>
        </div>
    </article>

    <article class="formula-card panel" id="series-capacitance">
        <div class="formula-card-header">
            <i data-lucide="link" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Series Capacitance</p>
                <h2>Series Capacitance</h2>
            </div>
        </div>

        <div class="formula-block" aria-label="Series capacitance formula">
            <code>1/Ct = 1/C1 + 1/C2 + ...</code>
        </div>

        <p>
            In series, the total capacitance gets smaller than the smallest
            capacitor in the chain. The calculator adds the reciprocal of each
            capacitance, then takes the reciprocal of that sum.
        </p>

        <div class="reference-detail">
            <h3>Example calculation</h3>
            <p>
                Two <strong>10 µF</strong> capacitors in series give a total of
                <strong>5 µF</strong>.
            </p>
        </div>

        <div class="reference-detail">
            <h3>When to use it</h3>
            <p>
                Use the series formula when capacitors are connected in a
                single path, end-to-end, and charge must pass through each one.
            </p>
        </div>
    </article>

    <article class="formula-card panel" id="parallel-capacitance">
        <div class="formula-card-header">
            <i data-lucide="plus-circle" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Parallel Capacitance</p>
                <h2>Parallel Capacitance</h2>
            </div>
        </div>

        <div class="formula-block" aria-label="Parallel capacitance formula">
            <code>Ct = C1 + C2 + C3 + ...</code>
        </div>

        <p>
            In parallel, capacitance adds directly. Each capacitor contributes
            more storage, so the total capacitance is the sum of all capacitor
            values.
        </p>

        <div class="reference-detail">
            <h3>Example calculation</h3>
            <p><strong>100 µF + 200 µF</strong> gives <strong>300 µF</strong>.</p>
        </div>

        <div class="reference-detail">
            <h3>When to use it</h3>
            <p>
                Use the parallel formula when both leads of each capacitor are
                connected across the same two points in a circuit.
            </p>
        </div>
    </article>

    <article class="formula-card panel" id="capacitor-code-decoder">
        <div class="formula-card-header">
            <i data-lucide="binary" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Capacitor Code Decoder</p>
                <h2>Capacitor Code Decoder</h2>
            </div>
        </div>

        <div class="formula-block" aria-label="Capacitor code decoder formula">
            <code>first two digits = significant figures</code>
            <code>third digit = multiplier in pF</code>
        </div>

        <p>
            A three-digit capacitor code is written in picofarads. The first
            two digits give the starting number, and the third digit tells you
            how many zeros to add.
        </p>

        <div class="reference-detail">
            <h3>Example calculation</h3>
            <p>
                <strong>104</strong> means <strong>10 × 10^4 pF</strong>, so it
                equals <strong>100 nF</strong> or <strong>0.1 µF</strong>.
            </p>
        </div>

        <div class="reference-detail">
            <h3>When to use it</h3>
            <p>
                Use the decoder when a small ceramic capacitor has a marking
                like 104, 103, 472, or 223 instead of a full printed unit.
            </p>
        </div>
    </article>

    <article class="formula-card panel" id="rc-time-constant">
        <div class="formula-card-header">
            <i data-lucide="timer" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">RC Time Constant</p>
                <h2>RC Time Constant</h2>
            </div>
        </div>

        <div class="formula-block" aria-label="RC time constant formula">
            <code>τ = R × C</code>
        </div>

        <p>
            The time constant, called tau, tells you how quickly an RC circuit
            responds. Resistance is measured in ohms, capacitance is measured
            in farads, and the result is measured in seconds.
        </p>

        <div class="reference-detail">
            <h3>Example calculation</h3>
            <p>
                <strong>10 kΩ × 1 µF</strong> gives <strong>0.01 s</strong>,
                which is the same as <strong>10 ms</strong>.
            </p>
        </div>

        <div class="reference-detail">
            <h3>When to use it</h3>
            <p>
                Use RC time constant calculations for simple timing circuits,
                filters, debounce circuits, and capacitor charge/discharge
                estimates.
            </p>
        </div>
    </article>

    <article class="formula-card panel" id="capacitive-reactance">
        <div class="formula-card-header">
            <i data-lucide="activity" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">AC Calculation</p>
                <h2>Capacitive Reactance</h2>
            </div>
        </div>

        <div class="formula-block" aria-label="Capacitive reactance formula">
            <code>Xc = 1 / (2πfC)</code>
        </div>

        <p>
            Capacitive reactance describes how strongly a capacitor resists
            changing current in an AC circuit. Higher frequency or higher
            capacitance produces lower reactance.
        </p>

        <div class="reference-detail">
            <h3>Example calculation</h3>
            <p>
                <strong>1 kHz</strong> with <strong>100 nF</strong> gives about
                <strong>1.59 kΩ</strong>.
            </p>
        </div>

        <div class="reference-detail">
            <h3>When to use it</h3>
            <p>
                Use capacitive reactance when estimating how a capacitor behaves
                with AC signals, coupling paths, bypass capacitors, and simple
                frequency-dependent circuit behavior.
            </p>
        </div>
    </article>

    <article class="formula-card panel" id="charge-calculator">
        <div class="formula-card-header">
            <i data-lucide="circle-dot" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Charge Calculator</p>
                <h2>Charge Calculator</h2>
            </div>
        </div>

        <div class="formula-block" aria-label="Charge formula">
            <code>Q = C × V</code>
        </div>

        <p>
            Charge tells you how much electric charge is stored by a capacitor
            at a given voltage. Capacitance is measured in farads, voltage is
            measured in volts, and the result is measured in coulombs. The
            calculator also shows millicoulombs, microcoulombs, and
            nanocoulombs for easier reading.
        </p>

        <div class="reference-detail">
            <h3>Example calculation</h3>
            <p>
                <strong>1000 µF</strong> at <strong>12 V</strong> stores
                <strong>0.012 C</strong> of charge.
            </p>
        </div>

        <div class="reference-detail">
            <h3>When to use it</h3>
            <p>
                Use charge calculations when comparing capacitor storage,
                estimating available charge, or connecting capacitance and
                voltage to the amount of charge in a circuit.
            </p>
        </div>
    </article>

    <article class="formula-card panel" id="energy-stored">
        <div class="formula-card-header">
            <i data-lucide="battery-charging" aria-hidden="true"></i>
            <div>
                <p class="eyebrow">Energy Stored</p>
                <h2>Energy Stored</h2>
            </div>
        </div>

        <div class="formula-block" aria-label="Energy stored formula">
            <code>E = 1/2 × C × V²</code>
        </div>

        <p>
            A charged capacitor stores energy in its electric field. The
            capacitance is measured in farads, voltage is measured in volts,
            and the result is measured in joules. Because voltage is squared,
            stored energy rises quickly as voltage increases.
        </p>

        <div class="reference-detail">
            <h3>Example calculation</h3>
            <p>
                <strong>1000 µF</strong> charged to <strong>12 V</strong>
                stores <strong>0.072 J</strong>.
            </p>
        </div>

        <div class="reference-detail">
            <h3>When to use it</h3>
            <p>
                Use stored energy calculations for capacitor banks, pulse
                circuits, hold-up capacitors, and safety checks before working
                around charged capacitors.
            </p>
        </div>
    </article>
</section>

<?php include __DIR__ . '/../includes/footer.php'; ?>
