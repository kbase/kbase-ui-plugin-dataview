define([
    'preact',
    'htm',
    'components/Row',
    'components/Col',
    'lib/format', 
    '../Aliases',
    '../Location',
    '../DNASequence',
    '../ProteinSequence',

    'bootstrap',
    'css!./FeatureViewer.css'
], (
    preact,
    htm,
    Row, 
    Col,
    {unixEpochToTimestamp},
    Aliases,
    Location,
    DNASequence,
    ProteinSequence
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class FeatureViewer extends Component {
        renderWarnings(warnings) {
            if (!warnings) {
                return 'n/a';
            }
            return warnings.map((warning) => {
                return html`<p>${warning}</p>`
            })
        }

        renderOverview() {
            const {feature: {location, aliases, cdss, subsystem_data, annotations}, scientificName} = this.props.featureData;
            return html`
                <table className="table table-striped -overview">
                    <tbody>
                        <tr>
                            <th>Functions</th>
                            <td>${this.renderFunctions()}</td>
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
                            <th>Genome</th>
                            <td><a href=${`/#dataview/${this.props.objectInfo.ref}`} target="_blank">${scientificName}</a></td>
                        </tr>
                        <tr>
                            <th>Length</th>
                            <td>${this.renderFeatureLength()}, ${this.renderProteinLength()}</td>
                        </tr>
                        <tr>
                            <th>Location</th>
                            <td><${Location} location=${location} /></td>
                        </tr>
                        <tr>
                            <th>Aliases</th>
                            <td>
                                <${Aliases} aliases=${aliases} />
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

        renderFunctions() {
            const feature = this.props.featureData.feature;
            if (feature.functions) {
                return feature.functions.map((func) => {
                    return html`<div>${func}</div>`;
                });
            }
            if (feature.function) {
                return feature.function;
            }
            return 'n/a';
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

        renderAnnotationComments(annotations) {
            if (!annotations || annotations.length === 0) {
                return  html`<i>No annotation comments</i>`;
            } 

            return annotations.map(([comment, annotator, annotation_time]) => {
                return html`
                    <div>
                        ${comment} (${annotator}), timestamp: ${unixEpochToTimestamp(annotation_time)}
                    </div>
                `
            });
        }

        renderSubsystems(subsystem_data) {
            if (!subsystem_data || subsystem_data.length === 0) {
                return html`<i>No subsystem data</i>`;
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

        renderFeatureLength() {
            const {dna_sequence_length} = this.props.featureData.feature;
            if (!dna_sequence_length) {
                return 'n/a';
            }

            return `${Intl.NumberFormat('en-US', {useGrouping: true}).format(dna_sequence_length)} bp`
        }

        renderProteinLength() {
            const {protein_translation_length} = this.props.featureData.feature;
            if (!protein_translation_length) {
                return 'n/a';
            }

            return `${Intl.NumberFormat('en-US', {useGrouping: true}).format(protein_translation_length)} aa`
        }

        renderSequence() {
           const {dna_sequence, protein_translation } = this.props.featureData.feature;
            return html`
                <table className="table table-striped -dnaSequence">
                    <tbody>
                         <tr>
                            <th>Protein length</th>
                            <td>${this.renderProteinLength()}</td>
                        </tr>
                        <tr>
                            <th>Protein translation</th>
                            <td><${ProteinSequence} sequence=${protein_translation} /></td>
                        </tr>
                        <tr>
                            <th>Feature Length</th>
                            <td>${this.renderFeatureLength()}</td>
                        </tr>
                        <tr>
                            <th>Feature</th>
                            <td><${DNASequence} dna_sequence=${dna_sequence} /></td>
                        </tr>
                       
                    </tbody>
                </table>
            `;
        }
       
        render() {
            // <h4>Biochemistry</h4>
            // ${this.renderBiochemistry()} 
            return html`
                <div className="FeatureViewer">
                   <${Row}>
                    <${Col} style=${{marginRight: '0.5em'}}>
                        <section>
                            <h4>Feature Overview</h4>
                            ${this.renderOverview()}
                        </section>

                    <//>
                    <${Col} style=${{marginLeft: '0.5em'}}>
                        <section>
                            <h4>Sequence</h4>
                            ${this.renderSequence()} 
                        </section>
                    <//>
                   <//>

                </div>
            `;
        }
    }
    return FeatureViewer;
});
