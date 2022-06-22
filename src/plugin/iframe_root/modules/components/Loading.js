define([
    'preact',
    'htm',

    // For effect
    'css!./Loading.css'
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Loading extends Component {

        renderInline(message) {
            return html`
                <div className="Loading-inline">
                    <span className="Loading-message">${message}</span>
                    <span className="fa fa-spinner fa-pulse fa-fw" />
                </div>
            `;
        }

        renderBlock(message) {
            return html`
                <div className="Loading-block">
                    <span className="Loading-message">${message}</span>
                    <span className="fa fa-spinner fa-pulse fa-2x fa-fw"
                            style=${{color: 'gray'}}>
                    </span>
                </div>
            `;
        }

        render() {
            let message;
            if (this.props.message) {
                message = html`<span>${this.props.message}</span>`;
            }
            if (this.props.inline) {
                return this.renderInline(message);
            }
            return this.renderBlock(message);
        }

        // render() {
        //     const style = {};
        //     if (this.props.inline) {
        //         style.justifyContent = 'left';
        //     } else {
        //         style.justifyContent = 'center';
        //     }
        //     return html`
        //         <div className="Loading" style=${style}>
        //             ${this.renderLoading()}
        //         </div>
        //     `;
        // }
    }

    return Loading;
});