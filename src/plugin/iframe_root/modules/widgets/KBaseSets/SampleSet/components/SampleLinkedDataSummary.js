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
            return this.props.linksByType.map(({typeName, count}) => {
                return html`
                    <div style=${styles.typeSummary}>
                        <div style=${styles.typeName}>${typeName}: </div>
                        <div style=${styles.linkCount}>${count}</div>
                    </div>
                `;
            });
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
                    <div style=${styles.label}>Linked Data <span class="fa fa-arrow-right"/></div>
                    ${this.renderSummary()}
                </div>
            `;
        }
    }

    return SampleLinkedDataSummary;
});
