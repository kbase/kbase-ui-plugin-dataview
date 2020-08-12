define([
    'preact',
    'htm',

    'bootstrap'
], function (
    preact,
    htm
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Progress extends Component {
        render() {
            return html`
        <div class="progress">
            <div class="progress-bar" 
                role="progressbar"
                aria-valuenow=${String(this.props.progress)}
                aria-valuemin="0"
                aria-valuemax="100"
                style=${{width: `${this.props.progress}%`}}>
                <span>
                    ${this.props.message}
                    <span style=${{fontWeight: 'bold'}}>${this.props.progress}%</span> 
                </span>
            </div>
        </div>
    `;
        }
    }

    return Progress;
});