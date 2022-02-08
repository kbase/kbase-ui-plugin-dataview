define([
    'preact',
    'htm',
    'components/Empty',
    './SampleLinkedData',
    './SampleLinkedDataDetail.styles'
], (
    {Component, h},
    htm,
    Empty,
    SampleLinkedData,
    styles
) => {
    const html = htm.bind(h);

    class SampleLinkedDataDetail extends Component {
        renderNoLinks() {
            return html`
                <div style=${styles.empty}>∅ - no data links</div>
            `;
        }

        renderLinks() {
            if (this.props.dataLinks.length === 0) {
                return this.renderNoLinks();
            }
            return html`<${SampleLinkedData} ...${this.props} />`;
        }

        render() {
            return html`
                <div style=${styles.main}>
                    ${this.renderLinks()}
                </div>
            `;
        }
    }

    return SampleLinkedDataDetail;
});
