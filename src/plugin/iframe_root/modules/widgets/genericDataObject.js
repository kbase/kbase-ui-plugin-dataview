define(['preact', 'htm', 'components/Empty'], (preact, htm, Empty) => {
    const html = htm.bind(preact.h);
    function factory({}) {
        let parent,
            container;

        function attach(node) {
            parent = node;
            container = parent.appendChild(document.createElement('div'));
        }

        function render() {
            preact.render(
                html`<${Empty} message="This object does not have a specific visualization" />`,
                container
            );
        }

        function start(params) {
            render(params);
        }

        function detach() {
            if (container) {
                parent.removeChild(container);
                container = null;
            }
        }

        return {
            attach,
            start,
            detach
        };
    }

    return {
        make: (config) => {
            return factory(config);
        }
    };
});
