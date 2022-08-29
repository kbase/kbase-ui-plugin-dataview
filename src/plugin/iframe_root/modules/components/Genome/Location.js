define([
    'preact',
    'htm',
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Location extends Component {
        renderLocation(locations) {
            if (locations.length === 0) {
                return 'Unknown';
            }

            return locations.map((location, index) => {
                const [contigId, start, direction, length] = location;
                console.log('loc', contigId, start, direction, length)

                const end = (() => {
                    if (direction === '+') {
                        return start + length - 1;
                    } else {
                        return start - length + 1;
                    }
                })();
                return html`<div key=${index}>
                    ${Intl.NumberFormat('en-US', {useGrouping: true}).format(start)} 
                    ${' '}to${' '}
                    ${Intl.NumberFormat('en-US', {useGrouping: true}).format(end)} 
                    ${' '}
                    (${direction})
                </div>`;
            });
        }
       
        render() {
            const location = this.props.location;
            if (!location) {
                return 'n/a';
            }
            return this.renderLocation(this.props.location);
        }
    }
    return Location;
});
