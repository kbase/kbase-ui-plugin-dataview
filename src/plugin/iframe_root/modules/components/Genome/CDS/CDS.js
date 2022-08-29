define([
    'preact',
    'htm',
    'components/Loading',
    'components/SimpleError',
    'lib/Model',
    './CDSViewer',
], (
    preact,
    htm,
    Loading,
    SimpleError,
    Model, 
    CDSViewer
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class CDS extends Component {
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
                const value = await this.model.getCDS({
                    ref: this.props.objectInfo.ref, 
                    cdsId: this.props.cdsId
                });

                this.setState({
                    status: 'SUCCESS',
                    value
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
                <${Loading} message="Loading CDS..." />
            `;
        }

        renderError({message}) {
            return html`
                <${SimpleError} message=${message} />
            `;
        }

        renderSuccess(value) {
            return html`
                <${CDSViewer} cdsData=${value} objectInfo=${this.props.objectInfo}/>
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
    return CDS;
});
