/**
 * Shows general gene info.
 * Such as its name, synonyms, annotation, publications, etc.
 *
 * Gene "instance" info (e.g. coordinates on a particular strain's genome)
 * is in a different widget.
 */
define([
    'jquery',
    'uuid',
    'kb_common/html',
    'kb_service/utils',
    'kb_lib/jsonRpc/dynamicServiceClient',
    'lib/domUtils',
    'lib/jqueryUtils',

    // For Effect
    'kbaseUI/widget/legacy/widget',
    'widgets/genomes/kbaseGenomeWideOverview',
    'widgets/genomes/kbaseLitWidget',
    'widgets/genomes/kbaseGenomeWideTaxonomy',
    'widgets/genomes/kbaseGenomeWideAssemblyAnnotation'
], (
    $,
    Uuid,
    html,
    serviceUtils,
    DynamicServiceClient,
    {domSafeText},
    {$errorAlert}
) => {
    $.KBWidget({
        name: 'KBaseGenomePage',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            genomeID: null,
            workspaceID: null,
            ver: null
        },
        init(options) {
            this._super(options);
            this.init_view();
            this.fetchGenome();
            this.assemblyAPI = new DynamicServiceClient({
                url: this.runtime.getConfig('services.service_wizard.url'),
                module: 'AssemblyAPI',
                auth: {
                    token: this.runtime.service('session').getAuthToken()
                }
            });
            return this;
        },
        fetchGenome() {
            const _this = this;
            const scope = {
                ws: this.options.workspaceID,
                id: this.options.genomeID,
                ver: this.options.objectVersion
            };
            let objId = `${scope.ws}/${scope.id}`;
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

            this.genomeAnnotationAPI = new DynamicServiceClient({
                url: this.runtime.getConfig('services.service_wizard.url'),
                module: 'GenomeAnnotationAPI',
                auth: {
                    token: this.runtime.service('session').getAuthToken()
                }
            });

            if (this.options.objectVersion) {
                objId += `/${this.options.objectVersion}`;
            }
            this.genomeAnnotationAPI
                .callFunc('get_genome_v1', [
                    {
                        genomes: [{ref: objId}],
                        included_fields: genome_fields
                    }
                ])
                .spread((result) => {
                    const genomeObject = result.genomes[0];
                    let assembly_ref = null;
                    const gnm = genomeObject.data;
                    let metadata = genomeObject.info[10];
                    const add_stats = function (obj, size, gc, num_contigs) {
                            obj.dna_size = size;
                            obj.gc_content = gc;
                            obj.num_contigs = num_contigs;
                        },
                        assembly_error = function (data, error) {
                            console.error('Error loading contigset subdata', data, error);
                        };

                    if ('contigset_ref' in gnm) {
                        assembly_ref = gnm.contigset_ref;
                    } else if ('assembly_ref' in gnm) {
                        assembly_ref = gnm.assembly_ref;
                    } else {
                        // no assembly reference found, error
                        assembly_error(gnm, 'No assembly reference present!');
                    }

                    genomeObject.objectInfo = serviceUtils.objectInfoToObject(genomeObject.info);

                    // We avoid getting features for big genomes.
                    if (gnm.domain === 'Eukaryota' || gnm.domain === 'Plant') {
                        // TODO: DANGER: sortof relying upon metadata structure!
                        if (metadata && metadata['GC content'] && metadata['Size'] && metadata['Number contigs']) {
                            add_stats(gnm, metadata['Size'], metadata['GC content'], metadata['Number contigs']);
                            _this.render(genomeObject);
                        } else {
                            return (
                                _this.assemblyAPI
                                    .callFunc('get_stats', [assembly_ref])
                                    // .get_stats(assembly_ref)
                                    .spread((stats) => {
                                        add_stats(gnm, stats.dna_size, stats.gc_content, stats.num_contigs);
                                        _this.render(genomeObject);
                                        return null;
                                    })
                                    .catch((error) => {
                                        assembly_error(gnm, error);
                                    })
                            );
                        }
                        return null;
                    }
                    genome_fields.push('features');
                    // we do a second call here to get the features, see above.
                    _this.genomeAnnotationAPI
                        .callFunc('get_genome_v1', [
                            {
                                genomes: [{ref: objId}],
                                included_fields: genome_fields,
                                included_feature_fields: feature_fields
                            }
                        ])
                        .spread((data) => {
                            const features = data.genomes[0].data.features;
                            genomeObject.data.features = features;
                            metadata = genomeObject.info[10];

                            // This stuff is duplicated from above -- they can be combined.

                            if (
                                metadata &&
                                    metadata['GC content'] &&
                                    metadata['Size'] &&
                                    metadata['Number contigs']
                            ) {
                                add_stats(
                                    gnm,
                                    metadata['Size'],
                                    metadata['GC content'],
                                    metadata['Number contigs']
                                );
                                _this.render(genomeObject);
                            } else if (!('dna_size' in gnm)) {
                                return (
                                    _this.assemblyAPI
                                        .callFunc('get_stats', [assembly_ref])
                                    // .get_stats(assembly_ref)
                                        .spread((stats) => {
                                            add_stats(gnm, stats.dna_size, stats.gc_content, stats.num_contigs);
                                            _this.render(genomeObject);
                                        })
                                        .catch((error) => {
                                            assembly_error(gnm, error);
                                        })
                                );
                            } else {
                                _this.render(genomeObject);
                            }

                            return null;
                        })
                        .catch((error) => {
                            _this.showError(_this.view.panels[0].inner_div, error);
                        });
                    return null;
                })
                .catch((error) => {
                    _this.showError(_this.view.panels[0].inner_div, error, 'Error loading genome subdata');
                    _this.view.panels[1].inner_div.empty();
                    _this.view.panels[2].inner_div.empty();
                    _this.view.panels[3].inner_div.empty();
                });
        },
        fetchAssembly(genomeInfo, callback) {
            let assembly_ref = null;
            const gnm = genomeInfo.data;

            if ('contigset_ref' in gnm) {
                assembly_ref = gnm.contigset_ref;
            } else if ('assembly_ref' in gnm) {
                assembly_ref = gnm.assembly_ref;
            }

            this.assemblyAPI
                .callFunc('get_contig_ids', [assembly_ref])
                .spread((contig_ids) => {
                    Object.defineProperties(gnm, {
                        contig_ids: {
                            __proto__: null,
                            value: contig_ids,
                            writable: false,
                            enumerable: true
                        }
                    });
                    return this.assemblyAPI
                        .callFunc('get_contig_lengths', [assembly_ref, contig_ids])
                        .spread((contig_lengths) => {
                            Object.defineProperties(gnm, {
                                contig_lengths: {
                                    __proto__: null,
                                    value: contig_lengths,
                                    writable: false,
                                    enumerable: true
                                }
                            });

                            callback(genomeInfo);
                            return null;
                        })
                        .catch((error) => {
                            this.showError(this.view.panels[3].inner_div, error);
                        });
                })
                .catch((error) => {
                    this.showError(this.view.panels[3].inner_div, error);
                });
        },
        init_view() {
            const cell_html = '<div>';
            const body = '<div data-element="body">';

            this.view = {
                panels: [
                    {
                        label: 'Overview',
                        name: 'overview',
                        outer_div: $(cell_html),
                        inner_div: $(body)
                    },
                    {
                        order: 2,
                        label: 'Publications',
                        name: 'publications',
                        outer_div: $(cell_html),
                        inner_div: $(body)
                    },
                    {
                        order: 3,
                        label: 'Taxonomy',
                        name: 'taxonomy',
                        outer_div: $(cell_html),
                        inner_div: $(body)
                    },
                    {
                        order: 4,
                        label: 'Assembly and Annotation',
                        name: 'assembly-annotation',
                        outer_div: $(cell_html),
                        inner_div: $(body)
                    }
                ]
            };
            const that = this;
            this.view.panels.forEach((panel) => {
                that.makeWidgetPanel(panel.outer_div, panel.label, panel.name, panel.inner_div);
                // xss safe
                that.$elem.append(panel.outer_div);
                // xss safe usage of html
                panel.inner_div.html(html.loading('Loading...'));
            });
        },
        render(genomeInfo) {
            const _this = this,
                scope = {
                    ws: this.options.workspaceID,
                    id: this.options.genomeID,
                    ver: this.options.objectVersion
                },
                panelError = (p, e) => {
                    _this.showError(p, e);
                };

            _this.view.panels[0].inner_div.empty();
            try {
                _this.view.panels[0].inner_div.KBaseGenomeWideOverview({
                    genomeID: scope.id,
                    workspaceID: scope.ws,
                    genomeInfo,
                    runtime: _this.runtime
                });
            } catch (e) {
                panelError(_this.view.panels[0].inner_div, e);
            }

            let searchTerm = '';
            if (genomeInfo && genomeInfo.data['scientific_name']) {
                searchTerm = genomeInfo.data['scientific_name'];
            }
            _this.view.panels[1].inner_div.empty();
            try {
                _this.view.panels[1].inner_div.KBaseLitWidget({
                    literature: searchTerm,
                    genomeInfo,
                    runtime: _this.runtime
                });
            } catch (e) {
                panelError(_this.view.panels[1].inner_div, e);
            }

            /*
            _this.view.panels[2].inner_div.empty();
            try {
                _this.view.panels[2].inner_div.KBaseGenomeWideCommunity({genomeID: scope.id, workspaceID: scope.ws, kbCache: kb, genomeInfo: genomeInfo});
            }
            catch (e) {
                panelError(_this.view.panels[2].inner_div, e);
            }
            */

            _this.view.panels[2].inner_div.empty();
            try {
                _this.view.panels[2].inner_div.KBaseGenomeWideTaxonomy({
                    genomeID: scope.id,
                    workspaceID: scope.ws,
                    genomeRef: scope,
                    genomeInfo,
                    runtime: _this.runtime
                });
            } catch (e) {
                panelError(_this.view.panels[2].inner_div, e);
            }

            if (
                (genomeInfo && genomeInfo.data['domain'] === 'Eukaryota') ||
                (genomeInfo && genomeInfo.data['domain'] === 'Plant')
            ) {
                // xss safe
                _this.view.panels[3].inner_div.html(
                    'Browsing Eukaryotic Genome Features is not supported at this time.'
                );
            } else {
                const gnm = genomeInfo.data,
                    assembly_callback = function (genomeInfo) {
                        _this.view.panels[3].inner_div.empty();
                        try {
                            _this.view.panels[3].inner_div.KBaseGenomeWideAssemAnnot({
                                genomeID: scope.id,
                                workspaceID: scope.ws,
                                ver: scope.ver,
                                genomeInfo,
                                runtime: _this.runtime
                            });
                        } catch (e) {
                            panelError(_this.view.panels[3].inner_div, e);
                        }
                    };

                if (gnm.contig_ids && gnm.contig_lengths && gnm.contig_ids.length === gnm.contig_lengths.length) {
                    assembly_callback(genomeInfo);
                } else {
                    _this.fetchAssembly(genomeInfo, assembly_callback);
                }
            }
        },
        // TODO: This is
        makeWidgetPanel($panel, title, name, $widgetDiv) {
            const id = new Uuid(4).format();
            // xss safe
            $panel.append(
                $(
                    `<div class="panel-group" id="accordion_${
                        id
                    }" role="tablist" aria-multiselectable="true" data-panel="${
                        domSafeText(name)
                    }">`
                )
                    // xss safe
                    .append(
                        $('<div class="panel panel-default kb-widget">')
                            // xss safe
                            .append(
                                '' +
                                    `<div class="panel-heading" role="tab" id="heading_${
                                        id
                                    }">` +
                                    '<h4 class="panel-title">' +
                                    `<span data-toggle="collapse" data-parent="#accordion_${
                                        id
                                    }" data-target="#collapse_${
                                        id
                                    }" aria-expanded="false" aria-controls="collapse_${
                                        id
                                    }" style="cursor:pointer;" data-element="title">` +
                                    ` ${domSafeText(title)}</span>` +
                                    '</h4>' +
                                    '</div>'
                            )
                            // xss safe
                            .append(
                                $(
                                    `<div id="collapse_${
                                        id
                                    }" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading_${
                                        id
                                    }" area-expanded="true">`
                                )
                                    // xss safe
                                    .append($('<div class="panel-body">').append($widgetDiv))
                            )
                    )
            );
        },
        getData() {
            return {
                type: 'Genome Page',
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: 'Genome Page'
            };
        },
        showError(panel, error, title) {
            if (title) {
                console.error(title);
            }
            console.error(error);
            panel.html($errorAlert(error, title));
        }
    });
});
