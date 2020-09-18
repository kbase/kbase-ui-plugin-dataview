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
            this.state = {
                open: false
            };
            this.isOpen = false;
            this.currentDropdown = null;

            this.handleAnyClick = () => {
                console.log('click');
                this.removeDropdown();
            };
        }

        componentDidMount() {
            this.spreadsheet = document.querySelector('.Spreadsheet');
        }

        componentWillUnmount() {
            this.removeDropdown();
        }

        removeDropdown() {
            if (this.currentDropdown) {
                this.spreadsheet.removeChild(this.currentDropdown);
                this.currentDropdown = null;
                document.body.removeEventListener('click', this.handleAnyClick);
            }
        }

        // handleAnyClick() {
        //     console.log('click');
        //     this.removeDropdown();
        // }

        toggleMenu() {
            if (this.currentDropdown) {
                this.removeDropdown();
                return;
            }
            const top = this.ref.current.offsetTop + this.ref.current.offsetHeight;
            const left = this.ref.current.offsetLeft;
            // console.log('hmm', top, left);
            // const style = {
            //     top, left
            // };
            // const dropdownClass = (() => {
            //     if (this.state.open) {
            //         return '-open';
            //     }
            //     return '';
            // })();
            const dropdown = html`
            <div className="DropdownMenu-dropdown">
                ${this.renderMenu()}
            </div>
            `;

            this.currentDropdown = this.spreadsheet.appendChild(document.createElement('div'));
            this.currentDropdown.style.position = 'absolute';
            this.currentDropdown.style.top = `${top}px`;
            this.currentDropdown.style.left = `${left}px`;
            console.log('hmm', top, left);
            preact.render(dropdown, this.currentDropdown);
            document.body.addEventListener('click', this.handleAnyClick);
        }

        // toggleMenux() {
        //     if (!this.ref.current) {
        //         return;
        //     }
        //     this.setState({
        //         open: !this.state.open
        //     });

        // }

        // renderDropdown() {
        //     if (!this.state.open) {
        //         return;
        //     }

        //     if (this.ref.current === null) {
        //         return;
        //     }

        //     const top = this.ref.current.offsetTop;
        //     const left = this.ref.current.offsetLeft;
        //     const style = {
        //         top, left
        //     };
        //     // const dropdownClass = (() => {
        //     //     if (this.state.open) {
        //     //         return '-open';
        //     //     }
        //     //     return '';
        //     // })();
        //     const dropdown = html`
        //     <div className="DropdownMenu-dropdown" style=${style}>
        //         ${this.renderMenu()}
        //     </div>
        //     `;
        //     this.currentDropdown = document.body.appendChild(document.createElement('div'));
        //     hmm.style.position = 'relative';
        //     preact.render(dropdown, hmm);
        // }

        renderMenu() {
            return this.props.menu.map((item) => {
                return html`
                    <div className="DropdownMenu-item" onClick=${item.action}>
                        ${item.title}
                        <div className="DropdownMenu-placeholder"></div>
                    </div>
                `;
            });
        }

        render() {
            // const style={};
            const menuStateClass = '';
            const menuIconClass = 'fa-chevron-circle-down';
            // this.renderDropdown();
            return html`
                <div className=${`DropdownMenu ${menuStateClass}`} onClick=${(e) => {e.stopPropagation(); this.toggleMenu();}} ref=${this.ref}>
                    <span className=${`DropdownMenu-icon fa ${menuIconClass}`}></span>
                </div>
            `;
        }
    }
    return DropdownMenu;
});
