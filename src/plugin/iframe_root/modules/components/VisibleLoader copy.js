/* eslint-disable react/no-did-mount-set-state */
define([
    'preact',
    'htm',
    './VisibleLoader.styles'
], (
    {Component, cloneElement, createRef, h},
    htm,
    styles
) => {
    const html = htm.bind(h);

    class VisibleLoader extends Component {
        constructor(props) {
            super(props);
            this.ref = createRef();
            // this.observer = null;
            this.state = {
                visible: false
            };
        }

        async componentDidMount() {
            if (this.ref.current === null) {
                console.log('NO REF');
                // what to do???
            }
            this.setState({
                visible: this.isInViewport()
            });
        }

        isInViewport() {
            if (this.ref.current === null) {
                return;
            }

            const element = this.ref.current;
            const container = element.closest('.DataTable4-body');
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const isVisible = (
                elementRect.top >= containerRect.top &&
        elementRect.left >= containerRect.left &&
        elementRect.bottom <= containerRect.bottom &&
        elementRect.right <= containerRect.right
            );
            // console.log('visible?', isVisible);
            // console.log('element', elementRect.bottom, elementRect.right);
            // console.log('container', container.innerHeight, container.innerWidth, container.clientHeight, container.clientWidth);
            return isVisible;
        }

        onScroll(e) {
            console.log('scrolled!', e);
        }

        renderChildren() {
            console.log('render children??', this.state.visible, this.props);
            if (!this.isInViewport()) {
                return;
            }
            console.log('visible i guess?', this.props);
            // return cloneElement(this.props.children[0], this.props);
            return this.props.children;
        }


        render() {
            return html`
            <div ref=${this.ref} onScroll=${this.onScroll.bind(this)}>
                ${this.renderChildren()}
            </div>
            `;
        }
    }

    return VisibleLoader;
});
