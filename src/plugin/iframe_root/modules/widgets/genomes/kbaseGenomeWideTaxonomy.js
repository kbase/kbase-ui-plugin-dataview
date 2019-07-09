// TODO: fix this bug -- this "build narrative" code below does not insert and populate the app, it just
// creates an narrative with the object. It should create markdown to document what to do, insert the app,
// and populate the app as far as it can.
// SpeciesTreeBuilder/insert_set_of_genomes_into_species_tree
// var buildUrl = '#narrativemanager/new';
// var query = {
//     copydat: scope.ws + '/' + scope.id,
//     app: 'SpeciesTreeBuilder/insert_set_of_genomes_into_species_tree',
//     appparam: [1, 'param0', scope.id].join(',')
// };
// buildUrl = html.makeUrl

define([
    'bluebird',
    'jquery',
    'uuid',
    'kb_common/html',
    'kb_common/jsonRpc/genericClient',
    'kb_common/jsonRpc/dynamicServiceClient',
    'kb_service/utils',
    'lib/post',

    'kbaseUI/widget/legacy/widget',
    'widgets/genomes/kbaseGenomeLineage',
    'widgets/trees/kbaseTree'
], function (Promise, $, Uuid, html, GenericClient, DynamicServiceClient, serviceUtils, post) {
    'use strict';

    var t = html.tag,
        div = t('div'),
        a = t('a'),
        button = t('button'),
        span = t('span');

    $.KBWidget({
        name: 'KBaseGenomeWideTaxonomy',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            genomeID: null,
            workspaceID: null,
            genomeInfo: null
        },
        trees: null,
        currentTree: null,
        objectRef: null,
        genomeInfo: null,
        init: function (options) {
            this._super(options);
            this.genomeInfo = this.options.genomeInfo;
            this.render();
            return this;
        },
        render: function () {
            var $row = $('<div class="row">');

            // This area for the taxonomy widget
            var $taxonomyinfo = $('<div class="col-md-5">');
            $row.append($taxonomyinfo);

            // This area for the tree display
            this.$tree = $('<div class="col-md-7">');

            const treeMessageNodeId = html.genId();
            const treeNodeId = html.genId();
            // COMMENTED OUT: new narrative button
            // let newTreeButtonNodeId = html.genId();
            const buttonsNodeId = html.genId();
            const messageNodeId = html.genId();
            const prevButtonNodeId = html.genId();
            const nextButtonNodeId = html.genId();

            const treeArea = div(
                {
                    class: 'col-md-7'
                },
                [
                    div(
                        {
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                marginBottom: '10px'
                            }
                        },
                        [
                            div(
                                {
                                    style: {
                                        flex: '3',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }
                                },
                                span({
                                    id: messageNodeId
                                })
                            ),
                            div(
                                {
                                    style: {
                                        flex: '1'
                                    }
                                },
                                [
                                    div(
                                        {
                                            class: 'btn-toolbar pull-right'
                                        },
                                        [
                                            button(
                                                {
                                                    class: 'btn btn-default btn-sm',
                                                    id: prevButtonNodeId
                                                },
                                                span({
                                                    class: 'fa fa-chevron-left'
                                                })
                                            ),
                                            button(
                                                {
                                                    class: 'btn btn-default btn-sm',
                                                    id: nextButtonNodeId
                                                },
                                                span({
                                                    class: 'fa fa-chevron-right'
                                                })
                                            )
                                        ]
                                    )
                                ]
                            )
                        ]
                    ),

                    div(
                        {
                            class: 'btn-toolbar'
                        },
                        [
                            // COMMENTED OUT: new narrative button
                            // div({
                            //     class: 'btn-group'
                            // }, button({
                            //     class: 'btn btn-primary',
                            //     id: newTreeButtonNodeId,
                            //     // href: this.buildNewNarrativeURL(),
                            //     target: '_blank'
                            // })),
                            div({
                                class: 'btn-group',
                                id: buttonsNodeId
                            })
                        ]
                    ),
                    div({
                        id: treeMessageNodeId
                    }),
                    div({
                        id: treeNodeId
                    })
                ]
            );

            $row.append(treeArea);

            this.$elem.append($row);

            this.$treeNode = $('#' + treeNodeId);
            this.$treeMessageNode = $('#' + treeMessageNodeId);

            // COMMENTED OUT: new narrative button
            // this.$newTreeButtonNode = $('#' + newTreeButtonNodeId);

            this.$buttonsNode = $('#' + buttonsNodeId);
            this.$messageNode = $('#' + messageNodeId);
            this.$prevButtonNode = $('#' + prevButtonNodeId);
            this.$nextButtonNode = $('#' + nextButtonNodeId);

            this.$prevButtonNode.click(() => {
                if (!this.trees) {
                    return;
                }
                if (this.currentTree > 0) {
                    this.currentTree -= 1;
                }
                this.displayTree();
            });

            this.$nextButtonNode.click(() => {
                if (!this.trees) {
                    return;
                }
                if (this.currentTree < this.trees.length - 1) {
                    this.currentTree += 1;
                }
                this.displayTree();
            });

            // COMMENTED OUT: new narrative button
            // this.$newTreeButtonNode.click(() => {
            //     let kbaseSecret = new Uuid(4).format();
            //     let newWindow = window.open('', 'kbase-ui-comm_' + kbaseSecret);
            //     newWindow.document.write(html.loading('Creating and Loading Narrative'));
            //     this.createTreeBuildingNarrative(newWindow, kbaseSecret);
            // });

            // Render the taxonomy/lineage widget
            $taxonomyinfo.KBaseGenomeLineage({
                genomeInfo: this.genomeInfo,
                runtime: this.runtime
            });

            // Render the tree
            this.fetchTrees()
                .then(() => {
                    this.renderTree();
                    return null;
                })
                .catch((error) => {
                    console.error(error);
                    var err = '<b>Sorry!</b>  Error retreiveing species trees info';
                    if (typeof error === 'string') {
                        err += ': ' + error;
                    } else if (error.error && error.error.message) {
                        err += ': ' + error.error.message;
                    }
                    this.setMessage(err);
                });
        },
        // SpeciesTreeBuilder/insert_set_of_genomes_into_species_tree
        // var buildUrl = '#narrativemanager/new';
        // var query = {
        //     copydat: scope.ws + '/' + scope.id,
        //     app: 'SpeciesTreeBuilder/insert_set_of_genomes_into_species_tree',
        //     appparam: [1, 'param0', scope.id].join(',')
        // };
        // buildUrl = html.makeUrl
        makeNarrativePath: function (wsId, objId) {
            return this.runtime.getConfig('services.narrative.url') + '/narrative/ws.' + wsId + '.obj.' + objId;
        },

        // createNewNarrative: function (arg) {
        //     // create workspace
        //     let id = new Uuid(4).format();
        //     let username = this.runtime.service('session').getUsername();
        //     let workspaceName = username + ':narrative_' + id;
        //     let narrativeName = 'Narrative.' + id;
        //     // window.postMessage({hi: 'there'}, 'https://ci.kbase.us/narrative');

        //     let workspace = new GenericClient({
        //         module: 'Workspace',
        //         url: this.runtime.getConfig('services.workspace.url'),
        //         token: this.runtime.service('session').getAuthToken()
        //     });
        //     workspace.create_worksapce({
        //         workspace: workspaceName,
        //         description: 'Tree-building Narrative auto-created by kbaseGenomeWideTaxonomy, thank you.'
        //     })
        //         .spread((workspaceInfo) => {
        //             let metadata = {
        //                 // job_ids: {
        //                 //     methods: [],
        //                 //     apps: [],
        //                 //     job_usage: {
        //                 //         queue_time: 0,
        //                 //         run_time: 0
        //                 //     }
        //                 // },
        //                 format: 'ipynb',
        //                 creator: username,
        //                 ws_name: workspaceName,
        //                 name: arg.title,
        //                 type: 'KBaseNarrative.Narrative',
        //                 description: 'A narrative',
        //                 data_dependencies: []
        //             };

        //             let narrativeObject = {
        //                 nbformat_minor: 0,
        //                 cells: [],
        //                 metadata: metadata
        //             };

        //         });
        //     // create narrative object in ws

        //     // modify ws metadata

        //     // ...
        // },

        /*
            resolveObjectNameToInfo
            Simply calls to the workspace to resolve an object name in a
            given workspace to an object info structure.
        */
        resolveObjectNameToInfo: function (workspaceId, objectName) {
            const workspace = new GenericClient({
                module: 'Workspace',
                url: this.runtime.config('services.workspace.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            return workspace
                .callFunc('get_object_info3', [
                    {
                        objects: [
                            {
                                wsid: workspaceId,
                                name: objectName
                            }
                        ],
                        includeMetadata: 0,
                        ignoreErrors: 1
                    }
                ])
                .spread((result) => {
                    const info = result.infos[0];
                    if (!info) {
                        console.error(info);
                        throw new Error('Could not find new object!!');
                    }
                    return serviceUtils.objectInfoToObject(info);
                });
        },

        createTreeBuildingNarrative: function (narrativeWindow, kbaseSecret) {
            const initialContent = [
                '# Tree-Building Narrative',
                '',
                'This Narrative was created by the Genome Landing Page to assist in creating a tree containing this genome.',
                'Notice that the genome is the sole object in the Data List on the left side of this page, and that the ',
                '"Insert Genome Into species Tree" app has been inserted into the Narrative below. ',
                '',
                'Other parameters specifying the output objects have been provided with default values. ',
                'Feel free to override them.',
                '',
                'The Narrative may be run as-is by clicking the "Run" button, or you may alter the parameters first.'
            ].join('\n');
            const param = {
                importData: [this.genomeInfo.objectInfo.ref],
                markdown: initialContent,
                title: 'New tree-building Narrative for ' + this.genomeInfo.objectInfo.name,
                includeIntroCell: 0
            };
            const narrativeService = new DynamicServiceClient({
                module: 'NarrativeService',
                url: this.runtime.config('services.service_wizard.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            return narrativeService
                .callFunc('create_new_narrative', [param])
                .spread((info) => {
                    var wsId = info.narrativeInfo.wsid,
                        objId = info.narrativeInfo.id,
                        path = this.makeNarrativePath(wsId, objId);

                    // while that is working its way through...
                    // find the object we think we copied. we need the ref.
                    return this.resolveObjectNameToInfo(wsId, this.genomeInfo.objectInfo.name).then((objectInfo) => {
                        const poster = new post.LocalPost({
                            partner: narrativeWindow,
                            channel: kbaseSecret
                        });
                        poster.start();
                        poster.on('ready', () => {
                            // poster.send('add-markdown-cell', {
                            //     content: [
                            //         '# Tree-Building Narrative',
                            //         '',
                            //         'This Narrative was created by the Genome Landing Page to assist in creating a tree containing this genome.',
                            //         'Notice that the genome is the sole object in the Data List on the left side of this page, and that the ',
                            //         '"Insert Genome Into species Tree" app has been inserted into the Narrative below',
                            //         'Other paramters specifying the output objects have been provided with default values. ',
                            //         'Feel free to override them.',
                            //         '',
                            //         'The Narrative may be run as-is by clicking the "Run" button, or you may alter the normal or advanced parameters.'
                            //     ].join('\n')
                            // });
                            const payload = {
                                appId: 'SpeciesTreeBuilder/insert_set_of_genomes_into_species_tree',
                                tag: 'release',
                                kbaseSecret: kbaseSecret,
                                params: {
                                    param0: [objectInfo.ref],
                                    genomeSetName: 'output_genome_set',
                                    treeID: 'output_tree'
                                }
                            };
                            poster.send('add-app-cell', payload);
                            poster.send('done');
                        });

                        narrativeWindow.location = path;
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        },

        // buildNewNarrativeURL: function () {
        //     let appId = 'SpeciesTreeBuilder/insert_set_of_genomes_into_species_tree';
        //     var path = '#narrativemanager/new';
        //     var query = {
        //         copydat: this.options.workspaceID + '/' + this.options.genomeID,
        //         app: appId,
        //         appparam: [1, 'param0', this.options.genomID].join(',')
        //     };
        //     let url = path + Object.keys(query).map((key) => {
        //         return [
        //             key,
        //             encodeURIComponent(query[key])
        //         ].join('=');
        //     }).join('&');
        //     return [
        //         '/#narrativemanager/new?copydata=',
        //         this.options.workspaceID,
        //         '/',
        //         this.options.genomeID,
        //         '&app=build_species_tree&appparam=1,param0,',
        //         this.options.genomeID
        //     ].join('');
        // },
        fetchTrees: function () {
            var workspace = new GenericClient({
                module: 'Workspace',
                url: this.runtime.getConfig('services.workspace.url'),
                token: this.runtime.service('session').getAuthToken()
            });
            var objectIdentity = {
                ref: this.options.workspaceID + '/' + this.options.genomeID
            };
            return workspace.callFunc('list_referencing_objects', [[objectIdentity]]).spread((data) => {
                const referencingTrees = data[0]
                    .filter((referencingObject) => {
                        const type = referencingObject[2].split('-')[0];
                        return type === 'KBaseTrees.Tree';
                    })
                    .map((referencingTree) => {
                        return {
                            wsid: referencingTree[6],
                            id: referencingTree[0],
                            name: referencingTree[1]
                        };
                    });
                this.trees = referencingTrees;
                if (this.trees.length > 0) {
                    this.currentTree = 0;
                }
                return null;
            });
        },
        // COMMENTED OUT: new narrative button
        // setButtonText: function (text) {
        //     this.$newTreeButtonNode.text(text);
        // },
        clearButtons: function () {
            this.$buttonsNode.empty();
        },
        addButton: function (markup) {
            this.$buttonsNode.append(markup);
        },
        hideNavButtons: function () {
            this.$prevButtonNode.hide();
            this.$nextButtonNode.hide();
        },
        showNavButtons: function () {
            this.$prevButtonNode.show();
            this.$nextButtonNode.show();
        },
        setTreeMessage: function (html) {
            this.$treeMessageNode.html(html);
        },
        setMessage: function (message) {
            this.$messageNode.html(message);
        },
        renderTree: function () {
            const trees = this.trees;
            if (!this.trees) {
                return;
            }
            if (trees.length === 0) {
                // show message that no trees. adjust button.
                // COMMENTED OUT: new narrative button
                // this.setButtonText('Launch a new tree-building Narrative');
                // this.setMessage([
                //     'There are no species trees created for this genome, ',
                //     ' but you can copy it into a Narrative to build a new species tree ',
                //     ' of closely related genomes. ',
                //     'You may do this from any Narrative you have write access to, or create a new Narrative ',
                //     'with the button below.'
                // ].join(''));
                this.setMessage(['There are no species trees associated with this genome.']);
                this.$prevButtonNode.addClass('hidden');
                this.$nextButtonNode.addClass('hidden');
            } else if (trees.length === 1) {
                // normal
                // COMMENTED OUT: new narrative button
                // this.setButtonText('Build another tree in a new Narrative');
                this.displayTree();
            } else {
                // more than one tree. show message and Nth tree (for now).
                // COMMENTED OUT: new narrative button
                // this.setButtonText('Build another tree in a new Narrative');
                this.displayTree();
            }
        },
        displayTree: function () {
            // Message changes
            if (this.trees.length === 0) {
                this.setMessage('Showing 1 phylogenetic tree for this genome');
            } else {
                this.setMessage(
                    [
                        'Showing #',
                        this.currentTree + 1,
                        ' of ',
                        this.trees.length,
                        ' phylogenetic trees for this genome'
                    ].join('')
                );
            }

            // Buttons
            this.clearButtons();
            const tree = this.trees[this.currentTree];
            // this.addButton(a({
            //     class: 'btn btn-primary',
            //     href: ['/#dataview', tree.wsid, tree.id].join('/'),
            //     target: '_blank'
            // }, 'View Tree "' + tree.name + '"'));
            this.addButton(
                a(
                    {
                        class: 'btn btn-primary',
                        href: ['/#dataview', tree.wsid, tree.id].join('/'),
                        target: '_blank'
                    },
                    'View tree in separate window'
                )
            );
            // this.addButton(a({
            //     class: 'btn btn-primary',
            //     href: ['/#dataview', tree.wsid, tree.id].join('/'),
            //     target: '_blank'
            // }, 'View in Narrative'));

            if (this.currentTree === 0) {
                this.$prevButtonNode.addClass('disabled');
            } else {
                this.$prevButtonNode.removeClass('disabled');
            }
            if (this.currentTree === this.trees.length - 1) {
                this.$nextButtonNode.addClass('disabled');
            } else {
                this.$nextButtonNode.removeClass('disabled');
            }

            // this.addButton($(button({
            //     class: 'btn btn-primary'
            // }, 'prev'))
            //     .click(() => {
            //         if (this.currentTree > 0) {
            //             this.currentTree -= 1;
            //         }
            //         this.displayTree();
            //     }));
            // this.addButton($(button({
            //     class: 'btn btn-primary'
            // }, 'next'))
            //     .click(() => {
            //         if (this.currentTree < this.trees.length - 1) {
            //             this.currentTree += 1;
            //         }
            //         this.displayTree();
            //     }));
            // this.setTreeMessage(div(['Showing Phylogenetic Tree (1): ', treeLink]));
            this.$treeNode.kbaseTree({
                treeID: tree.id,
                workspaceID: tree.wsid,
                genomeInfo: this.options.genomeInfo,
                runtime: this.runtime
            });
        },
        getData: function () {
            return {
                type: 'Genome Taxonomy',
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: 'Taxonomy'
            };
        }
    });
});
