define([
    'preact',
    'htm',
    'jquery',
    'uuid',
    'kb_common/utils',
    'components/DataTable7',
    '../Panel',
    './view.styles',

    'bootstrap',
    'css!./style.css'
], (
    preact,
    htm,
    $,
    Uuid,
    Utils,
    DataTable,
    Panel,
    styles
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

    function dateFormatShort(dateString) {
        if (Utils.isBlank(dateString)) {
            return '';
        }
        const date = Utils.iso8601ToDate(dateString);
        const monthPart = Intl.NumberFormat('en-US', {minimumIntegerDigits: 2}).format(date.getMonth() + 1);
        const dayPart = Intl.NumberFormat('en-US', {minimumIntegerDigits: 2}).format(date.getDate())
        return `${date.getFullYear()}/${monthPart}/${dayPart}`;
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
                    <td>${dateFormatShort(this.props.objectInfo.save_date)} by ${' '}
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
                                Saved on ${dateFormatShort(version.save_date)} by${' '}
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

        renderReferencedByTable(references) {
            const columns = [{
                id: 'name',
                label: 'Name',
                style: {
                    flex: '3 1 0'
                },
                render: (name, ref) => {
                    return html`
                        <a href=${`/#dataview/${ref.wsid}/${ref.id}/${ref.version}`}
                            title=${name}
                            target="_parent">${ref.name}</a>
                    `;
                    return name;
                }
            }, {
                id: 'type',
                label: 'Type',
                style: {
                    flex: '1 0 0'
                },
                render: (type, ref) => {
                    return html`
                    <a href=${`/#spec/type/${ref.type}`} 
                        title=${type}
                        target="_parent">${ref.typeName}</a>
                    `;
                }
            },{
                id: 'save_date',
                label: 'Saved',
                style: {
                    flex: '0 0 8em'
                },
                render: (savedDate) => {
                    return dateFormatShort(savedDate);
                }
            },{
                id: 'saved_by',
                label: 'By',
                style: {
                    flex: '1 0 0'
                },
                render: (savedBy, ref) => {
                    return html`
                        <a href=${`/#people/${ref.saved_by}`} target="_parent">${ref.saved_by}</a>
                    `;
                }
            }];

             const props = {
                columns,
                dataSource: references,
            };

            return html`
                <${DataTable} heights=${{row: 40, col: 40}} flex=${true} bordered=${false} ...${props} />
            `;
        }

        renderReferencedByPanel(parentId) {
            const body = (() => {
                // if (this.props.too_many_inc_refs) {
                //     return html`
                //         <span>Sorry, there are too many references (${this.props.inc_references_count}) to this data object to display.</span>
                //     `;
                // }

                if (!this.props.inc_references || this.props.inc_references.length === 0) {
                    return html`
                        <p>
                            No other data references this data object.
                        </p>
                    `;
                }

                return html`
                    <div style=${{height: '20em', display: 'flex', flexDirection: 'column'}}>
                    ${this.renderReferencedByTable(this.props.inc_references)}
                    </div>
                `;

                // const tableBody = this.props.inc_references.map((ref) => {
                //     return html`
                //         <tr>
                //             <td>
                //                 <a href=${`/#dataview/${ref.wsid}/${ref.id}/${ref.version}`}
                //                    target="_parent">${ref.name}</a>
                //             </td>
                //             <td>
                //                 <a href=${`/#spec/type/${ref.type}`} target="_parent">${ref.typeName}</a>
                //             </td>
                //             <td>
                //                 ${dateFormat(ref.save_date)}
                //             </td>
                //             <td>
                //                 <a href=${`/#people/${ref.saved_by}`} target="_parent">${ref.saved_by}</a>
                //             </td>
                //         </tr>
                //     `;
                // });

                // return html`
                //     <table className="table kb-overview-table">
                //         <thead>
                //         <tr>
                //             <th>Name</th>
                //             <th>Type</th>
                //             <th>Saved</th>
                //             <th>By
                //             </td>
                //         </tr>
                //         </thead>
                //         <tbody>
                //         ${tableBody}
                //         </tbody>
                //     </table>
                // `;
            })();

            return html`
                <${Panel} title="Referenced by"
                          parentId=${parentId}>
                    ${body}
                <//>
            `;
        }

        renderRelation(relation) {
            switch (relation) {
                case 'references':
                    return html`
                        <span title="The viewed object references (is linked to) this object" style=${styles.relation}>
                        ref
                        </span>
                    `;
                case 'used':
                    return html`
                        <span title="This viewed object was created by an app which used this object as a parameter" style=${styles.relation}>
                        used
                        </span>
                    `;
                case 'copiedFrom':
                    return html`
                        <span title="The viewed object was created by coping this object" style=${styles.relation}>
                            copy
                        </span>
                    `;
                default: 
                    console.warn('unknown relation', relation);
            }

            // switch (relation) {
            //     case 'references':
            //         return html`<span className="fa fa-link" title="This object references the viewed object"/>`;
            //     case 'used':
            //         return html`<span className="fa fa-arrow-left" title="This object is used as input to create the viewed object"/>`;
            //     case 'copiedFrom':
            //         return html`<span className="fa fa-clone" title="This object was copied to the viewed object"/>`;
        }

         renderReferencesTable(references) {
            const columns = [{
                id: 'name',
                label: 'Name',
                style: {
                    flex: '3 1 0'
                },
                render: (_, {ref, info}) => {
                    if (info === null) {
                        return html`
                            <a href=${`/#dataview/${ref}`}
                                title=${ref}
                                target="_parent">${ref}</a>
                        `;
                    }
                    return html`
                        <a href=${`/#dataview/${info.wsid}/${info.id}/${info.version}`}
                            title=${info.name}
                            target="_parent">${info.name}</a>
                    `;
                }
            }, {
                id: 'type',
                label: 'Type',
                style: {
                    flex: '1 0 0'
                },
                render: (_, {info}) => {
                    if (info === null) {
                        return html`<i>inaccessible</i>`;
                    }
                    return html`
                    <a href=${`/#spec/type/${info.type}`} 
                        title=${info.type}
                        target="_parent">${info.typeName}</a>
                    `;
                }
            },{
                id: 'save_date',
                label: 'Saved',
                style: {
                    flex: '0 0 8em'
                },
                render: (_, {info}) => {
                    if (info === null) {
                       return html`<i>inaccessible</i>`;
                    }
                    return dateFormatShort(info.save_date);
                }
            },{
                id: 'saved_by',
                label: 'By',
                style: {
                    flex: '1 0 0'
                },
                render: (_, {info}) => {
                    if (info === null) {
                       return html`<i>inaccessible</i>`;
                    }
                    return html`
                        <a href=${`/#people/${info.saved_by}`} target="_parent">${info.saved_by}</a>
                    `;
                }
            }];

             const props = {
                columns,
                dataSource: references,
            };

            return html`
                <${DataTable} heights=${{row: 40, col: 40}} flex=${true} bordered=${false} ...${props} />
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

                 return html`
                    <div style=${{height: '20em', display: 'flex', flexDirection: 'column'}}>
                    ${this.renderReferencesTable(this.props.out_references)}
                    </div>
                `; 

                // const tableBody = this.props.out_references.map(({ref, relation, info}) => {
                //     if (info) {
                //         return html`
                //             <tr>
                //                 <td>
                //                     <a href=${`/#dataview/${ref}`}
                //                     target="_blank">${info.name}</a>
                //                 </td>
                //                 <td>
                //                     <a href=${`/#spec/type/${info.type}`} target="_blank">${info.typeName}</a>
                //                 </td>
                //                 <td>
                //                     ${dateFormatShort(info.save_date)}
                //                 </td>
                //                 <td>
                //                     <a href=${`/#people/${info.saved_by}`} target="_blank">${info.saved_by}</a>
                //                 </td>
                //             </tr>
                //         `;
                //     }

                //     // This case probably never occurs?
                //     if (ref) {
                //         return html`
                //             <tr>
                //                 <td>
                //                     <a href=${`/#dataview/${ref}`}
                //                     target="_blank">${ref}</a>
                //                 </td>
                //                 <td>Unknown</td>
                //                 <td colspan="2">
                //                     Object inaccessible
                //                 </td>
                //             </tr>
                //         `;
                //     }
                //     return html`
                //         <tr>
                //             <td>
                //                <i>Unknown</i>
                //             </td>
                //             <td>
                //                 <a href=${`/#spec/type/${this.props.objectInfo.typeName}`} target="_blank">${this.props.objectInfo.typeName}</a>
                //             </td>
                //             <td>
                //                 <i>Unknown</i>
                //             </td>
                //             <td>
                //                <i>Unknown</i>
                //             </td>
                //         </tr>
                //     `;
                // });

                // return html`
                //     <table className="table kb-references-table" >
                //         <thead>
                //         <tr>
                //             <th>Name</th>
                //             <th>Type</th>
                //             <th>Saved</th>
                //             <th>By</td>
                //         </tr>
                //         </thead>
                //         <tbody>
                //         ${tableBody}
                //         </tbody>
                //     </table>
                // `;
            })();

            return html`
                <${Panel} title="References"
                          parentId=${parentId}>
                    ${body}
                <//>
            `;
        }

         renderReferencesPanelWithRelation(parentId) {
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

                const tableBody = this.props.out_references.map(({ref, relation, info}) => {
                    const relation2 = (() => {
                        if (typeof relation === 'string') {
                            return this.renderRelation(relation);
                        }
                        return relation.map((rel, index) => {
                            const style = (() => {
                                if (index >= 1) {
                                    return {marginLeft: '0.25em'}
                                }
                                return {};
                            })();
                            return html`<span style=${style}>${this.renderRelation(rel)}</span>`;
                        })
                    })();

                    if (info) {
                        return html`
                            <tr>
                                <td>
                                    ${relation2}
                                </td>
                                <td>
                                    <a href=${`/#dataview/${ref}`}
                                    target="_blank">${info.name}</a>
                                </td>
                                <td>
                                    <a href=${`/#spec/type/${info.type}`} target="_blank">${info.typeName}</a>
                                </td>
                                <td>
                                    ${dateFormatShort(info.save_date)}
                                </td>
                                <td>
                                    <a href=${`/#people/${info.saved_by}`} target="_blank">${info.saved_by}</a>
                                </td>
                            </tr>
                        `;
                    }

                    // This case probably never occurs?
                    if (ref) {
                        return html`
                            <tr>
                                <td>
                                    ${relation2}
                                </td>
                                <td>
                                    <a href=${`/#dataview/${ref}`}
                                    target="_blank">${ref}</a>
                                </td>
                                <td>Unknown</td>
                                <td colspan="2">
                                    Object inaccessible
                                </td>
                            </tr>
                        `;
                    }
                    return html`
                        <tr>
                            <td>
                                ${relation2}
                            </td>
                            <td>
                               <i>Unknown</i>
                            </td>
                            <td>
                                <a href=${`/#spec/type/${this.props.objectInfo.typeName}`} target="_blank">${this.props.objectInfo.typeName}</a>
                            </td>
                            <td>
                                <i>Unknown</i>
                            </td>
                            <td>
                               <i>Unknown</i>
                            </td>
                        </tr>
                    `;
                });

                return html`
                    <table className="table kb-references-table" >
                        <thead>
                        <tr>
                            <th>Relation</th>
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
