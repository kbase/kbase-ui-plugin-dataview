define([
    'preact',
    'htm',
    'lib/formatters'
], (
    preact,
    htm,
    fmt
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    function getMetadataValue(sample, name, defaultValue) {
        const metadata = sample.node_tree[0].meta_controlled;
        const userMetadata = sample.node_tree[0].meta_user;

        if (metadata[name]) {
            return metadata[name].value;
        }
        if (userMetadata[name]) {
            return userMetadata[name].value;
        }
        return defaultValue;
    }

    class LinkedSamples extends Component {
        renderTimestamp(time) {
            return html `<span title="${fmt.timestamp(time)}">
                  ${fmt.date(time)}
            </span>
            `;
        }

        renderLinkedSamples() {
            // <td>${(sample.sgetMetadataValueample, 'material', '-')}</td>
            const rows = this.props.linkedSamples.map(({link, sample}) => {
                return html`
                <tr>
                    <td>${link.dataid || '∅'}</td>
                    <td><a href="/#samples/view/${link.id}/${link.version}" target="_blank">${sample.name}</a></td>
                    <td>${sample.node_tree[0].id}</td>
                    <td>${this.renderTimestamp(sample.save_date)}</td> 
                    <td><a href="/#people/${sample.user}" target="_blank">${sample.user}</a></td>
                    <td style=${{textAlign: 'right', paddingRight: '2em'}}>${sample.version}</td>
                </tr>
                `;
            });

            return html`
            <table className="table">
                <thead>
                    <tr>
                        <th style=${{width: '15em', whiteSpace: 'nowrap'}}>Path to Sample</th>
                        <th style=${{whiteSpace: 'nowrap'}}>Sample Name</th>
                        <th style=${{whiteSpace: 'nowrap'}}>Id</th>
                        <th style=${{width: '12em', whiteSpace: 'nowrap'}}>Saved</th>
                        <th style=${{width: '8em', whiteSpace: 'nowrap'}}>By</th>
                        <th style=${{width: '5em', whiteSpace: 'nowrap'}}>Version</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            `;
        }

        renderNoLinkedSamples() {
            return html`
            <div class="alert alert-info">
            No samples linked to this object.
            </div>
            `;
        }

        render() {
            if (this.props.linkedSamples.length === 0) {
                return this.renderNoLinkedSamples();
            }
            return html`
                <div className="LinkedSamples">
                ${this.renderLinkedSamples()}
                </table>
            `;
        }
    }
    return LinkedSamples;
});
