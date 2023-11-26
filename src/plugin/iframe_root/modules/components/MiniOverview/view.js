define([
    'preact',
    'htm',
    'jquery',
    'kb_common/utils',
    'components/UILink',

    'bootstrap',
    'css!./style.css'
], (
    preact,
    htm,
    $,
    Utils,
    UILink
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    function dateFormat(dateString) {
        const monthLookup = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (Utils.isBlank(dateString)) {
            return '';
        }
        const date = Utils.iso8601ToDate(dateString);
        return `${monthLookup[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    class Overview extends Component {
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
                       style=${{color: icon.color}}></i>
                    <i className=${`fa fa-inverse fa-stack-1x ${icon.classNames.join(' ')}`}></i>
                </span>
            `;
        }

        handleCopyButtonClick() {
            this.props.runtime.send('copyWidget', 'toggle');
        }

        renderAccessIcon() {
            const isPublic =  this.props.workspaceInfo.globalread === 'r';
            if (isPublic) {
                return html`
                    <div className="MiniOverview-accessIcon"
                         data-toggle="tooltip"
                         data-placement="bottom"
                         title="This object is in a public narrative; it is accessible to all KBase users and anyone else with the url; visit the Narrative (a link is in the Overview tab below) to see who it is shared with (requires login)">
                        <div className="fa fa-2x fa-globe"/>
                        <div>Public</div>
                    </div>
                `;
            }
            return html`
                <div className="MiniOverview-accessIcon"
                     data-toggle="tooltip"
                     data-placement="bottom"
                     title="This object is in a private Narrative; visit the Narrative (a link is in the Overview tab below) to see who it is shared with.">
                    <div className="fa fa-2x fa-unlock" />
                    <div>Private</div>
                </div>
            `;
        }

        renderJSONViewButton() {
            const roles = this.props.runtime.service('session').getRoles();
            if (roles.indexOf('DevToken') === -1) {
                return;
            }
            return html`
                <a className="btn btn-default"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="View the actual JSON for this object"
                    href=${this.props.runtime.europaURL({hash: `jsonview/${this.props.objectInfo.ref}`}).toString()}
                    target="_parent">
                    JSON View
                </a>
            `;
        }

        renderCopyButton() {
            if (!this.props.runtime.service('session').isAuthenticated()) {
                return;
            }
            return html`
                <button className="btn btn-default"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Opens (and closes) a panel with which you can copy this data object to a Narrative"
                        onClick=${this.handleCopyButtonClick.bind(this)}>
                    Copy
                </button>
            `;
        }

        renderButtons() {
            const copyButton = this.renderCopyButton();
            const jsonViewButton = this.renderJSONViewButton();
            return html`
                <div>
                    ${copyButton}
                ${' '}
                    ${jsonViewButton}
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
                        <div className="MiniOverview-titleCol-title">
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
                        <${UILink}
                            hashPath=${{hash: `people/${this.props.objectInfo.saved_by}`}}
                            newWindow=${true}
                        >
                            ${this.props.objectInfo.saved_by}
                        </>
                    </div>
                    <div className="MiniOverview-accessCol">
                        ${this.renderAccessIcon()}
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
