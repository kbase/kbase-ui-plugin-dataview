define([
    'preact',
    'htm',
    'uuid',

    'bootstrap'
], function (
    preact,
    htm,
    Uuid
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    class CollapsiblePanel extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            const panelId = new Uuid(4).format();
            const headingId = new Uuid(4).format();
            const collapseId = new Uuid(4).format();
            let icon;
            if (this.props.icon) {
                let rotateClass;
                if (this.props.rotate) {
                    rotateClass = 'fa-rotate-90';
                } else {
                    rotateClass = '';
                }
                icon = html`
                    <span className=${`fa fa-${icon} ${rotateClass}`},
                          style=${{margin: '0 10px'}}></span>
                `;
            } else {
                icon = html`
                    <span style=${{marginLeft: '10px'}}></span>
                `;
            }
            return html`
                <div className="panel-group"
                    id=${panelId}
                    role="tablist"
                    ariaMultiselectable="true">
                    <div className="panel panel-default">
                        <div className="panel-heading"
                             id=${headingId}
                             role="tab">
                            <h4 className="panel-title">
                                <span data-toggle="collapse"
                                      data-parent=${`#${panelId}`}
                                      data-target=${`#${collapseId}`}
                                      area-expanded="false"
                                      aria-controls=${collapseId}
                                      className=${this.state.collapsed ? 'collapsed' : ''}
                                      style=${{cursor: 'pointer'}}>
                                    ${icon}
                                    ${this.props.title}
                                </span>
                            </h4>
                        </div>
                        <div className=${`panel-collapse collapse ${!this.state.collapsed ? 'in' : ''}`}
                             id=${collapseId}
                             role="tabpanel"
                             ariaLabeledby='provHeading'>
                            <div className="panel-body">
                                ${this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    return CollapsiblePanel;
});
