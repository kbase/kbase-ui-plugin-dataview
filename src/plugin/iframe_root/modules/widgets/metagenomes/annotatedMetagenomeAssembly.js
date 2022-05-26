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
    'kb_service/client/workspace',
    'kb_service/utils',
    'kb_lib/jsonRpc/dynamicServiceClient',
    'kbaseUI/widget/legacy/widget',
    'widgets/metagenomes/annotatedMetagenomeAssemblyWideOverview',
    'widgets/metagenomes/annotatedMetagenomeAssembly_AssemblyandAnnotationTab'
], ($, Uuid, html, Workspace, serviceUtils, DynamicServiceClient) => {
    $.KBWidget({
        name: 'AnnotatedMetagenomeAssembly',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            metagenomeId: null,
            workspaceId: null,
            objectVersion: null
        },
        init(options) {
            this._super(options);
            this.init_view();
            this.fetchMetagenome();
            this.assemblyAPI = new DynamicServiceClient({
                url: this.runtime.getConfig('services.service_wizard.url'),
                module: 'AssemblyAPI',
                auth: {
                    token: this.runtime.service('session').getAuthToken()
                }
            });
            return this;
        },
        fetchMetagenome() {
            const _this = this,
                scope = {
                    ws: this.options.workspaceId,
                    id: this.options.objectId,
                    ver: this.options.objectVersion
                },
                metagenome_fields = [
                    'dna_size',
                    'source_id',
                    'genetic_code',
                    'taxonomy',
                    'genetic_code',
                    'assembly_ref',
                    'gc_content',
                    'environment'
                ];

            let objId = `${scope.ws  }/${  scope.id}`;

            // disabled, not used
            // feature_fields = ['type', 'id', 'contig_id', 'location', 'function', 'functions'];

            this.metagenomeAPI = new DynamicServiceClient({
                url: this.runtime.getConfig('services.service_wizard.url'),
                module: 'MetagenomeAPI',
                auth: {
                    token: this.runtime.service('session').getAuthToken()
                },
                version: 'dev'
            });

            if (this.options.objectVersion) {
                objId += `/${this.options.objectVersion}`;
            }

            this.metagenomeAPI
                .callFunc('get_annotated_metagenome_assembly', [
                    {
                        ref: objId,
                        included_fields: metagenome_fields
                    }
                ])
                .spread((result) => {
                    const metagenomeObject = result.genomes[0];
                    let assembly_ref = null;
                    const metagenome = metagenomeObject.data;
                    const metadata = metagenomeObject.info[10];
                    const add_stats = function (obj, size, gc, num_contigs) {
                            obj.dna_size = size;
                            obj.gc_content = gc;
                            obj.num_contigs = num_contigs;
                        },
                        assembly_error = function (data, error){
                            console.error('Error loading contigset subdata', data, error);
                        };
                    if (Object.prototype.hasOwnProperty.call(metagenome, 'assembly_ref')) {
                        assembly_ref = metagenome.assembly_ref;
                    } else {
                        assembly_error(metagenome, 'No assembly reference present!');
                    }

                    metagenomeObject.objectInfo = serviceUtils.objectInfoToObject(metagenomeObject.info);

                    if (metadata && metadata['gc_content'] && metadata['size'] && metadata['Number contigs']) {
                        add_stats(metagenome, metadata['size'], metadata['GC content'], metadata['Number contigs']);
                        _this.render(metagenomeObject);
                    } else {
                        return (
                            _this.assemblyAPI
                                .callFunc('get_stats', [assembly_ref])
                                .spread((stats) => {
                                    add_stats(metagenome, stats.dna_size, stats.gc_content, stats.num_contigs);
                                    _this.render(metagenomeObject);
                                    return null;
                                })
                                .catch((error) => {
                                    assembly_error(metagenome, error);
                                })
                        );
                    }
                    return null;
                })
                .catch((error) => {
                    console.error('Error loading genome subdata');
                    console.error(error);
                    _this.showError(_this.view.panels[0].inner_div, error);
                    _this.view.panels[1].inner_div.empty();
                    _this.view.panels[2].inner_div.empty();
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
                that.$elem.append(panel.outer_div);
                // safe
                panel.inner_div.html(html.loading('Loading...'));
            });
        },
        render(genomeInfo) {
            const _this = this,
                scope = {
                    ws: this.options.workspaceID,
                    id: this.options.metagenomeID,
                    ver: this.options.ver
                },
                panelError = function (p, e) {
                    console.error(e);
                    _this.showError(p, e.message);
                };

            _this.view.panels[0].inner_div.empty();
            try {
                _this.view.panels[0].inner_div.annotatedMetagenomeAssemblyWideOverview({
                    metagenomeID: scope.id,
                    workspaceID: scope.ws,
                    genomeInfo,
                    runtime: _this.runtime
                });
            } catch (e) {
                panelError(_this.view.panels[0].inner_div, e);
            }
            _this.view.panels[1].inner_div.empty();
            try {
                _this.view.panels[1].inner_div.KBaseAnnotatedMetagenomeAssemblyWideAssemAnnot({
                    genomeID: scope.id,
                    workspaceID: scope.ws,
                    ver: scope.ver,
                    genomeInfo,
                    runtime: _this.runtime
                });
            } catch (e){
                panelError(_this.view.panels[1].inner_div, e);
            }

            // _this.view.panels[1].inner_div.empty();
            // _this.view.panels[1].inner_div.append(
            //     'Browsing Metagenome Features is not supported at this time. Coming soon!'
            // );
        },
        // TODO: This is
        makeWidgetPanel($panel, title, name, $widgetDiv) {
            const id = new Uuid(4).format();
            $panel.append(
                $(
                    `<div class="panel-group" id="accordion_${
                        id
                    }" role="tablist" aria-multiselectable="true" data-panel="${
                        name
                    }">`
                ).append(
                    $('<div class="panel panel-default kb-widget">')
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
                                ` ${
                                    title
                                }</span>` +
                                '</h4>' +
                                '</div>'
                        )
                        .append(
                            $(
                                `<div id="collapse_${
                                    id
                                }" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading_${
                                    id
                                }" area-expanded="true">`
                            ).append($('<div class="panel-body">').append($widgetDiv))
                        )
                )
            );
        },
        getData() {
            return {
                type: 'Annotated Metagenome Assembly Page',
                id: this.options.metagenomeID,
                workspace: this.options.workspaceID,
                title: 'Annotated Metagenome Assembly Page'
            };
        },
        showError(panel, e) {
            panel.empty();
            const $err = $('<div>')
                .addClass('alert alert-danger')
                .append(
                    $('<div>')
                        .addClass('text-danger')
                        .css('font-weight', 'bold')
                        .text('Error')
                )
                .append($('<p>').text(JSON.stringify(e.message)))
                .append($('<div>').text(JSON.stringify(e)));
            panel.append($err);
        }
    });
});
