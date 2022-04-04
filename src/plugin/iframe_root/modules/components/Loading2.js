define([
    'preact',
    'htm',
    './Alert',
    'css!./Loading2.css'
], (
    preact,
    htm,
    Alert
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    /*
    This loading component distinguishes itself by filling its container, and centering its content.
    So it really depends on the user of it providing a container.
    It is designed for the use case of asynchronous components which have a defined shape first, and need
    to show loading state within it.
    */

    class Loading2 extends Component {
        renderMessage() {
            if (this.props.message) {
                return html`<span>${this.props.message}</span>`;
            }
        }
        renderContent() {
            return html`
                <div className="Loading2">
                    <span className="fa fa-spinner fa-pulse fa-2x fa-fw"
                          style=${{color: 'gray', marginRight: '0.25em'}}>
                    </span>
                    ${this.renderMessage()}
                </div>
            `;
        }
        render() {
            return html`
                <${Alert} type="neutral" render=${this.renderContent.bind(this)} />
            `;
        }
    }

    return Loading2;
});