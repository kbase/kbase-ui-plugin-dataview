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
    'lib/domUtils',

    // For effect
    'kbaseUI/widget/legacy/widget'
], ($,
    html,
    Workspace,
    {domSafeText}
) => {
    $.KBWidget({
        name: 'KBaseGeneInstanceInfo',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            featureID: null,
            workspaceID: null,
            genomeID: null,
            hideButtons: false,
            width: 350,
            genomeInfo: null
        },
        init(options) {
            this._super(options);

            if (!this.options.featureID) {
                this.renderError('required parameter "FeatureID" not provided to the widget');
                return this;
            }

            this.workspaceClient = new Workspace(this.runtime.config('services.workspace.url'));

            this.render();
            this.renderWorkspace();

            return this;
        },
        render() {
            /*
                * Need to get:
                * Feature name
                * Feature type (cds, peg, etc.)
                * Location (coordinates) (link to centered genome browser -- or highlight in existing one?)
                * Length
                * Exons/structure.
                * Link to alignments, domains, trees, etc. GC content?
                * families
                * subsystems
                */
            const makeButton = function (btnName) {
                const id = btnName;
                btnName = btnName.replace(/\w\S*/g, (txt) => {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });

                return $('<button>')
                    .attr('id', id)
                    .attr('type', 'button')
                    .addClass('btn btn-primary')
                    .text(btnName);
            };

            this.$messagePane = $('<div/>').addClass('kbwidget-message-pane kbwidget-hide-message');
            // xss safe
            this.$elem.append(this.$messagePane);

            this.$infoPanel = $('<div>').css('overflow', 'auto');
            this.$infoTable = $('<table>').addClass('table table-striped table-bordered');
            this.$buttonPanel = $('<div>')
                .attr('align', 'center')
                .addClass('btn-group')
                //.append(makeButton("domains"))
                //.append(makeButton("operons"))
                // xss safe
                .append(makeButton('sequence'))
                // xss safe
                .append(makeButton('biochemistry'))
                // xss safe
                .append(makeButton('structure'));

            // xss safe
            this.$infoPanel.append(this.$infoTable);
            if (!this.options.hideButtons) {
                // xss safe
                this.$infoPanel.append(this.$buttonPanel);
            }

            // xss safe
            this.$elem.append(this.$infoPanel);
        },

        renderWorkspace() {
            const self = this;
            this.$infoPanel.hide();
            this.showMessage(html.loading());

            if (self.options.genomeInfo) {
                self.ready(self.options.genomeInfo);
            } else {
                const obj = this.buildObjectIdentity(this.options.workspaceID, this.options.genomeID), prom = this.workspace.get_objects([obj]);

                // var prom = this.options.kbCache.req('ws', 'get_objects', [obj]);
                $.when(prom).fail(
                    $.proxy(function (error) {
                        this.renderError(error);
                        console.error(error);
                    }, this)
                );
                $.when(prom).done(
                    $.proxy((genome) => {
                        genome = genome[0];
                        self.ready(genome);
                    }, this)
                );
            }
        },
        ready(genome) {
            const self = this;
            let feature = null;
            if (genome.data.features) {
                for (let i = 0; i < genome.data.features.length; i++) {
                    if (genome.data.features[i].id === this.options.featureID) {
                        feature = genome.data.features[i];
                        break;
                    }
                }

                if (feature) {
                    // FINALLY we have the feature! Hooray!
                    this.$infoTable.empty();
                    /* Function
                        * Genome + link
                        * Length
                        * Location
                        * Aliases
                        */
                    // Figure out the function.
                    let func = feature['function'];
                    if (!func) {
                        func = 'Unknown';
                    }
                    // xss safe
                    this.$infoTable.append(this.$renderRow('Function', func));

                    // Show the genome and a button for it.
                    // xss safe
                    this.$infoTable.append(
                        this.$renderRow(
                            'Genome', null,
                            $('<div/>')
                                // xss safe
                                .append(domSafeText(genome.data.scientific_name))
                                // xss safe
                                .append('<br>')
                                // xss safe
                                .append(this.makeGenomeButton(this.options.genomeID, this.options.workspaceID))
                        )
                    );
                    // Figure out the feature length
                    let len = 'Unknown';
                    if (feature.dna_sequence_length) {
                        len = `${feature.dna_sequence_length  } bp`;
                    } else if (feature.dna_sequence) {
                        len = `${feature.dna_sequence.length  } bp`;
                    } else if (feature.location && feature.location.length > 0) {
                        len = 0;
                        for (let i = 0; i < feature.location.length; i++) {
                            len += feature.location[i][3];
                        }
                        len += ' bp';
                    }
                    if (feature.protein_translation) {
                        len += `, ${  feature.protein_translation.length  } aa`;
                    }
                    // xss safe
                    this.$infoTable.append(this.$renderRow('Length', len));

                    // xss safe
                    this.$infoTable.append(
                        // xss safe
                        this.$renderRow('Location', null, $('<div/>').append(this.parseLocation(feature.location)))
                    );
                    //.append(this.parseLocation(feature.location))
                    //.append(this.makeContigButton(feature.location))));
                    // Aliases
                    let aliasesStr = 'No known aliases';
                    if (feature.aliases)
                        aliasesStr = feature.aliases.join(', ');
                    // xss safe
                    self.$infoTable.append(self.$renderRow('Aliases', domSafeText(aliasesStr)));
                    // end Aliases
                    // LOL GC content. Does anyone even care these days?
                    //if (feature.dna_sequence) {
                    //    var gc = this.calculateGCContent(feature.dna_sequence);
                    //    this.$infoTable.append(this.makeRow("GC Content", Number(gc).toFixed(2)));
                    //}
                    // Protein families list.
                    let proteinFamilies = '';
                    if (feature.protein_families) {
                        if (feature.protein_families.length > 0) {
                            proteinFamilies = '';
                            for (let i = 0; i < feature.protein_families.length; i++) {
                                const fam = feature.protein_families[i];
                                proteinFamilies += `${domSafeText(fam.id)}: ${domSafeText(fam.subject_description)}<br>`;
                            }
                        }
                    }
                    if (proteinFamilies) {
                        // xss safe
                        this.$infoTable.append(this.$renderRow('Protein Families', proteinFamilies));
                    }

                    // first add handlers that say we do not have domains or operons for this gene
                    this.$buttonPanel.find('button#domains').click(() => {
                        window.alert(
                            'No domain assignments available for this gene.  You will be able to compute domain assignments in the Narrative in the future.'
                        );
                    });
                    this.$buttonPanel.find('button#operons').click(() => {
                        window.alert(
                            'No operon assignments available for this gene.  You will be able to compute operon assignments in the Narrative in the future.'
                        );
                    });
                    this.$buttonPanel.find('button#structure').click(() => {
                        window.alert(
                            'No structure assignments available for this gene.  You will be able to compute structure assignments in the Narrative in the future.'
                        );
                    });

                    //determine if a feature id and its protein MD5 translation is found in the CDS- if it is,
                    //return true.  We use this as a hack to see if we have gene info for this feature for WS objects.
                    // cdmi service is defunct - eap
                    // this.cdmiClient.fids_to_proteins([self.options.featureID],
                    //     function(prot) {
                    //         if (prot[self.options.featureID] === feature['md5']) {
                    //             //ok the fid and md5 match, so go to the CDS to get domain info...  what a hack!
                    //             self.$buttonPanel.find('button#domains').off('click');
                    //             self.$buttonPanel.find('button#domains').click(function(event) {
                    //                 self.trigger('showDomains', { event: event, featureID: self.options.featureID });
                    //             });
                    //             self.$buttonPanel.find('button#operons').off('click');
                    //             self.$buttonPanel.find('button#operons').click(function(event) {
                    //                 self.trigger('showOperons', { event: event, featureID: self.options.featureID });
                    //             });
                    //             self.$buttonPanel.find('button#structure').off('click');
                    //             self.$buttonPanel.find('button#structure').click(function(event) {
                    //                 self.trigger('showStructureMatches', { event: event, featureID: self.options.featureID });
                    //             });
                    //         }
                    //     } // we don't add error function- if they don't match or this fails, do nothing.
                    // );
                    // bind button events
                    this.$buttonPanel.find('button#sequence').click(
                        $.proxy(function (event) {
                            this.trigger('showSequence', {
                                event,
                                featureID: this.options.featureID,
                                genomeID: this.options.genomeID,
                                workspaceID: this.options.workspaceID,
                                kbCache: this.options.kbCache
                            });
                        }, this)
                    );
                    this.$buttonPanel.find('button#biochemistry').click(
                        $.proxy(function (event) {
                            this.trigger('showBiochemistry', {
                                event,
                                featureID: this.options.featureID,
                                genomeID: this.options.genomeID,
                                workspaceID: this.options.workspaceID,
                                kbCache: this.options.kbCache
                            });
                        }, this)
                    );
                } else {
                    this.renderError({
                        error: `Gene '${this.options.featureID}' not found in the genome with object id: ${this.options.workspaceID}/${this.options.genomeID}`
                    });
                }
            } else {
                this.renderError({
                    error: `No genetic features found in the genome with object id: ${
                        this.options.workspaceID
                    }/${
                        this.options.genomeID}`
                });
            }

            this.hideMessage();
            this.$infoPanel.show();
        },

        $renderCell(valueText, valueHTML) {
            const $valueCell = $('<td>');
            if (valueText) {
                // xss safe
                $valueCell.text(valueText);
            } else if (valueHTML) {
                // xss safe (trusting valueHTML)
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

        makeContigButton(loc) {
            if (this.options.hideButtons) {
                return '';
            }
            if (loc === null || loc[0][0] === null)
                return '';

            const contigID = loc[0][0];

            const self = this;
            const $contigBtn = $('<button />')
                .addClass('btn btn-default')
                .text('Show Contig')
                .on('click', (event) => {
                    self.trigger('showContig', {
                        contig: contigID,
                        centerFeature: self.options.featureID,
                        genomeId: self.options.genomeID,
                        workspaceId: self.options.workspaceID,
                        kbCache: self.options.kbCache,
                        event
                    });
                });

            return $contigBtn;
        },
        makeGenomeButton(genomeID, workspaceID) {
            if (!genomeID) {
                return '';
            }

            // TODO: umm, this is very silly.
            if (!workspaceID) {
                workspaceID = null;
            }

            // xss safe
            return $('<div>').append(
                `<a href="/#dataview/${domSafeText(workspaceID)}/${domSafeText(genomeID)}" target="_blank">${domSafeText(workspaceID)}/<wbr>${domSafeText(genomeID)}</a>`
            );
        },
        /**
         * Returns the GC content of a string as a percentage value.
         * You'll still need to concat it to some number of decimal places.
         */
        calculateGCContent(s) {
            let gc = 0;
            s = s.toLowerCase();
            for (let i = 0; i < s.length; i++) {
                const c = s[i];
                if (c === 'g' || c === 'c')
                    gc++;
            }
            return (gc / s.length) * 100;
        },
        /**
         * parses out the location into something visible in html, adds a button to open the contig.
         * something like:
         *   123 - 456 (+),
         *   789 - 1234 (+)
         *   on contig [ kb|g.0.c.1 ]  // clicking opens contig browser centered on feature.
         */
        parseLocation(loc) {
            if (loc.length === 0) {
                return 'Unknown';
            }

            let locStr = '';
            for (let i = 0; i < loc.length; i++) {
                const start = Number(loc[i][1]);
                const length = Number(loc[i][3]);

                let end = 0;
                if (loc[i][2] === '+')
                    end = start + length - 1;
                else
                    end = start - length + 1;

                locStr += `${start} to ${end} (${loc[i][2]})<br/>`;
                //                locStr += loc[i][1] + " - " + loc[i][3] + " (" + loc[i][2] + ")<br/>";
            }
            return locStr;
        },
        showMessage(message) {
            // xss safe (trusting message)
            const span = $('<span/>').html(message);

            this.$messagePane
                // xss safe
                .html(span)
                .removeClass('hide');
        },
        hideMessage() {
            this.$messagePane.addClass('hide');
        },
        getData() {
            return {
                type: 'Feature',
                id: this.options.featureID,
                workspace: this.options.workspaceID,
                genome: this.options.genomeID,
                title: 'Gene Instance'
            };
        },
        renderError(error) {
            let errString = 'Sorry, an unknown error occurred';
            if (typeof error === 'string')
                errString = error;
            else if (error.error && error.error.message)
                errString = error.error.message;

            const $errorDiv = $('<div>')
                .addClass('alert alert-danger')
                // xss safe
                .append('<b>Error:</b>')
                // xss safe
                .append(`<br>${domSafeText(errString)}`);
            // xss safe
            this.$elem.html($errorDiv);
        },
        buildObjectIdentity(workspaceID, objectID) {
            const obj = {};
            if (/^\d+$/.exec(workspaceID))
                obj['wsid'] = workspaceID;
            else
                obj['workspace'] = workspaceID;

            // same for the id
            if (/^\d+$/.exec(objectID))
                obj['objid'] = objectID;
            else
                obj['name'] = objectID;
            return obj;
        }
    });
});
