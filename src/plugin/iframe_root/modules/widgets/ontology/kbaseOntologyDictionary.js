define([
    'jquery',
    './colorbrewer/colorbrewer', // TODO: new dependency
    'kb_service/client/workspace',
    'lib/domUtils',
    'uuid',

    // For effect
    'datatables_bootstrap',
    'kbaseUI/widget/legacy/authenticatedWidget',
    'kbaseUI/widget/legacy/kbaseTable'
], ($, colorbrewer, Workspace, {domSafeText}, Uuid) => {
    const MAPPINGS = [
        [/(EC:([\\w.-]+))/, '<a target = \'_blank\' href = \'http://enzyme.expasy.org/EC/$2\'>$1</a>'],
        [/(PMID:([\\w.-]+))/, '<a target = \'_blank\' href = \'http://www.ncbi.nlm.nih.gov/pubmed/$2\'>$1</a>'],
        [/(GOC:([\\w.-]+))/, '<a target = \'_blank\' href = \'http://www.geneontology.org/doc/GO.curator_dbxrefs\'>$1</a>'],
        [/(Wikipedia:([\\w.-]+))/, '<a target = \'_blank\' href = \'https://en.wikipedia.org/wiki/$2\'>$1</a>'],
        [/(Reactome:([\\w.-]+))/, '<a target = \'_blank\' href = \'http://www.reactome.org/content/query?q=$2\'>$1</a>'],
        [/(KEGG:([\\w.-]+))/, '<a target = \'_blank\' href = \'http://www.genome.jp/dbget-bin/www_bget?rn:$2\'>$1</a>'],
        ['(RHEA:([\\w.-]+))', '<a target = \'_blank\' href = \'http://www.rhea-db.org/reaction?id=$2\'>$1</a>'],
        [
            /(MetaCyc:([\\w.-]+))/,
            '<a target = \'_blank\' href = \'http://biocyc.org/META/NEW-IMAGE?type=NIL&object=$2\'>$1</a>'
        ],
        [
            /(UM-BBD_reactionID:([\\w.-]+))/,
            '<a target = \'_blank\' href = \'http://eawag-bbd.ethz.ch/servlets/pageservlet?ptype=r&reacID=$2\'>$1</a>'
        ],
        [
            /(UM-BBD_enzymeID:([\\w.-]+))/,
            '<a target = \'_blank\' href = \'http://eawag-bbd.ethz.ch/servlets/pageservlet?ptype=ep&enzymeID=$2\'>$1</a>'
        ],
        [
            /(UM-BBD_pathwayID:([\\w.-]+))/,
            '<a target = \'_blank\' href = \'http://eawag-bbd.ethz.ch/$2/$2_map.html\'>$1</a>'
        ],
        [/(RESID:([\\w.-]+))/, '<a target = \'_blank\' href = \'http://pir.georgetown.edu/cgi-bin/resid?id=$2\'>$1</a>'],
        [
            /(PO_GIT:([\\w.-]+))/,
            '<a target = \'_blank\' href = \'https://github.com/Planteome/plant-ontology/issues/$2\'>$1</a>'
        ],
        [
            /(TO_GIT:([\\w.-]+))/,
            '<a target = \'_blank\' href = \'https://github.com/Planteome/plant-trait-ontology/issues/$2\'>$1</a>'
        ],
        [
            /(GC_ID:([\\w.-]+))/,
            '<a target = \'_blank\' href = \'http://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi#SG$2\'>$1</a>'
        ]
    ];

    $.KBWidget({
        name: 'KBaseOntologyDictionary',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        options: {
            //object_name: 'gene_ontology', //'plant_ontology', 'ncbi_taxon_ontology', 'gene_ontology'
            //workspace_name: 'KBaseOntology'

            dictionaryMap: {
                GO: 'gene_ontology',
                SSO: 'seed_subsystem_ontology'
            }
        },
        extractLink(text) {
            if (text === undefined) {
                return text;
            }

            for (const [regex, template] in MAPPINGS) {
                text = text.replace(regex, template);
            }

            return text;
        },
        init: function init(options) {
            this._super(options);

            this.colors = colorbrewer.Set2[8];
            this.colorMap = {};
            this.termCache = {};

            this.ws = new Workspace(this.runtime.config('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });

            const subObjectIdentity = {
                included: [
                    '/format_version',
                    '/data_version',
                    '/date',
                    '/saved_by',
                    '/auto_generated_by',
                    '/subsetdef',
                    '/synonymtypedef',
                    '/default_namespace',
                    '/treat_xrefs_as_differentia',
                    '/treat_xrefs_as_is_a',
                    '/ontology',
                    '/term_hash/*/id',
                    '/term_hash/*/name',
                    '/term_hash/*/namespace',
                    //                '/term_hash/*/def',
                    //                '/term_hash/*/synonym',
                    //                '/term_hash/*/xref',
                    //                '/term_hash/*/namespace',
                    //                '/term_hash/*/relationship',
                    '/typedef_hash/'
                ]
            };
            if (this.options.workspaceId) {
                subObjectIdentity.wsid = this.options.workspaceId;
            } else if (this.options.workspaceName) {
                subObjectIdentity.workspace = this.options.workspaceName;
            } else {
                throw new Error('Workspace id or name required');
            }

            if (this.options.objectId) {
                subObjectIdentity.objid = this.options.objectId;
            } else if (this.options.objectName) {
                subObjectIdentity.name = this.options.objectName;
            } else {
                throw new Error('Object id or name required');
            }

            this.ws
                .get_object_subset([subObjectIdentity])
                .then((result) => {
                    const data = result[0].data;

                    this.dataset = data;

                    const $metaElem = this.data('metaElem');

                    $metaElem.empty();

                    const $metaTable = $.jqElem('div').kbaseTable({
                        allowNullRows: false,
                        structure: {
                            keys: [
                                {value: 'format-version', label: 'Format version'},
                                {value: 'data-version', label: 'Data version'},
                                {value: 'date'},
                                {value: 'saved-by', label: 'Saved By'},
                                {value: 'auto-generated-by', label: 'Auto Generated By'},
                                //{value: 'subsetdef'},
                                //{value: 'synonymtypedef'},
                                {value: 'default-namespace', label: 'Default Namespace'},
                                //{value: 'treat-xrefs-as-genus-differentia', label: 'Treat XREFs as genus differentia'},
                                //{value: 'treat-xrefs-as-is_a', label: 'Treat XREFs as "is a"'},
                                {value: 'ontology', label: 'ontology'}
                            ],
                            rows: {
                                'format-version': data.format_version,
                                'data-version': data.data_version,
                                date: data.date,
                                'saved-by': data.saved_by,
                                'auto-generated-by': data.auto_generated_by,
                                //'subsetdef': $.isArray(data.subsetdef) ? data.subsetdef.join('<br>') : data.subsetdef,
                                //'synonymtypedef': $.isArray(data.synonymtypedef) ? data.synonymtypedef.join('<br>') : data.synonymtypedef,
                                'default-namespace': data.default_namespace,
                                //'treat-xrefs-as-genus-differentials': $.isArray(data.treat_xrefs_as_differentia) ? data.treat_xrefs_as_differentia.join('<br>') : data.treat_xrefs_as_differentia,
                                //'treat-xrefs-as-is_a': $.isArray(data.treat_xrefs_as_is_a) ? data.treat_xrefs_as_is_a.join('<br>') : data.treat_xrefs_as_is_a,
                                ontology: data.ontology
                            }
                        }
                    });

                    $metaElem.append($metaTable.$elem);

                    const $typeDefElem = this.data('typeDefElem');
                    const typedef_data = [];
                    $.each(data.typedef_hash || {}, (k, v) => {
                        const $subtable = $.jqElem('div').kbaseTable({
                            structure: {
                                keys: Object.keys(v)
                                    .sort()
                                    .map((v) => {
                                        return {value: v, label: v, style: 'width : 200px'};
                                    }),
                                rows: v
                            },
                            striped: false
                        });

                        // safe usage of html
                        typedef_data.push([v.name || '', $subtable.$elem.html()]);
                    });

                    const $tt = $typeDefElem.DataTable({
                        columns: [{title: 'TypeDef', class: 'ontology-top'}, {title: 'Info'}]
                    });

                    $tt.rows.add(typedef_data).draw();

                    const table_data = [];

                    $.each(data.term_hash, (k, v) => {
                        table_data.push([
                            v,
                            //[v.name, $.isArray(v.synonym) ? v.synonym.join('<br>') : v.synonym, v.def].join('<br>')
                            v.name,
                            //[v.name, v.id, v.def, v.synonym, v.xref, v.namespace, v.relationship].join(',')
                            [v.id, v.name, v.namespace].join(',')
                        ]);
                    });

                    const $dt = this.data('tableElem').DataTable({
                        columns: [
                            {title: 'Term ID', class: 'ontology-top'},
                            {title: 'Term name'},
                            {title: 'Search field', visible: false}
                        ],
                        createdRow: (row, data) => {
                            const $linkCell = $('td', row).eq(0);
                            $linkCell.empty();

                            $linkCell.append(this.termLink(data[0]));

                            const $nameCell = $('td', row).eq(1);

                            let color = this.colorMap[data[0].namespace];
                            if (color === undefined) {
                                color = this.colorMap[data[0].namespace] = this.colors.shift();
                            }

                            $nameCell.css('color', color);
                        }
                    });

                    $dt.rows.add(table_data).draw();

                    this.data('colorMapElem').append('Ontology namespace key: ');

                    $.each(this.colorMap, (k, v) => {
                        this.data('colorMapElem').append(
                            $.jqElem('span')
                                .css('padding-left', '25px')
                                .css('color', v)
                                .append(k)
                        );
                    });

                    const m = location.href.match(/term_id=([^&]+)/);

                    if (m) {
                        this.appendTerm(m[1]);
                    }

                    if (this.options.term_id) {
                        this.appendTerm(this.options.term_id);
                    }

                    this.data('loaderElem').hide();
                    this.data('globalContainerElem').show();
                })
                .catch((err) => {
                    this.$elem.empty();
                    let message;
                    if (err.message) {
                        message = err.message;
                    } else if (err.error) {
                        message = err.error.message;
                    }
                    // safe usage of html
                    this.$elem.addClass('alert alert-danger').html(`Could not load object : ${domSafeText(message)}`);
                });

            this.appendUI(this.$elem);
            return this;
        },
        termLink(term, withName) {
            return $.jqElem('a')
                .append(term.id + (withName ? ` [${  term.name  }]` : ''))
                .on('click', (e) => {
                    e.preventDefault();
                    this.appendTerm(term.id);
                });
        },
        getTerm(term_id) {
            return this.dataset.term_hash[term_id];
        },
        parseISA(isa) {
            const ids = [];

            $.each(isa, (i, v) => {
                const parts = v.split(/\s*!\s*/);
                ids.push(parts[0]);
            });

            return ids;
        },
        getLineage(term_id, recursive, circular_breaker) {
            if (circular_breaker === undefined) {
                circular_breaker = {};
            }

            if (circular_breaker[term_id]) {
                return undefined;
            }

            circular_breaker[term_id] = 1;

            const term = this.getTerm(term_id);

            const parents = {};
            if (term.is_a) {
                $.each(this.parseISA(term.is_a), (i, v) => {
                    parents[v] = undefined;
                });
            } else {
                return undefined;
            }

            $.each(parents, (k) => {
                parents[k] = this.getLineage(k, true, circular_breaker);
            });

            if (!recursive) {
                //$self.reverseLineage(parents);
            }

            return parents;
        },
        buildLineageElem(lineage) {
            if (!lineage) {
                return '';
            }

            const $ul = $.jqElem('ul')
                .css('padding-left', '10px')
                .css('list-style-position', 'inside');
            //.css('list-style-type', 'none')
            let ret = {root: $ul, parent: $ul};

            $.each(lineage, (k, v) => {
                //if ($li.html().length) {
                //  $li.append(',')
                //}

                const $li = $.jqElem('li');
                $ul.append($li);

                const term = this.getTerm(k);

                $li.append(this.termLink(term));
                $li.append(' ');
                $li.append(
                    $.jqElem('span')
                        .css('color', this.colorMap[term.namespace])
                        .append(term.name)
                );

                if (v !== undefined) {
                    ret = this.buildLineageElem(v);
                    ret.parent.append($ul);
                    ret.parent = $ul;
                }
            });

            return ret;
        },
        lineageAsNodes(parent, lineage, nodes, edges, cache, depth) {
            if (nodes === undefined) {
                nodes = [];
            }
            if (edges === undefined) {
                edges = [];
            }
            if (cache === undefined) {
                cache = {};
            }

            if (depth === undefined) {
                depth = 0;
            }

            if (cache[parent] === undefined) {
                nodes.push({node: parent, tag: parent, color: this.colorMap[this.getTerm(parent).namespace]});
                cache[parent] = nodes.length - 1;
            }
            $.each(lineage, (k, v) => {
                if (cache[k] === undefined) {
                    nodes.push({name: k, tag: k, color: this.colorMap[this.getTerm(k).namespace]});
                    cache[k] = nodes.length - 1;
                }

                edges.push({source: cache[parent], target: cache[k], charge: -100 * depth});
                if (v !== undefined) {
                    this.lineageAsNodes(k, v, nodes, edges, cache, depth + 1);
                }
            });
            return {nodes, edges};
        },
        appendTerm(term_id) {
            const $termElem = this.data('termElem');
            $termElem.empty();
            this.data('termContainerElem').show();
            this.data('metaContainerElem')
                .find('.panel-heading')
                .find('i')
                .removeClass('fa-rotate-90');
            this.data('metaContainerElem')
                .find('.panel-body')
                .collapse('hide');
            this.data('containerElem')
                .find('.panel-heading')
                .find('i')
                .removeClass('fa-rotate-90');
            this.data('containerElem')
                .find('.panel-body')
                .collapse('hide');
            this.data('typeDefContainerElem')
                .find('.panel-heading')
                .find('i')
                .removeClass('fa-rotate-90');
            this.data('typeDefContainerElem')
                .find('.panel-body')
                .collapse('hide');

            if (this.termCache[term_id] === undefined) {
                $termElem.append(this.data('loaderElem'));
                this.data('loaderElem').show();

                const subObjectIdentity = {
                    included: [
                        `/term_hash/${  term_id  }/*`
                        //'/term_hash/'
                    ]
                };
                if (this.options.workspaceId) {
                    subObjectIdentity.wsid = this.options.workspaceId;
                } else if (this.options.workspaceName) {
                    subObjectIdentity.workspace = this.options.workspaceName;
                } else {
                    throw new Error('Workspace id or name required');
                }

                if (this.options.objectId) {
                    subObjectIdentity.objid = this.options.objectId;
                } else if (this.options.objectName) {
                    subObjectIdentity.name = this.options.objectName;
                } else {
                    throw new Error('Object id or name required');
                }

                this.ws
                    .get_object_subset([subObjectIdentity])
                    .then((data) => {
                        const term = data[0].data.term_hash[term_id];

                        this.termCache[term_id] = term;

                        this.data('loaderElem').hide();
                        $termElem.empty();

                        this.reallyAppendTerm(term);
                    })
                    .catch((d) => {
                        console.error(d);
                        let message;
                        if (d.message) {
                            message = d.message;
                        } else if (d.error) {
                            message = d.error.message;
                        }
                        this.$elem.empty();
                        // safe usage of html
                        this.$elem.addClass('alert alert-danger').html(`Could not load object : ${domSafeText(message)}`);
                    });
            } else {
                this.reallyAppendTerm(this.termCache[term_id]);
            }
        },
        reallyAppendTerm(term) {
            const $termElem = this.data('termElem');

            const lineage = this.getLineage(term.id);

            let $lineageElem;

            if (($lineageElem = this.buildLineageElem(lineage))) {
                $lineageElem.root.css('padding-left', '0px');

                const dataset = this.lineageAsNodes(term.id, lineage);
                dataset.nodes[0].stroke = 'yellow';

                $.jqElem('div')
                    .css({width: '500px', height: '500px'})
                    .kbaseForcedNetwork({
                        linkDistance: 150,
                        dataset
                    });
            }

            let $closureElem;
            if (term.relationship_closure !== undefined) {
                $closureElem = $.jqElem('ul').css('style', 'float : left');

                /*  var closure_data = [];
                 var term_headers = [];

                 $.each(
                 Object.keys(term.relationship_closure).sort(),
                 function (i, k) {

                 closure_headers.push({'title' : k});

                 var v = term.relationship_closure[k];

                 $.each(
                 v,
                 function (i, elem) {

                 }
                 )

                 table_data.push(
                 [
                 v,
                 //[v.name, $.isArray(v.synonym) ? v.synonym.join('<br>') : v.synonym, v.def].join('<br>')
                 v.name,
                 [v.name, v.id, v.def, v.synonym, v.xref, v.namespace, v.relationship].join(',')
                 ]
                 )
                 }
                 );

                 var $dt = $self.data('tableElem').DataTable({
                 columns : [
                 { title : 'Term ID', 'class' : 'ontology-top'},
                 { title : 'Term name'},
                 { title : 'Search field', 'visible' : false }
                 ],
                 createdRow : function(row, data, index) {

                 var $linkCell = $('td', row).eq(0);
                 $linkCell.empty();

                 $linkCell.append( $self.termLink(data[0]) )

                 var $nameCell = $('td', row).eq(1);

                 var color = $self.colorMap[data[0].namespace];
                 if (color === undefined) {
                 color = $self.colorMap[data[0].namespace] = $self.colors.shift();
                 }

                 $nameCell.css('color', color)

                 }
                 });*/

                for (const type in term.relationship_closure) {
                    $closureElem.append($.jqElem('li').append(`${type  } relationships`));

                    const $subUL = $.jqElem('ul');
                    $closureElem.append($subUL);

                    $.each(term.relationship_closure[type], (i, elem) => {
                        const term = this.getTerm(elem[0]);

                        $subUL.append(
                            $.jqElem('li')
                                .append(`${elem[1]  } away - `)
                                .append(this.termLink(term))
                                .append(' - ')
                                .append(
                                    $.jqElem('span')
                                        .css('color', this.colorMap[term.namespace])
                                        .append(term.name)
                                )
                        );
                    });
                }
            }

            const $relationship = $.jqElem('div');

            if (term.relationship !== undefined) {
                $.each(term.relationship, (i, rel) => {
                    const parts = rel.split(/ ! /);
                    this.extractLink(parts[0]);
                    $relationship
                        .append(parts[0])
                        .append(' ! ')
                        .append(parts[1])
                        .append('<br>');
                });
            }

            const $table = $.jqElem('div').kbaseTable({
                allowNullRows: false,
                structure: {
                    keys: [
                        {value: 'id', label: 'ID'},
                        'name',
                        'def',
                        'namespace',
                        'synonym',
                        'comment',
                        {value: 'is_a', label: 'Is A'},
                        'relationship',
                        'xref'
                    ],
                    rows: {
                        id: term.id,
                        name: term.name,
                        def: this.extractLink($.isArray(term.def) ? term.def.join('<br>') : term.def),
                        namespace: term.namespace,
                        synonym: $.isArray(term.synonym) ? term.synonym.join('<br>') : term.synonym,
                        comment: term.comment,
                        is_a: $closureElem ? $.jqElem('div').append($closureElem) : undefined, //$lineageElem.root, // or $force.$elem
                        relationship: term.relationship ? $relationship : undefined,
                        xref: this.extractLink($.isArray(term.xref) ? term.xref.join('<br>') : term.xref)
                    }
                }
            });

            $termElem.append($table.$elem);
        },
        appendUI: function appendUI($elem) {
            $elem.append($.jqElem('style').text('.ontology-top { vertical-align : top }'));

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

            this.data('loaderElem', $loaderElem);
            $elem.append($loaderElem);

            const $globalContainer = this.data('globalContainerElem', $.jqElem('div').css('display', 'none'));
            $elem.append($globalContainer);

            const $metaElem = this.data('metaElem', $.jqElem('div'));

            const $metaContainerElem = this.createContainerElem('Overview', [$metaElem]);

            this.data('metaContainerElem', $metaContainerElem);
            $globalContainer.append($metaContainerElem);

            const $tableElem = $.jqElem('table')
                .addClass('display')
                .addClass('table table-striped')
                .css({width: '100%', border: '1px solid #ddd'});

            this.data('tableElem', $tableElem);
            const $colorMapElem = this.data('colorMapElem', $.jqElem('div'));

            const $containerElem = this.createContainerElem('Term Dictionary', [$tableElem, $colorMapElem]);

            this.data('containerElem', $containerElem);
            $globalContainer.append($containerElem);

            const $termElem = this.data('termElem', $.jqElem('div'));

            const $termContainerElem = this.createContainerElem('Term', [$termElem], 'none');

            this.data('termContainerElem', $termContainerElem);
            $globalContainer.append($termContainerElem);

            const $typeDefElem = this.data('typeDefElem', $.jqElem('table').addClass('display')).css({
                width: '100%',
                border: '1px solid #ddd'
            });

            const $typeDefContainerElem = this.createContainerElem('Type Definitions', [$typeDefElem]).css(
                'display',
                'none'
            );

            this.data('typeDefContainerElem', $typeDefContainerElem);
            $globalContainer.append($typeDefContainerElem);

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
