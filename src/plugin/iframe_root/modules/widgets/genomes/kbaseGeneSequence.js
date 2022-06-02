/**
 * Shows general gene info.
 * Such as its name, synonyms, annotation, publications, etc.
 *
 * Gene "instance" info (e.g. coordinates on a particular strain's genome)
 * is in a different widget.
 */
define([
    'jquery',
    'kb_common/html',
    'kb_service/client/workspace',
    'dompurify',
    'lib/domUtils',

    // for effect
    'kbaseUI/widget/legacy/widget'
], (
    $,
    html,
    Workspace,
    DOMPurify,
    {domSafeText}
) => {
    $.KBWidget({
        name: 'KBaseGeneSequence',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            featureID: null,
            embedInCard: false,
            genomeID: null,
            workspaceID: null,
            width: 950,
            seq_cell_height: 208,
            genomeInfo: null
        },
        init(options) {
            this._super(options);

            if (this.options.featureID === null) {
                //throw an error.
                return this;
            }

            this.render();
            if (this.options.workspaceID) {
                this.renderWorkspace();
            } else this.renderError;

            return this;
        },
        render() {
            this.$messagePane = $('<div/>').addClass('kbwidget-message-pane hide');
            // xss safe
            this.$elem.append(this.$messagePane);

            this.$infoPanel = $('<div>').css('overflow', 'auto');
            this.$infoTable = $('<table>').addClass('table table-striped table-bordered');

            // xss safe
            this.$elem.append(this.$infoPanel.append(this.$infoTable));
        },
        makeRow(name, value, color) {
            const $row = $('<tr>')
                // xss safe
                .append($('<th>').text(name))
                // xss safe
                .append(
                    // xss safe
                    $('<td>').append(
                        $(
                            `<div style='max-height:${this.options.seq_cell_height}px; overflow:scroll; font-family:monospace; background-color:${color}; border:1px solid transparent'>`
                        )
                            // xss safe
                            .append(DOMPurify.sanitize(value))
                    )
                );
            //.append("<td style='max-height: 100px; overflow:scroll; font-family: monospace'>").append($("<div style='max-height:100px; overflow:scroll; font-family: monospace'>").append(value));
            return $row;
        },
        renderWorkspace() {
            const self = this;
            this.showMessage(html.loading());
            this.$infoPanel.hide();

            if (this.options.genomeInfo) {
                self.ready(this.options.genomeInfo);
            } else {
                const obj = this.buildObjectIdentity(this.options.workspaceID, this.options.genomeID);

                const workspace = new Workspace(this.runtime.config('services.workspace.url'), {
                    token: this.runtime.service('session').getAuthToken()
                });
                workspace
                    .get_objects([obj])
                    .then((genome) => {
                        self.ready(genome[0]);
                    })
                    .catch((err) => {
                        self.renderError(err);
                    });
            }
        },
        ready(genome) {
            if (genome.data.features) {
                let feature = null;
                for (let i = 0; i < genome.data.features.length; i++) {
                    if (genome.data.features[i].id === this.options.featureID) {
                        feature = genome.data.features[i];
                        break;
                    }
                }

                // Gene sequence
                //
                let dnaSequenceStr = 'No gene sequence found.';
                if (feature.dna_sequence) {
                    // get dna_sequence from object
                    dnaSequenceStr = feature.dna_sequence;
                    // wrap seq
                    const seq_width = 50;
                    if (dnaSequenceStr.length > seq_width) {
                        let dnaDispStr = '';
                        let start_pos = 0;
                        let end_pos = 0;
                        for (let i = 0; (i + 1) * seq_width < dnaSequenceStr.length; i++) {
                            start_pos = i * seq_width;
                            end_pos = (i + 1) * seq_width;
                            dnaDispStr += `${dnaSequenceStr.substring(start_pos, end_pos)}<br>`;
                        }
                        start_pos += seq_width;
                        end_pos = dnaSequenceStr.length;
                        if (start_pos < dnaSequenceStr.length) {
                            dnaDispStr += `${dnaSequenceStr.substring(start_pos, end_pos)}<br>`;
                        }
                        dnaSequenceStr = dnaDispStr;
                    }
                }
                // xss safe
                this.$infoTable.append(this.makeRow('Gene', dnaSequenceStr, 'white'));
                // end gene sequence

                // Protein sequence (for peg) (do first for bottom-up table build?)
                //
                let proteinTranslationStr = 'No protein sequence found.';
                if (feature.protein_translation) {
                    proteinTranslationStr = feature.protein_translation;
                    // wrap seq
                    const seq_width = 50;
                    if (proteinTranslationStr.length > seq_width) {
                        let protDispStr = '';
                        let start_pos = 0;
                        let end_pos = 0;
                        for (let i = 0; (i + 1) * seq_width < proteinTranslationStr.length; i++) {
                            start_pos = i * seq_width;
                            end_pos = (i + 1) * seq_width;
                            protDispStr += `${proteinTranslationStr.substring(start_pos, end_pos)}<br>`;
                        }
                        start_pos += seq_width;
                        end_pos = proteinTranslationStr.length;
                        if (start_pos < proteinTranslationStr.length) {
                            protDispStr += `${proteinTranslationStr.substring(start_pos, end_pos)}<br>`;
                        }
                        proteinTranslationStr = protDispStr;
                    }
                }
                // xss safe
                this.$infoTable.append(
                    this.makeRow('Protein', proteinTranslationStr, '#f9f9f9')
                    //.each(function(){$(this).css('font-family','monospace')})
                );

                // SOMETHING SIMILAR, BUT NOT RIGHT this.$infoTable.append(this.makeRow("Protein", proteinTranslationStr).find("td")[1].style="font-family:Courier");

                // end protein sequence
            } else {
                this.renderError({
                    error:
                        `No genetic features found in the genome with object id: ${
                            this.options.workspaceID
                        }/${
                            this.options.genomeID}`
                });
            }

            this.hideMessage();
            this.$infoPanel.show();
        },
        buildObjectIdentity(workspaceID, objectID) {
            const obj = {};
            if (/^\d+$/.exec(workspaceID)) obj['wsid'] = workspaceID;
            else obj['workspace'] = workspaceID;

            // same for the id
            if (/^\d+$/.exec(objectID)) obj['objid'] = objectID;
            else obj['name'] = objectID;
            return obj;
        },
        getData() {
            return {
                type: 'Feature',
                id: this.options.featureID,
                workspace: this.options.workspaceID,
                title: 'Gene Sequence'
            };
        },
        showMessage(message) {
            // xss safe
            const span = $('<span/>').append(message);

            this.$messagePane
                // xss safe
                .html(span)
                .removeClass('hide');
        },
        hideMessage() {
            this.$messagePane.addClass('hide');
        },
        renderError(error) {
            let errString = 'Sorry, an unknown error occurred';
            if (typeof error === 'string') errString = error;
            else if (error.error && error.error.message) errString = error.error.message;

            const $errorDiv = $('<div>')
                .addClass('alert alert-danger')
                // xss safe
                .append('<b>Error:</b>')
                // xss safe
                .append(`<br>${domSafeText(errString)}`);
            // xss safe
            this.$elem.html($errorDiv);
        }
    });
});
