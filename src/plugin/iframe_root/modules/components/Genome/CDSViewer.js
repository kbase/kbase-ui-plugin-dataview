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

        renderParentGene(featureId) {
            if (!featureId) { 
                return;
            }
            const url = `/#dataview/${this.props.objectInfo.ref}?sub=feature&subid=${featureId}`;
            return html`
                <a href=${url} target="_blank">${featureId}</a>
            `;
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
                            <td>${dna_sequence.length} bp</td>
                        </tr>
                        <tr>
                            <th>Location</th>
                            <td>${this.renderLocation(location)}</td>
                        </tr>
                        <tr>
                            <th>Aliases</th>
                            <td>
                                ${aliases.map((alias) => {
                                    return html`<p>${alias}</p>`;
                                })}
                            </td>
                        </tr>
                        <tr>
                            <th>Parent Gene</th>
                            <td>${this.renderParentGene(parent_gene)}</td>
                        </tr>
                        <tr>
                            <th>Note</th>
                            <td>
                            ${note}
                            </td>
                        </tr>
                        <tr>
                            <th>Warnings</th>
                            <td>
                                ${warnings.map((warning) => {
                                    return html`<p>${warning}</p>`
                                })}
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
                            <td>${functions.map((func) => {
                                return func;
                            })}</td>
                        </tr>
                        <tr>
                            <th>Protein translation</th>
                            <td>${protein_translation || 'n/a'}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

        renderSequence() {
            const SEQUENCE_SLICE_SIZE = 50;
            const {dna_sequence} = this.props.cdsData.cds;
            const slices = Math.ceil(dna_sequence.length /  SEQUENCE_SLICE_SIZE);
            const sequence = [];
            for (let i = 0; i < slices; i += 1) {
                const piece = dna_sequence.slice(i * SEQUENCE_SLICE_SIZE, (i + 1) * SEQUENCE_SLICE_SIZE);
                sequence.push(piece);
            }
            return html`
                <table className="table table-striped">
                    <colgroup>
                        <col style="width: 11em" />
                        <col />
                    </colgroup>
                    <tbody>
                         <tr>
                            <th>Length</th>
                            <td>${dna_sequence.length} bp</td>
                        </tr>
                        <tr>
                            <th>CDS</th>
                            <td><div style=${{fontFamily: 'monospace'}}>${sequence.map((line) => {
                                return html`<div>${line}</div>`
                            })}</div></td>
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
