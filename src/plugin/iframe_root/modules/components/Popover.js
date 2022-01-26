define([
    'preact',
    'htm',
    'jquery',
    'bootstrap'
], (
    preact,
    htm,
    $
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Popover extends Component {
        constructor(props) {
            super(props);
            this.ref = preact.createRef();
        }
        componentDidMount() {
            if (this.ref.current) {
                $(this.ref.current).popover({
                    content: () => {
                        return this.renderContent();
                    },
                    placement: 'left',
                    trigger: 'hover click',
                    html: true,
                    sanitize: false,
                    container: 'body'
                });
            }
        }
        renderContent() {
            const content = this.props.render();
            return content;
        }
        render() {
            return html`
                <div ref=${this.ref} style=${this.props.style} class=${this.props.class}>
                    ${this.props.children}
                </div>
            `;
        }
    }

    return Popover;
});