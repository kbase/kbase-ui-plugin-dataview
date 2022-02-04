define([
    'preact',
    'htm',
    'components/Empty',
    './SampleLinkedDataSummary.styles'
], (
    {Component, h},
    htm,
    Empty,
    styles
) => {
    const html = htm.bind(h);

    class SampleLinkedDataSummary extends Component {
        renderTypeSummary() {
            const rows = this.props.linksByType.map(({typeName, objectCounts}) => {
                return html`
                    <tr>
                        <td>${typeName}</td>
                        <td>${Object.keys(objectCounts).length}</td>
                    </tr>
                `;
            });
            return html`
                <table class="table table-condensed kb-light-table" style="width: 20em;">
                    <thead>
                        <tr>
                            <th>Object Type</th>
                            <th>Objects Linked</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            `;
        }


        renderNoLinks() {
            if (this.props.linksByType.length === 0) {
                return html`
                    <div style=${styles.empty}>none</div>
                `;
            }
        }

        renderSummary() {
            if (this.props.linksByType.length === 0) {
                return this.renderNoLinks();
            }
            return this.renderTypeSummary();
        }

        render() {
            return html`
                <div style=${styles.main}>
                    <div style=${styles.col1}>
                        <div style=${styles.label}>Linked Data </div>
                    </div>
                    <div style=${styles.col2}>
                        ${this.renderSummary()}
                    </div>
                </div>
            `;
        }
    }

    return SampleLinkedDataSummary;
});
