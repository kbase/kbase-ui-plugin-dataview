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

    function NCBIURL(name) {
        return `http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name=${name}`;
    }

    function NCBILink(name) {
        return html`
            <a href=${NCBIURL(encodeURIComponent(name))} target="_blank">
                ${name}
            </a>
        `;
    }

    class LineageLegacy extends Component {
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
                // const searchtax = item.replace('/ /g', '+');
                return html`
                    <div>
                        ${NCBILink(item)}
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
                                ${NCBILink(this.props.scientificName)}
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
    return LineageLegacy;
});
