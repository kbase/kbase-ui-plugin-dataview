define([
    'bluebird',
    'preact',
    'kb_lib/widgetUtils',
    'lib/Params',
    'lib/formatters',
    'components/Loading',
    './components/LinkedSamples',
    './components/Error',
    './model'
], function (
    Promise,
    preact,
    widgetUtils,
    Params,
    fmt,
    Loading,
    LinkedSamples,
    Error,
    Model
) {
    'use strict';

    class Viewer {
        constructor(config) {
            this.runtime = config.runtime;
            this.workspaceId = config.workspaceId;
            this.objectId = config.objectId;
            this.objectVersion = config.objectVersion;
            this.createdObjects = null;
        }

        // LIFECYCLE

        attach(node) {
            this.node = node;
        }

        start(params) {
            // Check params
            const p = new Params(params);
            this.workspaceId = p.check('workspaceId', 'integer', {
                required: true
            });
            this.objectId = p.check('objectId', 'integer', {
                required: true
            });
            this.objectVersion = p.check('objectVersion', 'integer', {
                required: true
            });

            // Display loading spinner...
            preact.render(preact.h(Loading, { }), this.node);

            // // Get the object form the model.
            this.model = new Model({
                runtime: this.runtime,
                workspaceId: this.workspaceId,
                objectId: this.objectId,
                objectVersion: this.objectVersion
            });

            // // Display the object!

            return this.model
                .getLinkedSamples()
                .then((linkedSamples) => {
                    preact.render(preact.h(LinkedSamples, {linkedSamples}), this.node);
                })
                .catch((error) => {
                    preact.render(preact.h(Error, {message: error.message}), this.node);
                });
        }

        stop() {}

        detach() {
            this.node = '';
        }
    }

    return Viewer;
});
