define([
    'preact',
    'htm',
    'css!./Alert.css'
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Alert extends Component {
        renderTitle() {
            if (this.props.title) {
                return html`<strong>${this.props.title}</strong>${' '}`;
            }
        }
        renderContent() {
            if (this.props.render) {
                return this.props.render();
            }
            return this.props.message;
        }
        render() {
            return html`
                <div className="Alert alert alert-${this.props.type || 'info'}">
                    ${this.renderTitle()}
                    ${this.renderContent()}
                </div>
            `;
        }
    }
    return Alert;
});
