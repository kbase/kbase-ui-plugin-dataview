define([
    'preact',
    'htm',
], (
    preact,
    htm
) => {
    const {h, Component} = preact;
    const html = htm.bind(h);

    function cheapEuropaBaseURL() {
        const europaHostname = window.location.hostname.split('.').slice(1).join('.');
        const url = new URL(window.location.origin);
        url.hostname = europaHostname;
        return url;
    }

    class UILink extends Component {
        constructor(props) {
            super(props);

            if (!['newwindow', 'kbaseui', 'europa'].includes(props.to)) {
                throw new Error(`Invalid "to": ${props.to}`)
            }
        }
        getTopLevelOrigin() {
            let hostname;
            if (!window.location.hostname.endsWith('kbase.us')) {
                // supports running on localhost, etc.
                hostname = 'ci.kbase.us';
            } else {
                // otherwise, assume a kbase deploy environment, and 
                const hostParts = window.location.hostname.split('.');
                if (hostParts.length === 3) {
                    hostname = hostParts.join('.')
                } else if (hostParts.length === 4) {
                    hostname = hostParts.slice(1).join('.');
                } else {
                    throw new Error(`Hostname format not supported: ${window.location.hostname} `)
                }
            }
            return `https://${hostname}`;
        }
        getTarget() {
            switch (this.props.to) {
                case 'newwindow': 
                    return '_blank';
                case 'kbaseui': 
                    return '_parent';
                case 'europa': 
                    return '_top';
            }
        }
        getOrigin() {
            switch (this.props.to) {
                case 'newwindow': 
                    return this.getTopLevelOrigin();
                case 'kbaseui': 
                    return window.location.origin;
                case 'europa': 
                    return this.getTopLevelOrigin();
            }
        }
        render() {
            const {hash, pathname, params} = this.props.hashPath;

            const url = new URL(this.getOrigin());
            
            if (pathname) {
                url.pathname = pathname;
            }

            // Apply hash or pathname
            switch (this.props.to) {
                case 'newwindow': 
                case 'europa': 
                    if (hash) {
                        url.pathname = `legacy/${hash}`;
                    } else {
                        url.pathname = pathname || '';
                    }
                    break;
                case 'kbaseui': 
                    if (!hash) {
                        throw new Error('A target of "kbaseui" requires a hash');
                    }
                    url.hash = hash;
            }

            // Apply parameters.
            
            if (params && Object.keys(params).length > 0) {
                const searchParams = new URLSearchParams(params);
                switch (this.props.to) {
                    case 'newwindow': 
                    case 'europa': 
                        // searchParams.forEach((value, key) => {
                        //     url.searchParams.set(key, value);
                        // });
                        url.pathname = url.pathname + '$' + searchParams.toString();
                        break;
                    case 'kbaseui': 
                        url.hash += `${hash}$${searchParams.toString()}`;
                }
            }

            const target = this.getTarget();
        
            const label = (() => {
                if (this.props.linkIsLabel) {
                    return url.toString();
                }
                if (this.props.label) {
                    return this.props.label;
                }
                return this.props.children;
            })();

            return html`<a 
                href=${url.toString()} 
                target=${target} 
                title=${this.props.title}
                className=${this.props.className}
            >
                ${label}
            </a>`;
        }
    }

    return UILink;
});