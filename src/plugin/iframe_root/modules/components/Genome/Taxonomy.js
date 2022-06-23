define([
    'preact',
    'htm',
    './Lineage',
    './LineageRE',
    './SpeciesTree',

    // For effect
    'css!./Taxonomy.css',
    'css!./common.css'
], (
    preact,
    htm,
    Lineage,
    LineageRE,
    SpeciesTree
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Taxonomy extends Component {
        render() {
            return html`
                <div className="container-fluid Genome Taxonomy" style=${{width: '100%'}}>
                    <div className="row">
                        <div className="col-md-4">
                            <h4>Lineage</h4>
                            <${Lineage}  ...${this.props} />
                        </div>
                        <div className="col-md-8">
                            <h4>Species Tree</h4>
                            <${SpeciesTree} ...${this.props}/>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    return Taxonomy;
});
