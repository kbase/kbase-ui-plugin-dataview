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
                <div style=${styles.mpty}>∅ - no data links</div>
            `;
        }

        render() {
            if (this.props.dataLinks.length === 0) {
                // return this.renderNoLinks();
                return;
            }

            return html`
                <div style=${styles.main}>
                    <${SampleLinkedData} ...${this.props} />
                </div>
            `;
        }
    }

    return SampleLinkedDataDetail;
});
