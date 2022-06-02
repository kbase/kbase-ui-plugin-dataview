define([
    'kb_common/utils',
    'kb_lib/jsonRpc/exceptions'
], (
    Utils,
    JSONRPCExceptions
) => {

    const donorNode = document.createElement('div');
    function domSafeText(rawContent) {
        donorNode.innerText = rawContent;
        // safe
        return donorNode.innerHTML;
    }

    /**
     * domSafeValue
     * Returns the provided value as a string, safely
     * encoded for inclusion into the DOM.
     */
    function domSafeValue(value) {
        switch (typeof value) {
        case 'string':
            return domSafeText(value);
        case 'number':
            return String(value);
        case 'undefined':
            return '';
        case 'boolean':
            if (value) {
                return 'true';
            }
            return 'false';
        default:
            throw new Error('No dom safe value for this type');
        }
    }

    function objectInfoToObject(rawObjectInfo) {
        const data = rawObjectInfo.map((value) => {
            if (typeof value === 'string') {
                return domSafeText(value);
            } else if (typeof value === 'object' && value !== null) {
                return Object.entries(value).reduce((metadata, [key, value]) => {
                    if (typeof value === 'string') {
                        value = domSafeText(value);
                    }
                    metadata[key] = value;
                    return metadata;
                }, {});
            }
            return value;
        });

        const type = data[2].split(/[-\.]/);

        return {
            id: data[0],
            name: data[1],
            type: data[2],
            save_date: data[3],
            version: data[4],
            saved_by: data[5],
            wsid: data[6],
            ws: data[7],
            checksum: data[8],
            size: data[9],
            metadata: data[10],
            ref: `${data[6]}/${data[0]}/${data[4]}`,
            obj_id: `ws.${data[6]}.obj.${data[0]}`,
            typeModule: type[0],
            typeName: type[1],
            typeMajorVersion: type[2],
            typeMinorVersion: type[3],
            saveDate: Utils.iso8601ToDate(data[3])
        };
    }

    function workspaceInfoToObject(rawWorkspaceInfo) {
        const data = rawWorkspaceInfo.map((value) => {
            if (typeof value === 'string') {
                return domSafeText(value);
            } else if (typeof value === 'object' && value !== null) {
                return Object.entries().reduce((metadata, [key, value]) => {
                    if (typeof value === 'string') {
                        value = domSafeText(value);
                    }
                    metadata[key] = value;
                    return metadata;
                }, {});
            }
        });

        return {
            id: data[0],
            name: data[1],
            owner: data[2],
            moddate: data[3],
            object_count: data[4],
            user_permission: data[5],
            globalread: data[6],
            lockstat: data[7],
            metadata: data[8],
            modDate: Utils.iso8601ToDate(data[3])
        };
    }

    function domSafeErrorMessage(error, defaultMessage) {
        const text = errorMessage(error, defaultMessage);
        return domSafeText(text);
    }

    const DEFAULT_ERROR_MESSAGE = 'Unknown error';
    function errorMessage(error, defaultMessage) {
        function messageOrDefault(message) {
            return message || defaultMessage || DEFAULT_ERROR_MESSAGE;
        }
        if (typeof error === 'string') {
            return messageOrDefault(error);
        } else if (error instanceof Error) {
            if (error instanceof JSONRPCExceptions.JsonRpcError) {
                return messageOrDefault(error.originalError.message || error.originalError.name);
            }
            return messageOrDefault(error.message || error.name);
        } else if (typeof error === 'object' && error !== null && error.error) {
            // Is probably a KBase service error
            return messageOrDefault(error.error.message || error.name);
        }
        return messageOrDefault();
    }
    return {
        objectInfoToObject,
        workspaceInfoToObject,
        domSafeText,
        domSafeValue,
        domSafeErrorMessage,
        errorMessage
    };
});