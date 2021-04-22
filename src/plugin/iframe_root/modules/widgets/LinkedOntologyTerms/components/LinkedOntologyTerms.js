define([
    'preact',
    'htm'
], function (
    preact,
    htm
) {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class LinkedOntologyTerms extends Component {
        constructor(props) {
            super(props);
        }

        renderLinkedTerms() {
            const rows = this.props.linkedTerms.map(({term, feature}) => {
                return html`
                <tr>
                    <td><a href="/#ontology/term/${term.namespace}/${term.id}" target="_blank">${term.id}</a></td>
                    <td><a href="/#ontology/term/${term.namespace}/${term.id}" target="_blank">${term.name}</a></td>
                    <td>${feature.id}</td>
                
                </tr>
                `;
            });

            return html`
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th style=${{width: '15em'}}>Term ID</th>
                        <th style=${{width: '10em'}}>Name</th>
                        <th style=${{width: '12em'}}>Feature</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            `;
        }

        renderNoLinkedTerms() {
            return html`
            <div class="alert alert-info">
            No terms linked to this object.
            </div>
            `;
        }

        render() {
            if (this.props.linkedTerms.length === 0) {
                return this.renderNoLinkedTerms();
            }
            return html`
                <div class="LinkedOntologyTerms">
                ${this.renderLinkedTerms()}
                </table>
            `;
        }
    }
    return LinkedOntologyTerms;
});
