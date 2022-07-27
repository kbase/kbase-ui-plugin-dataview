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
        renderIcon() {
            const icon = (() => {
                switch (this.props.type) {
                case 'info':
                    return 'info-circle';
                case 'warning':
                    return 'exclamation-triangle';
                case 'success':
                    return 'check';
                case 'danger':
                    return 'exclamation-circle';
                }
            })();
            return html`<span className=${`fa fa-2x fa-${icon} -icon`}/>`;
        }
        renderTitle() {
            if (this.props.title) {
                return html`<strong>${this.props.title}</strong>${' '}`;
            }
        }
        renderContent() {
            if (this.props.render) {
                return this.props.render();
            } else if (this.props.message) {
                return this.props.message;
            }
            return this.props.children;
        }
        render() {
            return html`
                <div className="Alert alert alert-${this.props.type || 'info'}">
                    ${this.renderIcon()}
                    ${this.renderTitle()}
                    ${this.renderContent()}
                </div>
            `;
        }
    }
    return Alert;
});
