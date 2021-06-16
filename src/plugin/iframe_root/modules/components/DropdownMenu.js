define([
    'preact',
    'htm',
    './DropdownMenu.styles'
], (
    preact,
    htm,
    styles
) => {
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
                    return [html`
                        <${DropdownMenu} menu=${item.menu}/>`, '-open'];
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
                <div className=${menuClass}
                     style=${styles.item}
                     onMouseEnter=${this.hoverItemOn.bind(this)}
                     onMouseLeave=${this.hoverItemOff.bind(this)}
                     onClick=${this.toggleSubMenu.bind(this)}>
                    <div style=${styles.itemLabel}>
                        ${item.title}
                    </div>
                    <div className=${menuIconClass}
                         style=${styles.itemSubmenuIcon}
                    />
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
                                <div style=${styles.item}
                                     onMouseEnter=${this.hoverItemOn.bind(this)}
                                     onMouseLeave=${this.hoverItemOff.bind(this)}
                                     onClick=${(event) => {
                                         this.doAction(event, item.action);
                                     }}>
                                    <div style=${styles.itemLabel}>${item.title}</div>
                                </div>
                            `;
                        }
                        return html`
                            <div style=${item} onClick=${this.props.onActionCompleted}>
                                <div style=${styles.itemLabel}>${item.title}</div>
                            </div>
                        `;
                    });
                    return [html`
                        <div style=${styles.dataMenu}>${items}</div>`, '-open'];
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
                <div className=${menuClass}
                     style=${styles.item}
                     onMouseEnter=${this.hoverItemOn.bind(this)}
                     onMouseLeave=${this.hoverItemOff.bind(this)}
                     onClick=${this.toggleSubMenu.bind(this)}>
                    <div style=${styles.itemLabel}>
                        ${item.title}
                    </div>
                    <div className=${menuIconClass} style=${styles.itemSubmenuIcon}/>
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
                    <div style=${styles.item}
                         onClick=${(event) => {
                             this.doAction(event, item.action);
                         }}
                         onMouseEnter=${this.hoverItemOn.bind(this)}
                         onMouseLeave=${this.hoverItemOff.bind(this)}>
                        <div style=${styles.itemLabel}>${item.title}</div>
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
                <div style=${styles.item} onMouseEnter=${this.hoverItemOn.bind(this)}
                     onMouseLeave=${this.hoverItemOff.bind(this)}>
                    <div style=${styles.itemLabel}>${item.title}</div>
                </div>
            `;
        }

        hoverItemOn(event) {
            Object.entries(styles.itemHover).forEach(([name, value]) => {
                event.target.style.setProperty(name, value);
            });
        }

        hoverItemOff(event) {
            Object.entries(styles.itemHover).forEach(([name, value]) => {
                event.target.style.removeProperty(name);
            });
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
                return html`
                    <${MenuItem} item=${item} onActionCompleted=${this.doActionCompleted.bind(this)}/>`;
            });
        }

        render() {
            return html`
                <div style=${styles.main} ref=${this.ref}>
                    <div style=${styles.dropdown} ref=${this.dropdownRef}>
                        <div style=${styles.wrapper}>
                            ${this.renderMenu()}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    return DropdownMenu;
});
