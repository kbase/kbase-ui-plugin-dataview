define([
    'preact',
    './components/LinkedSamplesLoader',
], (
    preact,
    LinkedSamplesLoader,
) => {
    class Viewer {
        constructor(config) {
            this.runtime = config.runtime;
            this.workspaceId = config.workspaceId;
            this.objectId = config.objectId;
            this.objectVersion = config.objectVersion;
        }

        // LIFECYCLE

        attach(node) {
            this.node = node;
        }

        start({workspaceId, objectId, objectVersion}) {
            // // Check params
            // const p = new Params(params);
            // this.workspaceId = p.check('workspaceId', 'integer', {
            //     required: true
            // });
            // this.objectId = p.check('objectId', 'integer', {
            //     required: true
            // });
            // this.objectVersion = p.check('objectVersion', 'integer', {
            //     required: true
            // });

            // Display loading spinner...
            preact.render(preact.h(LinkedSamplesLoader, {
                runtime: this.runtime,
                workspaceId, objectId, objectVersion
            }), this.node);

            // // // Get the object form the model.
            // this.model = new Model({
            //     runtime: this.runtime,
            //     workspaceId: this.workspaceId,
            //     objectId: this.objectId,
            //     objectVersion: this.objectVersion
            // });

            // // // Display the object!

            // return this.model
            //     .getLinkedSamples()
            //     .then((linkedSamples) => {
            //         if (['STOPPED', 'DETACHED'].includes(this.state.status)) {
            //             return;
            //         }
            //         const sortedLinkedSamples = linkedSamples.sort((a, b) => {
            //             return a.sample.name.localeCompare(b.sample.name);
            //         });
            //         preact.render(preact.h(LinkedSamples, {linkedSamples: sortedLinkedSamples}), this.node);
            //         this.setState({
            //             status: 'STARTED'
            //         });
            //     })
            //     .catch((error) => {
            //         if (['STOPPED', 'DETACHED'].includes(this.state.status)) {
            //             return;
            //         }
            //         this.setState({
            //             status: 'ERROR',
            //             message: error.message
            //         });
            //         preact.render(preact.h(SimpleError, {message: error.message}), this.node);
            //     });
        }

        stop() {
            // this.setState({
            //     status: 'STOPPED'
            // });
        }

        detach() {
            // this.setState({
            //     status: 'DETACHED'
            // });
            this.node = '';
        }
    }

    return Viewer;
});
