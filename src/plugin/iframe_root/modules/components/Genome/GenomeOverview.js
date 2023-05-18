define([
    'preact',
    'htm',
    'components/common'
], (
    preact,
    htm,
    {na}
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

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

    function overflowWrap(content) {
        return html`<div style=${{overflowX: 'hidden', textOverflow: 'ellipsis'}} title=${content}>${content}</div>`;
    }


    function wrapValue(value, formatter) {
        if (typeof value === 'undefined' || value === null) {
            return na();
        }
        if (formatter) {
            try {
                return overflowWrap(formatter(value));
            } catch (ex) {
                return overflowWrap(renderError(ex.message));
            }
        }
        return overflowWrap(value);
    }

    class GenomeOverview extends Component {
        renderGenomeOverview() {
            return html`
            <table className="table table-striped table-bordered" style=${{tableLayout: 'fixed', width: '100%'}}>
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
                        <th>KBase Genome ID</th>
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
