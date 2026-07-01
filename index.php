<?php
$pageTitle = 'Capacitance Calculator';
$currentPage = 'home';
include __DIR__ . '/includes/header.php';
?>

<section class="hero-section" aria-labelledby="page-title">
    <div class="hero-content">
        <p class="eyebrow">Electrical Engineering Tool</p>
        <h1 id="page-title">Capacitance Calculator</h1>
        <p class="hero-copy">
            Convert units, decode capacitor codes, and calculate capacitance
            or RC time constants with touch-friendly engineering tools.
        </p>
    </div>

    <div class="hero-status" aria-label="Project status">
        <i data-lucide="badge-check" aria-hidden="true"></i>
        <span>All calculator modes are ready</span>
    </div>
</section>

<section class="calculator-shell" aria-labelledby="calculator-title">
    <div class="section-heading">
        <p class="eyebrow">Calculator Modes</p>
        <h2 id="calculator-title">Convert or Calculate Capacitance</h2>
    </div>

    <div class="calculator-grid" id="unit-converter-panel" role="region" aria-labelledby="unit-converter-title" data-mode-panel="unit-converter">
        <article class="panel calculator-panel">
            <div class="panel-header">
                <i data-lucide="calculator" aria-hidden="true"></i>
                <h3 id="unit-converter-title">Unit Converter Calculator</h3>
            </div>

            <div class="mode-selector-card field-group">
                <label for="calculator-mode-unit">Select Calculator Mode</label>
                <select id="calculator-mode-unit" data-mode-select aria-controls="unit-converter-panel series-panel parallel-panel code-decoder-panel rc-time-panel capacitive-reactance-panel charge-calculator-panel energy-stored-panel">
                    <optgroup label="Basic">
                        <option value="unit-converter" selected>Unit Converter</option>
                        <option value="series">Series Capacitance</option>
                        <option value="parallel">Parallel Capacitance</option>
                        <option value="code-decoder">Capacitor Code Decoder</option>
                    </optgroup>
                    <optgroup label="Circuit Calculations">
                        <option value="rc-time">RC Time Constant</option>
                        <option value="charge-calculator">Charge Calculator</option>
                        <option value="energy-stored">Energy Stored</option>
                    </optgroup>
                    <optgroup label="AC Calculations">
                        <option value="capacitive-reactance">Capacitive Reactance</option>
                    </optgroup>
                </select>
            </div>

            <form class="converter-calculator calculator-device" id="unit-converter-form" tabindex="0" aria-describedby="calculator-help value-error" novalidate>
                <div class="calculator-display" aria-live="polite" aria-atomic="true">
                    <span class="display-label">Input</span>
                    <output class="display-input" id="calculator-input-display">0</output>
                    <span class="display-label">Converted Result</span>
                    <output class="display-result" id="converter-result">--</output>
                    <span class="result-summary" id="converter-summary">Waiting for input.</span>
                    <div class="copy-result-actions" data-copy-result="unit-converter">
                        <button class="button button-secondary copy-result-button" type="button" data-copy-button data-copy-mode="unit-converter" aria-label="Copy Unit Converter result" disabled>
                            <i data-lucide="copy" aria-hidden="true"></i>
                            Copy Result
                        </button>
                        <span class="copy-result-status" data-copy-status aria-live="polite"></span>
                    </div>
                </div>

                <p class="field-help" id="calculator-help">Use the keypad or your keyboard to enter a positive capacitance value.</p>
                <p class="field-error" id="value-error" role="alert"></p>

                <div class="unit-row">
                    <div class="field-group">
                        <label for="from-unit">From</label>
                        <select id="from-unit" name="from-unit">
                            <option value="pF">pF</option>
                            <option value="nF">nF</option>
                            <option value="uF">µF</option>
                            <option value="F">F</option>
                        </select>
                    </div>

                    <button class="swap-button" type="button" id="swap-units" aria-label="Swap from and to units">
                        <i data-lucide="arrow-left-right" aria-hidden="true"></i>
                    </button>

                    <div class="field-group">
                        <label for="to-unit">To</label>
                        <select id="to-unit" name="to-unit">
                            <option value="pF">pF</option>
                            <option value="nF" selected>nF</option>
                            <option value="uF">µF</option>
                            <option value="F">F</option>
                        </select>
                    </div>
                </div>

                <div class="calculator-keypad" aria-label="Numeric keypad">
                    <button class="key" type="button" data-value="7">7</button>
                    <button class="key" type="button" data-value="8">8</button>
                    <button class="key" type="button" data-value="9">9</button>
                    <button class="key key-secondary" type="button" data-action="backspace" aria-label="Backspace">
                        <i data-lucide="delete" aria-hidden="true"></i>
                    </button>

                    <button class="key" type="button" data-value="4">4</button>
                    <button class="key" type="button" data-value="5">5</button>
                    <button class="key" type="button" data-value="6">6</button>
                    <button class="key key-secondary" type="button" data-action="clear" aria-label="Clear input">C</button>

                    <button class="key" type="button" data-value="1">1</button>
                    <button class="key" type="button" data-value="2">2</button>
                    <button class="key" type="button" data-value="3">3</button>
                    <button class="key key-convert" type="button" data-action="convert" aria-label="Convert">=</button>

                    <button class="key key-zero" type="button" data-value="0">0</button>
                    <button class="key key-decimal" type="button" data-action="decimal" aria-label="Decimal point">.</button>
                </div>

                <section class="calculation-history-placeholder" data-history-mode="unit-converter" aria-labelledby="unit-converter-history-title">
                    <h4 id="unit-converter-history-title">Recent Calculations</h4>
                    <p data-history-empty>No saved calculations yet.</p>
                    <ol class="history-list" data-history-list aria-label="Recent Unit Converter calculations"></ol>
                    <div class="history-actions">
                        <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Unit Converter history as TXT" disabled>
                            Export TXT
                        </button>
                        <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Unit Converter history as CSV" disabled>
                            Export CSV
                        </button>
                        <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Unit Converter history">
                            Clear History
                        </button>
                    </div>
                </section>
            </form>
        </article>

        <article class="panel notes-panel">
            <div class="panel-header">
                <i data-lucide="book-open" aria-hidden="true"></i>
                <h3>Mode Notes</h3>
            </div>
            <ul class="debug-list">
                <li>Supported units: pF, nF, µF, and F.</li>
                <li>Conversion logic runs in the unit converter script.</li>
                <li>Series and Parallel modes are available from the in-card mode selector.</li>
                <li>Code Decoder mode is available from the in-card mode selector.</li>
                <li>RC Time mode is available from the in-card mode selector.</li>
                <li>Charge Calculator mode is available from the in-card mode selector.</li>
                <li>Energy Stored mode is available from the in-card mode selector.</li>
            </ul>
        </article>
    </div>

    <div class="calculator-grid" id="series-panel" role="region" aria-labelledby="series-title" data-mode-panel="series" hidden>
        <article class="panel calculator-panel">
            <div class="panel-header">
                <i data-lucide="list-plus" aria-hidden="true"></i>
                <h3 id="series-title">Series Capacitance Calculator</h3>
            </div>

            <div class="mode-selector-card field-group">
                <label for="calculator-mode-series">Select Calculator Mode</label>
                <select id="calculator-mode-series" data-mode-select aria-controls="unit-converter-panel series-panel parallel-panel code-decoder-panel rc-time-panel capacitive-reactance-panel charge-calculator-panel energy-stored-panel">
                    <optgroup label="Basic">
                        <option value="unit-converter">Unit Converter</option>
                        <option value="series" selected>Series Capacitance</option>
                        <option value="parallel">Parallel Capacitance</option>
                        <option value="code-decoder">Capacitor Code Decoder</option>
                    </optgroup>
                    <optgroup label="Circuit Calculations">
                        <option value="rc-time">RC Time Constant</option>
                        <option value="charge-calculator">Charge Calculator</option>
                        <option value="energy-stored">Energy Stored</option>
                    </optgroup>
                    <optgroup label="AC Calculations">
                        <option value="capacitive-reactance">Capacitive Reactance</option>
                    </optgroup>
                </select>
            </div>

            <form class="series-calculator calculator-device" id="series-calculator-form" aria-describedby="series-help series-error" novalidate>
                <div class="series-result-card calculator-result-display" id="series-result-card" aria-live="polite" aria-atomic="true">
                    <div class="series-result-header">
                        <span class="result-label">Total capacitance</span>
                        <span class="series-result-state" id="series-result-state">Ready</span>
                    </div>
                    <output class="series-result-value" id="series-result">--</output>
                    <span class="result-summary" id="series-summary">Waiting for capacitor values.</span>
                    <div class="copy-result-actions" data-copy-result="series">
                        <button class="button button-secondary copy-result-button" type="button" data-copy-button data-copy-mode="series" aria-label="Copy Series Capacitance result" disabled>
                            <i data-lucide="copy" aria-hidden="true"></i>
                            Copy Result
                        </button>
                        <span class="copy-result-status" data-copy-status aria-live="polite"></span>
                    </div>
                </div>

                <div class="calculator-input-section" data-shared-keypad-anchor>
                    <p class="field-help" id="series-help">
                        Add two or more capacitors. Each value is converted to farads before the series total is calculated.
                    </p>

                    <div class="series-list" id="series-capacitor-list" aria-label="Series capacitor values"></div>

                    <div class="series-actions">
                        <button class="button button-secondary" type="button" id="add-series-capacitor">
                            <i data-lucide="plus" aria-hidden="true"></i>
                            Add capacitor
                        </button>
                        <button class="button button-primary" type="submit">
                            Calculate Series
                        </button>
                    </div>

                    <p class="field-error" id="series-error" role="alert"></p>
                </div>

                <section class="calculation-history-placeholder" data-history-mode="series" aria-labelledby="series-history-title">
                    <h4 id="series-history-title">Recent Calculations</h4>
                    <p data-history-empty>No saved calculations yet.</p>
                    <ol class="history-list" data-history-list aria-label="Recent Series calculations"></ol>
                    <div class="history-actions">
                        <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Series history as TXT" disabled>
                            Export TXT
                        </button>
                        <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Series history as CSV" disabled>
                            Export CSV
                        </button>
                        <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Series history">
                            Clear History
                        </button>
                    </div>
                </section>

                <section class="calculator-explanation-section" aria-labelledby="series-explanation-title">
                    <h4 id="series-explanation-title">Formula / Technical Details</h4>
                    <div class="series-breakdown" id="series-breakdown">
                        Enter values for C1 and C2, then calculate to see the reciprocal breakdown.
                    </div>
                    <details class="series-technical-details" id="series-technical-details">
                        <summary>Technical Details</summary>
                        <output id="series-raw-farads">Raw total will appear after calculation.</output>
                    </details>
                </section>
            </form>
        </article>

        <article class="panel notes-panel">
            <div class="panel-header">
                <i data-lucide="sigma" aria-hidden="true"></i>
                <h3>Series Formula</h3>
            </div>
            <ul class="debug-list">
                <li>Series total uses the reciprocal formula.</li>
                <li>All inputs are converted to F before calculation.</li>
                <li>Parallel mode is available from the in-card mode selector.</li>
                <li>Code Decoder mode is available from the in-card mode selector.</li>
                <li>RC Time mode is available from the in-card mode selector.</li>
                <li>Charge Calculator mode is available from the in-card mode selector.</li>
                <li>Energy Stored mode is available from the in-card mode selector.</li>
            </ul>
        </article>
    </div>

    <div class="calculator-grid" id="parallel-panel" role="region" aria-labelledby="parallel-title" data-mode-panel="parallel" hidden>
        <article class="panel calculator-panel">
            <div class="panel-header">
                <i data-lucide="list-plus" aria-hidden="true"></i>
                <h3 id="parallel-title">Parallel Capacitance Calculator</h3>
            </div>

            <div class="mode-selector-card field-group">
                <label for="calculator-mode-parallel">Select Calculator Mode</label>
                <select id="calculator-mode-parallel" data-mode-select aria-controls="unit-converter-panel series-panel parallel-panel code-decoder-panel rc-time-panel capacitive-reactance-panel charge-calculator-panel energy-stored-panel">
                    <optgroup label="Basic">
                        <option value="unit-converter">Unit Converter</option>
                        <option value="series">Series Capacitance</option>
                        <option value="parallel" selected>Parallel Capacitance</option>
                        <option value="code-decoder">Capacitor Code Decoder</option>
                    </optgroup>
                    <optgroup label="Circuit Calculations">
                        <option value="rc-time">RC Time Constant</option>
                        <option value="charge-calculator">Charge Calculator</option>
                        <option value="energy-stored">Energy Stored</option>
                    </optgroup>
                    <optgroup label="AC Calculations">
                        <option value="capacitive-reactance">Capacitive Reactance</option>
                    </optgroup>
                </select>
            </div>

            <form class="series-calculator parallel-calculator calculator-device" id="parallel-calculator-form" aria-describedby="parallel-help parallel-error" novalidate>
                <div class="series-result-card parallel-result-card calculator-result-display" id="parallel-result-card" aria-live="polite" aria-atomic="true">
                    <div class="series-result-header">
                        <span class="result-label">Total capacitance</span>
                        <span class="series-result-state" id="parallel-result-state">Ready</span>
                    </div>
                    <output class="series-result-value" id="parallel-result">--</output>
                    <span class="result-summary" id="parallel-summary">Waiting for capacitor values.</span>
                    <div class="copy-result-actions" data-copy-result="parallel">
                        <button class="button button-secondary copy-result-button" type="button" data-copy-button data-copy-mode="parallel" aria-label="Copy Parallel Capacitance result" disabled>
                            <i data-lucide="copy" aria-hidden="true"></i>
                            Copy Result
                        </button>
                        <span class="copy-result-status" data-copy-status aria-live="polite"></span>
                    </div>
                </div>

                <div class="calculator-input-section" data-shared-keypad-anchor>
                    <p class="field-help" id="parallel-help">
                        Add two or more capacitors. Each value is converted to farads before the parallel total is calculated.
                    </p>

                    <div class="series-list parallel-list" id="parallel-capacitor-list" aria-label="Parallel capacitor values"></div>

                    <div class="series-actions parallel-actions">
                        <button class="button button-secondary" type="button" id="add-parallel-capacitor">
                            <i data-lucide="plus" aria-hidden="true"></i>
                            Add capacitor
                        </button>
                        <button class="button button-primary" type="submit">
                            Calculate Parallel
                        </button>
                    </div>

                    <p class="field-error" id="parallel-error" role="alert"></p>
                </div>

                <section class="calculation-history-placeholder" data-history-mode="parallel" aria-labelledby="parallel-history-title">
                    <h4 id="parallel-history-title">Recent Calculations</h4>
                    <p data-history-empty>No saved calculations yet.</p>
                    <ol class="history-list" data-history-list aria-label="Recent Parallel calculations"></ol>
                    <div class="history-actions">
                        <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Parallel history as TXT" disabled>
                            Export TXT
                        </button>
                        <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Parallel history as CSV" disabled>
                            Export CSV
                        </button>
                        <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Parallel history">
                            Clear History
                        </button>
                    </div>
                </section>

                <section class="calculator-explanation-section" aria-labelledby="parallel-explanation-title">
                    <h4 id="parallel-explanation-title">Formula / Technical Details</h4>
                    <div class="series-breakdown" id="parallel-breakdown">
                        Enter values for C1 and C2, then calculate to see the addition breakdown.
                    </div>
                    <details class="series-technical-details" id="parallel-technical-details">
                        <summary>Technical Details</summary>
                        <output id="parallel-raw-farads">Raw total will appear after calculation.</output>
                    </details>
                </section>
            </form>
        </article>

        <article class="panel notes-panel">
            <div class="panel-header">
                <i data-lucide="plus-circle" aria-hidden="true"></i>
                <h3>Parallel Formula</h3>
            </div>
            <ul class="debug-list">
                <li>Parallel total uses direct addition.</li>
                <li>All inputs are converted to F before calculation.</li>
                <li>Code Decoder mode is available from the in-card mode selector.</li>
                <li>RC Time mode is available from the in-card mode selector.</li>
                <li>Charge Calculator mode is available from the in-card mode selector.</li>
                <li>Energy Stored mode is available from the in-card mode selector.</li>
            </ul>
        </article>
    </div>

    <div class="calculator-grid" id="code-decoder-panel" role="region" aria-labelledby="code-decoder-title" data-mode-panel="code-decoder" hidden>
        <article class="panel calculator-panel">
            <div class="panel-header">
                <i data-lucide="binary" aria-hidden="true"></i>
                <h3 id="code-decoder-title">Capacitor Code Decoder</h3>
            </div>

            <div class="mode-selector-card field-group">
                <label for="calculator-mode-code-decoder">Select Calculator Mode</label>
                <select id="calculator-mode-code-decoder" data-mode-select aria-controls="unit-converter-panel series-panel parallel-panel code-decoder-panel rc-time-panel capacitive-reactance-panel charge-calculator-panel energy-stored-panel">
                    <optgroup label="Basic">
                        <option value="unit-converter">Unit Converter</option>
                        <option value="series">Series Capacitance</option>
                        <option value="parallel">Parallel Capacitance</option>
                        <option value="code-decoder" selected>Capacitor Code Decoder</option>
                    </optgroup>
                    <optgroup label="Circuit Calculations">
                        <option value="rc-time">RC Time Constant</option>
                        <option value="charge-calculator">Charge Calculator</option>
                        <option value="energy-stored">Energy Stored</option>
                    </optgroup>
                    <optgroup label="AC Calculations">
                        <option value="capacitive-reactance">Capacitive Reactance</option>
                    </optgroup>
                </select>
            </div>

            <form class="code-decoder-card calculator-device" id="code-decoder-form" aria-describedby="code-decoder-help code-decoder-error" novalidate>
                <div class="series-result-card decoder-result-card calculator-result-display" id="code-decoder-result-card" aria-live="polite" aria-atomic="true">
                    <div class="series-result-header">
                        <span class="result-label">Decoded capacitance</span>
                        <span class="series-result-state" id="code-decoder-state">Ready</span>
                    </div>
                    <output class="series-result-value" id="code-decoder-primary-result">--</output>
                    <span class="result-summary" id="code-decoder-summary">Enter a 3-digit code to decode its capacitance.</span>
                    <div class="copy-result-actions" data-copy-result="code-decoder">
                        <button class="button button-secondary copy-result-button" type="button" data-copy-button data-copy-mode="code-decoder" aria-label="Copy Capacitor Code Decoder result" disabled>
                            <i data-lucide="copy" aria-hidden="true"></i>
                            Copy Result
                        </button>
                        <span class="copy-result-status" data-copy-status aria-live="polite"></span>
                    </div>

                    <div class="decoder-result-grid" aria-label="Decoded capacitance in common units">
                        <div class="decoder-result-unit">
                            <span>pF</span>
                            <output id="code-result-pf">--</output>
                        </div>
                        <div class="decoder-result-unit">
                            <span>nF</span>
                            <output id="code-result-nf">--</output>
                        </div>
                        <div class="decoder-result-unit">
                            <span>µF</span>
                            <output id="code-result-uf">--</output>
                        </div>
                        <div class="decoder-result-unit">
                            <span>F</span>
                            <output id="code-result-f">--</output>
                        </div>
                    </div>
                </div>

                <div class="calculator-input-section" data-shared-keypad-anchor>
                    <p class="field-help" id="code-decoder-help">
                        Enter a standard 3-digit capacitor code. The first two digits are significant figures, and the third digit is the pF multiplier.
                    </p>

                    <div class="code-input-row">
                        <div class="field-group">
                            <label for="capacitor-code">Capacitor code</label>
                            <input id="capacitor-code" name="capacitor-code" type="text" inputmode="numeric" autocomplete="off" maxlength="3" placeholder="104" data-shared-keypad-input data-keypad-type="digits" data-keypad-label="Code" data-keypad-max="3">
                        </div>
                        <button class="button button-primary" type="submit">
                            Decode
                        </button>
                        <button class="button button-secondary" type="button" id="clear-code-decoder">
                            Clear
                        </button>
                    </div>

                    <div class="code-examples" aria-label="Example capacitor codes">
                        <span class="result-label">Examples</span>
                        <button class="code-example" type="button" data-code="104">104</button>
                        <button class="code-example" type="button" data-code="103">103</button>
                        <button class="code-example" type="button" data-code="472">472</button>
                        <button class="code-example" type="button" data-code="223">223</button>
                    </div>

                    <p class="field-error" id="code-decoder-error" role="alert"></p>
                </div>

                <section class="calculation-history-placeholder" data-history-mode="code-decoder" aria-labelledby="code-decoder-history-title">
                    <h4 id="code-decoder-history-title">Recent Calculations</h4>
                    <p data-history-empty>No saved calculations yet.</p>
                    <ol class="history-list" data-history-list aria-label="Recent Code Decoder calculations"></ol>
                    <div class="history-actions">
                        <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Code Decoder history as TXT" disabled>
                            Export TXT
                        </button>
                        <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Code Decoder history as CSV" disabled>
                            Export CSV
                        </button>
                        <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Code Decoder history">
                            Clear History
                        </button>
                    </div>
                </section>

                <section class="calculator-explanation-section" aria-labelledby="code-decoder-explanation-title">
                    <h4 id="code-decoder-explanation-title">Formula / Technical Details</h4>
                    <div class="series-breakdown" id="code-decoder-breakdown">
                        Example: 104 means 10 × 10^4 pF.
                    </div>
                </section>
            </form>
        </article>

        <article class="panel notes-panel">
            <div class="panel-header">
                <i data-lucide="info" aria-hidden="true"></i>
                <h3>Code Notes</h3>
            </div>
            <ul class="debug-list">
                <li>Only standard 3-digit capacitor codes are supported.</li>
                <li>The decoded base value is calculated in pF.</li>
                <li>RC Time mode is available from the in-card mode selector.</li>
                <li>Charge Calculator mode is available from the in-card mode selector.</li>
                <li>Energy Stored mode is available from the in-card mode selector.</li>
            </ul>
        </article>
    </div>

    <div class="calculator-grid" id="rc-time-panel" role="region" aria-labelledby="rc-time-title" data-mode-panel="rc-time" hidden>
        <article class="panel calculator-panel">
            <div class="panel-header">
                <i data-lucide="timer" aria-hidden="true"></i>
                <h3 id="rc-time-title">RC Time Constant Calculator</h3>
            </div>

            <div class="mode-selector-card field-group">
                <label for="calculator-mode-rc-time">Select Calculator Mode</label>
                <select id="calculator-mode-rc-time" data-mode-select aria-controls="unit-converter-panel series-panel parallel-panel code-decoder-panel rc-time-panel capacitive-reactance-panel charge-calculator-panel energy-stored-panel">
                    <optgroup label="Basic">
                        <option value="unit-converter">Unit Converter</option>
                        <option value="series">Series Capacitance</option>
                        <option value="parallel">Parallel Capacitance</option>
                        <option value="code-decoder">Capacitor Code Decoder</option>
                    </optgroup>
                    <optgroup label="Circuit Calculations">
                        <option value="rc-time" selected>RC Time Constant</option>
                        <option value="charge-calculator">Charge Calculator</option>
                        <option value="energy-stored">Energy Stored</option>
                    </optgroup>
                    <optgroup label="AC Calculations">
                        <option value="capacitive-reactance">Capacitive Reactance</option>
                    </optgroup>
                </select>
            </div>

            <form class="rc-time-card calculator-device" id="rc-time-form" aria-describedby="rc-time-help rc-time-error" novalidate>
                <div class="series-result-card rc-result-card calculator-result-display" id="rc-result-card" aria-live="polite" aria-atomic="true">
                    <div class="series-result-header">
                        <span class="result-label">Time constant</span>
                        <span class="series-result-state" id="rc-result-state">Ready</span>
                    </div>
                    <output class="series-result-value" id="rc-primary-result">--</output>
                    <span class="result-summary" id="rc-summary">Enter resistance and capacitance to calculate τ.</span>
                    <div class="copy-result-actions" data-copy-result="rc-time">
                        <button class="button button-secondary copy-result-button" type="button" data-copy-button data-copy-mode="rc-time" aria-label="Copy RC Time Constant result" disabled>
                            <i data-lucide="copy" aria-hidden="true"></i>
                            Copy Result
                        </button>
                        <span class="copy-result-status" data-copy-status aria-live="polite"></span>
                    </div>

                    <div class="decoder-result-grid rc-result-grid" aria-label="Time constant in common units">
                        <div class="decoder-result-unit">
                            <span>Seconds</span>
                            <output id="rc-result-seconds">--</output>
                        </div>
                        <div class="decoder-result-unit">
                            <span>Milliseconds</span>
                            <output id="rc-result-milliseconds">--</output>
                        </div>
                        <div class="decoder-result-unit">
                            <span>Microseconds</span>
                            <output id="rc-result-microseconds">--</output>
                        </div>
                    </div>
                </div>

                <div class="calculator-input-section" data-shared-keypad-anchor>
                    <p class="field-help" id="rc-time-help">
                        Enter resistance and capacitance to calculate the time constant τ = R × C.
                    </p>

                    <div class="rc-input-grid">
                        <div class="rc-input-pair">
                            <div class="field-group">
                                <label for="resistance-value">Resistance</label>
                                <input id="resistance-value" name="resistance-value" type="text" inputmode="decimal" autocomplete="off" placeholder="10" data-shared-keypad-input data-keypad-type="decimal" data-keypad-label="Resistance">
                            </div>
                            <div class="field-group">
                                <label for="resistance-unit">Unit</label>
                                <select id="resistance-unit" name="resistance-unit">
                                    <option value="ohm">Ω</option>
                                    <option value="kohm" selected>kΩ</option>
                                    <option value="mohm">MΩ</option>
                                </select>
                            </div>
                        </div>

                        <div class="rc-input-pair">
                            <div class="field-group">
                                <label for="rc-capacitance-value">Capacitance</label>
                                <input id="rc-capacitance-value" name="rc-capacitance-value" type="text" inputmode="decimal" autocomplete="off" placeholder="1" data-shared-keypad-input data-keypad-type="decimal" data-keypad-label="Capacitance">
                            </div>
                            <div class="field-group">
                                <label for="rc-capacitance-unit">Unit</label>
                                <select id="rc-capacitance-unit" name="rc-capacitance-unit">
                                    <option value="pF">pF</option>
                                    <option value="nF">nF</option>
                                    <option value="uF" selected>µF</option>
                                    <option value="F">F</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="rc-actions">
                        <button class="button button-primary" type="submit">
                            Calculate RC Time
                        </button>
                        <button class="button button-secondary" type="button" id="clear-rc-time">
                            Clear
                        </button>
                    </div>

                    <p class="field-error" id="rc-time-error" role="alert"></p>
                </div>

                <section class="calculation-history-placeholder" data-history-mode="rc-time" aria-labelledby="rc-history-title">
                    <h4 id="rc-history-title">Recent Calculations</h4>
                    <p data-history-empty>No saved calculations yet.</p>
                    <ol class="history-list" data-history-list aria-label="Recent RC Time calculations"></ol>
                    <div class="history-actions">
                        <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export RC Time history as TXT" disabled>
                            Export TXT
                        </button>
                        <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export RC Time history as CSV" disabled>
                            Export CSV
                        </button>
                        <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear RC Time history">
                            Clear History
                        </button>
                    </div>
                </section>

                <section class="calculator-explanation-section" aria-labelledby="rc-explanation-title">
                    <h4 id="rc-explanation-title">Formula / Technical Details</h4>
                    <div class="series-breakdown" id="rc-breakdown">
                        Formula: τ = R × C.
                    </div>
                </section>
            </form>
        </article>

        <article class="panel notes-panel">
            <div class="panel-header">
                <i data-lucide="activity" aria-hidden="true"></i>
                <h3>RC Formula</h3>
            </div>
            <ul class="debug-list">
                <li>Time constant uses τ = R × C.</li>
                <li>Resistance is converted to Ω and capacitance to F before calculation.</li>
                <li>This mode does not calculate charging or discharging voltage curves.</li>
                <li>Charge Calculator mode is available from the in-card mode selector.</li>
                <li>Energy Stored mode is available from the in-card mode selector.</li>
            </ul>
        </article>
    </div>

    <div class="calculator-grid" id="capacitive-reactance-panel" role="region" aria-labelledby="capacitive-reactance-title" data-mode-panel="capacitive-reactance" hidden>
        <article class="panel calculator-panel">
            <div class="panel-header">
                <i data-lucide="activity" aria-hidden="true"></i>
                <h3 id="capacitive-reactance-title">Capacitive Reactance Calculator</h3>
            </div>

            <div class="mode-selector-card field-group">
                <label for="calculator-mode-capacitive-reactance">Select Calculator Mode</label>
                <select id="calculator-mode-capacitive-reactance" data-mode-select aria-controls="unit-converter-panel series-panel parallel-panel code-decoder-panel rc-time-panel capacitive-reactance-panel charge-calculator-panel energy-stored-panel">
                    <optgroup label="Basic">
                        <option value="unit-converter">Unit Converter</option>
                        <option value="series">Series Capacitance</option>
                        <option value="parallel">Parallel Capacitance</option>
                        <option value="code-decoder">Capacitor Code Decoder</option>
                    </optgroup>
                    <optgroup label="Circuit Calculations">
                        <option value="rc-time">RC Time Constant</option>
                        <option value="charge-calculator">Charge Calculator</option>
                        <option value="energy-stored">Energy Stored</option>
                    </optgroup>
                    <optgroup label="AC Calculations">
                        <option value="capacitive-reactance" selected>Capacitive Reactance</option>
                    </optgroup>
                </select>
            </div>

            <form class="rc-time-card capacitive-reactance-card calculator-device" id="capacitive-reactance-form" aria-describedby="capacitive-reactance-help capacitive-reactance-error" novalidate>
                <div class="series-result-card capacitive-reactance-result-card calculator-result-display" id="capacitive-reactance-result-card" aria-live="polite" aria-atomic="true">
                    <div class="series-result-header">
                        <span class="result-label">Capacitive reactance</span>
                        <span class="series-result-state" id="capacitive-reactance-result-state">Ready</span>
                    </div>
                    <output class="series-result-value" id="capacitive-reactance-primary-result">--</output>
                    <span class="result-summary" id="capacitive-reactance-summary">Enter frequency and capacitance to calculate Xc.</span>
                    <div class="copy-result-actions" data-copy-result="capacitive-reactance">
                        <button class="button button-secondary copy-result-button" type="button" data-copy-button data-copy-mode="capacitive-reactance" aria-label="Copy Capacitive Reactance result" disabled>
                            <i data-lucide="copy" aria-hidden="true"></i>
                            Copy Result
                        </button>
                        <span class="copy-result-status" data-copy-status aria-live="polite"></span>
                    </div>

                    <div class="decoder-result-grid rc-result-grid capacitive-reactance-result-grid" aria-label="Capacitive reactance in common units">
                        <div class="decoder-result-unit">
                            <span>Ohms</span>
                            <output id="capacitive-reactance-result-ohms">--</output>
                        </div>
                        <div class="decoder-result-unit">
                            <span>Kilohms</span>
                            <output id="capacitive-reactance-result-kilohms">--</output>
                        </div>
                        <div class="decoder-result-unit">
                            <span>Megohms</span>
                            <output id="capacitive-reactance-result-megohms">--</output>
                        </div>
                    </div>
                </div>

                <div class="calculator-input-section" data-shared-keypad-anchor>
                    <p class="field-help" id="capacitive-reactance-help">
                        Enter frequency and capacitance to calculate capacitive reactance with Xc = 1 / (2πfC).
                    </p>

                    <div class="rc-input-grid capacitive-reactance-input-grid">
                        <div class="rc-input-pair">
                            <div class="field-group">
                                <label for="reactance-frequency-value">Frequency</label>
                                <input id="reactance-frequency-value" name="reactance-frequency-value" type="text" inputmode="decimal" autocomplete="off" placeholder="1" data-shared-keypad-input data-keypad-type="decimal" data-keypad-label="Frequency">
                            </div>
                            <div class="field-group">
                                <label for="reactance-frequency-unit">Unit</label>
                                <select id="reactance-frequency-unit" name="reactance-frequency-unit">
                                    <option value="Hz">Hz</option>
                                    <option value="kHz" selected>kHz</option>
                                    <option value="MHz">MHz</option>
                                </select>
                            </div>
                        </div>

                        <div class="rc-input-pair">
                            <div class="field-group">
                                <label for="reactance-capacitance-value">Capacitance</label>
                                <input id="reactance-capacitance-value" name="reactance-capacitance-value" type="text" inputmode="decimal" autocomplete="off" placeholder="100" data-shared-keypad-input data-keypad-type="decimal" data-keypad-label="Capacitance">
                            </div>
                            <div class="field-group">
                                <label for="reactance-capacitance-unit">Unit</label>
                                <select id="reactance-capacitance-unit" name="reactance-capacitance-unit">
                                    <option value="pF">pF</option>
                                    <option value="nF" selected>nF</option>
                                    <option value="uF">µF</option>
                                    <option value="mF">mF</option>
                                    <option value="F">F</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="rc-actions capacitive-reactance-actions">
                        <button class="button button-primary" type="submit">
                            Calculate Reactance
                        </button>
                        <button class="button button-secondary" type="button" id="clear-capacitive-reactance">
                            Clear
                        </button>
                    </div>

                    <p class="field-error" id="capacitive-reactance-error" role="alert"></p>
                </div>

                <section class="calculation-history-placeholder" data-history-mode="capacitive-reactance" aria-labelledby="capacitive-reactance-history-title">
                    <h4 id="capacitive-reactance-history-title">Recent Calculations</h4>
                    <p data-history-empty>No saved calculations yet.</p>
                    <ol class="history-list" data-history-list aria-label="Recent Capacitive Reactance calculations"></ol>
                    <div class="history-actions">
                        <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Capacitive Reactance history as TXT" disabled>
                            Export TXT
                        </button>
                        <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Capacitive Reactance history as CSV" disabled>
                            Export CSV
                        </button>
                        <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Capacitive Reactance history">
                            Clear History
                        </button>
                    </div>
                </section>

                <section class="calculator-explanation-section" aria-labelledby="capacitive-reactance-explanation-title">
                    <h4 id="capacitive-reactance-explanation-title">Formula / Technical Details</h4>
                    <div class="series-breakdown" id="capacitive-reactance-breakdown">
                        Formula: Xc = 1 / (2πfC).
                    </div>
                    <details class="series-technical-details" id="capacitive-reactance-technical-details">
                        <summary>Technical Details</summary>
                        <output id="capacitive-reactance-technical-output">Raw values will appear after calculation.</output>
                    </details>
                </section>
            </form>
        </article>

        <article class="panel notes-panel">
            <div class="panel-header">
                <i data-lucide="waves" aria-hidden="true"></i>
                <h3>Reactance Formula</h3>
            </div>
            <ul class="debug-list">
                <li>Capacitive reactance uses Xc = 1 / (2πfC).</li>
                <li>Frequency is converted to Hz and capacitance to F before calculation.</li>
                <li>Reactance decreases as frequency or capacitance increases.</li>
                <li>This mode does not calculate RC filters or graph frequency response.</li>
            </ul>
        </article>
    </div>

    <div class="calculator-grid" id="charge-calculator-panel" role="region" aria-labelledby="charge-calculator-title" data-mode-panel="charge-calculator" hidden>
        <article class="panel calculator-panel">
            <div class="panel-header">
                <i data-lucide="circle-dot" aria-hidden="true"></i>
                <h3 id="charge-calculator-title">Charge Calculator</h3>
            </div>

            <div class="mode-selector-card field-group">
                <label for="calculator-mode-charge-calculator">Select Calculator Mode</label>
                <select id="calculator-mode-charge-calculator" data-mode-select aria-controls="unit-converter-panel series-panel parallel-panel code-decoder-panel rc-time-panel capacitive-reactance-panel charge-calculator-panel energy-stored-panel">
                    <optgroup label="Basic">
                        <option value="unit-converter">Unit Converter</option>
                        <option value="series">Series Capacitance</option>
                        <option value="parallel">Parallel Capacitance</option>
                        <option value="code-decoder">Capacitor Code Decoder</option>
                    </optgroup>
                    <optgroup label="Circuit Calculations">
                        <option value="rc-time">RC Time Constant</option>
                        <option value="charge-calculator" selected>Charge Calculator</option>
                        <option value="energy-stored">Energy Stored</option>
                    </optgroup>
                    <optgroup label="AC Calculations">
                        <option value="capacitive-reactance">Capacitive Reactance</option>
                    </optgroup>
                </select>
            </div>

            <form class="rc-time-card charge-calculator-card calculator-device" id="charge-calculator-form" aria-describedby="charge-calculator-help charge-calculator-error" novalidate>
                <div class="series-result-card charge-result-card calculator-result-display" id="charge-result-card" aria-live="polite" aria-atomic="true">
                    <div class="series-result-header">
                        <span class="result-label">Stored charge</span>
                        <span class="series-result-state" id="charge-result-state">Ready</span>
                    </div>
                    <output class="series-result-value" id="charge-primary-result">--</output>
                    <span class="result-summary" id="charge-summary">Enter capacitance and voltage to calculate charge.</span>
                    <div class="copy-result-actions" data-copy-result="charge-calculator">
                        <button class="button button-secondary copy-result-button" type="button" data-copy-button data-copy-mode="charge-calculator" aria-label="Copy Charge Calculator result" disabled>
                            <i data-lucide="copy" aria-hidden="true"></i>
                            Copy Result
                        </button>
                        <span class="copy-result-status" data-copy-status aria-live="polite"></span>
                    </div>

                    <div class="decoder-result-grid charge-result-grid" aria-label="Charge in common units">
                        <div class="decoder-result-unit">
                            <span>Millicoulombs</span>
                            <output id="charge-result-millicoulombs">--</output>
                        </div>
                        <div class="decoder-result-unit">
                            <span>Microcoulombs</span>
                            <output id="charge-result-microcoulombs">--</output>
                        </div>
                        <div class="decoder-result-unit">
                            <span>Nanocoulombs</span>
                            <output id="charge-result-nanocoulombs">--</output>
                        </div>
                    </div>
                </div>

                <div class="calculator-input-section" data-shared-keypad-anchor>
                    <p class="field-help" id="charge-calculator-help">
                        Enter capacitance and voltage to calculate charge with Q = C × V.
                    </p>

                    <div class="rc-input-grid charge-input-grid">
                        <div class="rc-input-pair">
                            <div class="field-group">
                                <label for="charge-capacitance-value">Capacitance</label>
                                <input id="charge-capacitance-value" name="charge-capacitance-value" type="text" inputmode="decimal" autocomplete="off" placeholder="1000" data-shared-keypad-input data-keypad-type="decimal" data-keypad-label="Capacitance">
                            </div>
                            <div class="field-group">
                                <label for="charge-capacitance-unit">Unit</label>
                                <select id="charge-capacitance-unit" name="charge-capacitance-unit">
                                    <option value="pF">pF</option>
                                    <option value="nF">nF</option>
                                    <option value="uF" selected>µF</option>
                                    <option value="mF">mF</option>
                                    <option value="F">F</option>
                                </select>
                            </div>
                        </div>

                        <div class="rc-input-pair">
                            <div class="field-group">
                                <label for="charge-voltage-value">Voltage</label>
                                <input id="charge-voltage-value" name="charge-voltage-value" type="text" inputmode="decimal" autocomplete="off" placeholder="12" data-shared-keypad-input data-keypad-type="decimal" data-keypad-label="Voltage">
                            </div>
                            <div class="field-group">
                                <span class="field-label-static">Unit</span>
                                <span class="unit-pill" aria-label="Voltage unit">V</span>
                            </div>
                        </div>
                    </div>

                    <div class="rc-actions charge-actions">
                        <button class="button button-primary" type="submit">
                            Calculate Charge
                        </button>
                        <button class="button button-secondary" type="button" id="clear-charge-calculator">
                            Clear
                        </button>
                    </div>

                    <p class="field-error" id="charge-calculator-error" role="alert"></p>
                </div>

                <section class="calculation-history-placeholder" data-history-mode="charge-calculator" aria-labelledby="charge-history-title">
                    <h4 id="charge-history-title">Recent Calculations</h4>
                    <p data-history-empty>No saved calculations yet.</p>
                    <ol class="history-list" data-history-list aria-label="Recent Charge Calculator calculations"></ol>
                    <div class="history-actions">
                        <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Charge Calculator history as TXT" disabled>
                            Export TXT
                        </button>
                        <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Charge Calculator history as CSV" disabled>
                            Export CSV
                        </button>
                        <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Charge Calculator history">
                            Clear History
                        </button>
                    </div>
                </section>

                <section class="calculator-explanation-section" aria-labelledby="charge-explanation-title">
                    <h4 id="charge-explanation-title">Formula / Technical Details</h4>
                    <div class="series-breakdown" id="charge-breakdown">
                        Formula: Q = C × V.
                    </div>
                    <details class="series-technical-details" id="charge-technical-details">
                        <summary>Technical Details</summary>
                        <output id="charge-technical-output">Raw values will appear after calculation.</output>
                    </details>
                </section>
            </form>
        </article>

        <article class="panel notes-panel">
            <div class="panel-header">
                <i data-lucide="sigma" aria-hidden="true"></i>
                <h3>Charge Formula</h3>
            </div>
            <ul class="debug-list">
                <li>Charge uses Q = C × V.</li>
                <li>Capacitance is converted to F before calculation.</li>
                <li>Voltage is entered in V.</li>
            </ul>
        </article>
    </div>

    <div class="calculator-grid" id="energy-stored-panel" role="region" aria-labelledby="energy-stored-title" data-mode-panel="energy-stored" hidden>
        <article class="panel calculator-panel">
            <div class="panel-header">
                <i data-lucide="battery-charging" aria-hidden="true"></i>
                <h3 id="energy-stored-title">Energy Stored Calculator</h3>
            </div>

            <div class="mode-selector-card field-group">
                <label for="calculator-mode-energy-stored">Select Calculator Mode</label>
                <select id="calculator-mode-energy-stored" data-mode-select aria-controls="unit-converter-panel series-panel parallel-panel code-decoder-panel rc-time-panel capacitive-reactance-panel charge-calculator-panel energy-stored-panel">
                    <optgroup label="Basic">
                        <option value="unit-converter">Unit Converter</option>
                        <option value="series">Series Capacitance</option>
                        <option value="parallel">Parallel Capacitance</option>
                        <option value="code-decoder">Capacitor Code Decoder</option>
                    </optgroup>
                    <optgroup label="Circuit Calculations">
                        <option value="rc-time">RC Time Constant</option>
                        <option value="charge-calculator">Charge Calculator</option>
                        <option value="energy-stored" selected>Energy Stored</option>
                    </optgroup>
                    <optgroup label="AC Calculations">
                        <option value="capacitive-reactance">Capacitive Reactance</option>
                    </optgroup>
                </select>
            </div>

            <form class="rc-time-card energy-stored-card calculator-device" id="energy-stored-form" aria-describedby="energy-stored-help energy-stored-error" novalidate>
                <div class="series-result-card energy-result-card calculator-result-display" id="energy-result-card" aria-live="polite" aria-atomic="true">
                    <div class="series-result-header">
                        <span class="result-label">Stored energy</span>
                        <span class="series-result-state" id="energy-result-state">Ready</span>
                    </div>
                    <output class="series-result-value" id="energy-primary-result">--</output>
                    <span class="result-summary" id="energy-summary">Enter capacitance and voltage to calculate stored energy.</span>
                    <div class="copy-result-actions" data-copy-result="energy-stored">
                        <button class="button button-secondary copy-result-button" type="button" data-copy-button data-copy-mode="energy-stored" aria-label="Copy Energy Stored result" disabled>
                            <i data-lucide="copy" aria-hidden="true"></i>
                            Copy Result
                        </button>
                        <span class="copy-result-status" data-copy-status aria-live="polite"></span>
                    </div>

                    <div class="decoder-result-grid rc-result-grid energy-result-grid" aria-label="Stored energy in common units">
                        <div class="decoder-result-unit">
                            <span>Joules</span>
                            <output id="energy-result-joules">--</output>
                        </div>
                        <div class="decoder-result-unit">
                            <span>Millijoules</span>
                            <output id="energy-result-millijoules">--</output>
                        </div>
                        <div class="decoder-result-unit">
                            <span>Microjoules</span>
                            <output id="energy-result-microjoules">--</output>
                        </div>
                    </div>
                </div>

                <div class="calculator-input-section" data-shared-keypad-anchor>
                    <p class="field-help" id="energy-stored-help">
                        Enter capacitance and voltage to calculate the energy stored in a charged capacitor.
                    </p>

                    <div class="rc-input-grid energy-input-grid">
                        <div class="rc-input-pair">
                            <div class="field-group">
                                <label for="energy-capacitance-value">Capacitance</label>
                                <input id="energy-capacitance-value" name="energy-capacitance-value" type="text" inputmode="decimal" autocomplete="off" placeholder="1000" data-shared-keypad-input data-keypad-type="decimal" data-keypad-label="Capacitance">
                            </div>
                            <div class="field-group">
                                <label for="energy-capacitance-unit">Unit</label>
                                <select id="energy-capacitance-unit" name="energy-capacitance-unit">
                                    <option value="pF">pF</option>
                                    <option value="nF">nF</option>
                                    <option value="uF" selected>µF</option>
                                    <option value="mF">mF</option>
                                    <option value="F">F</option>
                                </select>
                            </div>
                        </div>

                        <div class="rc-input-pair">
                            <div class="field-group">
                                <label for="energy-voltage-value">Voltage</label>
                                <input id="energy-voltage-value" name="energy-voltage-value" type="text" inputmode="decimal" autocomplete="off" placeholder="12" data-shared-keypad-input data-keypad-type="decimal" data-keypad-label="Voltage">
                            </div>
                            <div class="field-group">
                                <span class="field-label-static">Unit</span>
                                <span class="unit-pill" aria-label="Voltage unit">V</span>
                            </div>
                        </div>
                    </div>

                    <div class="rc-actions energy-actions">
                        <button class="button button-primary" type="submit">
                            Calculate Energy
                        </button>
                        <button class="button button-secondary" type="button" id="clear-energy-stored">
                            Clear
                        </button>
                    </div>

                    <p class="field-error" id="energy-stored-error" role="alert"></p>
                </div>

                <section class="calculation-history-placeholder" data-history-mode="energy-stored" aria-labelledby="energy-history-title">
                    <h4 id="energy-history-title">Recent Calculations</h4>
                    <p data-history-empty>No saved calculations yet.</p>
                    <ol class="history-list" data-history-list aria-label="Recent Energy Stored calculations"></ol>
                    <div class="history-actions">
                        <button class="button button-secondary history-export" type="button" data-history-export="txt" aria-label="Export Energy Stored history as TXT" disabled>
                            Export TXT
                        </button>
                        <button class="button button-secondary history-export" type="button" data-history-export="csv" aria-label="Export Energy Stored history as CSV" disabled>
                            Export CSV
                        </button>
                        <button class="button button-secondary history-clear" type="button" data-history-clear aria-label="Clear Energy Stored history">
                            Clear History
                        </button>
                    </div>
                </section>

                <section class="calculator-explanation-section" aria-labelledby="energy-explanation-title">
                    <h4 id="energy-explanation-title">Formula / Technical Details</h4>
                    <div class="series-breakdown" id="energy-breakdown">
                        Formula: E = 1/2 × C × V².
                    </div>
                    <details class="series-technical-details" id="energy-technical-details">
                        <summary>Technical Details</summary>
                        <output id="energy-technical-output">Raw values will appear after calculation.</output>
                    </details>
                </section>
            </form>
        </article>

        <article class="panel notes-panel">
            <div class="panel-header">
                <i data-lucide="zap" aria-hidden="true"></i>
                <h3>Energy Formula</h3>
            </div>
            <ul class="debug-list">
                <li>Stored energy uses E = 1/2 × C × V².</li>
                <li>Capacitance is converted to F before calculation.</li>
                <li>Voltage is entered in V.</li>
            </ul>
        </article>
    </div>

    <details class="shared-input-keypad calculator-device" id="shared-input-keypad" hidden open>
        <summary class="shared-keypad-summary">Numeric keypad</summary>
        <p class="shared-keypad-status" id="shared-keypad-status" aria-live="polite">Active input: None selected</p>

        <div class="calculator-keypad shared-calculator-keypad" aria-label="Shared numeric keypad">
            <button class="key" type="button" data-shared-keypad-value="7">7</button>
            <button class="key" type="button" data-shared-keypad-value="8">8</button>
            <button class="key" type="button" data-shared-keypad-value="9">9</button>
            <button class="key key-secondary" type="button" data-shared-keypad-action="backspace" aria-label="Backspace active input">
                <i data-lucide="delete" aria-hidden="true"></i>
            </button>

            <button class="key" type="button" data-shared-keypad-value="4">4</button>
            <button class="key" type="button" data-shared-keypad-value="5">5</button>
            <button class="key" type="button" data-shared-keypad-value="6">6</button>
            <button class="key key-secondary" type="button" data-shared-keypad-action="clear" aria-label="Clear active input">C</button>

            <button class="key" type="button" data-shared-keypad-value="1">1</button>
            <button class="key" type="button" data-shared-keypad-value="2">2</button>
            <button class="key" type="button" data-shared-keypad-value="3">3</button>
            <button class="key key-convert" type="button" data-shared-keypad-action="calculate" aria-label="Calculate active mode">=</button>

            <button class="key key-zero" type="button" data-shared-keypad-value="0">0</button>
            <button class="key key-decimal" type="button" data-shared-keypad-action="decimal" aria-label="Decimal point">.</button>
        </div>
    </details>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
