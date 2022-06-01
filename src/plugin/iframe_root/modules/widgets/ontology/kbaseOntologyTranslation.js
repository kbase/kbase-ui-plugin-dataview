define([
    'jquery',
    './colorbrewer/colorbrewer', // new dep
    'kb_service/client/workspace',
    'uuid',
    'lib/domUtils',

    // For effect
    'datatables_bootstrap',
    'kbaseUI/widget/legacy/authenticatedWidget',
    'kbaseUI/widget/legacy/kbaseTable'
], ($, colorbrewer, Workspace, Uuid, {errorMessage}) => {
    $.KBWidget({
        name: 'KBaseOntologyTranslation',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        options: {
            //object_name: 'interpro2go',
            //workspace_name: 'KBaseOntology'
        },
        init: function init(options) {
            this._super(options);

            const objectIdentity = {};
            if (this.options.workspaceId) {
                objectIdentity.wsid = this.options.workspaceId;
            } else if (this.options.workspaceName) {
                objectIdentity.workspace = this.options.workspaceName;
            } else {
                throw new Error('Workspace id or name required');
            }

            if (this.options.objectId) {
                objectIdentity.objid = this.options.objectId;
            } else if (this.options.objectName) {
                objectIdentity.name = this.options.objectName;
            } else {
                throw new Error('Object id or name required');
            }

            this.colors = colorbrewer.Set2[8];
            this.colorMap = {};

            const $self = this;

            const ws = new Workspace(this.runtime.config('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });

            ws.get_objects([objectIdentity])
                .then((data) => {
                    data = data[0].data;

                    const $metaElem = $self.data('metaElem');

                    $metaElem.empty();

                    const comments = {};

                    data.comment.split(/\n/).forEach((v) => {
                        let tmp = v.split(/:/);
                        if (tmp.length > 2) {
                            const tail = tmp.slice(1, tmp.length).join(':');
                            tmp = [tmp[0], tail];
                        }
                        if (tmp.length === 2) {
                            comments[tmp[0]] = tmp[1];
                        }
                    });

                    let $commentsTable;
                    if (Object.keys(comments).length) {
                        if (comments['external resource']) {
                            comments['external resource'] = $.jqElem('a')
                                .attr('href', comments['external resource'])
                                .attr('target', '_blank')
                                .text(comments['external resource']);
                        }

                        $commentsTable = $('<table>').addClass('table')
                            // safe
                            .append($('<tbody>')
                                // safe
                                .append(Object.entries(comments).map(([key, value]) => {
                                    return $('<tr>')
                                        // safe
                                        .append($('<th>').text(key))
                                        // safe
                                        .append($('<td>').text(value));
                                })));
                    }

                    const dict_links = {
                        ncbi: 'KBaseOntology/1',
                        po: 'KBaseOntology/2',
                        go: 'KBaseOntology/3',
                        toy: 'KBaseOntology/4',
                        sso: 'KBaseOntology/8',
                        peo: 'KBaseOntology/9',
                        pto: 'KBaseOntology/10',
                        eo: 'KBaseOntology/11'
                    };

                    const $metaTable = $('<table>').addClass('table')
                        // safe
                        .append($('<tbody>')
                            // safe
                            .append($('<tr>')
                                // safe
                                .append($('<th>').text('Ontology 1'))
                                // safe
                                .append($('<td>').html(dict_links[data.ontology1] ? $.jqElem('a')
                                    .attr('href', `/#dataview/${  dict_links[data.ontology1]}`)
                                    .attr('target', '_blank')
                                    .text(data.ontology1)
                                    : data.ontology1)))
                            // safe
                            .append($('<tr>')
                                // safe
                                .append($('<th>').text('Ontology 2'))
                                // safe
                                .append($('<td>').html(dict_links[data.ontology2] ? $.jqElem('a')
                                    .attr('href', `/#dataview/${  dict_links[data.ontology2]}`)
                                    .attr('target', '_blank')
                                    .text(data.ontology2)
                                    : data.ontology1)))

                            // safe
                            .append($('<tr>')
                                // safe
                                .append($('<th>').text('Comments'))
                                // safe
                                .append($('<td>').html($commentsTable || data.comment))));

                    // const $metaTable = $.jqElem('div').kbaseTable({
                    //     allowNullRows: false,
                    //     structure: {
                    //         keys: [
                    //             {value: 'ontology1', label: 'Ontology 1'},
                    //             {value: 'ontology2', label: 'Ontology 2'},
                    //             {value: 'comment', label: 'Comment'}
                    //         ],
                    //         rows: {
                    //             ontology1: dict_links[data.ontology1]
                    //                 ? $.jqElem('a')
                    //                     .attr('href', `/#dataview/${  dict_links[data.ontology1]}`)
                    //                     .attr('target', '_blank')
                    //                     .text(data.ontology1)
                    //                 : data.ontology1,
                    //             ontology2: dict_links[data.ontology2]
                    //                 ? $.jqElem('a')
                    //                     .attr('href', `/#dataview/${  dict_links[data.ontology2]}`)
                    //                     .attr('target', '_blank')
                    //                     .text(data.ontology2)
                    //                 : data.ontology2,
                    //             comment: $commentsTable || data.comment
                    //         }
                    //     }
                    // });

                    // safe
                    $metaElem.append($metaTable);

                    const table_data = [];

                    $.each(Object.keys(data.translation).sort(), (i, k) => {
                        const v = data.translation[k];
                        $.each(v.equiv_terms, (j, e) => {
                            table_data.push([k, e.equiv_name, e.equiv_term]);
                        });
                    });

                    const equivalent_dictionary = dict_links[data.ontology2];

                    const $dt = $self.data('tableElem').DataTable({
                        columns: [
                            {title: 'Term ID', class: 'ontology-top'},
                            {title: 'Equivalent Name'},
                            {title: 'Equivalent Term'}
                        ],
                        createdRow(row, data) {
                            const $linkCell = $('td', row).eq(2);
                            // safe
                            $linkCell.html($self.termLink(data[2], equivalent_dictionary));
                        }
                    });

                    $dt.rows.add(table_data).draw();

                    $self.data('loaderElem').hide();
                    $self.data('globalContainerElem').show();
                })
                .catch((err) => {
                    $self.$elem.empty();
                    // safe
                    $self.$elem.addClass('alert alert-danger').text(`Could not load object : ${errorMessage(err)}`);
                });

            this.appendUI(this.$elem);

            return this;
        },

        termLink(term_id, dictionary) {
            if (dictionary != undefined) {
                return $.jqElem('a')
                    .attr('target', '_blank')
                    .attr('href', `/#dataview/${dictionary}?term_id=${  term_id}`)
                    .text(term_id);
            }
            return term_id;

        },

        appendUI: function appendUI($elem) {
            // safe
            $elem.append($.jqElem('style').text('.ontology-top { vertical-align : top }'));

            const $self = this;

            const $loaderElem = $.jqElem('div')
                // safe
                .append(
                    '<br>&nbsp;Loading data...<br>&nbsp;please wait...<br>&nbsp;Data parsing may take upwards of 30 seconds, during which time this page may be unresponsive.'
                )
                // safe
                .append($.jqElem('br'))
                // safe
                .append(
                    $.jqElem('div')
                        .attr('align', 'center')
                        // safe
                        .append(
                            $.jqElem('i')
                                .addClass('fa fa-spinner')
                                .addClass('fa fa-spin fa fa-4x')
                        )
                );

            $self.data('loaderElem', $loaderElem);
            // safe
            $elem.append($loaderElem);

            const $globalContainer = $self.data('globalContainerElem', $.jqElem('div').css('display', 'none'));
            // safe
            $elem.append($globalContainer);

            const $metaElem = $self.data('metaElem', $.jqElem('div'));

            const $metaContainerElem = $self.createContainerElem('Translation Information', $metaElem);

            $self.data('metaContainerElem', $metaContainerElem);

            // safe
            $globalContainer.append($metaContainerElem);

            const $tableElem = $.jqElem('table')
                .addClass('table')
                .css({width: '100%', border: '1px solid #ddd'});

            $self.data('tableElem', $tableElem);
            $self.data('colorMapElem', $.jqElem('div'));

            const $containerElem = $self.createContainerElem('Translation Dictionary', $tableElem);

            $self.data('containerElem', $containerElem);
            // safe
            $globalContainer.append($containerElem);

            return $elem;
        },
        createContainerElem(name, $content, display) {
            const panelHeadingId = new Uuid(4).format();
            const panelCollapseId = new Uuid(4).format();

            const $panelBody = $.jqElem('div').addClass('panel-body collapse in');

            // safe
            $panelBody.html($content);

            const $containerElem = $.jqElem('div')
                .addClass('panel panel-default')
                .css('display', display)
                // safe
                .append(
                    $.jqElem('div')
                        .addClass('panel-heading')
                        .attr('id', panelHeadingId)
                        .attr('role', 'tab')
                        .on('click', function () {
                            $(this)
                                .next()
                                .collapse('toggle');
                            $(this)
                                .find('i')
                                .toggleClass('fa-rotate-90');
                        })
                        // safe
                        .html(
                            $.jqElem('h4')
                                .addClass('panel-title')
                                // safe
                                .html(
                                    $.jqElem('span')
                                        .attr('data-toggle', 'collapse')
                                        .attr('data-target', `#${panelCollapseId}`)
                                        .attr('aria-expanded', 'true')
                                        .attr('aria-controls', `#${panelCollapseId}`)
                                        .css('cursor', 'pointer')
                                        // safe
                                        .html(
                                            $.jqElem('span')
                                                .text(name)
                                                .css('margin-left', '10px')
                                        )
                                )
                        )
                )
                // safe
                .append(
                    $.jqElem('div')
                        .addClass('panel-collapse collapse in')
                        .attr('id', panelCollapseId)
                        .attr('role', 'tabpanel')
                        .attr('aria-expanded', 'true')
                        // safe
                        .html($panelBody)
                );

            return $containerElem;
        }
    });
});
