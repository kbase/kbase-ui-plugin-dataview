define([], () => {
    function UIURL({path, params, type}, newWindow=false) {
        if (!path || !type) {
            throw new Error('Both "path" and "type" are required');
        }
        let url;

        switch (type) {
            case 'kbaseui': {
                if (newWindow) {
                    url = europaBaseURL();
                    url.pathname = `legacy/${path}`;
                    if (params && Object.keys(params).length > 0) {
                        for (const [key, value] of Object.entries(params)) {
                            url.searchParams.set(key, value);
                        }
                    }
                } else {
                    // In the same window, we will be issuing the 
                    url = kbaseUIRBaseURL();
                    url.hash = `#${path}`
                    if (params && Object.keys(params).length > 0) {
                        url.hash += `$${new URLSearchParams(params).toString()}`
                    }
                }
                break;
            }
            case 'europaui': {
                url = europaBaseURL();
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
        const url = kbaseUIRBaseURL();
        url.hash = `#${hash}`;
        if (params && Object.keys(params).length > 0) {
            const searchParams = new URLSearchParams(params);
            // Use our special notation for params on the hash
            url.hash += `$${searchParams}`;
        }
        return url;
    }

    function europaKBaseUIURL(hash, params) {
        const url = europaBaseURL()
        url.pathname = `legacy/${hash}`;
        if (params && Object.keys(params).length > 0) {
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.set(key, value);
            }
        }
        return url;
    }

    function otherUIURL({hash, pathname, params}) {
        const url = europaBaseURL()
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

    function europaBaseURL() {
        const europaHostname = window.parent.location.hostname.split('.')
            .slice(-3)
            .join('.');
        const url = new URL(window.location.origin);
        url.hostname = europaHostname;
        return url;
    }

    function kbaseUIRBaseURL() {
        const url = new URL(window.parent.location.origin);
        url.pathname = window.parent.location.pathname;
        return url;
    }

    return {UIURL, kbaseUIURL, europaKBaseUIURL, otherUIURL, europaURL};
});
