define([
    'preact',
    'htm',
    'uuid',
    'bluebird',

    // for effect
    'css!./WidgetWrapper.css'
], (
    preact,
    htm,
    Uuid,
    Promise
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class WidgetWrapper extends Component {
        constructor(props) {
            super(props);
            this.ref = preact.createRef();
            this.state = {
                status: 'ok',
                error: null
            };
        }

        componentDidMount() {
            if (this.ref.current === null) {
                return;
            }
            const widgetManager = this.props.runtime.service('widget').getWidgetManager();
            widgetManager.makeWidget(this.props.id, this.props.config)
                .then((widget) => {
                    this.widget = widget;
                    return (this.widget.init && this.widget.init()) || null;
                })
                .then(() => {
                    return (this.widget.attach && this.widget.attach(this.ref.current)) || null;
                })
                .then(() => {
                    return (this.widget.start && this.widget.start(this.props.params)) || null;
                })
                .catch((err) => {
                    this.setState({
                        status: 'error',
                        error: {
                            message: err.message
                        }
                    });
                });
        }

        componentWillUnmount() {
            Promise.try(() => {
                return this.widget.stop && this.widget.stop();
            })
                .then(() => {
                    return this.widget.detach && this.widget.detach();
                })
                .then(() => {
                    return (this.widget.destroy && this.widget.destroy()) || null;
                });
        }

        renderOk() {
            return html`
                <div 
                    ref=${this.ref} 
                    style=${this.props.style || {}} 
                    className=${this.props.className || ''}></div>
            `;
        }

        renderError() {
            return html`
                <div className="alert alert-danger">
                    ${this.state.error.message}
                </div>
            `;
        }

        renderState() {
            switch (this.state.status) {
            case 'ok':
                return this.renderOk();
            case 'error':
                return this.renderError();
            }
        }

        render() {
            const style = {};
            if (this.props.scrolling) {
                style.overflowY = 'auto';
            }
            return html`
            <div className="WidgetWrapper" style=${style}>
                ${this.renderState()}
            </div>
           `;
        }
    }

    return WidgetWrapper;
});
