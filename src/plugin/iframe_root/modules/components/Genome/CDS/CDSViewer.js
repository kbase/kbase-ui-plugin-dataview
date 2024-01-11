define([
    'preact',
    'htm',
    'components/Row',
    'components/Col',
    'components/UILink',
    '../Aliases',
    '../Location',
    '../DNASequence',
    '../ProteinSequence',

    'bootstrap',
    'css!./CDSViewer.css'
], (
    preact,
    htm,
    Row, 
    Col,
    UILink,
    Aliases,
    Location,
    DNASequence,
    ProteinSequence
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class CDS extends Component {
        renderParentGene(featureId) {
            if (!featureId) { 
                return;
            }
            const hash = `dataview/${this.props.objectInfo.ref}`;
            const params = {
                sub: 'feature',
                subid: featureId
            };
            return html`
                <${UILink} to="newwindow" hashPath=${{hash, params}}>
                    ${featureId}
                </>
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

         renderCDSLength() {
            const {dna_sequence_length} = this.props.cdsData.cds;
            if (!dna_sequence_length) {
                return 'n/a';
            }

            return `${Intl.NumberFormat('en-US', {useGrouping: true}).format(dna_sequence_length)} bp`
        }

        renderProteinLength() {
            const {protein_translation_length} = this.props.cdsData.cds;
            if (!protein_translation_length) {
                return 'n/a';
            }

            return `${Intl.NumberFormat('en-US', {useGrouping: true}).format(protein_translation_length)} aa`
        }

        renderOverview() {
            const {cds: {location, aliases, parent_gene, note, warnings}, scientificName, genomeId} = this.props.cdsData;
            return html`
                <table className="table table-striped -overview">
                    <colgroup>
                        <col style="width: 11em" />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Genome</th>
                            <td><${UILink} to="newwindow" 
                                hashPath=${{hash: `dataview/${this.props.objectInfo.ref}`}} >
                                ${genomeId}
                                </>
                            </td>
                        </tr>
                        <tr>
                            <th>Scientific name</th>
                            <td>${scientificName}</td>
                        </tr>
                        <tr>
                            <th>Functions</th>
                            <td>${this.renderFunctions()}</td>
                        </tr>
                        <tr>
                            <th>Length</th>
                            <td>${this.renderCDSLength()}, ${this.renderProteinLength()}</td>
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
                            <th>Parent Gene</th>
                            <td>${this.renderParentGene(parent_gene)}</td>
                        </tr>
                        <tr>
                            <th>Note</th>
                            <td>
                                <p>${note || 'n/a'}</p>
                            </td>
                        </tr>
                        <tr>
                            <th>Warnings</th>
                            <td>
                                ${this.renderWarnings(warnings)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

         renderFunctions() {
            const feature = this.props.cdsData.cds
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

        renderSequence() {
           const {dna_sequence, dna_sequence_length, protein_translation_length, protein_translation} = this.props.cdsData.cds;
            return html`
                <table className="table table-striped -sequence">
                    <colgroup>
                        <col style="width: 11em" />
                        <col />
                    </colgroup>
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
                            <th>CDS Length</th>
                            <td>${this.renderCDSLength()}</td>
                        </tr>
                        <tr>
                            <th>CDS</th>
                            <td><${DNASequence} dna_sequence=${dna_sequence} /></td>
                        </tr>
                    </tbody>
                </table>
            `;
        }
       
        render() {
            return html`
                <div className="CDSViewer">
                   <${Row}>
                    <${Col} style=${{marginRight: '0.5em'}}>
                        <section>
                            <h4>CDS Overview</h4>
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
    return CDS;
});
