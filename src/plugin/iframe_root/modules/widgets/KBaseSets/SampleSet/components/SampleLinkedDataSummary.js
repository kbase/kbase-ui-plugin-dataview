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
        renderTypeSummaryx() {
            return this.props.linksByType.map(({typeName, count}) => {
                return html`
                    <div style=${styles.DataPill}>
                        <div style=${styles.DataPillLabel}>${typeName}</div>
                        <div style=${styles.DataPillData}>${count}</div>
                    </div>
                `;
            });
        }

        renderTypeSummary() {
            const rows = this.props.linksByType.map(({typeName, count}) => {
                return html`
                    <tr>
                        <th>${typeName}</th>
                        <td>${count}</td>
                    </tr>
                `;
            });
            return html`
                <table class="table table-condensed kb-light-table" style="width: 20em;">
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
