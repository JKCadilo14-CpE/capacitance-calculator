// Advanced physics calculators: compatibility bootstrap for page-scoped modules.

import('./advanced/advanced-index.js')
    .then(({ initAdvancedPhysicsCalculators }) => {
        initAdvancedPhysicsCalculators();
    })
    .catch((error) => {
        console.error('Advanced Physics calculators failed to load.', error);
    });
