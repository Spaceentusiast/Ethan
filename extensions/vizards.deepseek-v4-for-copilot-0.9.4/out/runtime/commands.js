"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = registerCommands;
const vscode_1 = __importDefault(require("vscode"));
const consts_1 = require("../consts");
const i18n_1 = require("../i18n");
const logger_1 = require("../logger");
const debug_1 = require("../provider/debug");
function registerCommands(context) {
    context.subscriptions.push(vscode_1.default.commands.registerCommand('deepseek-copilot.resetBaseUrl', resetBaseUrl), vscode_1.default.commands.registerCommand('deepseek-copilot.showLogs', () => logger_1.logger.show()), vscode_1.default.commands.registerCommand('deepseek-copilot.openRequestDumpsFolder', () => openRequestDumpsFolder(context)), vscode_1.default.commands.registerCommand('deepseek-copilot.getApiKey', () => vscode_1.default.env.openExternal(vscode_1.default.Uri.parse(consts_1.EXTERNAL_URLS.deepseek.apiKeys))), vscode_1.default.commands.registerCommand('deepseek-copilot.openSettings', () => vscode_1.default.commands.executeCommand('workbench.action.openSettings', 'deepseek-copilot')));
}
async function resetBaseUrl() {
    try {
        const config = vscode_1.default.workspace.getConfiguration(consts_1.CONFIG_SECTION);
        const inspection = config.inspect('baseUrl');
        const hasWorkspace = Boolean(vscode_1.default.workspace.workspaceFile || vscode_1.default.workspace.workspaceFolders?.length);
        const userValue = inspection?.globalValue;
        const workspaceValue = inspection?.workspaceValue;
        const targets = [
            {
                label: (0, i18n_1.t)('settings.resetBaseUrl.user'),
                target: vscode_1.default.ConfigurationTarget.Global,
                description: userValue === undefined
                    ? (0, i18n_1.t)('settings.resetBaseUrl.notConfigured')
                    : (0, i18n_1.t)('settings.resetBaseUrl.current', userValue),
                // Public inspection merges local and remote user values, hiding a possible fallback.
                detail: userValue === undefined
                    ? undefined
                    : vscode_1.default.env.remoteName && workspaceValue === undefined
                        ? (0, i18n_1.t)('settings.resetBaseUrl.afterInherited')
                        : (0, i18n_1.t)('settings.resetBaseUrl.after', (workspaceValue ?? inspection?.defaultValue) || 'https://api.deepseek.com'),
            },
            // baseUrl has window scope: folder overrides do not apply in a multi-root workspace.
            ...(hasWorkspace
                ? [
                    {
                        label: (0, i18n_1.t)('settings.resetBaseUrl.workspace'),
                        target: vscode_1.default.ConfigurationTarget.Workspace,
                        description: workspaceValue === undefined
                            ? (0, i18n_1.t)('settings.resetBaseUrl.notConfigured')
                            : (0, i18n_1.t)('settings.resetBaseUrl.current', workspaceValue),
                        detail: workspaceValue === undefined
                            ? undefined
                            : (0, i18n_1.t)('settings.resetBaseUrl.after', (userValue ?? inspection?.defaultValue) || 'https://api.deepseek.com'),
                    },
                ]
                : []),
        ];
        // Markdown command links do not carry the active Settings tab's scope.
        const selected = await vscode_1.default.window.showQuickPick(targets, {
            title: (0, i18n_1.t)('settings.resetBaseUrl.title'),
            placeHolder: (0, i18n_1.t)('settings.resetBaseUrl.chooseScope'),
        });
        if (!selected) {
            return;
        }
        const current = vscode_1.default.workspace.getConfiguration(consts_1.CONFIG_SECTION).inspect('baseUrl');
        const selectedValue = selected.target === vscode_1.default.ConfigurationTarget.Global
            ? current?.globalValue
            : current?.workspaceValue;
        if (selectedValue === undefined) {
            return;
        }
        // Global uses VS Code's user-setting routing, including remote user overrides.
        await config.update('baseUrl', undefined, selected.target);
    }
    catch (error) {
        logger_1.logger.warn('Failed to reset DeepSeek base URL', error);
        void vscode_1.default.window.showErrorMessage((0, i18n_1.t)('settings.resetBaseUrl.failed'));
    }
}
async function openRequestDumpsFolder(context) {
    try {
        const root = await (0, debug_1.ensureRequestDumpRoot)(context.globalStorageUri);
        logger_1.logger.info(`Opening request dumps folder: ${root.toString(true)}`);
        await vscode_1.default.commands.executeCommand('revealFileInOS', root);
    }
    catch (error) {
        logger_1.logger.warn('Failed to open request dumps folder', error);
        void vscode_1.default.window.showErrorMessage((0, i18n_1.t)('extension.openRequestDumpsFolderFailed'));
    }
}
//# sourceMappingURL=commands.js.map