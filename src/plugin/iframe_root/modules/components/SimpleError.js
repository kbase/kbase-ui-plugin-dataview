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
                <strong>${this.props.title || 'Error!'}</strong>${' '}
                ${this.props.message}
                </table>
            `;
        }
    }
    return SimpleError;
});
