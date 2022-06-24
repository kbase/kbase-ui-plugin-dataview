define([
    'preact',
    'htm',
    'components/ElapsedClock',

    // For effect
    'css!./ProgressiveLoading.css'
], (
    preact,
    htm,
    ElapsedClock
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    const DEFAULT_TICK_RATE = 250;

    class ProgressiveLoading extends Component {

        constructor(props) {
            super(props);
            this.timer = null;
            // We recast the intervals as something easier to compute each time.
            this.intervals = [];
            this.props.intervals.forEach(({elapsed, type, message}, index) => {
                // We want the intervals to be continuous so we have one from
                // 0 to the first interval.
                if (index === 0 && elapsed > 0) {
                    this.intervals.push({message: null, type: null, from: 0, upTo: elapsed});
                }
                if (index === this.props.intervals.length -1) {
                    // On last
                    this.intervals.push({message, type, from: elapsed, upTo: null});
                } else {
                    this.intervals.push({message, type, from: elapsed, upTo: this.props.intervals[index + 1].elapsed});
                }
            });
            this.state = {
                start: Date.now(),
                elapsed: null,
                status: 'NONE',
                currentInterval: this.intervals[0]
            };
        }

        componentDidMount() {
            this.startClock();
        }

        getInterval(currentElapsed) {
            return this.intervals.find(({from, upTo}) => {
                return (currentElapsed >= from && (upTo === null || currentElapsed < upTo));
            });
        }

        startClock() {
            this.timer = window.setInterval(() => {
                const now = Date.now();
                const elapsed = now - this.state.start;
                const currentInterval = this.getInterval(elapsed);
                this.setState({
                    ...this.state,
                    elapsed,
                    currentInterval
                });
            }, this.props.tickRate || DEFAULT_TICK_RATE);
        }

        stopClock() {
            if (this.timer) {
                window.clearInterval(this.timer);
                this.timer = null;
            }
        }

        renderElapsed() {
            return html`<span className="-elapsed"><span>for</span> <span className="-elapsedTime"><${ElapsedClock} elapsed=${this.state.elapsed} /></span></span>`;
        }

        renderInterval() {
            const {currentInterval: {type, message}} = this.state;
            const textClass = (() => {
                if (type) {
                    return ` text-${type}`;
                }
                return '';
            })();
            if (message === null) {
                return;
            }
            return html`
                <div className="-intervalArea">
                    <span className=${`-intervalMessage${textClass}`}>${message}</span>
                </div>
            `;
        }

        render() {
            let message;
            if (this.props.message) {
                message = html`<span>${this.props.message}</span>`;
            }
            return html`
                <div className="ProgressiveLoading">
                    <div className="-messageArea">
                        <span className="-message">${message}</span>
                        <span className="-spinner fa fa-spinner fa-pulse fa-2x fa-fw">
                        </span>
                        ${this.renderElapsed()}
                    </div>
                    ${this.renderInterval()}
                </div>
            `;
        }
    }

    return ProgressiveLoading;
});
