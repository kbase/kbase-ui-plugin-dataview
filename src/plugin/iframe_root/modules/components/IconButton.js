define([
    'preact',
    'htm',

    'css!./IconButton.css'
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);


    class IconButton extends Component {
        onClick(ev) {
            this.props.onClick(ev.getModifierState('Alt'));
        }
        render() {
            const style = {};
            const icon = (() => {
                if (this.props.active && this.props.activeIcon) {
                    return this.props.activeIcon;
                }
                return this.props.icon;
            })();
            if (this.props.disabled) {
                style.color = 'rgb(175, 175, 175)';
                return html`
                    <div class='IconButton IconButton-disabled' style=${style} 
                        title=${this.props.tooltip}>
                        <span className=${`fa fa-${icon}`} />
                    </div>
                `;
            }
            return html`
                <div class='IconButton' style=${style} 
                    title=${this.props.tooltip}
                    onClick=${this.onClick.bind(this)}>
                    <span className=${`fa fa-${icon}`} />
                </div>
            `;
        }
    }

    return IconButton;
});
