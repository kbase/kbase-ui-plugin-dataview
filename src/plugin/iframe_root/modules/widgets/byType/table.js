define(['knockout', 'kb_lib/html', 'kb_knockout/registry', 'kb_knockout/lib/generators'], function (ko, html, reg, gen) {
    'use strict';

    const t = html.tag,
        div = t('div'),
        span = t('span'),
        input = t('input'),
        button = t('button'),
        label = t('label'),
        select = t('select'),
        table = t('table'),
        colgroup = t('colgroup'),
        col = t('col'),
        thead = t('thead'),
        tbody = t('tbody'),
        tr = t('tr'),
        th = t('th'),
        td = t('td');

    function viewModel(params) {
        const columns = params.table.columns;
        const columnMap = {};
        const searchColumns = [];
        columns.forEach((column, index) => {
            column.pos = index;
            columnMap[column.name] = column;
            if (column.search) {
                searchColumns.push({
                    name: column.name,
                    pos: index,
                    search: ko.observable()
                });
            }
        });

        const rawTable = params.table.rows.map((row, rowIndex) => {
            return {
                naturalOrder: rowIndex,
                row: row.map(function (value, index) {
                    var formatted;
                    var col = columns[index];
                    if (col.format) {
                        formatted = col.format(value);
                    } else {
                        formatted = value;
                    }
                    return {
                        value,
                        formatted,
                        style: col.style
                    };
                })
            };
        });

        const table = ko.observableArray(rawTable);

        const title = params.title;

        const pageSizeInput = ko.observable('10');
        const pageSize = ko.pureComputed(function () {
            if (pageSizeInput().length === 0) {
                return 10;
            }
            return parseInt(pageSizeInput());
        });

        const total = table().length;

        const search = ko.observable();

        search.subscribe(function (newValue) {
            if (newValue.length > 0) {
                pageStart(0);
            }
        });

        const searchText = ko.pureComputed(function () {
            if (!search()) {
                return;
            }
            return search().toLowerCase();
        });

        // var sortColumns = ['title', 'saved', 'created'].map(function (value) {
        //     return {
        //         label: value,
        //         value: value
        //     };
        // });
        const sortBy = ko.observable();

        const sortDirections = ['asc', 'desc'].map(function (value) {
            return {
                label: value,
                value: value
            };
        });
        const sortDirection = ko.observable('desc');

        function sortIt() {
            if (!sortBy()) {
                return;
            }
            // var sortColumnName = sortBy();
            const sortColumn = columnMap[sortBy()];
            table.sort(function (a, b) {
                let comparison;
                const aValue = a.row[sortColumn.pos].value;
                const bValue = b.row[sortColumn.pos].value;
                switch (sortColumn.type) {
                    case 'string':
                    case 'date':
                    case 'number':
                        if (aValue < bValue) {
                            comparison = -1;
                        } else if (aValue > bValue) {
                            comparison = 1;
                        } else {
                            comparison = 0;
                        }
                }
                if (sortDirection() === 'desc') {
                    return comparison * -1;
                }
                return comparison;
            });
        }

        sortBy.subscribe(function () {
            sortIt();
        });
        sortDirection.subscribe(function () {
            sortIt();
        });
        sortIt();

        const filteredTable = table.filter((row) => {
            const text = searchText();
            if (!text || text.length === 0) {
                return true;
            }
            if (searchColumns.length === 0) {
                return true;
            }

            for (let i in searchColumns) {
                const searchColumn = searchColumns[i];
                if (row.row[searchColumn.pos].value.toLowerCase().indexOf(text) >= 0) {
                    // console.log('filter!', row.row[searchColumn.pos].value.toLowerCase(), text);
                    return true;
                }
            }
            return false;
        });

        const len = ko.pureComputed(() => {
            return filteredTable().length;
        });

        const pageStart = ko.observable(0);
        const pageEnd = ko.pureComputed(function () {
            return Math.min(pageStart() + pageSize(), len()) - 1;
        });

        const searchSummary = ko.pureComputed(function () {
            if (filteredTable().length === total) {
                return '';
            }
            return 'found ' + filteredTable().length + ' of ' + total;
        });

        // NB: we need index, and index is now not available in the .filter() method
        // made available by knockout-mapping.
        const tableToShow = ko.pureComputed(() => {
            const table = filteredTable();
            return filteredTable().filter((row, index) => {
                return (index >= pageStart() && index <= pageEnd());
            });
        });


        // const tableToShow = filteredTable.filter((row, index) => {
        //     console.log('index?', index);
        //     if (row.naturalOrder >= pageStart() && row.naturalOrder <= pageEnd()) {
        //         return true;
        //     }
        // });

        // filteredNarratives.subscribe(function (newValue) {
        //     last(newValue.length);
        // });

        const more = ko.pureComputed(() => {
            const left = len() - pageEnd() - 1;
            if (left === 0) {
                return '';
            }
            return 'and ' + left + ' more...';
        });

        function doPrev() {
            if (pageStart() > 0) {
                pageStart(pageStart() - 1);
            }
        }

        function doNext() {
            if (pageStart() + pageSize() < len()) {
                pageStart(pageStart() + 1);
            }
        }

        function doFirst() {
            pageStart(0);
        }

        function doLast() {
            pageStart(Math.max(len() - pageSize(), 0));
        }

        function doPrevPage() {
            if (pageStart() > pageSize()) {
                pageStart(pageStart() - pageSize());
            } else {
                doFirst();
            }
        }

        function doNextPage() {
            if (pageEnd() < len() - pageSize()) {
                pageStart(pageStart() + pageSize());
            } else {
                doLast();
            }
        }

        var pageSizes = [5, 10, 20, 50, 100].map(function (value) {
            return {
                label: String(value),
                value: String(value)
            };
        });

        function doSortByColumn(column) {
            if (sortBy() === column.name) {
                if (sortDirection() === 'asc') {
                    sortDirection('desc');
                } else {
                    sortDirection('asc');
                }
            } else {
                sortBy(column.name);
                sortDirection('desc');
            }
        }

        function doCancelSort() {
            sortBy(null);
            sortDirection(null);
            table.sort(function (a, b) {
                return b.naturalOrder - a.naturalOrder;
            });
        }

        function getColor(index) {
            var base = index % 7;
            var color = (9 + base).toString(16);
            return '#' + color + color + color;
        }

        return {
            table: tableToShow,
            columns: columns,
            title: title,
            filteredTable: filteredTable,
            pageStart: pageStart,
            pageEnd: pageEnd,
            len: len,
            total: total,
            doPrev: doPrev,
            doNext: doNext,
            doFirst: doFirst,
            doLast: doLast,
            doPrevPage: doPrevPage,
            doNextPage: doNextPage,
            search: search,
            searchSummary: searchSummary,
            pageSizeInput: pageSizeInput,
            pageSizes: pageSizes,
            // sortColumns: sortColumns,
            doSortByColumn: doSortByColumn,
            sortBy: sortBy,
            more: more,
            sortDirections: sortDirections,
            sortDirection: sortDirection,
            getColor: getColor,
            username: params.username,
            currentUsername: params.currentUsername,
            doCancelSort: doCancelSort
        };
    }

    function buildHeaderColumn() {
        return th(
            span(
                {
                    dataBind: {
                        click: '$component.doSortByColumn',
                        // style: {
                        //     'color': '$component.sortBy() === name ? "green" : "blue"'
                        // }
                        style: '$data.columnStyle'
                    },
                    style: {
                        cursor: 'pointer'
                    }
                },
                [
                    div([
                        span({
                            dataBind: {
                                text: 'label'
                            }
                        }),
                        span({
                            dataBind: {
                                visible: '$component.sortBy() === name',
                                css: {
                                    'fa-chevron-down': '$component.sortDirection() === "desc"',
                                    'fa-chevron-up': '$component.sortDirection() === "asc"'
                                }
                            },
                            class: 'fa'
                        })
                    ])
                    // div(
                    //     input({
                    //         dataBind: {
                    //             value: 'search'
                    //         }
                    //     })
                    // )
                ]
            )
        );
    }

    function buildTable() {
        // var headerCellStyle = { display: 'table-cell', fontWeight: 'bold', border: '1px silver solid', padding: '4px' };
        // var cellStyle = { display: 'table-cell', fontWeight: 'normal', border: '1px silver solid', padding: '4px' };

        return table(
            {
                class: 'table'
                // style: {
                //     width: 'auto'
                // }
            },
            [
                colgroup({}, [
                    col({
                        style: {
                            width: '5em'
                        }
                    }),
                    '<!-- ko foreach: columns -->',
                    col({
                        dataBind: {
                            attr: {
                                width: 'width'
                            }
                        }
                    }),
                    '<!-- /ko -->'
                ]),
                thead(
                    tr([
                        th(
                            {
                                style: {
                                    fontStyle: 'italic',
                                    color: 'gray'
                                }
                            },
                            '#'
                        ),
                        '<!-- ko foreach: columns -->',
                        buildHeaderColumn(),
                        '<!-- /ko -->'
                    ])
                ),
                tbody(
                    {
                        style: {
                            maxHeight: '500px'
                        }
                        // },
                        // dataBind: {
                        //     foreach: 'table'
                        // }
                    },
                    gen.foreach('table', tr({
                        // td({ dataBind: { text: '$index() + $component.pageStart() + 1' } }),
                    }, [
                        td({
                            dataBind: {
                                text: '$index() + $component.pageStart() + 1'
                            },
                            style: {
                                fontStyle: 'italic',
                                color: 'gray'
                            }
                        }),
                        gen.foreach('row', td({
                            dataBind: {
                                text: 'formatted',
                                style: 'style'
                            }
                        }))
                        // '<!-- ko foreach: $data.row -->',
                        // td({
                        //     dataBind: {
                        //         text: '$data.formatted',
                        //         style: '$data.style'
                        //     }
                        // }),
                        // '<!-- /ko -->'
                    ]))
                )
            ]
        );
    }

    function icon(type) {
        return span({
            class: 'fa fa-' + type
        });
    }

    function buildButton(iconClass, func) {
        return button(
            {
                dataBind: {
                    click: func
                },
                class: 'btn btn-default'
            },
            icon(iconClass)
        );
    }

    function buildControls() {
        return div(
            {
                style: {
                    //border: '1px red dashed'
                    margin: '0 0 4px 0'
                }
            },
            div({ class: 'btn-toolbar' }, [
                div(
                    {
                        class: 'btn-group form-inline',
                        style: {
                            width: '350px'
                        }
                    },
                    [
                        buildButton('step-backward', 'doFirst'),
                        buildButton('backward', 'doPrevPage'),
                        buildButton('chevron-left', 'doPrev'),
                        buildButton('chevron-right', 'doNext'),
                        buildButton('forward', 'doNextPage'),
                        buildButton('step-forward', 'doLast'),
                        span(
                            {
                                style: {
                                    // why not work??
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    margin: '6px 0 0 4px'
                                }
                            },
                            [
                                span({
                                    dataBind: {
                                        text: 'pageStart() + 1'
                                    }
                                }),
                                ' to ',
                                span({
                                    dataBind: {
                                        text: 'pageEnd() + 1'
                                    }
                                }),
                                ' of ',
                                span({
                                    dataBind: {
                                        text: 'len()'
                                    },
                                    style: {
                                        marginRight: '10px',
                                        verticalAlign: 'middle'
                                    }
                                })
                            ]
                        )
                    ]
                ),
                div({ class: 'btn-group form-inline' }, [
                    label(
                        {
                            style: {
                                // for bootstrap
                                marginBottom: '0'
                            }
                        },
                        [
                            select({
                                dataBind: {
                                    value: 'pageSizeInput',
                                    options: 'pageSizes',
                                    optionsText: '"label"',
                                    optionsValue: '"value"'
                                },
                                class: 'form-control'
                            }),
                            ' rows per page'
                        ]
                    )
                ]),
                div(
                    {
                        class: 'xform-inline',
                        dataBind: {
                            if: 'sortBy()'
                        },
                        style: {
                            display: 'inline-block',
                            marginLeft: '20px'
                        }
                    },
                    [
                        button(
                            {
                                type: 'button',
                                class: 'btn btn-danger btn-sm',
                                dataBind: {
                                    click: 'doCancelSort'
                                }
                            },
                            icon('times')
                        ),
                        span(
                            {
                                style: {
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    margin: '6px 0 0 4px'
                                }
                            },
                            [
                                'sorting by ',
                                span({
                                    dataBind: {
                                        text: 'sortBy'
                                    },
                                    style: {
                                        fontWeight: 'bold'
                                    }
                                }),
                                ' ',
                                span({
                                    dataBind: {
                                        text: 'sortDirection'
                                    },
                                    style: {
                                        fontWeight: 'bold'
                                    }
                                })
                            ]
                        )
                    ]
                ),
                div({ class: 'btn-group form-inline pull-right' }, [
                    span(
                        {
                            style: {
                                verticalAlign: 'middle'
                            }
                        },
                        [
                            input({
                                dataBind: {
                                    textInput: 'search'
                                },
                                class: 'form-control',
                                style: {
                                    verticalAlign: 'middle'
                                },
                                placeholder: 'search'
                            }),
                            span({
                                dataBind: {
                                    visible: 'searchSummary && searchSummary().length > 0',
                                    text: 'searchSummary'
                                },
                                style: {
                                    marginLeft: '10px'
                                }
                            })
                        ]
                    )
                ])
            ])
        );
    }

    function buildMore() {
        return div({
            dataBind: {
                visible: 'more().length > 0',
                text: 'more'
            },
            style: {
                textAlign: 'center'
            }
        });
    }

    // function buildTest() {
    //     return div(([
    //         div([
    //             'total rows: ',
    //             span({
    //                 dataBind: {
    //                     text: '$component.filteredTable().length'
    //                 }
    //             })]
    //         ),
    //         div([
    //             gen.foreach('filteredTable', div({
    //                 dataBind: {
    //                     text: 'JSON.stringify($data)'
    //                 }
    //             }))
    //         ]),
    //         div([
    //             gen.foreach('table', div({
    //                 dataBind: {
    //                     text: 'JSON.stringify($data)'
    //                 }
    //             }))
    //         ])
    //     ]))
    // }

    function template() {
        return div([
            div([buildControls(), buildTable(), buildMore()]),
            div(
                {
                    dataBind: {
                        if: 'len() === 0'
                    }
                },
                'Sorry, no rows'
            )
        ]);
    }

    function component() {
        return {
            viewModel: viewModel,
            template: template()
        };
    }
    return reg.registerComponent(component);
});
