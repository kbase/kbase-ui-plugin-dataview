define([
    'preact',
    'htm'
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);
    class SimpleError extends Component {
        render() {
            return html`
                <div className="alert alert-danger">
                    <div>
                        <strong>${this.props.title || 'Error!'}</strong>${' '}
                    </div>
                    <div>
                        ${this.props.message}
                    </div>
                </div>
            `;
        }
    }
    return SimpleError;
});
