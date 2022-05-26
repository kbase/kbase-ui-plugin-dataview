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
], ($, colorbrewer, Workspace, Uuid, {htmlSafeErrorMessage}) => {
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

                    let $commentsTable;
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

                    if (Object.keys(comments).length) {
                        if (comments['external resource']) {
                            comments['external resource'] = $.jqElem('a')
                                .attr('href', comments['external resource'])
                                .attr('target', '_blank')
                                .append(comments['external resource']);
                        }

                        $commentsTable = $.jqElem('div').kbaseTable({
                            allowNullRows: false,
                            structure: {
                                keys: Object.keys(comments).sort(),
                                rows: comments
                            }
                        });
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

                    const $metaTable = $.jqElem('div').kbaseTable({
                        allowNullRows: false,
                        structure: {
                            keys: [
                                {value: 'ontology1', label: 'Ontology 1'},
                                {value: 'ontology2', label: 'Ontology 2'},
                                {value: 'comment', label: 'Comment'}
                            ],
                            rows: {
                                ontology1: dict_links[data.ontology1]
                                    ? $.jqElem('a')
                                        .attr('href', `/#dataview/${  dict_links[data.ontology1]}`)
                                        .attr('target', '_blank')
                                        .append(data.ontology1)
                                    : data.ontology1,
                                ontology2: dict_links[data.ontology2]
                                    ? $.jqElem('a')
                                        .attr('href', `/#dataview/${  dict_links[data.ontology2]}`)
                                        .attr('target', '_blank')
                                        .append(data.ontology2)
                                    : data.ontology2,
                                comment: $commentsTable ? $commentsTable.$elem : data.comment
                            }
                        }
                    });

                    $metaElem.append($metaTable.$elem);

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
                            $linkCell.empty();

                            $linkCell.append($self.termLink(data[2], equivalent_dictionary));
                        }
                    });

                    $dt.rows.add(table_data).draw();

                    $self.data('loaderElem').hide();
                    $self.data('globalContainerElem').show();
                })
                .catch((err) => {
                    $self.$elem.empty();
                    // safe
                    $self.$elem.addClass('alert alert-danger').html(`Could not load object : ${htmlSafeErrorMessage(err)}`);
                });

            this.appendUI(this.$elem);

            return this;
        },

        termLink(term_id, dictionary) {
            if (dictionary != undefined) {
                return $.jqElem('a')
                    .attr('target', '_blank')
                    .attr('href', `/#dataview/${dictionary}?term_id=${  term_id}`)
                    .append(term_id);
            }
            return term_id;

        },

        appendUI: function appendUI($elem) {
            // $elem.css({
            //     width: '95%',
            //     'padding-left': '10px'
            // });

            $elem.append($.jqElem('style').text('.ontology-top { vertical-align : top }'));

            const $self = this;

            const $loaderElem = $.jqElem('div')
                .append(
                    '<br>&nbsp;Loading data...<br>&nbsp;please wait...<br>&nbsp;Data parsing may take upwards of 30 seconds, during which time this page may be unresponsive.'
                )
                .append($.jqElem('br'))
                .append(
                    $.jqElem('div')
                        .attr('align', 'center')
                        .append(
                            $.jqElem('i')
                                .addClass('fa fa-spinner')
                                .addClass('fa fa-spin fa fa-4x')
                        )
                );

            $self.data('loaderElem', $loaderElem);
            $elem.append($loaderElem);

            const $globalContainer = $self.data('globalContainerElem', $.jqElem('div').css('display', 'none'));
            $elem.append($globalContainer);

            const $metaElem = $self.data('metaElem', $.jqElem('div'));

            const $metaContainerElem = $self.createContainerElem('Translation Information', [$metaElem]);

            $self.data('metaContainerElem', $metaContainerElem);
            $globalContainer.append($metaContainerElem);

            const $tableElem = $.jqElem('table')
                .addClass('display')
                .css({width: '100%', border: '1px solid #ddd'});

            $self.data('tableElem', $tableElem);
            $self.data('colorMapElem', $.jqElem('div'));

            const $containerElem = $self.createContainerElem('Translation Dictionary', [$tableElem]);

            $self.data('containerElem', $containerElem);
            $globalContainer.append($containerElem);

            return $elem;
        },
        createContainerElem(name, content, display) {
            const panelHeadingId = new Uuid(4).format();
            const panelCollapseId = new Uuid(4).format();

            const $panelBody = $.jqElem('div').addClass('panel-body collapse in');

            $.each(content, (i, v) => {
                $panelBody.append(v);
            });

            const $containerElem = $.jqElem('div')
                .addClass('panel panel-default')
                .css('display', display)
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
                        .append(
                            $.jqElem('h4')
                                .addClass('panel-title')
                                .append(
                                    $.jqElem('span')
                                        .attr('data-toggle', 'collapse')
                                        .attr('data-target', `#${  panelCollapseId}`)
                                        .attr('aria-expanded', 'true')
                                        .attr('aria-controls', `#${  panelCollapseId}`)
                                        .css('cursor', 'pointer')
                                        .append(
                                            $.jqElem('span')
                                                .text(name)
                                                .css('margin-left', '10px')
                                        )
                                )
                        )
                )
                .append(
                    $.jqElem('div')
                        .addClass('panel-collapse collapse in')
                        .attr('id', panelCollapseId)
                        .attr('role', 'tabpanel')
                        .attr('aria-expanded', 'true')
                        .append($panelBody)
                );

            return $containerElem;
        }
    });
});
