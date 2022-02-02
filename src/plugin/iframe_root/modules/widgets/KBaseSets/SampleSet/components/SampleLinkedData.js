define([
    'preact',
    'htm',
    'components/Empty',
    './SampleLinkedData.styles'
], (
    {Component, h},
    htm,
    Empty,
    styles
) => {
    const html = htm.bind(h);

    function combineStyles(style1, style2) {
        return Object.assign({}, style1, style2);
    }

    class SampleLinkedData extends Component {
        renderDataId(link) {
            if (link.dataid) {
                return link.dataid;
            }
            return html`<span style=${{color: 'rgb(150, 150, 150'}}>∅</span>`;
        }

        renderLinks(links) {
            if (links.length === 0) {
                return html`
                    <${Empty} message="No data linked to this sample"/>
                `;
            }
            const rows =  links
                .map(({link, objectInfo}) => {
                    return html`
                        <div style=${styles.Link}>
                            <div style=${combineStyles(styles.LinkCol, styles.LinkCol1)}>
                                <a href="/#dataview/${link.upa}" target="_blank" title=${link.upa}>${link.upa}</a>
                            </div>
                            <div style=${combineStyles(styles.LinkCol, styles.LinkCol2)}>
                                <a href="/#dataview/${link.upa}" target="_blank" title=${objectInfo.name}>${objectInfo.name}</a>
                            </div>
                            <div style=${combineStyles(styles.LinkCol, styles.LinkCol3)}>
                                <a href="/#spec/type/${objectInfo.type}" target="_blank" title=${objectInfo.type}>${objectInfo.typeName}</b>
                            </div>
                            <div style=${combineStyles(styles.LinkCol, styles.LinkCol4)}>
                                <span title=${link}>${this.renderDataId(link)}</span>
                            </div>
                            <div style=${combineStyles(styles.LinkCol, styles.LinkCol5)}>
                                <span title="${Intl.DateTimeFormat('en-us', {dateStyle: 'full', timeStyle: 'long'}).format(link.created)}" title=${link.created}>${Intl.DateTimeFormat('en-us', {}).format(link.created)}</span>
                            </div>
                            <div style=${combineStyles(styles.LinkCol, styles.LinkCol6)}>
                                <a href="/#people/${link.createdby}" target="_blank" title=${link.createdby}>${link.createdby}</a>
                            </div>
                        </div>
                    `;
                });
            return html`
                <div style=${styles.SampleLinks}>
                    <div style=${styles.LinkHeader} >
                        <div style=${combineStyles(styles.LinkCol, styles.LinkHeaderCol1)} >
                            Object Ref
                        </div>
                        <div style=${combineStyles(styles.LinkCol, styles.LinkHeaderCol2)} >
                            Name
                        </div>
                        <div style=${combineStyles(styles.LinkCol, styles.LinkHeaderCol3)} >
                            Type
                        </div>
                        <div style=${combineStyles(styles.LinkCol, styles.LinkHeaderCol4)} >
                            Data Id
                        </div>
                        <div style=${combineStyles(styles.LinkCol, styles.LinkHeaderCol5)} >
                            Linked On
                        </div>
                        <div style=${combineStyles(styles.LinkCol, styles.LinkHeaderCol6)} >
                            By
                        </div>
                    </div>
                    ${rows}
                </div>
            `;
        }

        renderNone() {
            return html`
            <${Empty} message="no data linked to this sample" />
            `;
        }

        render() {
            if (this.props.linkedData.length === 0) {
                return this.renderNone();
            }
            return this.renderLinks(this.props.linkedData);
        }
    }

    return SampleLinkedData;
});
