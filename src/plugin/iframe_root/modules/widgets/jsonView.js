define([
    'kb_common/html',
    'kb_common/domEvent',
    'lib/format',
    'highlight',
    'numeral',
    'bootstrap'
], (html, domEvent, {domSafeText}, highlight, numeral) => {
    const t = html.tag,
        table = t('table'),
        tbody = t('tbody'),
        tr = t('tr'),
        th = t('th'),
        td = t('td'),
        ul = t('ul'),
        li = t('li'),
        a = t('a'),
        div = t('div'),
        button = t('button'),
        p = t('p'), pre = t('pre'), code = t('code');

    function factory() {
        let container,
            workspaceInfo, theObject;

        let showLargeObject = false;

        const events = domEvent.make();

        function toggleLargeObject() {
            if (showLargeObject) {
                showLargeObject = false;
            } else {
                showLargeObject = true;
            }
            render();
        }
        function renderObjectInfoTable(objectInfo) {
            const [id, name, ws_type, saved_date, version, saved_by,
                wsid, wsname, checksum, size, metadata] = objectInfo;

            return table({
                class: 'table table-striped'
            }, tbody([
                tr([
                    th({
                        style: {
                            width: '11em'
                        }
                    }, 'Id'),
                    td(id)
                ]),
                tr([
                    th('name'),
                    td(name)
                ]),
                tr([
                    th('Type'),
                    td(ws_type)
                ]),
                tr([
                    th('Saved date'),
                    td(saved_date)
                ]),
                tr([
                    th('Version'),
                    td(version)
                ]),
                tr([
                    th('Saved by'),
                    td(saved_by)
                ]),
                tr([
                    th('Workspace Id'),
                    td(wsid)
                ]),
                tr([
                    th('Workspace name'),
                    td(wsname)
                ]),
                tr([
                    th('Checksum'),
                    td(checksum)
                ]),
                tr([
                    th('Size'),
                    td(size)
                ]),
                tr([
                    th('Metadata'),
                    td(renderMetadata(metadata))
                ])
            ]));
        }
        function renderObjectInfo(data) {
            return div([
                ul({
                    class: 'nav nav-tabs',
                    role: 'tablist'
                }, [
                    li({
                        role: 'presentation',
                        class:'active'
                    }, a({
                        href: '#objinfoRaw',
                        ariaControls: 'objinfoRaw',
                        role: 'tab',
                        dataToggle: 'tab'
                    }, 'Raw')),
                    li({
                        role: 'presentation'
                    }, a({
                        href: '#objinfoTable',
                        ariaControls: 'objinfoTable',
                        role: 'tab',
                        dataToggle: 'tab'
                    }, 'Table'))
                ]),
                div({
                    class: 'tab-content'
                }, [
                    div({
                        role: 'tabpanel',
                        class: 'tab-pane active',
                        id: 'objinfoRaw'
                    }, renderJSONRaw(data)),
                    div({
                        role: 'tabpanel',
                        class: 'tab-pane',
                        id: 'objinfoTable'
                    }, renderObjectInfoTable(data))
                ])
            ]);
        }

        function renderMetadata(metadata) {
            if (!metadata) {
                return;
            }
            return table({
                class: 'table table-striped'
            }, tbody(Array.from(Object.entries(metadata)).map(([k,v]) => {
                return tr([
                    th({
                        style: {
                            width: '11em'
                        }
                    }, k),
                    td(domSafeText(v))
                ]);
            })));
        }

        function renderWorkspaceInfoTable(workspaceInfo) {
            const [id, name, owner, moddate,
                max_objid, user_permission, global_permission,
                lockstat, metadata] = workspaceInfo;

            return table({
                class: 'table table-striped'
            }, tbody([
                tr([
                    th({
                        style: {
                            width: '11em'
                        }
                    }, 'Id'),
                    td(id)
                ]),
                tr([
                    th('Name'),
                    td(name)
                ]),
                tr([
                    th('Owner'),
                    td(owner)
                ]),
                tr([
                    th('Modification date'),
                    td(moddate)
                ]),
                tr([
                    th('Max Obj Id'),
                    td(max_objid)
                ]),
                tr([
                    th('User permission'),
                    td(user_permission)
                ]),
                tr([
                    th('Global permission'),
                    td(global_permission)
                ]),
                tr([
                    th('Lock status'),
                    td(lockstat)
                ]),
                tr([
                    th('Metadata'),
                    td(renderMetadata(metadata))
                ])
            ]));
        }
        function renderJSONRaw(data) {
            const jsString = JSON.stringify(data, true, 4);
            return pre(code(highlight.highlight('json', jsString).value));
        }
        function renderWorkspaceInfo(data) {
            return div([
                ul({
                    class: 'nav nav-tabs',
                    role: 'tablist'
                }, [
                    li({
                        role: 'presentation',
                        class:'active'
                    }, a({
                        href: '#wsinfoRaw',
                        ariaControls: 'wsinfoRaw',
                        role: 'tab',
                        dataToggle: 'tab'
                    }, 'Raw')),
                    li({
                        role: 'presentation'
                    }, a({
                        href: '#wsinfoTable',
                        ariaControls: 'wsinfoTable',
                        role: 'tab',
                        dataToggle: 'tab'
                    }, 'Table'))
                ]),
                div({
                    class: 'tab-content'
                }, [
                    div({
                        role: 'tabpanel',
                        class: 'tab-pane active',
                        id: 'wsinfoRaw'
                    }, renderJSONRaw(data)),
                    div({
                        role: 'tabpanel',
                        class: 'tab-pane',
                        id: 'wsinfoTable'
                    }, renderWorkspaceInfoTable(data))
                ])
            ]);
        }

        function renderProvenance(data) {
            const jsString = JSON.stringify(data, true, 4);
            return pre(code(highlight.highlight('json', jsString).value));
        }

        function renderObject(data) {
            let jsString = JSON.stringify(data, true, 4), comment, formatOutput = true;

            if (jsString.length > 10000) {
                if (showLargeObject) {
                    comment = div([
                        p(['Object is very large (', numeral(jsString.length).format('0.0b'), '), but being displayed anyway.']),
                        p(['If the browser is misbehaving, refresh it or ',
                            button({
                                class: 'btn btn-default',
                                id: events.addEvent('click', toggleLargeObject)
                            }, 'Redisplay with the Object Truncated'),
                            '.'])
                    ]);
                    formatOutput = false;
                } else {
                    comment = div([
                        p(['Object is too large to display fully (', numeral(jsString.length).format('0.0b'), ') truncated at 10K.']),
                        p(['You may live dangerously and ',
                            button({
                                class: 'btn btn-default',
                                id: events.addEvent('click', toggleLargeObject)
                            }, 'Display the Entire Object Without Syntax Highlighting'),
                            '.'])
                    ]);
                    jsString = jsString.substr(0, 10000);
                }
            }
            return div([
                comment,
                pre(code(formatOutput ? highlight.highlight('json', jsString).value : jsString))
            ]);
        }

        function render() {
            events.detachEvents();
            container.innerHTML = div({class: 'container-fluid'}, [
                div({class: 'row'}, [
                    div({class: 'col-md-12'}, [
                        html.makePanel({
                            title: 'object info',
                            content: renderObjectInfo(theObject.info)
                        }),
                        html.makePanel({
                            title: 'workspace info',
                            content: renderWorkspaceInfo(workspaceInfo)
                        }),
                        html.makePanel({
                            title: 'provenance',
                            content: renderProvenance(theObject.provenance)
                        }),
                        html.makePanel({
                            title: 'data',
                            content: renderObject(theObject.data)
                        })
                    ])
                ])
            ]);
            events.attachEvents();
        }

        function attach(node) {
            container = node;
            container.innerHTML = div({class: 'container-fluid'}, [
                div({class: 'row'}, [
                    div({class: 'col-md-12'}, div({class: 'well'}, html.loading('Loading object...')))
                ])
            ]);

        }
        function start(params) {
            theObject = params.object;
            workspaceInfo = params.workspaceInfo;
            render();
        }

        function detach() {
            events.detachEvents();
        }

        return {
            attach,
            start,
            detach
        };
    }
    return {
        make(config) {
            return factory(config);
        }
    };
});
