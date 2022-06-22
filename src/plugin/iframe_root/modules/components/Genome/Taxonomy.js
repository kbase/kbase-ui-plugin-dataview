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
        renderRELineage() {
            if (!(this.props.runtime.featureEnabled('re-lineage'))) {
                return;
            }
            return html`
            <div>
                 <h4>Lineage (RE)</h4>
                 <${LineageRE}  ...${this.props} />
            </div>
            `;
        }
        render() {
            return html`
                <div className="container-fluid Genome Taxonomy" style=${{width: '100%'}}>
                    <div className="row">
                        <div className="col-md-4">
                            ${this.renderRELineage()}
                            <h4>Lineage</h4>
                            <${Lineage}  
                                lineage=${this.props.genomeObject.data.taxonomy} 
                                scientificName=${this.props.genomeObject.data.scientific_name} />
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
