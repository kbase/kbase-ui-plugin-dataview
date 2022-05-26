/**
 * Output widget for visualization of genome annotation.
 * @author Roman Sutormin <rsutormin@lbl.gov>
 * @public
 */
define([
    'jquery',
    'kb_common/html',
    'kb_service/client/workspace',
    'kbaseUI/widget/legacy/widget',
    'widgets/genomes/kbaseGeneInstanceInfo',
    'widgets/genomes/kbaseGeneBiochemistry',
    'widgets/genomes/kbaseGeneSequence'
], ($, html, Workspace) => {
    $.KBWidget({
        name: 'KBaseGenePage',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            featureID: null,
            genomeID: null,
            workspaceID: null
        },
        init(options) {
            this._super(options);
            if (this.options.workspaceID === 'CDS') {
                this.options.workspaceID = 'KBasePublicGenomesV4';
            }
            this.workspace = new Workspace(this.runtime.getConfig('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });
            this.render();
            return this;
        },
        render() {
            const self = this;
            const scope = {
                ws: this.options.workspaceID,
                gid: this.options.genomeID,
                fid: this.options.featureID
            };
            ///////////////////////////////////////////////////////////////////////////////
            const cell1 = $('<div panel panel-default">');
            self.$elem.append(cell1);
            const panel1 = self.makePleaseWaitPanel();
            self.makeDecoration(cell1, 'Feature Overview', panel1);
            ///////////////////////////////////////////////////////////////////////////////
            const cell2 = $('<div panel panel-default">');
            self.$elem.append(cell2);
            const panel2 = self.makePleaseWaitPanel();
            self.makeDecoration(cell2, 'Biochemistry', panel2);
            ///////////////////////////////////////////////////////////////////////////////
            const cell3 = $('<div panel panel-default">');
            self.$elem.append(cell3);
            const panel3 = self.makePleaseWaitPanel();
            self.makeDecoration(cell3, 'Sequence', panel3);
            ///////////////////////////////////////////////////////////////////////////////

            const objId = `${scope.ws  }/${  scope.gid}`;
            const included = [
                '/complete',
                '/contig_ids',
                '/contig_lengths',
                'contigset_ref',
                '/dna_size',
                '/domain',
                '/gc_content',
                '/genetic_code',
                '/id',
                '/md5',
                'num_contigs',
                '/scientific_name',
                '/source',
                '/source_id',
                '/tax_id',
                '/taxonomy',
                '/features/[*]/id'
            ];

            const ready = function (genomeInfo) {
                panel1.empty();
                try {
                    panel1.KBaseGeneInstanceInfo({
                        featureID: scope.fid,
                        genomeID: scope.gid,
                        workspaceID: scope.ws,
                        hideButtons: true,
                        genomeInfo,
                        runtime: self.runtime
                    });
                } catch (e) {
                    console.error(e);
                    self.showError(panel1, e.message);
                }

                panel2.empty();
                try {
                    panel2.KBaseGeneBiochemistry({
                        featureID: scope.fid,
                        genomeID: scope.gid,
                        workspaceID: scope.ws,
                        genomeInfo,
                        runtime: self.runtime
                    });
                } catch (e) {
                    console.error(e);
                    self.showError(panel2, e.message);
                }

                panel3.empty();
                panel3.KBaseGeneSequence({
                    featureID: scope.fid,
                    genomeID: scope.gid,
                    workspaceID: scope.ws,
                    genomeInfo,
                    runtime: self.runtime
                });
            };

            self.workspace.get_object_subset(
                [
                    {
                        ref: objId,
                        included
                    }
                ],
                (data) => {
                    const genomeInfo = data[0];
                    let featureIdx = null;
                    for (const pos in genomeInfo.data.features) {
                        const featureId = genomeInfo.data.features[pos].id;
                        if (featureId && featureId === scope.fid) {
                            featureIdx = pos;
                            break;
                        }
                    }
                    if (featureIdx) {
                        self.workspace.get_object_subset(
                            [{ref: objId, included: [`/features/${  featureIdx}`]}],
                            (data) => {
                                const fInfo = data[0].data;
                                genomeInfo.data.features[featureIdx] = fInfo.features[0];
                                ready(genomeInfo);
                            },
                            (error) => {
                                console.error('Error loading genome subdata');
                                console.error(error);
                                panel1.empty();
                                self.showError(panel1, error);
                                cell2.empty();
                                cell3.empty();
                            }
                        );
                    } else {
                        panel1.empty();
                        self.showError(panel1, `Feature ${  scope.fid  } is not found in genome`);
                        cell2.empty();
                        cell3.empty();
                    }
                },
                (error) => {
                    console.error('Error loading genome subdata');
                    console.error(error);
                    panel1.empty();
                    self.showError(panel1, error);
                    cell2.empty();
                    cell3.empty();
                }
            );
        },
        makePleaseWaitPanel() {
            // safe
            return $('<div>').html(html.loading('loading...'));
        },
        makeDecoration($panel, title, $widgetDiv) {
            const id = this.genUUID();
            $panel.append(
                $(
                    `<div class="panel-group" id="accordion_${id}" role="tablist" aria-multiselectable="true">`
                ).append(
                    $('<div class="panel panel-default kb-widget">')
                        .append(`<div class="panel-heading" role="tab" id="heading_${id}">
                                    <h4 class="panel-title">
                                        <span data-toggle="collapse" 
                                              data-parent="#accordion_${id}" 
                                              data-target="#collapse_${id}" 
                                              aria-expanded="false" 
                                              aria-controls="collapse_${id}" 
                                              style="cursor:pointer;">${title}</span>
                                    </h4>
                                </div>`)
                        .append(
                            $(`<div id="collapse_${id}" 
                                    class="panel-collapse collapse in" 
                                    role="tabpanel" 
                                    aria-labelledby="heading_${id}" 
                                    area-expanded="true">`)
                                .append($('<div class="panel-body">').append($widgetDiv))
                        )
                )
            );
        },
        getData() {
            return {
                type: 'Gene Page',
                id: `${this.options.genomeID  }/${  this.options.featureID}`,
                workspace: this.options.workspaceID,
                title: 'Gene Page'
            };
        },
        showError(panel, e) {
            panel.empty();
            panel.append(`Error: ${  JSON.stringify(e)}`);
        },
        genUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = (Math.random() * 16) | 0,
                    v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        }
    });
});
