define([
    'preact',
    'htm',
    'kb_common/jsonRpc/dynamicServiceClient',
    'components/Loading',
    './LineageLegacy',
    './LineageRE',
], (
    preact,
    htm,
    DynamicServiceClient,
    Loading,
    LineageLegacy,
    LineageRE
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Lineage extends Component {
        constructor(props) {
            super(props);
            this.state = {
                status: 'NONE'
            };
        }

        componentDidMount() {
            this.fetchRELineage();
        }

        async fetchRELineage() {
            const {wsid, id, version} = this.props.objectInfo;
            const genomeRef = [wsid, id, version].join('/');
            const taxonomyAPI = new DynamicServiceClient({
                url: this.props.runtime.config('services.service_wizard.url'),
                module: 'taxonomy_re_api',
                token: this.props.runtime.service('session').getAuthToken()
            });
            // let timestamp = this.options.timestamp;
            // console.warn('ts?', timestamp, Date.now());
            // TODO: important, remove the following line after the demo! Currently things
            //       break due to the database being incomplete, so there is not complete
            //       coverage over time, and queries which should never fail, do.
            // TODO: the actual timestamp should be ... based on the timestamp associated
            //       with ... the taxon linked to the object?
            //            ... the time the taxon was linked to the object?
            const timestamp = this.props.timestamp || Date.now();

            // TODO: resolve the usage of 'ts' in 'get_taxon...'. It should not be necessary
            // since the taxon assignment to an object is not dependent upon some reference time,
            // it is fixed in that respect.
            try {
                const [result] = await taxonomyAPI.callFunc('get_taxon_from_ws_obj', [{
                    obj_ref: genomeRef,
                    ns: 'ncbi_taxonomy'
                }]);

                if (result.results.length === 0) {
                    // throw new Error('No taxon found for this object');
                    // return null;
                    // fallback
                    if (this.props.genomeObject.data.lineage &&
                        this.props.genomeObject.data.lineage.length) {
                        this.setState({
                            status: 'ERROR',
                            message: 'No lineage for this Genome'
                        });
                        return;
                    }
                    this.setState({
                        status: 'SUCCESS',
                        value: {
                            type: 'workspace',
                            lineage: this.props.genomeObject.data.taxonomy,
                            scientificName: this.props.genomeObject.data.scientific_name
                        }
                    });
                    return;
                }
                const [{ns, id}] = result.results;
                const taxonRef = {
                    ns, id, ts: timestamp
                };
                const [[{results: lineage}], [{results: [taxon]}]] = await Promise.all([
                    taxonomyAPI.callFunc('get_lineage', [taxonRef]),
                    taxonomyAPI.callFunc('get_taxon', [taxonRef])
                ]);

                if (!taxon) {
                    // return null;
                    throw new Error('Taxon not found');
                }
                const {scientific_name: scientificName} = taxon;
                // return {lineage, taxonRef, scientificName};
                this.setState({
                    status: 'SUCCESS',
                    value: {type: 'relationEngine', lineage, taxonRef, scientificName}
                });
            } catch (ex) {
                console.error(ex);
                this.setState({
                    status: 'ERROR',
                    error: {
                        message: ex.message
                    }
                });
            }
        }

        renderSuccess() {
            switch (this.state.value.type) {
            case 'relationEngine':
                return html`
                    <div>
                        <p>Taxonomy derived from Relation Engine.</p>
                        <${LineageRE} ...${this.state.value} />
                    </div>
                `;
            case 'workspace':
                return html`
                    <div>
                        <p>Taxonomy derived from this Object.</p>
                        <${LineageLegacy} ...${this.state.value} />
                    </div>
                `;
            }
        }

        renderLoading() {
            return html`
                <${Loading} message="Loading taxonomy..." />
            `;
        }

        renderError(error) {
            return html`
                <div className="alert alert-danger">
                    ${error.message}
                </div>
            `;
        }

        render() {
            switch (this.state.status) {
            case 'NONE':
            case 'PENDING':
                return this.renderLoading();
            case 'ERROR':
                return this.renderError(this.state.error);
            case 'SUCCESS':
                return this.renderSuccess(this.state.value);
            }

        }
    }
    return Lineage;
});
