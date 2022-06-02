define([
    'jquery',
    'bluebird',
    'kb_service/client/workspace',
    'widgets/modeling/modelSeedPathway',
    'content',
    'lib/jqueryUtils',

    // for effect
    'kbaseUI/widget/legacy/widget',
    'kbaseUI/widget/legacy/tabs'
], (
    $,
    Promise,
    Workspace,
    ModelSeedPathway,
    content,
    {$errorAlert}
) => {
    $.KBWidget({
        name: 'kbasePathways',
        version: '1.0.0',
        init(options) {
            const self = this;
            const imageWorkspace = 'nconrad:kegg',
                mapWorkspace = 'nconrad:pathwaysjson',
                container = this.$elem;
            const models = options.models,
                fbas = options.fbas;
            // add tabs
            const selectionTable = $('<table class="table table-bordered table-striped">');
            const tabs = container.kbTabs({
                tabs: [{name: 'Selection', content: selectionTable, active: true}]
            });
            this.runtime = options.runtime;
            this.workspaceClient = new Workspace(this.runtime.config('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });
            this.load_map_list = () => {
                // load table for maps
                container.loading();
                return this.workspaceClient
                    .list_objects({
                        workspaces: [mapWorkspace],
                        includeMetadata: 1
                    })
                    .then((data) => {
                        container.rmLoading();
                        const tableSettings = {
                            aaData: data,
                            fnDrawCallback: events,
                            aaSorting: [[1, 'asc']],
                            bAutoWidth: false,
                            aoColumns: [
                                {
                                    sTitle: 'Name',
                                    mData(data) {
                                        return (
                                            `<a class="pathway-link" data-map_id="${
                                                data[1]
                                            }">${
                                                data[10].name
                                            }</a>`
                                        );
                                    }
                                },
                                {sTitle: 'Map ID', mData: 1},
                                {
                                    sTitle: 'Rxn Count',
                                    sWidth: '10%',
                                    mData(data) {
                                        const metadata = data[10];
                                        if ('Number reactions' in metadata) {
                                            return parseInt(metadata['Number reactions']);
                                        }
                                        return content.na();

                                    }
                                },
                                {
                                    sTitle: 'Cpd Count',
                                    sWidth: '10%',
                                    mData(data) {
                                        const metadata = data[10];
                                        if ('Number compounds' in metadata) {
                                            return parseInt(metadata['Number compounds']);
                                        }
                                        return content.na();

                                    }
                                },
                                {
                                    sTitle: 'Source',
                                    sWidth: '10%',
                                    mData() {
                                        return 'KEGG';
                                    }
                                }
                            ],
                            oLanguage: {
                                sEmptyTable: 'No objects in workspace',
                                sSearch: 'Search:'
                            }
                        };

                        selectionTable.dataTable(tableSettings);
                        return true;
                    })
                    .catch((err) => {
                        console.error(err);
                        // xss safe
                        container.prepend($errorAlert(err));
                        return false;
                    });
            };

            function events() {
                // event for clicking on pathway link
                container.find('.pathway-link').unbind('click');
                container.find('.pathway-link').click(function () {
                    const map_id = $(this).data('map_id'),
                        name = $(this).text(),
                        elemID = `${map_id  }-${  self.uuid()}`,
                        container = $(`<div id="path-container-${  elemID  }" style="position:relative;">`);
                    container.loading();
                    tabs.addTab({name, removable: true, content: container});
                    load_map(map_id, container, elemID);
                    tabs.showTab(name);
                });
                // tooltip for hover on pathway name
                container.find('.pathway-link').tooltip({
                    title: 'Open path tab',
                    placement: 'right',
                    delay: {show: 1000}
                });
            } // end events

            function load_map(map, container, elemID) {
                Promise.all([
                    self.workspaceClient.get_objects([{workspace: imageWorkspace, name: `${map  }.png`}]),
                    self.workspaceClient.get_objects([{workspace: mapWorkspace, name: map}])
                ])
                    .spread((imgRes, mapRes) => {
                        const image = imgRes[0].data.id,
                            mapData = mapRes[0].data;
                        // no need to decode...
                        // xss safe
                        container.append(
                            `<img src="data:image/png;base64,${image}" style="display: inline-block;">`
                        );
                        // xss safe
                        container.append(`<div id="pathway-${elemID}" style="position:absolute; top:0;">`);
                        container.rmLoading();
                        const modelSeedPathway = new ModelSeedPathway({
                            elem: `pathway-${  elemID}`,
                            usingImage: true,
                            mapData,
                            models,
                            fbas,
                            runtime: self.runtime
                        });
                        modelSeedPathway.render();
                        return null;
                    })
                    .catch((err) => {
                        console.error('Error loading map');
                        console.error(err);
                    });
            }

            this.load_map_list();
            return this;
        } //end init
    });
});
