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
            genomeID: null,
            timestamp: null
        },
        genome: null,
        token: null,

        init: function (options) {
            this._super(options);
            if (!this.options.genomeInfo) {
                this.renderError('Genome information not supplied');
                return;
            }
            this.genome = options.genomeInfo.data;
            this.genomeID = options.genomeID;

            this.render();
            return this;
        },

        renderLineageTable({lineage, taxonRef, scientificName}) {
            const taxonURL = `/#taxonomy/taxon/${taxonRef.ns}/${taxonRef.id}/${taxonRef.ts}`;
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
                                a(
                                    {
                                        href: taxonURL,
                                        target: '_blank'
                                    },
                                    scientificName
                                )
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
            let timestamp = this.options.timestamp;
            // console.warn('ts?', timestamp, Date.now());
            // TODO: important, remove the following line after the demo! Currently things
            //       break due to the database being incomplete, so there is not complete
            //       coverage over time, and queries which should never fail, do.
            // TODO: the actual timestamp should be ... based on the timestamp associated
            //       with ... the taxon linked to the object?
            //            ... the time the taxon was linked to the object?
            timestamp = Date.now();

            // TODO: resolve the usage of 'ts' in 'get_taxon...'. It should not be necessary
            // since the taxon assignment to an object is not dependent upon some reference time,
            // it is fixed in that respect.
            return taxonomyAPI.callFunc('get_taxon_from_ws_obj', [{
                obj_ref: genomeRef,
                ns: 'ncbi_taxonomy'
            }])
                .then(([result]) => {
                    if (result.results.length === 0) {
                        // throw new Error('No taxon found for this object');
                        return null;
                    }
                    const [taxon] = result.results;
                    const taxonRef = {
                        ns: taxon.ns,
                        id: taxon.id,
                        ts: timestamp
                    };
                    return Promise.all([
                        taxonomyAPI.callFunc('get_lineage', [taxonRef]),
                        taxonomyAPI.callFunc('get_taxon', [taxonRef])
                    ])
                        .then(([[{results: lineage}], [{results: [taxon]}]]) => {
                            if (!taxon) {
                                return null
                                // throw new Error('Taxon not found');
                            }
                            const {scientific_name: scientificName} = taxon;
                            return {lineage, taxonRef, scientificName};

                        });
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
                    const url = `/#review/${taxon.ns}/${taxon.id}`;
                    return div(
                        a(
                            {
                                href: url,
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

        renderNoLineage: function() {
            this.$elem.empty().append(
                div({class: 'alert alert-info'}, 
                    'No lineage found'
                )
            );
        },

        render: function () {
            const {ws, id, ver} = this.options.genomeRef;
            const genomeRef = [ws, id, ver].join('/');
            this.renderLoading();
            this.fetchRELineage(genomeRef)
                .then((result) => {
                    if (!result) {
                        this.renderNoLineage();
                    } else {
                        this.renderLineageTable(result);
                    }
                })
                .catch((err) => {
                    console.error('ERROR', err);
                    this.renderError('Error fetching lineage: ' + err.message);
                });
        },

    });
});
