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

    class DNASequence extends Component {
          renderDNASequence(dna_sequence) {
            if (!dna_sequence) {
                return 'n/a';
            }

            const lineLength = this.props.lineLength || DEFAULT_SEQUENCE_LINE_LENGTH;
            
            const slices = Math.ceil(dna_sequence.length /  lineLength);
            const sequence = [];
            for (let i = 0; i < slices; i += 1) {
                const piece = dna_sequence.slice(i * lineLength, (i + 1) * lineLength);
                sequence.push(piece);
            }
            return html`
                <div style=${{fontFamily: 'monospace'}}>${sequence.map((line) => {
                    return html`<div>${line}</div>`
                })}</div>
            `;
        }
       
        render() {
            const dna_sequence = this.props.dna_sequence;
            if (!dna_sequence || dna_sequence.length == 0) {
                return 'n/a';
            }
            return this.renderDNASequence(dna_sequence);
        }
    }
    return DNASequence;
});
