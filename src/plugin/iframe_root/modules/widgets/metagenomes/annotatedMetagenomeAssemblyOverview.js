/**
 * Shows general gene info.
 * Such as its name, synonyms, annotation, publications, etc.
 *
 * Gene "instance" info (e.g. coordinates on a particular strain's genome)
 * is in a different widget.
 */
define([
    'jquery',
    'numeral',
    'lib/jqueryUtils',

    // for effect
    'kbaseUI/widget/legacy/widget'
], ($,
    numeral,
    {$errorAlert}
) => {
    $.KBWidget({
        name: 'KBaseAMAOverview',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            genomeID: null,
            workspaceID: null,
            isInCard: false,
            genomeInfo: null
        },
        $infoTable: null,
        noContigs: 'No Contigs',
        init(options) {
            this._super(options);

            this.$root = $('<div>');
            // safe
            this.$elem.html(this.$root);

            this.render();
            return this;
        },
        render() {
            try {
                // safe
                this.$root.html(this.$renderData(this.options.genomeInfo.data, this.options.genomeInfo.info[10]));
            } catch (e) {
                console.error(e);
                // safe
                this.$root.html($errorAlert(e));
            }
        },
        addInfoRow(a, b) {
            return $('<tr>')
                .append($('<th>').text(a))
                .append($('<td>').text(b));
        },
        $renderData(genome, metadata) {
            let gcContent = 'Unknown',
                dnaLength = 'Unknown',
                nFeatures = 0,
                num_contigs = 0;

            /** Changes - wjriehl 22apr2016 */
            /* Assume two cases for GC content.
             * 1. GC > 1 --> it's a raw percentage, so just render
             * 2. GC < 1 --> it's a decimal and should be x100
             * 3. (maybe?) GC > 100 --> it's an actual count of GCs and should be divided by dna length
             */
            if (genome.gc_content) {
                gcContent = Number(genome.gc_content);
                if (gcContent < 1.0) {
                    gcContent = `${(gcContent * 100).toFixed(2)  } %`;
                } else if (gcContent > 100) {
                    if (genome.dna_size && genome.dna_size !== 0) {
                        gcContent = `${gcContent + Number(genome.dna_size)  } %`;
                    }
                } else {
                    gcContent = `${gcContent.toFixed(2)} %`;
                }
            }

            if (genome.features) {
                nFeatures = genome.features.length;
            } else if (metadata && metadata['Number features']) {
                nFeatures = metadata['Number features'];
            }

            if (genome.num_contigs) {
                num_contigs = genome.num_contigs;
            } else if (genome.contig_ids) {
                num_contigs = genome.contig_ids.length;
            }

            if (genome.dna_size) {
                dnaLength = genome.dna_size;
            }

            return $('<table>').addClass('table table-striped table-hover table-bordered')
                // safe
                .append($('<tbody>')
                    // safe
                    .append(this.addInfoRow('Original Source File Name', genome.original_source_file_name || 'n/a'))
                    // safe
                    .append(this.addInfoRow('DNA Length', numeral(dnaLength).format('0,0')))
                    // safe
                    .append(this.addInfoRow('Source ID', `${genome.source || 'n/a'}: ${genome.source_id}`))
                    // safe
                    .append(this.addInfoRow('Number of Contigs', numeral(num_contigs).format('0,0')))
                    // safe
                    .append(this.addInfoRow('GC Content', gcContent))
                    // safe
                    .append(this.addInfoRow('Genetic Code', genome.genetic_code))
                    // safe
                    .append(this.addInfoRow('Number of features', numeral(nFeatures).format('0,0'))));

        },
        getData() {
            return {
                type: 'Genome',
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: 'Genome Overview'
            };
        }
    });
});
