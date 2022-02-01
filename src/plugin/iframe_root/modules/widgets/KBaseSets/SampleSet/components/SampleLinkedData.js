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
                            <div style=${styles.LinkCol1}>
                                <a href="/#dataview/${link.upa}" target="_blank">${link.upa}</a>
                            </div>
                            <div style=${styles.LinkCol2}>
                                <a href="/#dataview/${link.upa}" target="_blank">${objectInfo.name}</a>
                            </div>
                            <div style=${styles.LinkCol3}>
                                <a href="/#spec/type/${objectInfo.type}" target="_blank">${objectInfo.typeName}</b>
                            </div>
                            <div style=${styles.LinkCol4}>
                                ${this.renderDataId(link)}
                            </div>
                            <div style=${styles.LinkCol5}>
                                <span title="${Intl.DateTimeFormat('en-us', {dateStyle: 'full', timeStyle: 'long'}).format(link.created)}">${Intl.DateTimeFormat('en-us', {}).format(link.created)}</span>
                            </div>
                            <div style=${styles.LinkCol6}>
                                <a href="/#people/${link.createdby}" target="_blank">${link.createdby}</a>
                            </div>
                        </div>
                    `;
                });
            return html`
                <div style=${styles.SampleLinks}>
                    <div style=${styles.LinkHeader} >
                        <div style=${styles.LinkHeaderCol1} >
                            Object Ref
                        </div>
                        <div style=${styles.LinkHeaderCol2} >
                            Name
                        </div>
                        <div style=${styles.LinkHeaderCol3} >
                            Type
                        </div>
                        <div style=${styles.LinkHeaderCol4} >
                            Data Id
                        </div>
                        <div style=${styles.LinkHeaderCol5} >
                            Linked On
                        </div>
                        <div style=${styles.LinkHeaderCol6} >
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
