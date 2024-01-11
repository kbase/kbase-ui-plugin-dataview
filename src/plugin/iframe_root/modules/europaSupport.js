define([], () => {
    function UIURL({path, params, type}, newWindow=false) {
        if (!path || !type) {
            throw new Error('Both "path" and "type" are required');
        }
        const url = new URL(window.location.origin);
        switch (type) {
            case 'kbaseui': {
                if (newWindow) {
                    const hostname = window.location.hostname.split('.').slice(1).join('.');
                    url.hostname = hostname;
                    url.pathname = `legacy/${path}`;
                    if (params && Object.keys(params).length > 0) {
                        for (const [key, value] of Object.entries(params)) {
                            url.searchParams.set(key, value);
                        }
                    }
                } else {
                    // In the same window, we will be issuing the 
                    url.hash = `#${path}`
                    if (params && Object.keys(params).length > 0) {
                        url.hash += `$${new URLSearchParams(params).toString()}`
                    }
                }
                break;
            }
            case 'europaui': {
                const hostname = window.location.hostname.split('.').slice(1).join('.');
                url.hostname = hostname;
                url.pathname = path;
                if (params && Object.keys(params).length > 0) {
                    for (const [key, value] of Object.entries(params)) {
                        url.searchParams.set(key, value);
                    }
                }
            }
        }
        return url;
    }

    function kbaseUIURL(hash, params) {
        const url = new URL(window.location.origin);
        url.hash = `#${hash}`;
        if (params && Object.keys(params).length > 0) {
            const searchParams = new URLSearchParams(params);
            // Use our special notation for params on the hash
            url.hash += `$${searchParams}`;
        }
        return url;
    }

    function europaKBaseUIURL(hash, params) {
        const url = topLevelBaseURL()
        url.pathname = `legacy/${hash}`;
        if (params && Object.keys(params).length > 0) {
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.set(key, value);
            }
        }
        return url;
    }

    function topLevelBaseURL() {
        let hostname;
        if (!window.location.hostname.endsWith('kbase.us')) {
            hostname = 'ci.kbase.us';
        } else {
            hostname = window.location.hostname.split('.').slice(1).join('.');
        }
        return new URL(`https://${hostname}`);
    }

    function otherUIURL({hash, pathname, params}) {
        let hostname;
        if (!window.location.hostname.endsWith('kbase.us')) {
            hostname = 'ci.kbase.us';
        } else {
            hostname = window.location.hostname.split('.').slice(1).join('.');
        }
        const url = new URL(`https://${hostname}`);

        url.pathname = hash ? `legacy/${hash}` : pathname || '';

        // So in this case we use a standard search fragment.
        if (params && Object.keys(params).length > 0) {
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.set(key, value);
            }
        }

        return url;
    }

    /**
     * Create a URL for any KBase user interface.
     *
     * Uses specific heuristics for determining how to construct it:
     */
    function europaURL(hashPath, newWindow) {
        if (!newWindow && hashPath.hash) {
            return kbaseUIURL(hashPath.hash, hashPath.params);
        }

        return otherUIURL(hashPath);
    }

    return {UIURL, kbaseUIURL, europaKBaseUIURL, otherUIURL, europaURL};
});
