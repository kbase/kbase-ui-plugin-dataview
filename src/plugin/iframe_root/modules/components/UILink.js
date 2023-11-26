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
        render() {
            const {hash, pathname, params} = this.props.hashPath;
            const url = new URL(this.props.origin || cheapEuropaBaseURL().origin);
            
            if (pathname) {
                url.pathname = pathname;
            }
            if (params && Object.keys(params).length > 0) {
                const searchParams = new URLSearchParams(params);
                if (hash) {
                    // Use our special notation for params on the hash
                    url.hash = url.hash + `${hash}$${searchParams}`;
                } else {
                    // Otherwise, assume we just want a standard search component
                    searchParams.forEach((value, key) => {
                        url.searchParams.set(key, value);
                    });
                }
            } else {
                if (hash) {
                    url.hash = `#${hash}`;
                }
            }
            const target = typeof this.props.newWindow === 'undefined' || this.props.newWindow ? '_blank': '_top';
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