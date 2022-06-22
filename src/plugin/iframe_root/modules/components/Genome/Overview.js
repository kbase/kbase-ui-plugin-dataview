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
                    <div className="col-md-4">
                        <h4>Genome</h4>
                        <${GenomeOverview}  ...${this.props}/>
                    </div>
                    <div className="col-md-8">
                        <h4>From Wikipedia</h4>
                        <${GenomeWikipedia}  ...${this.props}/>
                    </div>
                </div>
            </div>`;
        }
    }
    return Overview;
});
