define([
    'preact',
    'htm',
    'lib/formatters'
], function (
    preact,
    htm,
    fmt
) {
    'use strict';

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
        constructor(props) {
            super(props);
        }

        renderLinkedSamples() {
            const rows = this.props.linkedSamples.map(({link, sample}) => {
                return html`
                <tr>
                    <td><a href="/#samples/view/${link.id}/${link.version}">${sample.sample.name}</a></td>
                    <td>${getMetadataValue(sample.sample, 'material', '-')}</td>
                    <td>${sample.sample.node_tree[0].id}</td>
                    <td>${fmt.formattedDate(sample.sample.save_date)}</td>
                    <td><a href="/#people/${sample.sample.user}" target="_blank">${sample.sample.user}</a></td>
                    <td style=${{textAlign: 'right', paddingRight: '2em'}}>${sample.sample.version}</td>
                    <td style=${{textAlign: 'right', paddingRight: '2em'}}>${fmt.formattedInteger(sample.linkedData.links.length)}</td>
                </tr>
                `;
            });

            return html`
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th style=${{width: '15em'}}>Material</th>
                        <th style=${{width: '10em'}}>Source Id</th>
                        <th style=${{width: '12em'}}>Saved</th>
                        <th style=${{width: '8em'}}>By</th>
                        <th style=${{width: '5em'}}>Version</th>
                        <th style=${{width: '8em'}}># Linked objs</th>
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
