/* eslint-disable react/no-did-mount-set-state */
define([
    'preact',
    'htm',
    './VisibleLoader.styles'
], (
    {Component, createRef, h},
    htm,
    styles
) => {
    const html = htm.bind(h);

    class VisibleLoader extends Component {
        constructor(props) {
            super(props);
            this.ref = createRef();
            this.observer = null;
            this.state = {
                visible: false
            };
        }

        async componentDidMount() {
            if (this.ref.current === null) {
                // what to do???
            }
            const element = this.ref.current;
            const container = element.closest('.DataTable4-body');
            this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
                root: container,
                rootMargin: '0px',
                threshold: 1.0
            });
            this.observer.observe(element);
            this.setState({
                visible: false
            });
        }

        onIntersection(entries) {
            // Only switch visibility if not yet visible!
            if (!this.state.visible) {
                this.setState({
                    visible: entries[0].isIntersecting
                });
            }
        }

        // isInViewport() {
        //     if (this.ref.current === null) {
        //         return;
        //     }

        //     const element = this.ref.current;
        //     const container = element.closest('.DataTable4-body');
        //     const containerRect = container.getBoundingClientRect();
        //     const elementRect = element.getBoundingClientRect();
        //     const isVisible = (
        //         elementRect.top >= containerRect.top &&
        // elementRect.left >= containerRect.left &&
        // elementRect.bottom <= containerRect.bottom &&
        // elementRect.right <= containerRect.right
        //     );
        //     // console.log('visible?', isVisible);
        //     // console.log('element', elementRect.bottom, elementRect.right);
        //     // console.log('container', container.innerHeight, container.innerWidth, container.clientHeight, container.clientWidth);
        //     return isVisible;
        // }

        // onScroll(e) {
        //     console.log('scrolled!', e);
        // }

        renderChildren() {
            if (!this.state.visible) {
                return;
            }
            return this.props.children;
        }

        render() {
            return html`
            <div ref=${this.ref}>
                ${this.renderChildren()}
            </div>
            `;
        }
    }

    return VisibleLoader;
});
