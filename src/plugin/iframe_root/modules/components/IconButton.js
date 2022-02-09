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
            const buttonClass = [
                'IconButton'
            ];
            if (this.props.type) {
                buttonClass.push(`text-${this.props.type}`);
            }
            if (this.props.disabled) {
                style.color = 'rgb(175, 175, 175)';
                buttonClass.push('IconButton-disabled');
                return html`
                    <div class=${buttonClass.join(' ')} 
                        style=${style} 
                        title=${this.props.tooltip}>
                        <span className=${`fa fa-${icon}`} />
                    </div>
                `;
            }
            return html`
                <div class=${buttonClass.join(' ')} style=${style} 
                    title=${this.props.tooltip}
                    onClick=${this.onClick.bind(this)}>
                    <span className=${`fa fa-${icon}`} />
                </div>
            `;
        }
    }

    return IconButton;
});
