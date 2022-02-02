define([
    'preact',
    'htm',
    './Container.styles'
], (
    preact,
    htm,
    styles
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Container extends Component {
        render() {
            const style = Object.assign({}, styles.main, this.props.style || {});
            return html`
                <div style=${style}>
                    ${this.props.children}
                </div>
            `;
        }
    }
    return Container;
});
