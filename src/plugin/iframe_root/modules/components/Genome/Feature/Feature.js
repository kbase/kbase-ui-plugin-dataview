define([
    'preact',
    'htm',
    'components/Loading',
    'components/SimpleError',
    'lib/Model',
    './FeatureViewer'
], (
    preact,
    htm,
    Loading,
    SimpleError,
    Model, 
    FeatureViewer
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Feature extends Component {
        constructor(props) {
            super(props);
            this.state = {
                status: 'NONE'
            }

            this.model = new Model({
                workspaceURL: this.props.runtime.config('services.Workspace.url'),
                authToken: this.props.runtime.service('session').getAuthToken()
            });
        }

        componentDidMount() {
            this.fetchData();
        }

        async fetchData() {
            try {
                this.setState({
                    status: 'LOADING'
                });

                // fetch data...
                const featureInfo = await this.model.getFeature({
                    ref: this.props.objectInfo.ref, 
                    featureId: this.props.featureId
                });

                const isCDSCompatible = await (async () => {
                    if ('cdss' in featureInfo.feature) {
                        return this.model.isCDSCompatible({ref: this.props.objectInfo.ref});
                    }
                })();

                this.setState({
                    status: 'SUCCESS',
                    value: {
                        featureInfo, isCDSCompatible
                    }
                });
            } catch (ex) {
                console.error(ex);
                this.setState({
                    status: 'ERROR',
                    error: {
                        message: ex.message
                    }
                })
            }
        }

        renderLoading() {
            return html`
                <${Loading} message="Loading Feature..." />
            `;
        }

        renderError({message}) {
            return html`
                <${SimpleError} message=${message} />
            `;
        }

        renderSuccess({featureInfo, isCDSCompatible}) {
            return html`
                <${FeatureViewer} 
                    runtime=${this.props.runtime}
                    featureData=${featureInfo} 
                    isCDSCompatible=${isCDSCompatible} 
                    objectInfo=${this.props.objectInfo}/>
            `;
        }
       
        render() {
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
    }
    return Feature;
});
