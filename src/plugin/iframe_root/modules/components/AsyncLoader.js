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
            this.state = {
                status: 'none'
            };
        }

        async componentDidMount() {
            try {
                const result = await this.props.loader();
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

        async shouldComponentUpdate({key}, {status}) {
            if (key === this.props.key && status === this.state.status) {
                return false;
            }
            return true;
        }

        renderLoading() {
            const message = this.props.message || 'Loading...';
            if (this.props.renderLoading) {
                return this.props.renderLoading(message);
            }
            return html`
                <${Loading} inline=${this.props.inlineLoading || false} message=${message} />
            `;
        }

        renderError(message) {
            return html`
                <${SimpleError} message=${message} />
            `;
        }

        renderSuccess(result) {
            return html`
                <${this.props.component} ...${result} />
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
