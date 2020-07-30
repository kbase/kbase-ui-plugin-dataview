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

    class Panel extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            const headingId = `heading-${new Uuid(4).format()}`;
            const collapseId = `collapse-${new Uuid(4).format()}`;
            const initialCollapseClass = (() => {
                if (this.props.collapsed === true || 
                    typeof this.props.collaped === 'undefined') {
                    return 'collapsed'
                }
            })();
            return html`
                <div className="panel panel-default">
                    <div className="panel-heading"
                            id=${headingId}
                            role="tab">
                        <h4 className="panel-title">
                            <span data-toggle="collapse"
                                    data-parent=${`#${this.props.parentId}`}
                                    data-target=${`#${collapseId}`}
                                    aria-expanded="false"
                                    aria-controls=${collapseId}
                                    className=${initialCollapseClass}
                                    style=${{cursor: 'pointer'}}>
                                ${this.props.title}
                            </span>
                        </h4>
                    </div>
                    <div className=${`panel-collapse collapse ${this.state.collapsed ? 'in' : ''}`}
                            id=${collapseId}
                            role="tabpanel"
                            aria-labeledby='provHeading'>
                        <div className="panel-body">
                            ${this.props.children}
                        </div>
                    </div>
                </div>
            `;
        }
    }
    return Panel;
});
