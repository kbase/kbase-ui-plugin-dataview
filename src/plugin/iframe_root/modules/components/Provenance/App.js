define([
    'preact',
    'htm',
    'components/SankeyGraph',
    './NodeDetail',
    './App.styles'
], (
    preact,
    htm,
    SankeyGraph,
    NodeDetail,
    styles
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    const MAX_REFERENCING_OBJECTS = 100;

    class App extends Component {

        renderThisNarrativeToggle() {
            return html`
                <div className="checkbox" title="If checked, will omit referencing objects from other Narratives, otherwise shows all referencing objects regardless of Narrative..">
                    <label><input type="checkbox" 
                        checked=${this.props.omitOtherNarratives} 
                        onChange=${this.props.toggleOmitOtherNarratives}/> Omit objects in other Narratives</label>
                </div>
            `;
        }

        renderOmitReportToggle() {
            return html`
                <div className="checkbox" title="If checked, will omit reports from the graph.">
                    <label><input type="checkbox" 
                        checked=${this.props.omitReports} 
                        onChange=${this.props.toggleOmitReports}/> Omit Reports</label>
                </div>  
            `;
        }

        renderOpenButton() {
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
                ${this.props.environment === 'embedded' ? this.renderOpenButton() : null}
            `;
        }

        renderStats() {
            const message = (() => {
                if (this.props.value.truncated) {
                    return html`<span class="text-warning" style=${{marginLeft: '1em'}}>The number of referencing objects exceeds the maximum displayable (${MAX_REFERENCING_OBJECTS}); display limited to first ${MAX_REFERENCING_OBJECTS} referencing objects.</span>`;
                }
            })();
            const referencingObjectSummary = (() => {
                const {totalReferencingObjects, filteredReferencingObjects} = this.props.value;
                if (totalReferencingObjects === filteredReferencingObjects) {
                    return html`${totalReferencingObjects}`;
                }
                return html`${filteredReferencingObjects} of ${totalReferencingObjects}`;
            })();
            return html`
                <span>
                    <span>Referencing objects: ${referencingObjectSummary}</span>
                    ${message}
                </span>
            `;
        }

        renderLoading() {
            if (this.props.loading) {
                return html`
                    <span className="fa fa-refresh fa-spin fa-fw" />
                `;
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

        render() {
            return html`
                <div style=${styles.main}>
                    <div style=${styles.headerRow}>
                        <div style=${styles.controlRow}>
                            <div style=${styles.filterControls}>
                                <span style=${styles.label}>Filters:</span>
                                <span style=${{width: '1em'}} />
                                ${this.renderThisNarrativeToggle()}
                                <span style=${{width: '1em'}} />
                                ${this.renderOmitReportToggle()}
                            </div>
                            <div style=${styles.controls}>
                                ${this.renderControls()}
                            </div>
                        </div>
                        <div style=${styles.statusRow}> 
                            <div style="flex: 1 1 0">
                            ${this.renderStats()}
                            </div>
                            <div style="flex: 0 0 auto">
                            ${this.renderLoading()}
                            </div>
                        </div>
                    </div>
                    <div style=${styles.body}>
                        ${this.renderSankeyGraph()}
                        <${NodeDetail} node=${this.props.selectedNode} />
                    </div>
                </div>
            `;
        }
    }

    return App;
});