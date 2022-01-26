
define([
    'preact',
    'htm'
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Nullable extends Component {
        render() {
            if (this.props.value === null) {
                return html`<span style=${{color: 'rgb(150, 150, 150'}}>∅</span>`;
            }
            return this.props.value;
        }
    }
    return Nullable;
});