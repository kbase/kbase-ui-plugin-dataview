define(['kb_knockout/registry', 'kb_knockout/lib/generators', 'kb_knockout/lib/viewModelBase', 'kb_lib/html'], function (
    reg,
    gen,
    ViewModelBase,
    html
) {
    'use strict';

    const t = html.tag,
        span = t('span'),
        i = t('i'),
        p = t('p'),
        a = t('a'),
        div = t('div'),
        table = t('table'),
        thead = t('thead'),
        tr = t('tr'),
        th = t('th'),
        tbody = t('tbody'),
        td = t('td');

    class ViewModel extends ViewModelBase {
        constructor(params) {
            super(params);

            this.createdObjects = params.createdObjects.map((createdObject) => {
                const typeURL = params.runtime.europaURL({hash: `spec/type/${createdObject.fullType}`});
                const objectURL = params.runtime.europaURL({hash: `dataview/${createdObject.ref}`});
                return {...createdObject, typeURL, objectURL};
            })  
        }
    }

    function buildIcon() {
        return span(
            {
                class: 'fa-stack',
                style: {
                    marginRight: '10px'
                }
            },
            [
                i({
                    class: 'fa fa-circle fa-stack-2x',
                    dataBind: {
                        style: {
                            color: 'icon.color'
                        }
                    }
                }),
                i({
                    class: 'fa-inverse fa-stack-1x',
                    dataBind: {
                        class: 'icon.classNames.join(" ")'
                    }
                })
            ]
        );
    }

    function buildCreatedObjects() {
        return table(
            {
                class: 'table kb-table-lite'
            },
            [
                thead(
                    tr([
                        th({
                            style: {
                                width: '2em'
                            }
                        }),
                        th('Type'),
                        th('Object'),
                        th('Description')
                    ])
                ),
                tbody(
                    {
                        dataBind: {
                            foreach: 'createdObjects'
                        }
                    },
                    tr([
                        td(
                            {
                                style: {
                                    textAlign: 'center'
                                }
                            },
                            buildIcon()
                        ),
                        td([
                            a({
                                dataBind: {
                                    text: 'type',
                                    attr: {
                                        href: 'typeURL'
                                    }
                                },
                                target: '_blank'
                            })
                        ]),
                        td(
                            a({
                                dataBind: {
                                    text: 'name',
                                    attr: {
                                        href: 'objectURL'
                                    }
                                },
                                target: '_blank'
                            })
                        ),
                        td({
                            dataBind: {
                                text: 'description'
                            }
                        })
                    ])
                )
            ]
        );
    }

    function buildNoCreatedObjects() {
        return p(
            {
                style: {
                    fontStyle: 'italic'
                }
            },
            'No objects created for this report'
        );
    }

    function template() {
        return div(
            {
                style: {
                    padding: '8px'
                }
            },
            gen.if('createdObjects && createdObjects.length > 0', buildCreatedObjects(), buildNoCreatedObjects())
        );
    }

    function component() {
        return {
            viewModel: ViewModel,
            template: template()
        };
    }

    return reg.registerComponent(component);
});
