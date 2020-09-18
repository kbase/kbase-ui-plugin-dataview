define([
    'preact',
    'htm',

    'css!./DropdownMenu'
], function (
    preact,
    htm
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    class DropdownMenu extends Component {
        constructor(props) {
            super(props);
            this.ref = preact.createRef();
            this.dropdownRef = preact.createRef();
            this.state = {
                open: false
            };
        }

        toggleMenu() {
            if (!this.ref.current) {
                return;
            }
            this.setState({
                open: !this.state.open
            });
        }

        renderMenu() {
            return this.props.menu.map((item) => {
                return html`
                    <div className="DropdownMenu-item" onClick=${item.action}>
                        ${item.title}
                    </div>
                `;
            });
        }

        render() {
            // const style={};
            const menuStateClass = '';
            const menuIconClass = 'fa-chevron-circle-down';
            const dropdownClass = (() => {
                if (this.state.open) {
                    return '-open';
                }
                return '';
            })();

            return html`
                <div className=${`DropdownMenu ${menuStateClass}`} onClick=${() => {this.toggleMenu();}} ref=${this.ref}>
                    <span className=${`DropdownMenu-icon fa ${menuIconClass}`}></span>
                    <div className=${`DropdownMenu-dropdown ${dropdownClass}`} ref=${this.dropdownRef}>
                        ${this.renderMenu()}
                    </div>
                </div>
            `;
        }
    }
    return DropdownMenu;
});
