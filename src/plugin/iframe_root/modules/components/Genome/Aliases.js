define([
    'preact',
    'htm',

    'css!./Aliases.css'
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Aliases extends Component {
        renderRows() {
            if (typeof this.props.aliases[0] === 'string') {
                return this.props.aliases.map((alias) => {
                    return html`<tr>
                        <td>${alias}</td>
                    </tr>`;
                });
            } 
            return this.props.aliases.map(([label, alias]) => {
                return html`<tr>
                    <td>${label}</td>
                    <td>${alias}</td>
                </tr>`;
            });
        }
       
        render() {
            const aliases = this.props.aliases;
            if (!aliases || aliases.length == 0) {
                return 'n/a';
            }
            const rows = this.renderRows();

            return html`
                <table className="Aliases table table-compact kb-mini-table">
                    <tbody>
                        ${rows}
                   </tbody>
                </table>
            `;
        }
    }
    return Aliases;
});
