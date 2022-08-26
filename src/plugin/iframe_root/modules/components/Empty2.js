define([
    'preact',
    'htm',
    './Alert',
    './Empty2.styles'
], (
    preact,
    htm,
    Alert,
    styles
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Empty extends Component {
        renderMessage() {
            let message;
            if (this.props.message) {
                message = html`<span>${this.props.message}</span>`;
            }
            return html`
                <div style=${styles.wrapper}>
                    <div style=${styles.message}>${message}</div>
                </div>
            `;
        }
        render() {
            return html`
                <${Alert} icon="ban" type="info" render=${this.renderMessage.bind(this)} />
            `;
        }
    }
    return Empty;
});
