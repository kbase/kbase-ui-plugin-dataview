define([
    'preact',
    'htm',
    './Popup.styles'
], (
    preact,
    htm,
    styles
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Content extends Component {
        constructor(props) {
            super(props);
            this.ref = preact.createRef();
            this.observer = null;
        }
        render() {
            return html`
                <div style=${this.props.style} ref=${this.ref} data-testid="content">
                    ${this.props.children}
                </div>
            `;
        }
    }

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
            this.setState({
                open: false
            });
            if (this.cover) {
                // this.cover.removeEventListener('click', this.handleAnyClick);
                document.body.removeEventListener('click', this.handleAnyClick);
                this.cover.parentNode.removeChild(this.cover);
                this.cover = null;
            }
            this.props.onClose();
        }

        togglePopup() {
            this.setState({
                open: !this.state.open
            });
            if (this.currentPop) {
                this.removePop();
                return;
            }

            // Take the current position of this component

            // The pop up is positioned at the left offset of our button, adjusted for
            // any scrolling of its container.
            const left = this.ref.current.offsetLeft - this.scrollContainer.scrollLeft;

            // And similarly positioned vertically.
            const top = this.ref.current.offsetTop + this.ref.current.offsetHeight;

            // Note that this is the position of the upper left corner of the popup.
            // TODO: position the popup relative to this, in order to allow for adjusting
            // to overflow on the right side of the page.

            // Use the cover approach.
            this.cover = this.overlayContainer.appendChild(document.createElement('div'));
            Object.entries(styles.cover).forEach(([name, value]) => {
                this.cover.style.setProperty(name, value);
            });
            // this.cover.addEventListener('click', this.handleAnyClick);
            document.body.addEventListener('click', this.handleAnyClick);

            const content = html`
                <${Content} style=${Object.assign({}, styles.pop, {left, top})} >
                    ${this.renderContent()}
                </>
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
            const icon = this.state.open ? 'times-circle' : 'chevron-circle-down';
            return html`
                <div style=${styles.main} data-testid="Popup"
                     onClick=${(e) => {e.stopPropagation(); this.togglePopup();}} 
                     ref=${this.ref}>
                    <span class="fa fa-${icon}" style=${styles.icon}></span>
                </div>
            `;
        }
    }
    return Popup;
});
