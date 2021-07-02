define([
    'preact',
    'htm',

    'css!./Col'
], function (
    preact,
    htm
) {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Col extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return html`
                <div className="Col" style=${this.props.style || {}}>
                    ${this.props.children}
                </div>
            `;
        }
    }
    return Col;
});
