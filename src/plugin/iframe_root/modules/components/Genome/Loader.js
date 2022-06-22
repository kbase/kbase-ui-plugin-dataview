define([
    'preact',
    'htm',
    'kb_lib/jsonRpc/dynamicServiceClient',
    'components/ErrorView',
    'components/Loading',
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
                    included_fields: genome_fields.concat(['features'])
                }
            ]);
            return result.genomes[0];
        }

        async getStats(assemblyRef) {
            const genomeAnnotationAPI = new DynamicServiceClient({
                url: this.props.runtime.getConfig('services.service_wizard.url'),
                module: 'GenomeAnnotationAPI',
                auth: {
                    token: this.props.runtime.service('session').getAuthToken()
                }
            });
            const [result] = await genomeAnnotationAPI.callFunc('get_stats', [assemblyRef]);
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
                let domain = this.props.objectInfo.metadata.Domain;
                let genomeObject;
                if (!domain) {
                    // get prelim genome info
                    genomeObject = await this.getGenomeInfoWithoutFeatures();
                    domain = genomeObject.data.domain;
                }

                // Skip getting features for Euks and Plants
                if (domain === 'Eukaryota' || domain === 'Plant') {
                    console.log('BIG!');
                    // TODO: implement later
                }

                genomeObject = await this.getGenomeInfoWithFeatures();

                const genomeData = genomeObject.data;

                const genomeMetadata = genomeObject.info[10];

                const {
                    dna_size, gc_content, num_contigs
                } = genomeData;

                const stats = {
                    dna_size: dna_size || parseInt(genomeMetadata['Size'], 10),
                    gc_content: gc_content || parseFloat(genomeMetadata['GC content']),
                    num_contigs
                };

                if (genomeObject.data.features) {
                    stats.num_features = genomeObject.data.features.length;
                } else {
                    stats.num_features = parseInt(genomeMetadata['Number features'], 10);
                }

                if (!stats.num_contigs) {
                    if ('Number contigs' in genomeMetadata) {
                        stats.num_contigs = parseInt(genomeMetadata['Number contigs'], 10);
                    } else {
                        stats.num_contigs = genomeObject.data.contig_ids.length;
                    }
                }

                const isUndefined = (value) => {
                    return typeof value === 'undefined';
                };

                // Weirdly defensive. Does nothing work right at KBase??
                if (isUndefined(stats.dna_size) || isUndefined(stats.gc_content) || isUndefined(stats.num_contigs)) {
                    console.warn('Some or all stats not available in genome, trying stats...');
                    let assemblyRef;
                    if ('contigset_ref' in genomeData) {
                        assemblyRef = genomeData.contigset_ref;
                    } else if ('assembly_ref' in genomeData) {
                        assemblyRef = genomeData.assembly_ref;
                    } else {
                        throw new Error('No assembly reference present!');
                    }
                    const assemblyStats = await this.getStats(assemblyRef);
                    stats.dna_size = assemblyStats.dna_size;
                    stats.gc_content = assemblyStats.gc_content;
                    stats.num_contigs = assemblyStats.num_contigs;
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
                            message: ex.message
                        }
                    }
                });
            }
        }

        renderLoading() {
            return html`
                <${Loading} message="Loading Genome..." />
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
