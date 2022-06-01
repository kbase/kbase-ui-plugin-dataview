/**
 * Shows taxonomic lineage.
 *
 */
define([
    'jquery',
    'uuid',
    'kb_common/html',
    'lib/domUtils',
    'lib/jqueryUtils',

    // For effect
    'kbaseUI/widget/legacy/widget'
], (
    $,
    Uuid,
    html,
    {domSafeText},
    {$errorAlert}
) => {
    const t = html.tag,
        a = t('a'),
        div = t('div'),
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

        init(options) {
            this._super(options);
            if (!this.options.genomeInfo) {
                throw new Error('Genome information not supplied');
            }
            this.genome = options.genomeInfo.data;

            this.uniqueId = new Uuid(4).format();

            this.render();
            return this;
        },

        render() {
            this.$elem
                // safe
                .html(
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
                                    domSafeText(this.genome.scientific_name)
                                )
                            ]),
                            tr([th('Taxonomic Lineage'), td(this.buildLineage())])
                        ]
                    )
                );
        },

        buildLineage() {
            if (!this.genome.taxonomy) {
                return 'No taxonomic data for this genome.';
            }

            // Note that the taxonomy lineage path is just a string, with semicolon or comma separators
            // (depends on what the developer or user decided to use...)
            let separator = ';';
            if (this.genome.taxonomy.indexOf(',') >= 0) {
                separator = ',';
            }
            const splittax = this.genome.taxonomy.split(separator).map((item) => {
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
                    const searchtax = item.replace('/ /g', '+');
                    const link = `http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name=${searchtax}`;
                    return div(
                        a(
                            {
                                href: link,
                                target: '_blank'
                            },
                            domSafeText(item)
                        )
                    );
                })
            );
        },

        renderError(error) {
            // safe
            this.$elem.html($errorAlert(error));
        }
    });
});
