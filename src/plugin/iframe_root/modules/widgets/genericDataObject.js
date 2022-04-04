define(['kb_common/html'], (html) => {

    function factory({}) {
        let parent,
            container;

        const div = html.tag('div'),
            p = html.tag('p');

        function attach(node) {
            parent = node;
            container = parent.appendChild(document.createElement('div'));
        }

        function render() {
            return div([p('This object does not have a specific visualization')]);
        }

        function start(params) {
            container.innerHTML = render(params);
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
