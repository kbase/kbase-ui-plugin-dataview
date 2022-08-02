define([
    'preact',
    'htm'
], (
    preact,
    htm
) => {
    const html = htm.bind(preact.h);

    function na(label) {
        return html`
            <span style=${{color: 'gray'}}>
              ${label || '∅'}
            </span>
        `;
    }

    function niceNumber(value) {
        return Intl.NumberFormat('en-US', {useGrouping: true}).format(value);
    }

    return {
        na, niceNumber
    };
});