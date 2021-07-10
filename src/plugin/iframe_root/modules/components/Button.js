define([
    'preact',
    'htm'
], (
    {h, Component},
    htm
) => {
    const html = htm.bind(h);

    class Button extends Component {
        constructor(props) {
            super(props);
            this.state = {
                showTooltip: false
            };
        }

        renderTooltip() {
            if (!this.state.showTooltip) {
                return;
            }
            return html`
                <div class="Tooltip-container">
                    <div class="Tooltip-content">
                        ${this.props.title}
                    </div>
                </div>
            `;
        }

        onMouseOver() {
            this.setState({
                showTooltip: true
            });
        }

        onMouseOut() {
            this.setState({
                showTooltip: false
            });
        }

        render() {
            return html`
                <div style="position: relative;" onmouseover=${this.onMouseOver.bind(this)}
                     onmouseout=${this.onMouseOut.bind(this)}>
                    ${this.renderTooltip()}
                    <button type="button"
                            class="btn btn-default"
                            style="border: none;"
                            onclick=${this.props.onclick}

                            title=${this.props.title}
                            disabled=${this.props.disabled}>
                        ${this.props.icon}
                    </button>
                </div>
            `;
        }
    }

    return Button;
});