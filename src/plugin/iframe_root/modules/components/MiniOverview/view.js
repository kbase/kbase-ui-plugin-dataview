define([
    'preact',
    'htm',
    'jquery',
    'uuid',
    '../Row',
    '../Col',
    '../CollapsiblePanel',
    'kb_common/utils',

    'bootstrap',
    'css!./style.css'
], function (
    preact,
    htm,
    $,
    Uuid,
    Row,
    Col,
    CollapsiblePanel,
    Utils
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    function dateFormat(dateString) {
        var monthLookup = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (Utils.isBlank(dateString)) {
            return '';
        }
        var date = Utils.iso8601ToDate(dateString);
        return monthLookup[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    }

    class Overview extends Component {
        constructor(props) {
            super(props);
        }

        componentDidMount() {
            $(document).ready(() => {
                $('[data-toggle="tooltip"]').tooltip({
                    delay: {
                        show: 500,
                        hide: 100
                    }
                });
            });
        }

        renderDataIcon() {
            const typeId = this.props.objectInfo.type;
            const type = this.props.runtime.service('type').parseTypeId(typeId);
            const icon = this.props.runtime.service('type').getIcon({type});

            return html`
                <span className="fa-stack fa-2x">
                    <i className="fa fa-circle fa-stack-2x"
                       style=${{color: icon.color}} ></i>
                    <i className=${`fa fa-inverse fa-stack-1x ${icon.classes.join(' ')}`}></i>
                </span>
            `;
        }

        handleCopyButtonClick() {
            this.props.runtime.send('copyWidget', 'toggle');
        }

        renderButtons() {
            return html`
                <div>
                    <button className="btn btn-default"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Opens (and closes) a panel with which you can copy this data object to a Narrative",
                            onClick=${this.handleCopyButtonClick.bind(this)}>
                        Copy
                    </button>
                    ${' '}
                    <a className="btn btn-default"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="View the actual JSON for this object"
                            href=${`/#jsonview/${this.props.objectInfo.ref}`}
                            target="_parent">
                        JSON View
                    </a>
            </div>
            `;
        }

        render() {
            return html`
            <div className="MiniOverview">
                <div className="MiniOverview-titleCol">
                    <div className="MiniOverview-titleCol-icon">
                        ${this.renderDataIcon()}
                    </div>
                    <div  className="MiniOverview-titleCol-title">
                        <div className="MiniOverview-titleCol-title-title">
                            ${(this.props.sub && this.props.sub.id) ? this.props.sub.subid : this.props.objectInfo.name}
                        </div>
                        <div className="MiniOverview-titleCol-title-type">
                            ${this.props.objectInfo.type}
                        </div>
                    </div>
                    
                </div>
                <div className="MiniOverview-savedCol">
                    Saved ${dateFormat(this.props.objectInfo.save_date)} by ${' '}
                    <a href="${`/#people/${this.props.objectInfo.saved_by}`}" target="_blank">
                        ${this.props.objectInfo.saved_by}
                    </a>
                </div>
                <div className="MiniOverview-buttonsCol">
                    ${this.renderButtons()}
                </div>
            </div>
            `;
        }
    }
    return Overview;
});
