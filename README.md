# Capacitance Calculator

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![PHP](https://img.shields.io/badge/PHP-XAMPP%20%2F%20Apache-777BB4)
![License](https://img.shields.io/badge/license-ISC-green)

A responsive, browser-based capacitance calculator suite for electronics students, hobbyists, makers, and beginners learning capacitor math. Built with plain PHP, HTML, CSS, and vanilla JavaScript, the project combines practical capacitor calculators, a beginner-friendly Formula Reference page, an Advanced Physics page, local history/export/copy tools, and a responsive interface for desktop, tablet, and mobile devices.

## Project Status

**Current version:** `v2.1.0`

This project is a working educational/reference calculator suite. It runs locally with XAMPP and stores calculator history in the browser using `localStorage`. It does not use PHP sessions, MySQL, Composer, or a backend database yet.

Version 2.1.0 focuses on internal architecture improvements and maintainability while preserving existing calculator behavior.

## What's New in v2.1.0

- Cleaned up the practical calculator architecture
- Added a shared practical utility layer
- Extracted shared numeric formatting helpers
- Extracted shared practical unit definitions
- Centralized practical history helpers
- Reduced duplicated implementation across practical calculators
- Expanded Playwright regression coverage for practical calculators
- Improved maintainability without changing calculator behavior

## Live Demo

🌐 Live Demo
https://capacitance-calculator-demo.vercel.app/

This repository contains the original PHP/XAMPP development version.

A static demo version is deployed on Vercel for public access using the link above.

For now, run the project locally with XAMPP:

```text
http://localhost/capacitance-calculator-main/
```

## Target Audience

- Electronics students learning capacitance formulas
- Hobbyists and makers working with capacitor values
- Beginners decoding capacitor markings
- Developers reviewing a plain PHP and vanilla JavaScript portfolio project
- Instructors looking for a simple educational calculator reference

## Feature Highlights

- **Seven calculator modes** in one clean interface
- **Advanced Physics section** with five additional theory-focused calculators
- **Shared practical calculator utility layer** for common formatting, units, validation, and history helpers
- **Mobile-friendly calculator controls** with a dedicated Unit Converter keypad and shared numeric keypad
- **Formula breakdowns and technical details** for supported calculator modes
- **Recent Calculations history** stored locally per calculator mode
- **Clickable history restore** for saved calculations with restore data
- **TXT and CSV export** for per-mode history
- **Copy Result buttons** for sharing a short input summary and final result
- **Dark/light theme toggle** with saved browser preference
- **Formula Reference page** written for electronics beginners
- **Jump to Topics navigation** on long reference and Advanced Physics pages
- **Collapsible Advanced Physics workflows** so educational content stays easy to scan
- **Improved Advanced Physics result cards** with clearer primary results and secondary units
- **Mobile sticky Jump to Topics button** on the Advanced Physics page
- **Modular Advanced Physics JavaScript** under `assets/js/advanced/`
- **Improved maintainability through shared helpers** while preserving calculator behavior
- **Responsive design** for phones, tablets, and desktop screens
- **Playwright screenshot automation** for GitHub-ready project images
- **Practical and Advanced Physics regression coverage** for calculator behavior, navigation, history restore, copy, export, and responsive checks

## Calculator Modes

| Mode | What It Does |
| --- | --- |
| **Unit Converter** | Converts capacitance between `pF`, `nF`, `µF`, and `F`. |
| **Series Capacitance** | Calculates total capacitance for capacitors connected end-to-end using `1/Ct = 1/C1 + 1/C2 + ...`. |
| **Parallel Capacitance** | Calculates total capacitance for capacitors connected across the same two nodes using `Ct = C1 + C2 + ...`. |
| **Capacitor Code Decoder** | Decodes standard 3-digit capacitor codes such as `104`, `103`, `472`, and `223`. |
| **RC Time Constant** | Calculates `τ = R × C` using resistance and capacitance values. |
| **Charge Calculator** | Calculates stored charge with `Q = C × V` and shows results in `C`, `mC`, `µC`, and `nC`. |
| **Energy Stored** | Calculates capacitor energy with `E = 1/2 × C × V²` and shows results in `J`, `mJ`, and `µJ`. |

## Advanced Physics

The Advanced Physics page keeps the main calculator focused on practical electronics while adding capacitor theory tools for students studying electromagnetics and physics.

| Topic | What It Covers |
| --- | --- |
| **Parallel Plate Capacitor** | Calculates `C = εA / d` using plate area, separation distance, and relative permittivity. |
| **Cylindrical Capacitor** | Calculates `C = 2π ε L / ln(b/a)` for coaxial and cylindrical conductor models. |
| **Spherical Capacitor** | Calculates `C = 4π εab / (b - a)` for concentric spherical conductors. |
| **Dielectric Materials** | Shows how dielectric constant changes capacitance using `ε = κ × ε0` and `C = κ × C0`. |
| **Electric Field & Capacitance** | Solves electric field, voltage, distance, and capacitance relationships with `E = V / d` and `C = Q / V`. |

Each topic card includes theory, formula, applications, an interactive calculator workflow, a worked solution, technical details, local history, copy result, restore, and TXT/CSV export tools. Topic navigation, Back to Topics links, and collapsible calculator sections make the page easier to use on phones.

## Screenshots

### Home Page
![Home Page](docs/screenshots/home.png)

### Formula Reference
![Formula Reference](docs/screenshots/formula-reference.png)

### Advanced Physics
![Advanced Physics](docs/screenshots/advanced-physics.png)

### Unit Converter
![Unit Converter](docs/screenshots/unit-converter.png)

### Series Capacitance
![Series Capacitance](docs/screenshots/series-capacitance.png)

### RC Time Constant
![RC Time Constant](docs/screenshots/rc-time.png)

## Technologies Used

- **PHP** for shared page includes and plain XAMPP routing
- **HTML5** for semantic page structure
- **CSS3** with custom properties for responsive design and dark/light themes
- **Vanilla JavaScript** for calculator behavior, modular Advanced Physics scripts, and browser storage
- **Lucide Icons** via CDN
- **localStorage** for local history and theme preference
- **XAMPP / Apache** for local PHP development
- **Playwright** for browser checks and screenshot automation

## How to Run Locally With XAMPP

1. Install and open XAMPP.
2. Start **Apache**.
3. Place this project folder here:

   ```text
   C:\xampp\htdocs\capacitance-calculator-main
   ```

4. Open the Home page in your browser:

   ```text
   http://localhost/capacitance-calculator-main/
   ```

5. Open the Formula Reference page directly:

   ```text
   http://localhost/capacitance-calculator-main/pages/formula-reference.php
   ```

6. Open the Advanced Physics page directly:

   ```text
   http://localhost/capacitance-calculator-main/pages/advanced-physics.php
   ```

## How to Use the Calculator

1. Open the app in your browser.
2. Use the in-card mode selector to choose a calculator mode.
3. Enter values using your keyboard, the Unit Converter keypad, or the shared numeric keypad.
4. Select the correct units.
5. Press the visible calculate button or the shared `=` key.
6. Read the primary result display first.
7. Review formula breakdowns and technical details when available.
8. Use Copy Result, Recent Calculations, Restore, Export TXT, or Export CSV as needed.

## Formula Reference Page

The Formula Reference page explains each calculator mode in beginner-friendly language. Each section includes:

- Formula
- Simple explanation
- Example calculation
- When to use it

Covered topics:

- Unit Conversion
- Series Capacitance
- Parallel Capacitance
- Capacitor Code Decoder
- RC Time Constant
- Charge Calculator
- Energy Stored

Use the **Formula Reference** link in the header navigation or open:

```text
http://localhost/capacitance-calculator-main/pages/formula-reference.php
```

## Local History, Restore, Export, and Copy

Recent calculations are stored locally in the browser for each supported calculator mode, including Advanced Physics calculators. The app keeps the latest five entries per mode.

- **Restore**: Refill previous inputs without auto-calculating.
- **Export TXT**: Download readable history entries for the current mode.
- **Export CSV**: Download spreadsheet-friendly history entries for the current mode.
- **Clear History**: Clear only the active mode's saved entries.
- **Copy Result**: Copy the mode name, short input summary, and final result after a valid calculation.

Because history uses `localStorage`, saved entries stay on the same browser and device only.

## Mobile Support

The interface is responsive for desktop, tablet, and mobile devices:

- Controls use touch-friendly sizing.
- Calculator cards stack cleanly on small screens.
- Shared keypads reduce reliance on the phone keyboard.
- History, export, and copy controls wrap to avoid horizontal scrolling.
- Result cards prioritize the main answer and keep secondary values readable.
- Advanced Physics topic links and collapsible calculator workflows reduce long-page scrolling.

## Dark/Light Theme

The app defaults to dark theme and includes a header theme toggle. The selected theme is saved in `localStorage`, so it persists after reload.

## Screenshot Automation

Playwright can capture project screenshots for the README.

```bash
npm install
npm run screenshots
```

The script saves images to:

```text
docs/screenshots/
```

It expects the local site to be available at:

```text
http://localhost/capacitance-calculator-main/
```

## Folder Structure

```text
capacitance-calculator-main/
├── index.php
├── README.md
├── package-lock.json
├── package.json
├── playwright.config.js
│
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── calculator.css
│   │   └── responsive.css
│   └── js/
│       ├── advanced/
│       │   ├── advanced-calculator-toggle.js
│       │   ├── advanced-index.js
│       │   ├── advanced-utils.js
│       │   ├── cylindrical.js
│       │   ├── dielectric.js
│       │   ├── electric-field.js
│       │   ├── package.json
│       │   ├── parallel-plate.js
│       │   └── spherical.js
│       ├── advanced-physics.js
│       ├── main.js
│       ├── capacitance-calculator.js
│       ├── capacitor-code-decoder.js
│       ├── charge-calculator.js
│       ├── copy-result.js
│       ├── energy-calculator.js
│       ├── history.js
│       ├── mobile-nav.js
│       ├── practical-utils.js
│       ├── rc-time-calculator.js
│       ├── shared-keypad.js
│       ├── theme-toggle.js
│       └── unit-converter.js
│
├── docs/
│   └── screenshots/
│       ├── home.png
│       ├── formula-reference.png
│       ├── advanced-physics.png
│       ├── unit-converter.png
│       ├── series-capacitance.png
│       ├── rc-time.png
│       ├── charge-calculator.png
│       ├── energy-stored.png
│       ├── parallel-capacitance.png
│       └── code-decoder.png
│
├── includes/
│   ├── header.php
│   └── footer.php
│
├── pages/
│   ├── about.php
│   ├── advanced-physics.php
│   └── formula-reference.php
│
├── scripts/
│   └── capture-screenshots.js
│
└── tests/
    ├── calculator-smoke.spec.js
    └── practical-calculators.spec.js
```

## Version History

### v2.1.0 – Practical Calculator Architecture Refactor

- Added comprehensive regression coverage for practical calculators.
- Extracted shared formatting, normalization, validation, unit, and history helpers.
- Reduced duplicated implementation across practical calculators.
- Refactored Charge, Energy, RC Time, Capacitor Code Decoder, and Series/Parallel internals.
- No calculator formulas, validation behavior, history, copy/export, or UI changed.

### v2.0.0 – Advanced Physics Update

- Added the Advanced Physics page
- Added five Advanced Physics calculators
- Added topic navigation, collapsible workflows, and mobile navigation improvements
- Modularized the Advanced Physics JavaScript files
- Expanded Playwright UI regression coverage

### v1.0.0 – Initial complete calculator suite

- Seven practical calculator modes
- Formula Reference page
- About page
- Dark/light theme
- Local calculation history, restore, TXT/CSV export, and Copy Result buttons
- Shared numeric keypad
- Screenshot automation

## Roadmap

- Capacitive reactance calculator
- RC filter tools
- Printable formula and Advanced Physics references
- Accessibility improvements
- More automated tests for calculator edge cases

## Contributing

Contributions are welcome for bug fixes, documentation improvements, accessibility refinements, and additional calculator modes.

Suggested workflow:

1. Fork the project.
2. Create a focused feature or fix branch.
3. Keep calculator formulas and validation rules easy to review.
4. Test changes locally with XAMPP.
5. Submit a pull request with a clear summary and screenshots when UI changes are involved.

## Educational Use Notice

This calculator is intended for learning, prototyping, and reference. For critical engineering, manufacturing, safety, or high-voltage work, verify results with trusted engineering tools and component datasheets.

## License

This project is released under the **ISC License**.

## Keywords

`capacitance calculator`, `capacitor calculator`, `electronics calculator`, `series capacitance`, `parallel capacitance`, `capacitor code decoder`, `RC time constant`, `charge calculator`, `energy stored capacitor`, `PHP project`, `XAMPP project`, `vanilla JavaScript`
