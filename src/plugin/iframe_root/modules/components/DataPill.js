define([
    'preact',
    'htm',
    './DataPill.styles',
    'lib/merge'
], (
    {Component, h},
    htm,
    styles,
    {merge}
) => {
    const html = htm.bind(h);

    class DataPill extends Component {
        constructor(props) {
            super(props);
            if (typeof this.props.value === 'undefined' &&
                typeof this.props.render === 'undefined') {
                throw new Error('either "value" or "render" prop must be provided');
            }
        }
        renderBody() {
            if (this.props.value) {
                return this.props.value;
            }
            if (this.props.render) {
                return this.props.render();
            }
        }
        render() {
            const style = (() => {
                if (this.props.style) {
                    return merge(styles.main, this.props.style);
                }
                return styles.main;
            })();
            return html`
                <div style=${style}>
                    <div style=${styles.label}>
                        ${this.props.label}
                    </div>
                    <div style=${styles.value}>
                        ${this.renderBody()}
                    </div>
                </div>
            `;
        }
    }
    return DataPill;
});
