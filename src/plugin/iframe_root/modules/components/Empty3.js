define([
    'preact',
    'htm',
    './Empty3.styles'
], (
    preact,
    htm,
    styles
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Empty extends Component {
        render() {
            return html`
                <div style=${styles.wrapper}>
                    <div style=${styles.main}>
                        <div style=${styles.header}>
                            <div className="fa fa-lg fa-ban" style=${styles.icon} />
                            ${this.props.title || 'Empty'}
                        </div>
                        <div style=${styles.body}>
                            ${this.props.children}
                        </div>
                    </div>
                </div>
            `;
        }
    }
    return Empty;
});
