define([
    'preact',
    'htm',
    'kb_lib/widgetUtils',
    'components/Progress',
    './model',
    'components/SimpleError',
    'components/SimpleWarning',
    'components/SimpleInfo',
    'components/Loading',
    './components/Main',
    './constants'
], (
    preact,
    htm,
    widgetUtils,
    Progress,
    Model,
    SimpleError,
    SimpleWarning,
    SimpleInfo,
    Loading,
    Main,
    {status: {NONE, ATTACHED, STARTING, STARTED, ERROR, STOPPING, STOPPED, DETACHED}}
) => {
    const html = htm.bind(preact.h);

    class Viewer {
        constructor(config) {
            this.runtime = config.runtime;
            this.workspaceId = config.workspaceId;
            this.objectId = config.objectId;
            this.objectVersion = config.objectVersion;
            this.createdObjects = null;
            this.status = NONE;
        }

        // LIFECYCLE

        attach(node) {
            this.node = node;
            this.status = ATTACHED;
        }

        renderSimpleProgress(progress) {
            return html`Loading <span className="text-info" style=${{fontWeight: 'bold'}}>${progress}
                %</span> ...`;
        }

        onProgress(current, total) {
            const progress = Math.round(100 * current / total);
            this.renderProgress(progress);
        }

        renderProgress(progress) {
            const content = html`
                <div style=${{width: '50%'}}>
                    <div>Loading samples...</div>
                    <${Progress} progress=${progress}/>
                </div>
            `;
            preact.render(content, this.node);
        }

        async start(params) {
            // Check params
            this.status = STARTING;
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

            // Display loading spinner...
            // this.renderProgress(0);
            preact.render(preact.h(Loading, {message: 'Loading ...'}), this.node);

            // Get the object from the model.
            const model = new Model({
                runtime: this.runtime,
                workspaceId: this.workspaceId,
                objectId: this.objectId,
                objectVersion: this.objectVersion
            });

            // Display the object!

            try {
                const {info: objectInfo, data: sampleSet} = await model.getObject();

                preact.render(preact.h(Main, params), this.node);
                this.status = STARTED;
            } catch (ex) {
                if ([STOPPING, STOPPED, DETACHED].includes(this.status)) {
                    // ignore, this means the tab has been closed.
                    return;
                }

                this.status = ERROR;
                console.error('Error fetching samples', ex);
                preact.render(preact.h(SimpleError, {message: ex.message}), this.node);
            }
        }

        stop() {
            if (this.status === STARTING) {
                this.status = STOPPING;
            }
            // Should cancel any pending requests here...
            this.status = STOPPED;
        }

        detach() {
            this.node = '';
            this.status = DETACHED;
        }
    }

    return Viewer;
});
