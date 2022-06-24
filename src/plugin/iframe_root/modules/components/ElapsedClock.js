define([
    'preact',
    'htm'
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class ElapsedClock extends Component {
        niceDuration(value, options) {
            options = options || {};
            const minimized = [];
            const units = [{
                unit: 'millisecond',
                short: 'ms',
                single: 'm',
                size: 1000
            }, {
                unit: 'second',
                short: 'sec',
                single: 's',
                size: 60
            }, {
                unit: 'minute',
                short: 'min',
                single: 'm',
                size: 60
            }, {
                unit: 'hour',
                short: 'hr',
                single: 'h',
                size: 24
            }, {
                unit: 'day',
                short: 'day',
                single: 'd',
                size: 30
            }];
            let temp = Math.abs(value);
            const parts = units
                .map((unit) => {
                // Get the remainder of the current value
                // sans unit size of it composing the next
                // measure.
                    const unitValue = temp % unit.size;
                    // Recompute the measure in terms of the next unit size.
                    temp = (temp - unitValue) / unit.size;
                    return {
                        name: unit.single,
                        unit: unit.unit,
                        value: unitValue
                    };
                }).reverse();

            parts.pop();

            // We skip over large units which have not value until we
            // hit the first unit with value. This effectively trims off
            // zeros from the end.
            // We also can limit the resolution with options.resolution
            let keep = false;
            for (let i = 0; i < parts.length; i += 1) {
                if (!keep) {
                    if (parts[i].value > 0) {
                        keep = true;
                        minimized.push(parts[i]);
                    }
                } else {
                    minimized.push(parts[i]);
                    if (options.resolution &&
                    options.resolution === parts[i].unit) {
                        break;
                    }
                }
            }

            if (minimized.length === 0) {
            // This means that there is are no time measurements > 1 second.
                return '<1s';
            }
            // Skip seconds if we are into the hours...
            // if (minimized.length > 2) {
            //     minimized.pop();
            // }
            return minimized.map((item) => {
                return String(item.value) + item.name;
            })
                .join(' ');

        }

        render() {
            return this.niceDuration(this.props.elapsed);
        }
    }
    return ElapsedClock;
});
