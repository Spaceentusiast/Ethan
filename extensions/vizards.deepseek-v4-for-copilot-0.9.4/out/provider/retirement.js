"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelRetirementNotice = getModelRetirementNotice;
const i18n_1 = require("../i18n");
const LEGACY_FLASH_MODEL_IDS = new Set(['deepseek-v4-flash', 'deepseek-v4-flash-vision-exp']);
/** Presentation only: never changes model selection or request conversion. */
function getModelRetirementNotice(modelId, usesOfficialModel) {
    if (!LEGACY_FLASH_MODEL_IDS.has(modelId)) {
        return undefined;
    }
    // A custom endpoint or mapped ID may still serve the original model.
    if (!usesOfficialModel) {
        return {
            code: 'model_deprecated',
            message: (0, i18n_1.t)('model.retirement.custom'),
            showPricing: false,
        };
    }
    return {
        code: 'model_deprecated',
        message: (0, i18n_1.t)('model.retirement.flashRetired'),
        showPricing: false,
    };
}
//# sourceMappingURL=retirement.js.map