define([
    'bluebird',
    'knockout',
    'kb_lib/widgetUtils',
    'kb_lib/html',
    'kb_lib/htmlBuilders',
    './components/main',
    './model'
], function (Promise, ko, widgetUtils, html, htmlBuilders, MainComponent, Model) {
    'use strict';

    const t = html.tag,
        div = t('div');

    class Viewer {
        constructor(config) {
            this.runtime = config.runtime;
            this.workspaceId = config.workspaceId;
            this.objectId = config.objectId;
            this.objectVersion = config.objectVersion;
            this.createdObjects = null;

            this.vm = {
                runtime: config.runtime,
                state: ko.observable(),
                error: ko.observable()
            };
        }

        loadRootComponent() {
            this.node.innerHTML = div({
                dataBind: {
                    component: {
                        name: MainComponent.quotedName(),
                        params: {
                            report: 'report',
                            links: 'links',
                            createdObjects: 'createdObjects',
                            runtime: 'runtime',
                            workspaceId: 'workspaceId',
                            objectId: 'objectId',
                            objectVersion: 'objectVersion'
                        }
                    }
                }
            });
            ko.applyBindings(this.vm, this.node);
        }

        // LIFECYCLE

        attach(node) {
            this.node = node;
        }

        start(params) {
            const p = new widgetUtils.Params(params);
            this.workspaceId = p.check('workspaceId', 'number', {
                required: true
            });
            this.objectId = p.check('objectId', 'number', {
                required: true
            });
            this.objectVersion = p.check('objectVersion', 'number', {
                required: true
            });

            this.vm.workspaceId = this.workspaceId;
            this.vm.objectId = this.objectId;
            this.vm.objectVersion = this.objectVersion;

            this.node.innerHTML = htmlBuilders.loading();

            this.model = new Model({
                runtime: this.runtime,
                workspaceId: this.workspaceId,
                objectId: this.objectId,
                objectVersion: this.objectVersion
            });
            this.vm.model = this.model;

            return this.model
                .fetchReport()
                .then((report) => {
                    this.vm.report = report;
                    return Promise.all([this.model.getLinks(), this.model.getCreatedObjects()]);
                })
                .spread((links, objects) => {
                    this.vm.links = links;
                    this.vm.createdObjects = objects;
                    this.loadRootComponent();
                });
        }

        stop() {}

        detach() {
            this.node.innerHTML = '';
        }
    }

    return Viewer;
});
