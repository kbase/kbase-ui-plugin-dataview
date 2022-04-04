define([
    'bluebird',
    'preact',
    'kb_lib/widgetUtils',
    'lib/Params',
    'lib/formatters',
    'components/Loading2',
    './components/LinkedOntologyTerms',
    'components/SimpleError',
    './model'
], (
    Promise,
    preact,
    widgetUtils,
    Params,
    fmt,
    Loading,
    LinkedOntologyTerms,
    SimpleError,
    Model
) => {
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
            preact.render(preact.h(Loading, {message: 'Looking for linked ontology terms...'}), this.node);

            // // Get the object form the model.
            this.model = new Model({
                runtime: this.runtime,
                workspaceId: this.workspaceId,
                objectId: this.objectId,
                objectVersion: this.objectVersion
            });

            // // Display the object!

            return this.model
                .getLinkedTerms()
                .then((linkedTerms) => {
                    preact.render(preact.h(LinkedOntologyTerms, {linkedTerms}), this.node);
                })
                .catch((error) => {
                    console.error('ERROR!', error.message);
                    preact.render(preact.h(SimpleError, {message: error.message}), this.node);
                });
        }

        stop() {}

        detach() {
            this.node = '';
        }
    }

    return Viewer;
});
