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

    function intFormat(value) {
        return Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    function percentFormat(value) {
        if (value > 1) {
            if (value <= 100) {
                value = value / 100;
            } else {
                return `invalid value ${value}`;
            }
        }
        return Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    class GenomeOverview extends Component {
        renderGenomeOverview() {
            return html`
            <table className="table table-striped table-bordered">
                <colgroup>
                    <col style=${{width: '12em'}} />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <td>${this.props.genomeObject.data.scientific_name}</td>
                    </tr>
                    <tr>
                        <th>KBase Genome ID	</th>
                        <td>${this.props.genomeObject.data.id}</td>
                    </tr>
                    <tr>
                        <th>Domain</th>
                        <td>${this.props.genomeObject.data.domain}</td>
                    </tr>
                    <tr>
                        <th>DNA Length</th>
                        <td>${intFormat(this.props.stats.dna_size)}</td>
                    </tr>
                    <tr>
                        <th>Source</th>
                        <td>${this.props.genomeObject.data.source}</td>
                    </tr>
                    <tr>
                        <th>Source ID</th>
                        <td>${this.props.genomeObject.data.source_id}</td>
                    </tr>
                    <tr>
                        <th>Number of Contigs</th>
                        <td>${intFormat(this.props.stats.num_contigs)}</td>
                    </tr>
                    <tr>
                        <th>GC Content</th>
                        <td>${percentFormat(this.props.stats.gc_content)}</td>
                    </tr>
                    <tr>
                        <th>Genetic Code</th>
                        <td>${this.props.genomeObject.data.genetic_code}</td>
                    </tr>
                    <tr>
                        <th>Number of Features</th>
                        <td>${intFormat(this.props.stats.num_features)}</td>
                    </tr>
                </tbody>
            </table>
            `;
        }

        render() {
            return html`
                <div className="GenomeOverview">
                    ${this.renderGenomeOverview()}
                </div>
            `;
        }
    }
    return GenomeOverview;
});
