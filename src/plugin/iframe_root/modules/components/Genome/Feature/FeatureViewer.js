define([
    'preact',
    'htm',
    'components/Row',
    'components/Col',

    'bootstrap',
    'css!./FeatureViewer.css'
], (
    preact,
    htm,
    Row, 
    Col
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    // @optional parent_gene parent_mrna functions ontology_terms note flags warnings
    // @optional inference_data dna_sequence aliases db_xrefs functional_descriptions  

    class FeatureViewer extends Component {

        renderLocation(loc) {
            if (loc.length === 0) {
                return 'Unknown';
            }

            let locStr = '';
            for (let i = 0; i < loc.length; i++) {
                const start = Number(loc[i][1]);
                const length = Number(loc[i][3]);

                let end = 0;
                if (loc[i][2] === '+')
                    end = start + length - 1;
                else
                    end = start - length + 1;

                locStr += `${start} to ${end} (${loc[i][2]})`;
            }
            return locStr;
        }

        renderProteinTranslation(proteinTranslation) {
            if (proteinTranslation.length === 0) {
                return 'n/a';
            }

            const SEQUENCE_SLICE_SIZE = 50;
            
            const slices = Math.ceil(proteinTranslation.length /  SEQUENCE_SLICE_SIZE);
            const sequence = [];
            for (let i = 0; i < slices; i += 1) {
                const piece = proteinTranslation.slice(i * SEQUENCE_SLICE_SIZE, (i + 1) * SEQUENCE_SLICE_SIZE);
                sequence.push(piece);
            }
            return html`
                <div style=${{fontFamily: 'monospace'}}>${sequence.map((line) => {
                    return html`<div>${line}</div>`
                })}</div>
            `;
        }

        renderWarnings(warnings) {
            if (!warnings) {
                return 'n/a';
            }
            return warnings.map((warning) => {
                return html`<p>${warning}</p>`
            })
        }

        renderAliases(aliases) {
            if (!aliases || aliases.length == 0) {
                return 'n/a';
            }
            const rows = aliases.map(([label, alias]) => {
                return html`<tr>
                    <td>${label}</td>
                    <td>${alias}</td>
                </tr>`;
            });

            return html`
                <table className="table table-compact kb-mini-table">
                    <tbody>
                   ${rows}
                   </tbody>
                </table>
            `;
        }

        renderOverview() {
            const {feature: {location, aliases, cdss, 'function': func, dna_sequence, note, warnings, protein_translation}, scientificName, genomeId} = this.props.featureData;
            const genomeLink = `/#dataview/${this.props.objectInfo.ref}`;
            return html`
                <table className="table table-striped">
                    <colgroup>
                        <col style="width: 11em" />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Function</th>
                            <td>${func || 'Unknown'}</td>
                        </tr>
                        <tr>
                            <th>Genome</th>
                            <td><a href=${`/#dataview/${this.props.objectInfo.ref}`} target="_blank">${scientificName}</a></td>
                        </tr>
                        <tr>
                            <th>Length</th>
                            <td>${dna_sequence ? dna_sequence.length : 'n/a'} bp ${protein_translation ? `, ${protein_translation.length} aa` : ''}</td>
                        </tr>
                        <tr>
                            <th>Location</th>
                            <td>${this.renderLocation(location)}</td>
                        </tr>
                        <tr>
                            <th>Aliases</th>
                            <td>
                                ${this.renderAliases(aliases)}
                            </td>
                        </tr>
                        <tr>
                            <th>CDSs</th>
                            <td>${this.renderCDSs(cdss)}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

        renderBiochemistry() {
            const {functions, protein_translation, annotations, subsystem_data} = this.props.featureData.feature;
            return html`
                <table className="table table-striped">
                    <colgroup>
                        <col style="width: 13em" />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Function</th>
                            <td>${functions ? functions.map((func) => {
                                return func;
                            }) : 'n/a'}</td>
                        </tr>
                         <tr>
                            <th>Subsystems</th>
                            <td>${this.renderSubsystems(subsystem_data)}</td>
                        </tr>
                         <tr>
                            <th>Annotation Comments</th>
                            <td>${this.renderAnnotationComments(annotations)}</td>
                        </tr>
                        <tr>
                            <th>Protein translation</th>
                            <td>${this.renderProteinTranslation(protein_translation)}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

        renderDNASequence(dna_sequence) {
            if (!dna_sequence) {
                return 'n/a';
            }

            const SEQUENCE_SLICE_SIZE = 50;
            
            const slices = Math.ceil(dna_sequence.length /  SEQUENCE_SLICE_SIZE);
            const sequence = [];
            for (let i = 0; i < slices; i += 1) {
                const piece = dna_sequence.slice(i * SEQUENCE_SLICE_SIZE, (i + 1) * SEQUENCE_SLICE_SIZE);
                sequence.push(piece);
            }
            return html`
                <div style=${{fontFamily: 'monospace'}}>${sequence.map((line) => {
                    return html`<div>${line}</div>`
                })}</div>
            `;
        }

        renderCDSs(cdss) {
            if (!cdss) {
                return 'n/a';
            }

            return cdss.map((cds) => {
                const url = `/#dataview/${this.props.objectInfo.ref}?sub=cds&subid=${cds}`;
                return html`
                    <a href=${url} target="_blank">
                        ${cds}
                    </a>
                `;
            })
        }

          unixEpochToTimestamp(time) {
            if (!time) {
                return 'n/a';
            }
            const options = {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false
            };
            return Intl.DateTimeFormat('en-US', options).format(time * 1000);
        }

        renderAnnotationComments(annotations) {
            if (!annotations) {
                return  html`<i>No annotation comments found.</i>`;
            } 

            return annotations.map(([comment, annotator, annotation_time]) => {
                return html`
                    <div>
                        ${comment} (${annotator}), timestamp: ${this.unixEpochToTimestamp(annotation_time)}
                    </div>
                `
            });
        }

        renderSubsystems(subsystem_data) {
            if (!subsystem_data) {
                return html`<i>No subsystem data found.</i>`;
            }

            return subsystem_data.map(([subsystem, variant, role]) => {
                return html`
                    <div style="margin-bottom: 1em">
                        <div>Subsystem: ${subsystem}</div>
                        <div>Variant: ${variant}</div>
                        <div>Role: ${role}</div>
                    </div>
                `;
            });
        }

        renderSequence() {
           const {dna_sequence, cdss} = this.props.featureData.feature;
            return html`
                <table className="table table-striped">
                    <colgroup>
                        <col style="width: 11em" />
                        <col />
                    </colgroup>
                    <tbody>
                         <tr>
                            <th>Length</th>
                            <td>${dna_sequence ? dna_sequence.length : 'n/a'} bp</td>
                        </tr>
                        <tr>
                            <th>Feature</th>
                            <td>${this.renderDNASequence(dna_sequence)}</td>
                        </tr>
                       
                    </tbody>
                </table>
            `;
        }
       
        render() {
            return html`
                <div className="FeatureViewer">
                   <h4>Feature Overview</h4>
                   ${this.renderOverview()}

                   <${Row}>
                    <${Col} style=${{marginRight: '0.5em'}}>
                        <h4>Biochemistry</h4>
                        ${this.renderBiochemistry()} 
                    <//>
                    <${Col} style=${{marginLeft: '0.5em'}}>
                        <h4>Sequence</h4>
                        ${this.renderSequence()} 
                    <//>
                   <//>

                </div>
            `;
        }
    }
    return FeatureViewer;
});
