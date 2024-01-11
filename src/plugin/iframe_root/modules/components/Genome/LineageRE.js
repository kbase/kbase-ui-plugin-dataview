define([
    'preact',
    'htm',
    'components/UILink'
], (
    preact,
    htm,
    UILink
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class LineageRE extends Component {
        buildLineage(lineage) {
            // Trim off the "root" which is always at the top of the lineage.
            const lineageMap = lineage.slice(1).map((taxon, index) => {
                // const url = UIURL({path: `/#taxonomy/taxon/${taxon.ns}/${taxon.id}`,
                // type: 'kbaseui'});
                const hash = `taxonomy/taxon/${taxon.ns}/${taxon.id}`;
                return html`
                    <div key=${index}>
                        <${UILink} 
                            to="newwindow" 
                            hashPath=${{hash}}>
                            ${taxon.scientific_name}
                        </>
                    </div>
                `;
            });
            return html`<div style=${{whiteSpace: 'nowrap', overflowX: 'auto'}}>
                ${lineageMap}
            </div>`;
        }

        render() {
            const {lineage, taxonRef, scientificName} = this.props;
            const taxonPath = `taxonomy/taxon/${taxonRef.ns}/${taxonRef.id}/${taxonRef.ts}`;
            // xss safe
            return html`
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th style=${{width: '11em'}}>
                                Scientific Name
                            </th>
                            <td data-field="scientific-name"
                                style= ${{fontStyle: 'italic'}}>
                                <${UILink} to="newwindow" hashPath=${{hash: taxonPath}}>
                                    ${scientificName}
                                </>
                            </td>
                        </tr>
                        <tr>
                            <th>Taxonomic Lineage</th>
                            <td>${this.buildLineage(lineage)}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }
    }
    return LineageRE;
});
