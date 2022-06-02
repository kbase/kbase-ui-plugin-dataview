/**
 * Shows general gene info.
 * Such as its name, synonyms, annotation, publications, etc.
 *
 * Gene "instance" info (e.g. coordinates on a particular strain's genome)
 * is in a different widget.
 */
define([
    'jquery',
    'kb_lib/htmlBuilders',
    'kb_service/client/workspace',
    'lib/domUtils',

    // for effect
    'kbaseUI/widget/legacy/widget'
], (
    $,
    htmlBuilders,
    Workspace,
    {domSafeText}
) => {
    $.KBWidget({
        name: 'KBaseGeneBiochemistry',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            featureID: null,
            embedInCard: false,
            genomeID: null,
            workspaceID: null,
            genomeInfo: null
        },
        init(options) {
            this._super(options);

            if (this.options.featureID === null) {
                //throw an error.
                return this;
            }

            this.render();
            this.renderWorkspace();

            return this;
        },
        render() {
            this.$messagePane = $('<div/>').addClass('kbwidget-message-pane kbwidget-hide-message');
            // xss safe
            this.$elem.append(this.$messagePane);

            this.$infoPanel = $('<div>').css('overflow', 'auto');
            this.$infoTable = $('<table>').addClass('table table-striped table-bordered');

            // xss safe
            this.$elem.append(this.$infoPanel.append(this.$infoTable));
        },

        $noData(textMessage) {
            return $('<span>')
                .css('font-style', 'italic')
                .css('font-size', '90%')
                .text(textMessage || '∅');
        },

        $renderCell(valueText, valueHTML) {
            const $valueCell = $('<td>');
            if (valueText) {
                // xss safe
                $valueCell.text(valueText);
            } else if (valueHTML) {
                // xss safe (trusting valueHTML as good html text or jquery object)
                $valueCell.html(valueHTML);
            } else {
                // xss safe
                $valueCell.html(this.$noData());
            }
            return $valueCell;
        },

        $renderRow(headerText, valueText, valueHTML) {
            return $('<tr>')
                // xss safe
                .append($('<th>').text(headerText))
                // xss safe
                .append(this.$renderCell(valueText, valueHTML));
        },

        renderWorkspace() {
            const self = this;
            this.showMessage(htmlBuilders.loading());
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
        unixEpochToTimestamp(time) {
            if (!time) {
                return 'n/a';
            }
            const options = {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false
            };
            return Intl.DateTimeFormat('en-US', options).format(time * 1000);
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

                // Function
                let func;
                if (feature.function) {
                    func = feature.function;
                } else if (feature.functions) {
                    func = feature.functions.join('; ');
                } else {
                    func = 'Unknown';
                }

                // xss safe
                this.$infoTable.append(this.$renderRow('Function', func));

                // Subsystems, single string
                //var subsysSumStr = "No subsystem summary found.";
                //if (feature.subsystems) {
                //subsysSumStr = feature.subsystems;
                //}
                //this.$infoTable.append(this.makeRow("Subsystems Summary", subsysSumStr));

                // Subsystem, detailed
                let subsysDataStr;
                if (feature.subsystem_data) {
                    subsysDataStr = '';
                    for (let i = 0; i < feature.subsystem_data.length; i++) {
                        const subsys = feature.subsystem_data[i];
                        // typedef tuple<string subsystem, string variant, string role> subsystem_data;
                        subsysDataStr +=
                            '<p>' +
                            `Subsystem: ${domSafeText(subsys[0])}<br>` +
                            `Variant: ${domSafeText(subsys[1])}<br>` +
                            `Role: ${domSafeText(subsys[2])}`;
                    }
                } else {
                    subsysDataStr = this.$noData('No subsystem data found.');
                }
                // xss safe
                this.$infoTable.append(this.$renderRow('Subsystems', null, subsysDataStr));

                // Annotation
                let annotationsStr;
                if (feature.annotations) {
                    annotationsStr = '';
                    for (let i = 0; i < feature.annotations.length; i++) {
                        const annot = feature.annotations[i];
                        // typedef tuple<string comment, string annotator, int annotation_time> annotation;
                        annotationsStr += `${annot[0]} (${annot[1]}, timestamp: ${this.unixEpochToTimestamp(annot[2])})<br>`;
                    }
                } else {
                    annotationsStr = this.$noData('No annotation comments found.');
                }
                // xss safe
                this.$infoTable.append(this.$renderRow('Annotation Comments', null, annotationsStr));

                // Protein families list.
                //var proteinFamilies = "None found";
                //if (feature.protein_families) {
                //proteinFamilies = "";
                //for (var i=0; i<feature.protein_families.length; i++) {
                //    var fam = feature.protein_families[i];
                //    proteinFamilies += fam.id + ": " + fam.subject_description + "<br>";
                //}
                //}
                //this.$infoTable.append(this.makeRow("Protein Families", proteinFamilies));
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
            if (/^\d+$/.exec(workspaceID)) {
                obj['wsid'] = workspaceID;
            } else {
                obj['workspace'] = workspaceID;
            }

            // same for the id
            if (/^\d+$/.exec(objectID)) {
                obj['objid'] = objectID;
            } else {
                obj['name'] = objectID;
            }
            return obj;
        },
        getData() {
            return {
                type: 'Feature',
                id: this.options.featureID,
                workspace: this.options.workspaceID,
                title: 'Biochemical Function'
            };
        },
        showMessage(message) {
            this.$messagePane
                // xss safe (usages)
                .html($('<div>').html(message))
                .removeClass('hide');
        },
        hideMessage() {
            this.$messagePane.addClass('hide');
        },
        makeErrorString(error) {
            if (typeof error === 'string') {
                return error;
            } else if (error.error && error.error.message) {
                return error.error.message;
            }
            return 'Sorry, an unknown error occurred';

        },
        renderError(error) {
            const errString = this.makeErrorString(error),
                $errorDiv = $('<div>')
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
