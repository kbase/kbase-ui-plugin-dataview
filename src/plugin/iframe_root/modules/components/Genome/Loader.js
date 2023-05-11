define([
    'preact',
    'htm',
    'kb_lib/jsonRpc/dynamicServiceClient',
    'components/ErrorView',
    'components/ProgressiveLoading',
    './Genome'
], (
    preact,
    htm,
    DynamicServiceClient,
    ErrorView,
    Loading,
    Genome
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    const genome_fields = [
        'contigset_ref',
        'assembly_ref',
        'domain',
        'dna_size',
        'scientific_name',
        'source',
        'source_id',
        'genetic_code',
        'id',
        'contig_ids',
        'contig_lengths',
        'gc_content',
        'taxonomy'
    ];
    const feature_fields = ['type', 'id', 'contig_id', 'location', 'function', 'functions'];

    class Loader extends Component {
        constructor(props) {
            super(props);
            this.state = {
                genomeInfo: {
                    status: 'NONE'
                }
            };
        }

        componentDidMount() {
            this.loadGenome();
        }

        async getGenomeInfoWithoutFeatures() {
            this.genomeAnnotationAPI = new DynamicServiceClient({
                url: this.props.runtime.getConfig('services.service_wizard.url'),
                module: 'GenomeAnnotationAPI',
                auth: {
                    token: this.props.runtime.service('session').getAuthToken()
                }
            });
            const [result] = await this.genomeAnnotationAPI.callFunc('get_genome_v1', [
                {
                    genomes: [{ref: this.props.objectInfo.ref}],
                    included_fields: genome_fields
                }
            ]);
            return result.genomes[0];
        }

        async getGenomeInfoWithFeatures() {
            const genomeAnnotationAPI = new DynamicServiceClient({
                url: this.props.runtime.getConfig('services.service_wizard.url'),
                module: 'GenomeAnnotationAPI',
                auth: {
                    token: this.props.runtime.service('session').getAuthToken()
                }
            });
            const [result] = await genomeAnnotationAPI.callFunc('get_genome_v1', [
                {
                    genomes: [{ref: this.props.objectInfo.ref}],
                    included_fields: genome_fields.concat(['features']),
                    included_feature_fields: feature_fields
                }
            ]);
            return result.genomes[0];
        }

        async getStats(assemblyRef) {
            const assemblyAPI = new DynamicServiceClient({
                url: this.props.runtime.getConfig('services.service_wizard.url'),
                module: 'AssemblyAPI',
                auth: {
                    token: this.props.runtime.service('session').getAuthToken()
                }
            });
            const [result] = await assemblyAPI.callFunc('get_stats', [assemblyRef]);
            return result;
        }

        async loadGenome() {
            this.setState({
                genomeInfo: {
                    status: 'PENDING'
                }
            });
            try {
                // We need the domain, so if it isn't in the metadata, get
                // the genome info w/o features, in case it is a large genome.
                const genomeMetadata = this.props.objectInfo.metadata;

                const genomeObject = await (async () => {
                    let domain = genomeMetadata.Domain;
                    let genomeObject;
                    if (!domain) {
                        // get prelim genome info
                        genomeObject = await this.getGenomeInfoWithoutFeatures();
                        domain = genomeObject.data.domain;
                    }

                    if (domain === 'Eukaryota' || domain === 'Plant') {
                        if (genomeObject) {
                            return genomeObject;
                        }
                        return this.getGenomeInfoWithoutFeatures();
                    }

                    return this.getGenomeInfoWithFeatures();
                })();

                // Get stats

                const getIntValue  = (value, genomeMetadata, key) => {
                    if (typeof value !== 'number' &&  (key in genomeMetadata)) {
                        value = parseInt(genomeMetadata[key], 10);
                    }

                    if (isNaN(value)) {
                        return null;
                    }
                    return value;
                };

                const getFloatValue  = (value, genomeMetadata, key) => {
                    if (typeof value !== 'number' &&  (key in genomeMetadata)) {
                        value = parseFloat(genomeMetadata[key]);
                    }

                    if (isNaN(value)) {
                        return null;
                    }
                    return value;
                };

                const {
                    dna_size, gc_content, num_contigs
                } = genomeObject.data;

                const stats = {
                    dna_size: getIntValue(dna_size, genomeMetadata, 'Size'),
                    gc_content: getFloatValue(gc_content, genomeMetadata, 'GC content'),
                    num_contigs: getIntValue(num_contigs, genomeMetadata, 'Number contigs')
                };

                // Add in features if available (should be for non-Euk, non-Plant)
                if (genomeObject.data.features) {
                    stats.num_features = genomeObject.data.features.length;
                } else {
                    const genomeMetadata = genomeObject.info[10];
                    stats.num_features = parseInt(genomeMetadata['Number features'], 10);
                }

                const isUndefined = (value) => {
                    return typeof value === 'undefined';
                };

                // Weirdly defensive. Does nothing work right at KBase??
                stats.dna_size = undefined;
                if (isUndefined(stats.dna_size) || isUndefined(stats.gc_content) || isUndefined(stats.num_contigs)) {
                    console.warn('Some or all stats not available in genome, trying stats...');
                    let assemblyRef;
                    if ('contigset_ref' in genomeObject.data) {
                        assemblyRef = genomeObject.data.contigset_ref;
                    } else if ('assembly_ref' in genomeObject.data) {
                        assemblyRef = genomeObject.data.assembly_ref;
                    } else {
                        console.warn('And no contigset or assembly ref available; some stats will be missing');
                    }
                    if (assemblyRef) {
                        const assemblyRefChain = [this.props.objectInfo.ref, assemblyRef].join(';')
                        const assemblyStats = await this.getStats(assemblyRefChain);
                        stats.dna_size = assemblyStats.dna_size;
                        stats.gc_content = assemblyStats.gc_content;
                        stats.num_contigs = assemblyStats.num_contigs;
                    }
                }

                this.setState({
                    genomeInfo: {
                        status: 'SUCCESS',
                        value: {
                            genomeObject,
                            stats
                        }
                    }
                });
            } catch (ex) {
                console.error(ex);
                this.setState({
                    genomeInfo: {
                        status: 'ERROR',
                        error: {
                            message: `There was an error loading this Genome: ${ex.message}` 
                        }
                    }
                });
            }
        }

        renderLoading() {
            const intervals = [{
                elapsed: 5000,
                message: 'Genomes can take some time to load, working on it...',
                type: 'info'
            }, {
                elapsed: 15000,
                message: 'This is taking longer than it should, working on it',
                type: 'warning'
            }, {
                elapsed: 30000,
                message: 'This is taking a while, but it is still loading',
                type: 'warning'
            }, {
                elapsed: 45000,
                message: 'This genome is taking a long time to load, the system wll cancel the request at 60s.',
                type: 'danger'
            }];
            return html`
                <${Loading} message="Loading Genome..." intervals=${intervals}/>
            `;
        }

        renderError(error) {
            return html`
                <div className="alert alert-danger">
                    ${error.message}
                </div>
            `;
        }

        renderSuccess(value) {
            return html`<${Genome} ...${this.props} ...${value}/>`;
        }

        renderState() {
            switch (this.state.genomeInfo.status) {
            case 'NONE':
            case 'PENDING':
                return this.renderLoading();
            case 'ERROR':
                return this.renderError(this.state.genomeInfo.error);
            case 'SUCCESS':
                return this.renderSuccess(this.state.genomeInfo.value);
            }
        }

        render() {
            return this.renderState();
        }
    }
    return Loader;
});
