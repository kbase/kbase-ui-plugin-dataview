define([
    'preact',
    'htm',

    'css!./Row.css'
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Row extends Component {
        render() {
            return html`
                <div className="Row" style=${this.props.style}>
                    ${this.props.children}
                </div>
            `;
        }
    }
    return Row;
});
