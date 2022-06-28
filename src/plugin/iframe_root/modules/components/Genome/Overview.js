define([
    'preact',
    'htm',
    './GenomeOverview',
    './GenomeWikipedia',

    // For effect
    'css!./Overview.css',
    'css!./common.css'
], (
    preact,
    htm,
    GenomeOverview,
    GenomeWikipedia
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Overview extends Component {
        render() {
            return html` 
            <div className="container-fluid Genome Overview" style=${{width: '100%'}}>
                <div className="row">
                    <section className="col-md-4">
                        <h4>Summary and Stats</h4>
                        <${GenomeOverview}  ...${this.props}/>
                    </section>
                    <section className="col-md-8">
                        <h4>From Wikipedia</h4>
                        <${GenomeWikipedia}  ...${this.props}/>
                    </section>
                </div>
            </div>`;
        }
    }
    return Overview;
});
