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
    'use strict';

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
            // console.log('tab?', this.state.selectedTab);
            if (this.state.selectedTab.render) {
                return this.state.selectedTab.render();
            }
            if (this.state.selectedTab.renderText) {
                const text = this.state.selectedTab.renderText();
                return html`
                    <div  className="Tabs-pane-default-content" dangerouslySetInnerHTML=${{__html: text}}></div>
                `;
            }
            if (this.state.selectedTab.text) {
                const text = this.state.selectedTab.text;
                return html`
                    <div className="Tabs-pane-default-content" dangerouslySetInnerHTML=${{__html: text}}></div>
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
            const tabs = this.state.tabs.map((tab) => {
                const classes = [
                    'Tabs-tab'
                ];
                const isSelected = (this.state.selectedTab && this.state.selectedTab.id === tab.id);

                if (isSelected) {
                    classes.push('Tabs-active');
                }

                return html`
                    <div role="presentation" 
                         className=${classes.join(' ')} 
                         onClick=${() => {this.selectTab(tab);}}>
                        <span>${tab.title}</span>
                    </div>
                `;
            });
            return html`
                <div className="Tabs">
                    <div className="Tabs-tabs">
                        ${tabs}
                    </div>
                    <div className="Tabs-pane">
                        ${this.renderTabPane()}
                    </div>
                </div>
            `;
        }

        render() {
            return this.renderTabs();
        }


    }

    return Tabs;
});