define([
    'preact',
    'htm',
    'components/Loading2',
    'components/ErrorView',
    './LinkedSamples',
    '../model'
], (
    preact,
    htm,
    Loading,
    ErrorView,
    LinkedSamples,
    Model
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Loader extends Component {
        constructor(props) {
            super(props);
            this.state = {
                status: 'NONE'
            };
        }

        async loadData() {
            this.setState({
                status: 'LOADING'
            });

            // Display loading spinner...

            const {runtime, workspaceId, objectId, objectVersion} = this.props;

            // // Get the object form the model.
            this.model = new Model({runtime, workspaceId, objectId, objectVersion});

            // // Display the object!

            try {
                const linkedSamples = await this.model.getLinkedSamples();

                const sortedLinkedSamples = linkedSamples.sort((a, b) => {
                    return a.sample.name.localeCompare(b.sample.name);
                });

                this.setState({
                    status: 'SUCCESS',
                    value: {
                        sortedLinkedSamples
                    }
                });
            } catch (ex) {
                this.setState({
                    status: 'ERROR',
                    error: {
                        message: ex.message
                    }
                });
            }
        }

        componentDidMount() {
            this.loadData();
        }

        renderLoading() {
            return html`
                <${Loading} message="Loading linked samples..." />
            `;
        }

        renderError(error) {
            return html`
                <${ErrorView} error=${error} />
            `;
        }

        renderSuccess({sortedLinkedSamples}) {
            return html`<${LinkedSamples} linkedSamples=${sortedLinkedSamples} />`;
        }

        renderState() {
            switch (this.state.status) {
            case 'NONE':
            case 'LOADING':
                return this.renderLoading();
            case 'ERROR':
                return this.renderError(this.state.error);
            case 'SUCCESS':
                return this.renderSuccess(this.state.value);
            }
        }

        render() {
            return this.renderState();
        }
    }

    return Loader;
});