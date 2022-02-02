define([
    'bluebird',
    'preact',
    'kb_lib/widgetUtils',
    'lib/Params',
    'lib/formatters',
    'components/Loading',
    './components/LinkedSamples',
    'components/SimpleError',
    './model'
], (
    Promise,
    preact,
    widgetUtils,
    Params,
    fmt,
    Loading,
    LinkedSamples,
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
            this.state = {
                status: 'NONE'
            };
        }

        // LIFECYCLE

        setState(newState) {
            this.state = newState;
        }

        attach(node) {
            this.node = node;
            this.setState({
                status: 'ATTACHED'
            });
        }

        start(params) {
            this.setState({
                status: 'STARTING'
            });
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
            preact.render(preact.h(Loading, {message: 'Loading Linked Samples...'}), this.node);

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
                    if (['STOPPED', 'DETACHED'].includes(this.state.status)) {
                        return;
                    }
                    const sortedLinkedSamples = linkedSamples.sort((a, b) => {
                        return a.sample.name.localeCompare(b.sample.name);
                    });
                    preact.render(preact.h(LinkedSamples, {linkedSamples: sortedLinkedSamples}), this.node);
                    this.setState({
                        status: 'STARTED'
                    });
                })
                .catch((error) => {
                    if (['STOPPED', 'DETACHED'].includes(this.state.status)) {
                        return;
                    }
                    this.setState({
                        status: 'ERROR',
                        message: error.message
                    });
                    preact.render(preact.h(SimpleError, {message: error.message}), this.node);
                });
        }

        stop() {
            this.setState({
                status: 'STOPPED'
            });
        }

        detach() {
            this.setState({
                status: 'DETACHED'
            });
            this.node = '';
        }
    }

    return Viewer;
});
