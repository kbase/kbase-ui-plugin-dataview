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

    class MenuItem extends Component {
        constructor(props) {
            super(props);
            this.state = {
                isOpen: false
            };
        }

        toggleSubMenu(event) {
            event.stopPropagation();
            this.setState({isOpen: !this.state.isOpen});
        }

        renderSubMenu() {
            const item = this.props.item;
            const [subMenu, menuClass] = (() => {
                if (this.state.isOpen) {
                    return [html`<${DropdownMenu} menu=${item.menu} />`, '-open'];
                }
                return [null, ''];
            })();
            const menuIconClass = (() => {
                if (this.state.isOpen) {
                    return 'fa fa-chevron-down';
                }
                return 'fa fa-chevron-right';
            })();
            return html`
            <div className=${`DropdownMenu-item ${menuClass}`} onClick=${this.toggleSubMenu.bind(this)}>
                <div className="DropdownMenu-item-label">
                    ${item.title} 
                </div>
                <div className=${`DropdownMenu-item-submenu-icon ${menuIconClass}`} />
                ${subMenu}
            </div>
        `;
        }

        renderDataMenu() {
            const item = this.props.item;
            const [subMenu, menuClass] = (() => {
                if (this.state.isOpen) {
                    const items = item.dataMenu.items.map((item) => {
                        if (item.action) {
                            return html`
                            <div className="DropdownMenu-item" onClick=${(event) => {this.doAction(event, item.action);}}>
                                <div className="DropdownMenu-item-label">${item.title}</div>
                            </div>
                            `;
                        } else {
                            return html`
                            <div className="DropdownMenu-item" onClick=${this.props.onActionCompleted}>
                                <div className="DropdownMenu-item-label">${item.title}</div>
                            </div>
                            `;
                        }
                    });
                    return [html`<div className="DropdownMenu-dataMenu">${items}</div>`, '-open'];
                }
                return [null, ''];
            })();
            const menuIconClass = (() => {
                if (this.state.isOpen) {
                    return 'fa fa-chevron-down';
                }
                return 'fa fa-chevron-right';
            })();
            return html`
            <div className=${`DropdownMenu-item ${menuClass}`} 
                 onClick=${this.toggleSubMenu.bind(this)}>
                <div className="DropdownMenu-item-label">
                    ${item.title} 
                </div>
                <div className=${`DropdownMenu-item-submenu-icon ${menuIconClass}`} />
                ${subMenu}
            </div>
        `;
        }

        doAction(event, action) {
            event.stopPropagation();
            try {
                action();
            } catch (ex) {
                console.error('Error ', ex);
            }
            this.props.onActionCompleted();
        }

        render() {
            const item = this.props.item;
            if (item.action) {
                return html`
                    <div className="DropdownMenu-item" onClick=${(event) => {this.doAction(event, item.action);}}>
                        <div className="DropdownMenu-item-label">${item.title}</div>
                    </div>
                `;
            }
            if (item.menu) {
                return this.renderSubMenu(item);
            }
            if (item.dataMenu) {
                return this.renderDataMenu(item);
            }
            return html`
                <div className="DropdownMenu-item">
                    <div className="DropdownMenu-item-label">${item.title}</div>
                </div>
            `;
        }
    }

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

        doActionCompleted() {
            this.props.onClose();
        }

        renderMenu() {
            return this.props.menu.items.map((item) => {
                return html`<${MenuItem} item=${item} onActionCompleted=${this.doActionCompleted.bind(this)}/>`;
            });
        }

        render() {
            const menuStateClass = '';
            return html`
                <div className=${`DropdownMenu ${menuStateClass}`} ref=${this.ref}>
                    <div className="DropdownMenu-dropdown" ref=${this.dropdownRef}>
                        <div className="DropdownMenu-wrapper">
                            ${this.renderMenu()}
                        </div>
                    </div>
                </div>
            `;
        }
    }
    return DropdownMenu;
});
