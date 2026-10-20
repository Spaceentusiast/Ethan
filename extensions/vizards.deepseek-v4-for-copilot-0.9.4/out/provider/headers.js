"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRequestHeaders = resolveRequestHeaders;
const crypto_1 = require("crypto");
/** Resolve header templates once per provider call, before any HTTP attempts. */
function resolveRequestHeaders(headers, options, storageUri) {
    let conversationId;
    return Object.fromEntries(Object.entries(headers).map(([name, value]) => [
        name,
        value.replaceAll('${conversationId}', () => {
            conversationId ??= resolveConversationId(options, storageUri);
            return conversationId;
        }),
    ]));
}
function resolveConversationId(options, storageUri) {
    // Copilot transports this optional internal field through modelOptions.
    const upstreamId = options.modelOptions?._conversationId;
    if (typeof upstreamId === 'string' && upstreamId.length > 0) {
        return upstreamId;
    }
    // VS Code builds storageUri as <workspaceStorageHome>/<workspaceId>/<extensionId>.
    const storageDirectory = storageUri?.path.split('/').at(-2);
    if (storageDirectory) {
        // Node extension hosts may append a lock-conflict suffix to the workspace's MD5 ID.
        const workspaceId = storageDirectory.replace(/^([0-9a-f]{32})-\d+$/i, '$1');
        return `workspace-${workspaceId}`;
    }
    // Copilot creates this correlation ID for each model request.
    const upstreamRequestId = options.modelOptions?._capturingTokenCorrelationId;
    if (typeof upstreamRequestId === 'string' && upstreamRequestId.length > 0) {
        return `request-${upstreamRequestId}`;
    }
    return `request-${(0, crypto_1.randomUUID)()}`;
}
//# sourceMappingURL=headers.js.map