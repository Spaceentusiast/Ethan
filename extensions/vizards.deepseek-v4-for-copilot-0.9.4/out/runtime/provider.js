"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProvider = registerProvider;
const vscode_1 = __importDefault(require("vscode"));
const logger_1 = require("../logger");
const provider_1 = require("../provider");
function registerProvider(context) {
    const provider = new provider_1.DeepSeekChatProvider(context);
    context.subscriptions.push(vscode_1.default.commands.registerCommand('deepseek-copilot.setApiKey', () => provider.configureApiKey()), vscode_1.default.commands.registerCommand('deepseek-copilot.clearApiKey', () => provider.clearApiKey()), vscode_1.default.commands.registerCommand('deepseek-copilot.setVisionModel', () => provider.setVisionModel()), vscode_1.default.lm.registerLanguageModelChatProvider('deepseek', provider));
    // Make models discoverable without waiting for Copilot, which may itself be waiting for BYOK.
    provider.refreshModelPicker();
    context.subscriptions.push(refreshModelsAfterCopilotActivation(provider));
    return provider;
}
function refreshModelsAfterCopilotActivation(provider) {
    let disposed = false;
    // Keep the post-activation refresh to replace cached model info missing configurationSchema.
    Promise.resolve(vscode_1.default.extensions.getExtension('github.copilot-chat')?.activate())
        .then(() => {
        if (!disposed) {
            provider.refreshModelPicker();
        }
    })
        .catch((error) => {
        if (!disposed) {
            logger_1.logger.warn('Failed to activate Copilot Chat or refresh model information', error);
        }
    });
    // Ignore late activation results after this extension is disposed.
    return new vscode_1.default.Disposable(() => {
        disposed = true;
    });
}
//# sourceMappingURL=provider.js.map