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

    function na(label = 'n/a') {
        return html`<span style=${{fontStyle: 'italic'}}>${label}</span>`;
    }

    function intFormat(value) {
        if (typeof value !== 'number') {
            return na();
        }
        return Intl.NumberFormat('en-US', {
            useGrouping: true
        }).format(value);
    }

    function percentFormat(value) {
        if (typeof value !== 'number') {
            return na();
        }
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

    function renderError(message) {
        return html`
        <span className="text-danger">Error: ${message}</span>`;
    }

    function wrapValue(value, formatter) {
        if (typeof value === 'undefined' || value === null) {
            return na();
        }
        if (formatter) {
            try {
                return formatter(value);
            } catch (ex) {
                return renderError(ex.message);
            }
        }
        return value;
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
                        <td>${wrapValue(this.props.genomeObject.data.scientific_name)}</td>
                    </tr>
                    <tr>
                        <th>KBase Genome ID	</th>
                        <td>${wrapValue(this.props.genomeObject.data.id)}</td>
                    </tr>
                    <tr>
                        <th>Domain</th>
                        <td>${wrapValue(this.props.genomeObject.data.domain)}</td>
                    </tr>
                    <tr>
                        <th>DNA Length</th>
                        <td>${wrapValue(this.props.stats.dna_size, intFormat)}</td>
                    </tr>
                    <tr>
                        <th>Source</th>
                        <td>${wrapValue(this.props.genomeObject.data.source)}</td>
                    </tr>
                    <tr>
                        <th>Source ID</th>
                        <td>${wrapValue(this.props.genomeObject.data.source_id)}</td>
                    </tr>
                    <tr>
                        <th>Number of Contigs</th>
                        <td>${wrapValue(this.props.stats.num_contigs, intFormat)}</td>
                    </tr>
                    <tr>
                        <th>GC Content</th>
                        <td>${wrapValue(this.props.stats.gc_content, percentFormat)}</td>
                    </tr>
                    <tr>
                        <th>Genetic Code</th>
                        <td>${wrapValue(this.props.genomeObject.data.genetic_code)}</td>
                    </tr>
                    <tr>
                        <th>Number of Features</th>
                        <td>${wrapValue(this.props.stats.num_features, intFormat)}</td>
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
