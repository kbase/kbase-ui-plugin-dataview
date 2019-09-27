/**
 * Shows taxonomic lineage.
 *
 */
define(['jquery', 'uuid', 'kb_common/html', 'kbaseUI/widget/legacy/widget'], function ($, Uuid, html) {
    'use strict';

    var t = html.tag,
        a = t('a'),
        div = t('div'),
        span = t('span'),
        table = t('table'),
        tr = t('tr'),
        th = t('th'),
        td = t('td');

    $.KBWidget({
        name: 'KBaseGenomeLineage',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            width: 600,
            genomeInfo: null
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

            this.uniqueId = new Uuid(4).format();

            this.render();
            return this;
        },

        render: function () {
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
                        tr([th('Taxonomic Lineage'), td(this.buildLineage())])
                    ]
                )
            );
        },

        buildLineage: function () {
            if (!this.genome.taxonomy) {
                return 'No taxonomic data for this genome.';
            }

            // Note that the taxonomy lineage path is just a string, with semicolon or comma separators
            // (depends on what the developer or user decided to use...)
            let separator = ';';
            if (this.genome.taxonomy.indexOf(',') >= 0) {
                separator = ',';
            }
            var splittax = this.genome.taxonomy.split(separator).map((item) => {
                return item.trim();
            });

            // The display is a simple vertical un-indented list of links to the taxonomy
            // page at NCBI.
            return div(
                {
                    style: {
                        whiteSpace: 'nowrap',
                        overflowX: 'auto'
                    }
                },
                splittax.map((item) => {
                    var searchtax = item.replace('/ /g', '+');
                    var link = 'http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name=' + searchtax;
                    return div(
                        a(
                            {
                                href: link,
                                target: '_blank'
                            },
                            item
                        )
                    );
                })
            );
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
        }
    });
});
