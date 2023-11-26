define(['kb_common/html'], (html) => {
    function objectRef(object) {
        return [object.info[6], object.info[0], object.info[4]].join('/');
    }

    function factory({runtime}) {
        let container;
        const t = html.tag,
            div = t('div'),
            table = t('table'),
            tr = t('tr'),
            td = t('td'),
            a = t('a');

        function renderOverview(object) {
            const ref = objectRef(object);
            return table({class: 'table table-striped'}, [
                tr([td('Dataview'), td(a({href: runtime.europaURL({hash: `dataview/${ref}`}).toString(), target: '_top'}, ref))])
            ]);
        }

        function attach(node) {
            container = node;
            // xss safe
            container.innerHTML = div({class: 'well'}, html.loading('Loading object overview...'));
        }
        function start(params) {
            // xss safe
            container.innerHTML = div({class: 'well'}, renderOverview(params.object));
        }

        return {
            attach,
            start
        };
    }
    return {
        make(config) {
            return factory(config);
        }
    };
});
