define([
    'preact',
    'htm',
    './Summary.styles'
], (
    {Component, h},
    htm,
    styles
) => {
    const html = htm.bind(h);

    class Summary extends Component {

        renderTypeCountTable() {
            const rows = this.props.objectTypeCounts
                .map(({typeName, count}) => {
                    return html`
                    <tr>
                        <td>
                            ${typeName}
                        </td>
                        <td>
                            ${Intl.NumberFormat('en-US', {useGrouping: true}).format(count)}
                        </td>
                    </tr>
                `;
                });
            return html`
                <table class="table kb-light-table">
                    <thead>
                        <tr>
                            <th style=${{width: '15em'}}>
                                Type Name
                            </th>
                            <th>
                                Link Count
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    ${rows}
                    </tbody>
                </table>
            `;
        }

        renderSummaryTable() {
            return html`
                <table class="table kb-light-table">
                    <tbody>
                        <tr>
                            <th style=${{width: '15em'}}>
                                Description
                            </th>
                            <td>
                                ${this.props.description}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Total Samples
                            </th>
                           <td>
                                ${Intl.NumberFormat('en-US', {useGrouping: true}).format(this.props.sampleCount)}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Sample Attributes
                            </th>
                            <td>
                                ${Intl.NumberFormat('en-US', {useGrouping: true}).format(this.props.fieldCount)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

        render() {
            return html`
                <div style=${styles.main}>
                    <div class="row">
                        <div class="col-md-6">
                            <div style=${styles.section}>Sample Set Summary</div>
                            ${this.renderSummaryTable()}
                        </div>
                        <div class="col-md-6">
                            <div style=${styles.section}>Data Links by Object Type</div>
                            ${this.renderTypeCountTable()}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    return Summary;
});