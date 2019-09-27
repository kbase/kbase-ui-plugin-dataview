/**
 * Shows taxonomic lineage.
 *
 */
define(['jquery', 'uuid', 'kb_lib/html', 'kb_lib/jsonRpc/dynamicServiceClient', 'kbaseUI/widget/legacy/widget'], function ($, Uuid, html, DynamicServiceClient) {
    'use strict';

    const t = html.tag;
    const a = t('a');
    const div = t('div');
    const span = t('span');
    const table = t('table');
    const tr = t('tr');
    const th = t('th');
    const td = t('td');

    $.KBWidget({
        name: 'KBaseGenomeRELineage',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            width: 600,
            genomeInfo: null,
            genomeID: null
        },
        genome: null,
        token: null,
        uniqueId: null,

        init: function (options) {
            this._super(options);
            if (!this.options.genomeInfo) {
                this.renderError('Genome information not supplied');
                return;
            }
            this.genome = options.genomeInfo.data;
            this.genomeID = options.genomeID;

            this.uniqueId = new Uuid(4).format();

            this.render();
            return this;
        },

        renderLineageTable(lineage) {
            this.$elem.empty().append(
                table(
                    {
                        class: 'table table-bordered'
                    },
                    [
                        tr([
                            th(
                                {
                                    style: {
                                        width: '11em'
                                    }
                                },
                                'Scientific Name'
                            ),
                            td(
                                {
                                    dataField: 'scientific-name',
                                    style: {
                                        fontStyle: 'italic'
                                    }
                                },
                                this.genome.scientific_name
                            )
                        ]),
                        tr([th('Taxonomic Lineage'), td(this.buildLineage(lineage))])
                    ]
                )
            );
        },

        fetchRELineage: function (genomeRef) {
            const taxonomyAPI = new DynamicServiceClient({
                url: this.runtime.config('services.service_wizard.url'),
                module: 'taxonomy_re_api',
                token: this.runtime.service('session').getAuthToken()
            });
            const timestamp = Date.now();

            return taxonomyAPI.callFunc('get_taxon_from_ws_obj', [{
                obj_ref: genomeRef,
                ns: 'ncbi_taxonomy',
                ts: timestamp
            }])
                .then(([result]) => {
                    if (result.results.length === 0) {
                        throw new Error('No taxon found for this object');
                    }
                    const [taxon] = result.results;
                    const namespace = taxon.ns;
                    const taxonID = taxon.id;
                    const ts = result.ts;
                    return taxonomyAPI.callFunc('get_lineage', [{
                        ns: namespace,
                        id: taxonID,
                        ts
                    }]);
                })
                .then(([result]) => {
                    const lineage = result.results;
                    this.renderLineageTable(lineage);
                });
        },


        buildLineage: function (lineage) {
            // Trim off the "root" which is always at the top of the lineage.
            lineage = lineage.slice(1);
            return div(
                {
                    style: {
                        whiteSpace: 'nowrap',
                        overflowX: 'auto'
                    }
                },
                lineage.map((taxon) => {
                    const link = `/#review/taxonomy/${taxon.ns}/${taxon.id}`;
                    return div(
                        a(
                            {
                                href: link,
                                target: '_blank'
                            },
                            taxon.scientific_name
                        )
                    );
                })
            );
        },

        renderLoading: function () {
            this.$elem.empty();
            this.$elem.append(div({
                style: {
                    textAlign: 'left',
                    marginBottom: '10px',
                    color: 'rgba(150, 150, 150, 1)'
                }
            }, [
                span({
                    class: 'fa fa-spinner fa-pulse'
                }),
                span({
                    style: {
                        marginLeft: '4px'
                    }
                }, 'Loading lineage...')
            ]));
        },

        renderError: function (error) {
            var errorMessage;
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error.error && error.error.message) {
                errorMessage = error.error.message;
            } else {
                errorMessage = 'Sorry, an unknown error occurred';
            }

            var errorAlert = div(
                {
                    class: 'alert alert-danger'
                },
                [
                    span(
                        {
                            textWeight: 'bold'
                        },
                        'Error: '
                    ),
                    span(errorMessage)
                ]
            );
            this.$elem.empty();
            this.$elem.append(errorAlert);
        },

        render: function () {
            const {ws, id, ver} = this.options.genomeRef;
            const genomeRef = [ws, id, ver].join('/');
            this.renderLoading();
            this.fetchRELineage(genomeRef)
                .catch((err) => {
                    console.error('ERROR', err);
                    this.renderError('Error fetching lineage: ' + err.message);
                });
        },

    });
});
