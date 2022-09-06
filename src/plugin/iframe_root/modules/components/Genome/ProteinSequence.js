define([
    'preact',
    'htm',
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    const DEFAULT_SEQUENCE_LINE_LENGTH = 50;

    class ProteinSequence extends Component {
        renderProteinSequence(sequence) {
            if (!sequence) {
                return 'n/a';
            }

            const lineLength = this.props.lineLength || DEFAULT_SEQUENCE_LINE_LENGTH;
            
            const slices = Math.ceil(sequence.length /  lineLength);
            const lines = [];
            for (let i = 0; i < slices; i += 1) {
                const line = sequence.slice(i * lineLength, (i + 1) * lineLength);
                lines.push(line);
            }
            return html`
                <div style=${{fontFamily: 'monospace'}} role="list">${lines.map((line) => {
                    return html`<div role="listitem">${line}</div>`
                })}</div>
            `;
        }
       
        render() {
            const sequence = this.props.sequence;
            if (!sequence || sequence.length == 0) {
                return 'n/a';
            }
            return this.renderProteinSequence(sequence);
        }
    }
    return ProteinSequence;
});
