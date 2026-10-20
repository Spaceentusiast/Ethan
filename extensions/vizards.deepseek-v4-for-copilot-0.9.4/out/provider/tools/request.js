"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareRequestTools = prepareRequestTools;
exports.collectTrailingToolResultIds = collectTrailingToolResultIds;
const convert_1 = require("../convert");
function prepareRequestTools(toolCallingCapability, options) {
    return toolCallingCapability ? (0, convert_1.convertTools)(options.tools) : undefined;
}
function collectTrailingToolResultIds(messages) {
    const trailingToolResultIds = [];
    for (let index = messages.length - 1; index >= 0; index -= 1) {
        const message = messages[index];
        if (message.role !== 'tool' || !message.tool_call_id) {
            break;
        }
        trailingToolResultIds.push(message.tool_call_id);
    }
    return trailingToolResultIds.reverse();
}
//# sourceMappingURL=request.js.map