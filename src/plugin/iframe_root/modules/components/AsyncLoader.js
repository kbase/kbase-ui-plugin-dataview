/* eslint-disable react/no-did-mount-set-state */
define([
    'preact',
    'htm',
    'components/Loading',
    'components/SimpleError',
    './AsyncLoader.styles'
], (
    {Component, h},
    htm,
    Loading,
    SimpleError,
    styles
) => {
    const html = htm.bind(h);

    class AsyncLoader extends Component {
        constructor(props) {
            super(props);
            const {loader} = props;
            this.loader = loader;
            this.state = {
                status: 'none'
            };
        }

        async componentDidMount() {
            try {
                const result = await this.loader();
                this.setState({
                    status: 'success',
                    result
                });
            } catch (ex) {
                this.setState({
                    status: 'error',
                    error: {
                        message: ex.message
                    }
                });
            }
        }

        renderLoading() {
            return html`
                <${Loading} message=${this.props.message || 'Loading...'} />
            `;
        }

        renderError(message) {
            return html`
                <${SimpleError} message=${message} />
            `;
        }

        renderSuccess(result) {
            return html`
                <${this.props.component} data=${result} />
            `;
        }

        render() {
            switch (this.state.status) {
            case 'none':
            case 'processing':
                return this.renderLoading();
            case 'error':
                return this.renderError(this.state.error.message);
            case 'success':
                return this.renderSuccess(this.state.result);
            }
        }
    }

    return AsyncLoader;
});
