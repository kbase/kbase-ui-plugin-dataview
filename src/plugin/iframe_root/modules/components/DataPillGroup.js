define([
    'preact',
    'htm',
    './DataPillGroup.styles',
    'lib/merge'
], (
    {Component, h},
    htm,
    styles,
    {merge}
) => {
    const html = htm.bind(h);

    class DataPillGroup extends Component {
        render() {
            const style = (() => {
                if (this.props.style) {
                    return merge(styles.main, this.props.style);
                }
                return styles.main;
            })();
            return html`
                <div style=${style}>
                    <div style=${styles.title}>
                        ${this.props.title}
                    </div>
                    <div style=${styles.body}>
                        ${this.props.children}
                    </div>
                </div>
            `;
        }
    }

    return DataPillGroup;
});
