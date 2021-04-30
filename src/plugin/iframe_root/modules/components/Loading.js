define([
    'preact',
    'htm',
    'css!./Loading.css'
], function (
    preact,
    htm
) {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Loading extends Component {
        render() {
            let message;
            if (this.props.message) {
                message = html`<span>${this.props.message}</span>`;
            }
            return html`
                <div className="Loading-wrapper">
                    <div className="Loading">
                        <span className="Loading-message">${message}</span>
                        <span className="fa fa-spinner fa-pulse fa-2x fa-fw"
                              style=${{color: 'gray'}}>
                        </span>
                    </div>
                </div>
            `;
        }
    }

    return Loading;
});