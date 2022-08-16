define([
    'preact',
    'htm',
    'components/SankeyGraph',
    './NodeDetail',
    'components/Row',
    'components/Col',
    './App.styles',

    'css!./App.css'
], (
    preact,
    htm,
    SankeyGraph,
    NodeDetail,
    Row, Col,
    styles
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    const MAX_REFERENCING_OBJECTS = 100;

    class App extends Component {
        renderThisNarrativeToggle() {
            if (this.props.totalObjectsInOtherNarratives === 0) {
                return html`
                    <div className="checkbox" title="If checked, will omit referencing objects from other Narratives, otherwise shows all referencing objects regardless of Narrative..">
                        <label><input type="checkbox" disabled/> Omit other Narratives (none)</label>
                    </div>
                `;
            }
            return html`
                <div className="checkbox" title="If checked, will omit referencing objects from other Narratives, otherwise shows all referencing objects regardless of Narrative..">
                    <label><input type="checkbox" 
                        checked=${this.props.omitOtherNarratives} 
                        onChange=${this.props.toggleOmitOtherNarratives}/> Omit other Narratives (${this.props.totalObjectsInOtherNarratives})</label>
                </div>
            `;
        }

        renderOmitReportToggle() {
            if (!this.props.totalReports) {
                return html`
                    <div className="checkbox" title="There are no referencing Reports in the graph.">
                        <label><input type="checkbox" disabled /> Omit Reports (none)</label>
                    </div>  
                `;
            }
            return html`
                <div className="checkbox" title="If checked, will omit reports from the graph.">
                    <label><input type="checkbox" 
                        checked=${this.props.omitReports} 
                        onChange=${this.props.toggleOmitReports}/> Omit Reports (${this.props.totalReports})</label>
                </div>  
            `;
        }

        renderShowAllVersionsToggle() {
            if (this.props.totalVersions === 1) {
                return html`
                    <div className="checkbox" title="If checked, will include all versions in the graph.">
                        <label><input type="checkbox" 
                            disabled /> Include all Versions (no other versions)</label>
                    </div>  
                `;
            }
            return html`
                <div className="checkbox" title="If checked, will include all versions in the graph.">
                    <label><input type="checkbox" 
                        checked=${this.props.showAllVersions} 
                        onChange=${this.props.toggleShowAllVersions}/> Include all Versions (${this.props.totalVersions})</label>
                </div>  
            `;
        }

        onLabelTypeSelect(e) {
            this.props.selectNodeLabelType(e.target.value);
        }

        renderLabelTypeSelect() {
            const labelType = this.props.nodeLabelType;
            return html`
                <select class="form-control" onChange=${this.onLabelTypeSelect.bind(this)}>
                    <option value="object-name" selected=${labelType === 'object-name'}>Object Name</option>
                    <option value="ref" selected=${labelType === 'ref'}>Object Ref</option>
                    <option value="type" selected=${labelType === 'type'}>Object Type</option>
                    <option value="node-number" selected=${labelType === 'node-number'}>Node #</option>
                </select>
            `;
        }

        renderOpenButton() {
            const disabled = this.props.environment !== 'embedded';
            if (disabled) {
                return html`
                <a disabled
                    className="btn btn-default"
                >
                    Open in separate window
                </a>
            `;
            }
            return html`
                <a href="/#provenance/${this.props.objectInfo.ref}" 
                    target="_blank"
                    className="btn btn-default"
                >
                    Open in separate window
                </a>
            `;
        }

        renderControls() {
            return html`
                ${this.renderOpenButton()}
            `;
        }

        renderStatus() {

            // const referencingObjectSummary = (() => {
            //     const {totalReferencingObjects, filteredReferencingObjects} = this.props.value;
            //     if (totalReferencingObjects === filteredReferencingObjects) {
            //         return html`${totalReferencingObjects}`;
            //     }
            //     return html`${filteredReferencingObjects} of ${totalReferencingObjects}`;
            // })();
            const nodeCount = (() => {
                if (this.props.loading) {
                    return html`
                        <span className="fa fa-refresh fa-spin fa-fw" />
                    `;
                }
                return this.props.value.nodeCount;
            })();
            return html`
                <span>Node count: ${nodeCount} </span>
            `;
        }

        renderMessage() {
            if (this.props.value.truncated) {
                return html`<span class="text-warning" style=${{marginLeft: '1em'}}>
                    The number of referencing objects (${this.props.filteredReferencingObjects}) exceeds the maximum displayable (${MAX_REFERENCING_OBJECTS}); display limited to first ${MAX_REFERENCING_OBJECTS} referencing objects.</span>`;
            }
        }

        renderSankeyGraph() {
            const {graph, objRefToNodeIdx} = this.props.value;
            return html`
                <${SankeyGraph} 
                        graph=${graph} 
                        objRefToNodeIdx=${objRefToNodeIdx} 
                        runtime=${this.props.runtime} 
                        onNodeOver=${this.props.onNodeOver}
                        onNodeOut=${this.props.onNodeOut}
                />
            `;
        }

        renderLegend() {
            //  totalReferencingObjects, filteredReferencingObjects
            const thisObjectLabel = (() => {
                if (this.props.includesAllVersions) {
                    return 'All Versions';
                }
                return 'This Object';
            })();
            const copiedRow = (() => {
                if (this.props.isCopied) {
                    return html`
                        <tr>
                            <td style=${{width: '3em', backgroundColor: '#4BB856'}}></td>
                            <td>Copied From</td>
                            <td>1</td>
                            <td>1</td>
                        </tr>
                    `;
                }
            })();
            return html`
                <div className="LegendTableContainer">
                    <table className="LegendTable" cellpadding="0" cellspacing="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Objects</th>
                                <th>Total</th>
                                <th>Filtered</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style=${{width: '3em', backgroundColor: '#FF9800'}}></td>
                                <td>${thisObjectLabel}</td>
                                <td>${this.props.totalVersions}</td>
                                <td>${this.props.totalVersions}</td>
                            </tr>
                            <tr>
                                <td style=${{width: '3em', backgroundColor: '#C62828'}}></td>
                                <td>Referencing</td>
                                <td>${this.props.totalReferencingObjects}</td>
                                <td>${this.props.filteredReferencingObjects}</td>
                            </tr>
                            <tr>
                                <td style=${{width: '3em', backgroundColor: '#2196F3'}}></td>
                                <td>Referenced</td>
                                <td>${this.props.totalReferencedObjects}</td>
                                <td>${this.props.totalReferencedObjects}</td>
                            </tr>
                            ${copiedRow}
                            <tr>
                                <td></td>
                                <td>TOTAL</td>
                                <td>${this.props.totalVersions + this.props.totalReferencedObjects + this.props.totalReferencingObjects + (this.props.isCopied ? 1 : 0)}</td>
                                <td>${this.props.totalVersions + this.props.totalReferencedObjects + this.props.filteredReferencingObjects + (this.props.isCopied ? 1 : 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        }

        renderGraphToolbar() {
            return html`
                <div style=${styles.graphToolbar}>
                    <div style=${styles.graphToolbarHeaderRow}>
                         <div style=${{...styles.graphToolbarCol, ...styles.title}}>
                            Objects referenced
                        </div>
                        <div style=${{...styles.graphToolbarCol, ...styles.title}}>
                            This object
                        </div>
                        <div style=${{...styles.graphToolbarCol, ...styles.title}}>
                            Objects referencing
                        </div>
                    </div>
                    <div style=${styles.graphToolbarRow}>
                        <div style=${styles.graphToolbarCol}>
                        </div>
                        <div style=${styles.graphToolbarCol}>
                            ${this.renderShowAllVersionsToggle()}
                        </div>
                        <div style=${styles.graphToolbarCol}>
                            ${this.renderThisNarrativeToggle()}
                                <span style=${{width: '1em'}} />
                                ${this.renderOmitReportToggle()}
                        </div>
                    </div>
                </div>
            `;
        }

        render() {
            return html`
                <div style=${styles.main}>
                    <div style=${styles.headerRow}>
                        <div style=${styles.controlRow}>
                            <div style=${styles.status}>
                                ${this.renderStatus()}
                            </div>
                            <div style=${styles.message}>
                                ${this.renderMessage()}
                            </div>
                           
                            <div style=${styles.controls}>
                                <div className="form-inline" style=${{marginRight: '0.25em'}}>
                                    <span style=${styles.label}>Node Label:</span>
                                    ${this.renderLabelTypeSelect()}
                                </div>
                                ${this.renderControls()}
                            </div>
                        </div>
                       
                    </div>
                    <div style=${styles.body}>
                        ${this.renderGraphToolbar()}
                        ${this.renderSankeyGraph()}
                        <${Row} style=${{marginBottom: '1em'}}>
                            <${Col} style=${{flex: '0 0 22em', marginRight: '0.5em'}}>
                                <h4>Legend</h4>
                                ${this.renderLegend()}
                            <//>

                            <${Col} style=${{flex: '1 1 0', marginRight: '0.5em'}}>
                                <${NodeDetail} node=${this.props.selectedNode} />
                            <//>
                        <//>
                    </div>
                </div>
            `;
        }
    }

    return App;
});
