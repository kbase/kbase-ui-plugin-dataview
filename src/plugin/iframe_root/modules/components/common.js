define([
    'preact',
    'htm'
], function (preact, htm) {
    'use strict';

    const html = htm.bind(preact.h);

    return {
        na() {
            return html`
                <span style=${{color: 'gray'}}>
                    ∅
                </span>
            `;
        }
    };
});