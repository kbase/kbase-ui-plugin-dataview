define([
    'preact',
    'htm',

    // for effect
    'css!./Tabs.css',
    'bootstrap'
], function (
    preact,
    htm
) {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Tabs extends Component {
        constructor(props) {
            super(props);

            const selectedTab = (() => {
                if (this.props.initialTab) {
                    const initialTab = this.props.tabs.filter((tab) => {
                        return tab.id === initialTab;
                    })[0];
                    if (initialTab) {
                        return initialTab;
                    }
                }
                return this.props.tabs[0];
            })();

            this.state = {
                tabs: props.tabs || [],
                selectedTab
            };
        }

        addTab(tab) {
            this.setState({
                tabs: [...this.state.tabs, tab]
            });
        }

        renderTabPane() {
            if (!this.state.selectedTab) {
                return;
            }

            if (this.state.selectedTab.render) {
                return this.state.selectedTab.render();
            }
            if (this.state.selectedTab.renderText) {
                const text = this.state.selectedTab.renderText();
                return html`
                    <div
                            className="Tabs-pane-default-content"
                            dangerouslySetInnerHTML=${{__html: text}}></div>
                `;
            }
            if (this.state.selectedTab.text) {
                const text = this.state.selectedTab.text;
                return html`
                    <div
                            className="Tabs-pane-default-content"
                            dangerouslySetInnerHTML=${{__html: text}}></div>
                `;
            }
            return html`
                <div className="alert alert-danger">
                    Tab does not have a render method!
                </div>
            `;
        }

        selectTab(selectedTab) {
            this.setState({
                selectedTab
            });
        }

        renderTabs() {
            return this.state.tabs.map((tab) => {
                const classes = [
                    'Tabs-tab'
                ];
                const isSelected = (this.state.selectedTab && this.state.selectedTab.id === tab.id);

                if (isSelected) {
                    classes.push('Tabs-active');
                }

                return html`
                    <div className=${classes.join(' ')}
                         data-k-b-testhook-tab=${tab.id}
                         role="tab"
                         onClick=${() => {
                             this.selectTab(tab);
                         }}>
                        <span>${tab.title}</span>
                    </div>
                `;
            });
        }

        renderExtra() {
            if (!this.props.extra) {
                return;
            }

            return html`
                <div className="Tabs-extra">
                    ${this.props.extra}
                </div>
            `;
        }

        render() {
            return html`
                <div className="Tabs">
                    <div className="Tabs-tabs">
                        <div className="Tabs-tab-container">
                            ${this.renderTabs()}
                        </div>
                        ${this.renderExtra()}
                    </div>
                    <div className="Tabs-pane"
                         data-k-b-testhook-tabpane=${this.state.selectedTab.id}
                         role="tabpane"
                         style=${this.props.paneStyle || {}}>
                        ${this.renderTabPane()}
                    </div>
                </div>
            `;
        }
    }

    return Tabs;
});
