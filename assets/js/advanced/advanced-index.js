// Advanced Physics calculator entrypoint.

import { initAdvancedCalculatorToggles } from './advanced-calculator-toggle.js';
import { initParallelPlateCalculator } from './parallel-plate.js';
import { initCylindricalCalculator } from './cylindrical.js';
import { initSphericalCalculator } from './spherical.js';
import { initDielectricCalculator } from './dielectric.js';
import { initElectricFieldCalculator } from './electric-field.js';

export const initAdvancedPhysicsCalculators = () => {
    const hasAdvancedCalculator = Boolean(
        document.getElementById('parallel-plate-form')
        || document.getElementById('cylindrical-form')
        || document.getElementById('spherical-form')
        || document.getElementById('dielectric-form')
        || document.getElementById('electric-field-form')
    );

    if (!hasAdvancedCalculator) {
        return;
    }

    initAdvancedCalculatorToggles();
    initParallelPlateCalculator();
    initCylindricalCalculator();
    initSphericalCalculator();
    initDielectricCalculator();
    initElectricFieldCalculator();
};
