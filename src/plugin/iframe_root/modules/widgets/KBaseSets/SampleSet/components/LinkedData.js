define([
    'preact',
    'htm',
    'lib/formatters',
    'components/DataTable',
    'components/Empty',
    './LinkedData.styles'
], (
    {Component, h},
    htm,
    fmt,
    DataTable,
    Empty,
    styles
) => {
    const html = htm.bind(h);

    class LinkedData extends Component {
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
                .sort((a, b) => {
                    return a.objectInfo.typeName.localeCompare(b.objectInfo.typeName);
                })
                .map(({link, objectInfo}) => {
                    return html`
                    <div style=${styles.Link} >
                        <div style=${styles.LinkCol1} >
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
                         ${Intl.DateTimeFormat('en-us', {}).format(link.created)}
                        </div>
                        <div style=${styles.LinkCol6}>
                         <a href="/#people/${link.createdby}" target="_blank">${link.createdby}</a>
                        </div>
                    </div>
                `;
                });
            return html`
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
                        Linked
                    </div>
                    <div style=${styles.LinkHeaderCol6} >
                        By
                    </div>
                </div>
                ${rows}
            `;
        }

        renderSample({sample, links}) {
            return html`
                <div style=${styles.SampleLinks}>
                    <div style=${styles.Sample}>
                        <span style=${styles.Label}>Sample name</span><a href="/#samples/view/${sample.id}/${sample.version}" target="_blank">${sample.name}</a>
                    </div>
                    <div style=${styles.Links}>
                        ${this.renderLinks(links)}
                    </div>
                </div>
            `;
        }

        renderLinkedData() {
            return this.props.data
                .filter(({links}) => {
                    return links.length > 0;
                })
                .map((sample) => {
                    return this.renderSample(sample);
                });
        }

        renderEmptySet() {
            return html`
                <div class="alert alert-warning" style=${{marginTop: '10px'}}>
                    <span style=${{fontSize: '150%', marginRight: '4px'}}>∅</span> - Sorry, no linked data in this set.
                </div>
            `;
        }

        render() {
            if (this.props.data.length === 0) {
                return this.renderEmptySet();
            }
            return html`
                <div style=${styles.main}>
                    ${this.renderLinkedData()}
                </div>
            `;
        }
    }

    return LinkedData;
});
