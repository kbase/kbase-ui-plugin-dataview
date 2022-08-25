define([
    'preact',
    'htm',
    'components/Row',
    'components/Col',
    './CDSViewer.styles',

    'bootstrap',
    'css!./CDSViewer.css'
], (
    preact,
    htm,
    Row, 
    Col,
    styles
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    // @optional parent_gene parent_mrna functions ontology_terms note flags warnings
    // @optional inference_data dna_sequence aliases db_xrefs functional_descriptions  

    class CDS extends Component {

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

        renderParentGene(featureId) {
            if (!featureId) { 
                return;
            }
            const url = `/#dataview/${this.props.objectInfo.ref}?sub=feature&subid=${featureId}`;
            return html`
                <a href=${url} target="_blank">${featureId}</a>
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

        renderOverview() {
            const {cds: {location, aliases, parent_gene, dna_sequence, note, warnings}, scientificName, genomeId} = this.props.cdsData;
            const genomeLink = `/#dataview/${this.props.objectInfo.ref}`;
            return html`
                <table className="table table-striped">
                    <colgroup>
                        <col style="width: 11em" />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Genome</th>
                            <td><a href=${genomeLink} target="_blank">${genomeId}</a></td>
                        </tr>
                        <tr>
                            <th>Scientific name</th>
                            <td>${scientificName}</td>
                        </tr>
                        <tr>
                            <th>Length</th>
                            <td>${dna_sequence ? dna_sequence.length : 'n/a'} bp</td>
                        </tr>
                        <tr>
                            <th>Location</th>
                            <td>${this.renderLocation(location)}</td>
                        </tr>
                        <tr>
                            <th>Aliases</th>
                            <td>
                                ${aliases ? aliases.map((alias) => {
                                    return html`<p>${alias}</p>`;
                                }) : 'n/a'}
                            </td>
                        </tr>
                        <tr>
                            <th>Parent Gene</th>
                            <td>${this.renderParentGene(parent_gene)}</td>
                        </tr>
                        <tr>
                            <th>Note</th>
                            <td>
                            ${note || 'n/a'}
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

        renderBiochemistry() {
            const {functions, protein_translation} = this.props.cdsData.cds;
            return html`
                <table className="table table-striped">
                    <colgroup>
                        <col style="width: 11em" />
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

        renderSequence() {
           const {dna_sequence} = this.props.cdsData.cds;
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
                            <th>CDS</th>
                            <td>${this.renderDNASequence(dna_sequence)}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }
       
        render() {
            return html`
                <div style=${styles.main} className="CDSViewer">
                   <h4>Overview</h4>
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
    return CDS;
});
