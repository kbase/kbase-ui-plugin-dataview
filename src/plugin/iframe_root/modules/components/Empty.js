define([
    'preact',
    'htm',
    './Empty.styles'
], (
    preact,
    htm,
    styles
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Empty extends Component {
        renderMessage() {
            if (this.props.message) {
                return html`<span>${this.props.message}</span>`;
            }
            return this.props.children;
        }
        render() {
            return html`
                <div style=${styles.wrapper}>
                    <div style=${styles.main}>
                        <div className="fa fa-lg fa-ban" style=${styles.icon} />
                        ${this.renderMessage()}
                    </div>
                </div>
            `;
        }
    }
    return Empty;
});
