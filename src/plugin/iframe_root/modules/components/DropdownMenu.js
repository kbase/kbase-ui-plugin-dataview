define([
    'preact',
    'htm',
    './DropdownMenu.styles'
], (
    preact,
    htm,
    styles
) => {
    const {Component, createRef} = preact;
    const html = htm.bind(preact.h);

    class MenuItem extends Component {
        constructor(props) {
            super(props);
            this.state = {
                isOpen: false,
                isHovered: false
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
            let style = styles.item;
            if (this.state.isHovered) {
                style = {...style, ...styles.itemHover};
            }
            return html`
                <div className=${menuClass}
                     style=${style}
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
                    const style = styles.item;
                    // if (this.state.isHovered) {
                    //     style = {...style, ...styles.itemHover};
                    // }
                    const dataMenuPositionStyle = this.props.position === 'right' ? styles.dataMenuPositionRight : styles.dataMenuPositionLeft;
                    const items = item.dataMenu.items.map((item) => {
                        if (item.action) {
                            return html`
                                <div style=${style}
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
                        <div style=${Object.assign({}, styles.dataMenu, dataMenuPositionStyle)}>${items}</div>`, '-open'];
                }
                return [null, ''];
            })();
            const menuIconClass = (() => {
                if (this.state.isOpen) {
                    return 'fa fa-chevron-down';
                }
                return 'fa fa-chevron-right';
            })();

            let itemStyle = styles.item;
            if (this.state.isHovered) {
                itemStyle = {...itemStyle, ...styles.itemHover};
            }

            return html`
                <div className=${menuClass}
                     style=${itemStyle}
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
            let style = styles.item;
            if (this.state.isHovered) {
                style = {...style, ...styles.itemHover};
            }
            if (item.action) {
                return html`
                    <div style=${style}
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
                <div style=${style} onMouseEnter=${this.hoverItemOn.bind(this)}
                     onMouseLeave=${this.hoverItemOff.bind(this)}>
                    <div style=${styles.itemLabel}>${item.title}</div>
                </div>
            `;
        }

        hoverItemOn() {
            this.setState({
                isHovered: true
            });
        }

        hoverItemOff() {
            this.setState({
                isHovered: false
            });
        }
    }

    class DropdownMenu extends Component {
        constructor(props) {
            super(props);
            this.ref = createRef();
            this.dropdownRef = createRef();
            this.state = {
                open: false,
                position: 'left'
            };
        }

        componentDidMount() {
            if (this.state.position === 'left' && this.isHidden()) {
                this.setState({
                    position: 'right'
                });
            }
        }

        isHidden() {
            const bounds = this.dropdownRef.current.getBoundingClientRect();
            const coverBounds = document.elementFromPoint(bounds.x, bounds.y).getBoundingClientRect();
            const dropdownRight = bounds.x + bounds.width;
            const coverRight = coverBounds.x + coverBounds.width;
            return dropdownRight > coverRight;
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

        renderMenuItems() {
            return this.props.menu.items.map((item) => {
                return html`
                    <${MenuItem} item=${item} position=${this.state.position} onActionCompleted=${this.doActionCompleted.bind(this)}/>`;
            });
        }

        renderMenuTitle() {
            if (!this.props.title) {
                return;
            }

            return html`
                <div style=${styles.title}>${this.props.title}</div>
            `;
        }

        renderMenu() {
            return html`
                ${this.renderMenuTitle()}
                ${this.renderMenuItems()}
            `;
        }

        render() {
            const side = this.state.position === 'left' ? styles.positionLeft : styles.positionRight;
            return html`
                <div style=${styles.main} ref=${this.ref} data-testid="DropdownMenu">
                    <div style=${Object.assign({}, styles.dropdown, side)} ref=${this.dropdownRef}>
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
