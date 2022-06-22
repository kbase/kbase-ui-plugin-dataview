define([
    'preact',
    'htm',

    // For effect
    // 'css!./Overview.css'
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Lineage extends Component {
        renderLineageList() {
            const {lineage} = this.props;
            if (!lineage) {
                return html`<i>No taxonomic data for this genome.</i>`;
            }

            // Note that the taxonomy lineage path is just a string, with semicolon or comma separators
            // (depends on what the developer or user decided to use...)
            let separator = ';';
            if (lineage.indexOf(',') >= 0) {
                separator = ',';
            }
            const splittax = lineage.split(separator).map((item) => {
                return item.trim();
            });

            const lineageMap = splittax.map((item) => {
                const searchtax = item.replace('/ /g', '+');
                const link = `http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name=${searchtax}`;
                return html`
                    <div>
                        <a href=${link} target="_blank">
                            ${item}
                        </a>
                    </div>
                `;
            });
            return html`<div style=${{whiteSpace: 'nowrap', overflowX: 'auto'}}>
                ${lineageMap}
            </div>`;
        }

        render() {
            // xss safe
            return html`
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th style=${{width: '11em'}}>
                                Scientific Name
                            </th>
                            <td style= ${{fontStyle: 'italic'}}>
                                ${this.props.scientificName}
                            </td>
                        </tr>
                        <tr>
                            <th>Taxonomic Lineage</th>
                            <td>${this.renderLineageList()}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }
    }
    return Lineage;
});
