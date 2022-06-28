define([
    'preact',
    'htm'
], (preact, htm) => {
    const html = htm.bind(preact.h);

    function na(label = 'n/a') {
        return html`
            <span style=${{fontStyle: 'italic'}}>
                ${label}
            </span>
        `;
    }

    function none() {
        return html`
            <span style=${{color: 'gray'}}>
                ∅
            </span>
        `;
    }

    return {
        na, none
    };
});
