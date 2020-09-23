define([
    'preact',
    'htm',

    'css!./Popup'
], function (
    preact,
    htm
) {
    'use strict';

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
            this.cover.classList.add('Popup-cover');
            this.cover.addEventListener('click', this.handleAnyClick);

            const style = {
                left, top
            };
            const content = html`
            <div className="Popup-pop" style=${style}>
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
            const popupStateClass = '';
            const iconClass = 'fa-chevron-circle-down';
            return html`
                <div className=${`Popup ${popupStateClass}`}
                     onClick=${(e) => {e.stopPropagation(); this.togglePopup();}} 
                     ref=${this.ref}>
                    <span className=${`Popup-icon fa ${iconClass}`}></span>
                </div>
            `;
        }
    }
    return Popup;
});
