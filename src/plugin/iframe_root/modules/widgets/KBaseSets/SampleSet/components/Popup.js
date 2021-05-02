define([
    'preact',
    'htm',
    './Popup.styles'
], function (
    preact,
    htm,
    styles
) {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Popup extends Component {
        constructor(props) {
            super(props);
            this.ref = preact.createRef();
            this.state = {
                open: false
            };
            this.isOpen = false;
            this.currentPop = null;

            this.handleAnyClick = () => {
                this.removePop();
            };
        }

        componentDidMount() {
            this.overlayContainer = document.querySelector(this.props.overlaySelector);
            this.scrollContainer = document.querySelector(this.props.scrollSelector);
        }

        componentWillUnmount() {
            this.removePop();
        }

        removePop() {
            if (this.cover) {
                this.cover.removeEventListener('click', this.handleAnyClick);
                this.cover.parentNode.removeChild(this.cover);
                this.cover = null;
            }
            this.props.onClose();
        }

        togglePopup() {
            if (this.currentPop) {
                this.removePop();
                return;
            }

            // Take the current position of this component
            const left = this.ref.current.offsetLeft - this.scrollContainer.scrollLeft;
            const top = this.ref.current.offsetTop + this.ref.current.offsetHeight;

            // Use the cover approach.
            this.cover = this.overlayContainer.appendChild(document.createElement('div'));
            Object.entries(styles.cover).forEach(([name, value]) => {
                this.cover.style.setProperty(name, value);
            });
            this.cover.addEventListener('click', this.handleAnyClick);

            const content = html`
            <div style=${Object.assign({}, styles.pop, {left, top})}>
                ${this.renderContent()}
            </div>
            `;
            preact.render(content, this.cover);
            this.props.onOpen();
        }

        renderContent() {
            if (this.props.render) {
                return this.props.render();
            }
            return preact.cloneElement(this.props.children, {
                onClose: () => {this.removePop();}
            });
        }

        render() {
            return html`
                <div style=${styles.main}
                     onClick=${(e) => {e.stopPropagation(); this.togglePopup();}} 
                     ref=${this.ref}>
                    <span class="fa fa-chevron-circle-down" style=${styles.icon}></span>
                </div>
            `;
        }
    }
    return Popup;
});
