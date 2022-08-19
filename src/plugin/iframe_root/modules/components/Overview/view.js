define([
    'preact',
    'htm',
    'jquery',
    'uuid',
    '../Row',
    '../Col',
    '../CollapsiblePanel',
    'kb_common/utils',
    '../Panel',

    'bootstrap',
    'css!./style.css'
], (
    preact,
    htm,
    $,
    Uuid,
    Row,
    Col,
    CollapsiblePanel,
    Utils,
    Panel
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
                <div>
                <span className="fa-stack fa-2x">
                    <i className="fa fa-circle fa-stack-2x"
                       style=${{color: icon.color}}></i>
                    <i className=${`fa fa-inverse fa-stack-1x ${icon.classes.join(' ')}`}></i>
                </span>
                </div>
            `;
        }

        // These "rows" are in either the summary table or the
        // Object Info panel.
        renderNarrativeRow() {
            if (!this.props.workspaceInfo.metadata['narrative_nice_name']) {
                return;
            }
            return html`
                <tr>
                    <th>In Narrative</th>
                    <td>
                        <a href="${`/narrative/${this.props.workspaceInfo.id}`}" target="_blank">
                            ${this.props.workspaceInfo.metadata.narrative_nice_name}
                        </a>
                    </td>
                </tr>
            `;
        }

        renderPermalinkRow() {
            const {protocol, host} = window.location;
            let permalink = `${protocol}//${host}/#dataview/${this.props.objectInfo.ref}`;
            if (this.props.sub && this.props.sub.subid) {
                permalink += `?${this.props.sub.sub}&${this.props.sub.subid}`;
            }
            return html`
                <tr>
                    <th>Permalink</th>
                    <td>
                        <a href="${permalink}" target="_parent">
                            ${permalink}
                        </a>
                    </td>
                </tr>
            `;
        }

        renderVersionRow() {
            return html`
                <tr>
                    <th>Object Version</th>
                    <td>${this.props.objectInfo.version || 'Latest'}</td>
                </tr>
            `;
        }

        renderTypeRow() {
            return html`
                <tr>
                    <th>Type</th>
                    <td>${(this.props.sub && this.props.sub.sub) ? `${this.props.sub.sub} in ` : ''}
                        <a href="${`/#spec/type/${this.props.objectInfo.type}`}" target="_blank">
                            ${this.props.objectInfo.typeName}
                        </a>
                    </td>
                </tr>
            `;
        }

        renderTypeModuleRow() {
            return html`
                <tr>
                    <th>Type Module</th>
                    <td>${(this.props.sub && this.props.sub.sub) ? `${this.props.sub.sub} in ` : ''}
                        <a href="${`/#spec/module/${this.props.objectInfo.typeModule}`}" target="_blank">
                            ${this.props.objectInfo.typeModule}
                        </a>
                    </td>
                </tr>
            `;
        }

        renderTypeVersionRow() {
            return html`
                <tr>
                    <th>Type Version</th>
                    <td>
                        ${this.props.objectInfo.typeMajorVersion}.${this.props.objectInfo.typeMinorVersion}
                    </td>
                </tr>
            `;
        }

        renderLastUpdatedRow() {
            return html`
                <tr>
                    <th>Last Updated</th>
                    <td>${dateFormat(this.props.objectInfo.save_date)} by ${' '}
                        <a href="${`/#people/${this.props.objectInfo.saved_by}`}" target="_blank">
                            ${this.props.objectInfo.saved_by}
                        </a>
                    </td>
                </tr>
            `;
        }

        renderSummary() {
            return html`
                <table className="table">
                    <tbody>
                        ${this.renderTypeRow()}
                        ${this.renderNarrativeRow()}
                        ${this.renderLastUpdatedRow()}
                        ${this.renderPermalinkRow()}
                    </tbody>
                </table>
            `;
        }

        renderHeader() {
            return html`
                <div className="Overview-header">
                    <div>
                        ${this.renderDataIcon()}
                    </div>
                    <h3 className="Overview-header-title">
                        ${(this.props.sub && this.props.sub.id) ? this.props.sub.subid : this.props.objectInfo.name}
                    </h3>
                </div>
            `;
        }

        renderObjectInfo(parentId) {
            const body = html`
                <table className="table">
                    <tbody>
                    ${this.renderVersionRow()}
                    ${this.renderTypeModuleRow()}
                    ${this.renderTypeRow()}
                    ${this.renderTypeVersionRow()}
                    ${this.renderNarrativeRow()}
                    ${this.renderLastUpdatedRow()}
                    ${this.renderPermalinkRow()}
                    </tbody>
                </table>
            `;
            return html`
                <${Panel} title="Object Info"
                          parentId=${parentId}>
                    ${body}
                <//>
            `;
        }

        renderMetadataPanel(parentId) {
            const body = (() => {
                const entries = Object.entries(this.props.objectInfo.metadata);
                if (entries.length === 0) {
                    return html`
                        <p>no metadata for this object</p>
                    `;
                }
                const tableBody = entries.map(([key, value]) => {
                    return html`
                        <tr>
                            <th>${key}</th>
                            <td>${value}</td>
                        </tr>
                    `;
                });
                return html`
                    <table className="table Overview-metadata-table">
                        <tbody>
                        ${tableBody}
                        </tbody>
                    </table>
                `;
            })();

            return html`
                <${Panel} title="Metadata"
                          parentId=${parentId}>
                    ${body}
                <//>
            `;
        }

        renderVersionsPanel(parentId) {
            const body = (() => {
                if (this.props.versions.length === 0) {
                    return html`
                        <p>no versions</p>
                    `;
                }
                const tableBody = this.props.versions.map((version) => {
                    return html`
                        <tr>
                            <td>
                                <a href=${`/#dataview/${version.wsid}/${version.id}/${version.version}`}
                                   target="_parent">
                                        ${`v${version.version}`}
                                </a>
                            </td>
                            <td>
                                Saved on ${dateFormat(version.save_date)} by${' '}
                                <a href="/#people/${version.saved_by}" target="_parent">${version.saved_by}</a>
                            </td>
                        </tr>
                    `;
                });
                return html`
                    <table className="table Overview-metadata-table">
                        <tbody>
                        ${tableBody}
                        </tbody>
                    </table>
                `;
            })();

            return html`
                <${Panel} title="Versions"
                          parentId=${parentId}>
                    ${body}
                <//>
            `;
        }

        renderReferencedByPanel(parentId) {
            const body = (() => {
                if (this.props.too_many_inc_refs) {
                    return html`
                        <span>Sorry, there are too many references to this data object to display.</span>
                    `;
                }

                if (!this.props.inc_references || this.props.inc_references.length === 0) {
                    return html`
                        <p>
                            No other data references this data object.
                        </p>
                    `;
                }

                const tableBody = this.props.inc_references.map((ref) => {
                    return html`
                        <tr>
                            <td>
                                <a href=${`/#dataview/${ref.wsid}/${ref.id}/${ref.version}`}
                                   target="_parent">${ref.name}</a>
                            </td>
                            <td>
                                <a href=${`/#spec/type/${ref.type}`} target="_parent">${ref.typeName}</a>
                            </td>
                            <td>
                                ${dateFormat(ref.save_date)}
                            </td>
                            <td>
                                <a href=${`/#people/${ref.saved_by}`} target="_parent">${ref.saved_by}</a>
                            </td>
                        </tr>
                    `;
                });

                return html`
                    <table className="table kb-overview-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Saved</th>
                            <th>By
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        ${tableBody}
                        </tbody>
                    </table>
                `;
            })();

            return html`
                <${Panel} title="Referenced by"
                          parentId=${parentId}>
                    ${body}
                <//>
            `;
        }

        renderReferencesPanel(parentId) {
            const body = (() => {
                if (this.props.too_many_out_refs) {
                    return html`
                        <span>Sorry, there are too many references from this data object to display.</span>
                    `;
                }

                if (!this.props.inc_references || this.props.out_references.length === 0) {
                    return html`
                        <p>
                           This object does not reference any other data object.
                        </p>
                    `;
                }

                const tableBody = this.props.out_references.map(({ref, info}) => {
                    if (info) {
                        return html`
                            <tr>
                                <td>
                                    <a href=${`/#dataview/${ref}`}
                                    target="_blank">${info.name}</a>
                                </td>
                                <td>
                                    <a href=${`/#spec/type/${info.type}`} target="_blank">${info.typeName}</a>
                                </td>
                                <td>
                                    ${dateFormat(info.save_date)}
                                </td>
                                <td>
                                    <a href=${`/#people/${info.saved_by}`} target="_blank">${info.saved_by}</a>
                                </td>
                            </tr>
                        `;
                    }
                    return html`
                        <tr>
                            <td>
                                <a href=${`/#dataview/${ref}`}
                                target="_blank">${ref}</a>
                            </td>
                            <td colspan="3">
                                Object inaccessible
                            </td>
                        </tr>
                    `;
                });

                return html`
                    <table className="table kb-overview-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Saved</th>
                            <th>By</td>
                        </tr>
                        </thead>
                        <tbody>
                        ${tableBody}
                        </tbody>
                    </table>
                `;
            })();

            return html`
                <${Panel} title="References"
                          parentId=${parentId}>
                    ${body}
                <//>
            `;
        }

        handleCopyButtonClick() {
            this.props.runtime.send('copyWidget', 'toggle');
        }

        render() {
            const id = `panel-${new Uuid(4).format()}`;
            return html`
                <div className="container-fluid" style=${{width: '100%'}}>
                    <div className="row">
                        <div className="col-sm-6">
                            <h4>Summary</h4>
                            ${this.renderSummary()}
                        </div>
                        <div className="col-sm-6">
                            <div className="panel-group"
                                id=${id}
                                role="tablist"
                                aria-multiselectable="true">
                                ${this.renderObjectInfo(id)}
                                ${this.renderMetadataPanel(id)}
                                ${this.renderVersionsPanel(id)}
                                ${this.renderReferencedByPanel(id)}
                                ${this.renderReferencesPanel(id)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    return Overview;
});
