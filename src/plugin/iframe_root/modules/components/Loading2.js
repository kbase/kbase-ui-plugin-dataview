define([
    'preact',
    'htm',
    'css!./Loading2.css'
], (
    preact,
    htm
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
        render() {
            const style = {};
            if (this.props.inline) {
                style.justifyContent = 'left';
            } else {
                style.justifyContent = 'center';
            }
            let message;
            if (this.props.message) {
                message = html`<span>${this.props.message}</span>`;
            }
            return html`
                <div className="Loading2" style=${style}>
                    <span className="Loading2-message">${message}</span>
                    <span className="fa fa-spinner fa-pulse fa-2x fa-fw"
                            style=${{color: 'gray'}}>
                    </span>
                </div>
            `;
        }
    }

    return Loading2;
});