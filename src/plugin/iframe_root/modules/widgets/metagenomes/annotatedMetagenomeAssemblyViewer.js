define([
    'jquery',
    'vendor/datatables/jquery.dataTables',
    'kbaseUI/widget/legacy/kbaseTable',
    'kbaseUI/widget/legacy/kbaseTabs',
    'uuid',
    'kb_lib/jsonRpc/dynamicServiceClient',
    'widgets/metagenomes/contigBrowserPanel',
    'lib/domUtils',
    'lib/jqueryUtils',

    // For efect
    'kbaseUI/widget/legacy/widget'
], (
    $,
    jquery_dataTables,

    kbaseTable,
    kbaseTabs,
    Uuid,
    DynamicServiceClient,
    ContigBrowserPanel,
    {domSafeText, domSafeValue},
    {$errorAlert, $loadingAlert, $none}
) => {
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function WidgetState() {
        const UNINITIALIZED = 0;
        const OK = 1;
        const ERROR = 2;
        let state = null;
        let _info = null;
        function ok(stateInfo) {
            state = OK;
            _info = stateInfo;
        }
        function error(stateInfo) {
            state = ERROR;
            _info = stateInfo;
        }
        function isUninitialized() {
            return state === UNINITIALIZED;
        }
        function isOk() {
            return state === OK;
        }
        function isError() {
            return state === ERROR;
        }
        function info() {
            return _info;
        }
        return {
            ok,
            error,
            isUninitialized,
            isOk,
            isError,
            info
        };
    }

    $.KBWidget({
        name: 'kbaseAnnotatedMetagenomeAssemblyView',
        parent : 'kbaseWidget',
        version: '1.0.0',
        token: null,
        width: 1150,
        options: {
            id: null,
            ws: null,
            ver: null
        },
        timer: null,
        lastElemTabNum: 0,
        metagenome_info: null,

        state: WidgetState(),

        init(options) {
            this._super(options);
            let errorMessage;

            if (options.upas){
                this.metagenome_ref = options.upas.id;
            }
            else if (options.ws && options.id && options.ver) {
                this.metagenome_ref = [options.ws, options.id, options.ver].join('/');
            } else {
                errorMessage = 'Insufficient information for this widget';
                console.error(errorMessage);
                this.state.error({
                    message: errorMessage
                });
                return;
            }
            this.token = this.runtime.token;
            this.state.ok();
            this.attachClients();
            this.render();
            return this;
        },

        attachClients() {
            this.metagenomeAPI = new DynamicServiceClient({
                module: 'MetagenomeAPI',
                url: this.runtime.getConfig('services.service_wizard.url'),
                token: this.token,
                version: 'dev'
            });
        },

        showError(err) {
            this.$elem.empty();
            // This wrapper is required because the output widget displays a "Details..." button
            // with float right; without clearing this button will reside inside the error
            // display area.
            const $errorBox = $('<div>')
                .css('clear', 'both');
            // xss safe
            $errorBox.html($errorAlert(err));
            // xss safe
            this.$elem.append($errorBox);
        },

        $notImplemented() {
            return $('<span>')
                .css('font-style', 'italic')
                .css('font-size', '90%')
                .text('not implemented');
        },

        $noData() {
            return $('<span>')
                .css('font-style', 'italic')
                .css('font-size', '90%')
                .text('∅');
        },


        $renderAliases(aliases) {
            return $('<table>')
                .addClass('table table-small')
                .css('width', 'fit-content')
                // xss safe
                .append($('<tbody>')
                    // xss safe
                    .append(
                        aliases.map(([a, b]) => {
                            return $('<tr>')
                                // xss safe
                                .append($('<td>').text(a))
                                // xss safe
                                .append($('<td>').text(b));
                        })));
        },

        tabData() {
            const names = ['Browse Features', 'Browse Contigs'];
            const ids = ['browse_features', 'browse_contigs'];

            return {
                names,
                ids
            };
        },

        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////// Gene Search View ////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////

        buildGeneSearchView(params) {
            const self = this;

            const BIG_COL_WIDTH = '25%';

            // parse parameters
            const $div = params['$div'];
            if (!$div.is(':empty')) {
                return; // if it has content, then do not rerender
            }
            const metagenome_ref = params['ref'];

            let idClick = null;
            if (params['idClick']) { idClick = params['idClick']; }
            let contigClick = null;
            if (params['contigClick']) { contigClick = params['contigClick']; }

            // setup some defaults and variables (should be moved to class variables)
            const limit = 10;
            let start = 0;
            const sort_by = ['id', 1];

            let n_results = 0;

            // setup the main search button and the results panel and layout
            const $input = $('<input type="text" class="form-control" placeholder="Search Features">');
            $input.prop('disabled', true);

            function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }

            const isLastQuery = function () {
                // establish edge condition
                return true;
                // if(start !== result['start']) {
                //     return false;
                // }
                // if($input.val() !== result['query']) {
                //     return false;
                // }
                // return true;
            };

            const $resultDiv = $('<div>');
            // xss safe
            const $noResultsDiv = $('<div>').html('<center>No matching features found.</center>').hide();
            const $loadingDiv = $('<div>');
            const $errorDiv = $('<div>');
            const $pagenateDiv = $('<div>').css('text-align','left');
            const $resultsInfoDiv = $('<div>');

            const $container = $('<div>').addClass('container-fluid').css({margin:'15px 0px', 'max-width':'100%'});
            // xss safe
            $div.append($container);
            const $headerRow = $('<div>').addClass('row')
                // xss safe
                .append($('<div>').addClass('col-md-4').append($pagenateDiv))
                // xss safe
                .append($('<div>').addClass('col-md-4').append($loadingDiv))
                // xss safe
                .append($('<div>').addClass('col-md-4').append($input));
            const $resultsRow = $('<div>').addClass('row').css({'margin-top':'15px'})
                // xss safe
                .append($('<div>').addClass('col-md-12').append($resultDiv));
            const $noResultsRow = $('<div>').addClass('row')
                // xss safe
                .append($('<div>').addClass('col-md-12').append($noResultsDiv));
            // var $errorRow = $('<div>').addClass('row')
            //     .append($('<div>').addClass('col-md-8').append($errorDiv));
                // xss safe
            const $infoRow = $('<div>').addClass('row')
                // xss safe
                .append($('<div>').addClass('col-md-4').append($resultsInfoDiv))
                // xss safe
                .append($('<div>').addClass('col-md-8'));
            $container
                // xss safe
                .append($headerRow)
                // xss safe
                .append($resultsRow)
                // xss safe
                .append($errorDiv)
                // xss safe
                .append($noResultsRow)
                // xss safe
                .append($infoRow);

            // xss safe
            const $pageBack = $('<button class="btn btn-default">').append('<i class="fa fa-caret-left" aria-hidden="true">');
            // xss safe
            const $pageForward = $('<button class="btn btn-default">').append('<i class="fa fa-caret-right" aria-hidden="true">');

            // xss safe
            $pagenateDiv.append($pageBack);
            // xss safe
            $pagenateDiv.append($pageForward);
            $pagenateDiv.hide();

            const clearInfo= function () {
                $resultsInfoDiv.empty();
                $pagenateDiv.hide();
            };

            // define the functions that do everything
            const setToLoad = function ($panel) {
                //clearInfo();
                $panel.empty();
                const $loadingDiv = $('<div>').attr('align', 'left').append($('<i class="fa fa-spinner fa-spin fa-2x">'));
                // xss safe
                $panel.append($loadingDiv);
            };

            const search = function (query, start, limit, sort_by) {
                $errorDiv.empty();
                const local_sort_by = [];
                if (sort_by[0]==='start') {
                    local_sort_by.push(['contig_id',1]);
                }
                local_sort_by.push(sort_by);
                return self.metagenomeAPI.callFunc('search', [{
                    ref: metagenome_ref,
                    query,
                    sort_by: local_sort_by,
                    start,
                    limit
                }])
                    .spread((d) => {
                        return d;
                    })
                    .catch((err) => {
                        console.error(err);
                        // xss safe
                        $errorDiv.html($errorAlert(err), 'Error Searching');
                        throw err;
                    });
            };

            const showPaginate = function () {
                $pagenateDiv.show();
            };

            const showViewInfo = function (start, num_showing, num_found) {
                $resultsInfoDiv.empty();
                // xss safe
                $resultsInfoDiv.append(`Showing ${start+1} to ${start+num_showing} of ${num_found}`);
            };
            const showNoResultsView = function () {
                $noResultsDiv.show();
                $resultsInfoDiv.empty();
                $pagenateDiv.hide();
            };

            const buildRow = (rowData) => {
                const $tr = $('<tr>');
                let hasFunc = false;
                const hasOntology = false;
                const hasAlias = false;

                if (idClick) {
                    const getCallback = function (rowData) { return function () {idClick(rowData);};};
                    // xss safe
                    $tr.append($('<td>').append(
                        // xss safe
                        $('<a>').css('cursor','pointer').append(domSafeText(rowData['feature_id']))
                            .on('click',getCallback(rowData)))
                    );
                } else {
                    // xss safe
                    $tr.append($('<td>').append($('<div>').css('word-break','break-all').text(rowData['feature_id'])));
                }
                // xss safe
                $tr.append($('<td>').text(rowData['feature_type']));
                // xss safe
                $tr.append($('<td>').text(rowData['function']));
                if (rowData['function']) { hasFunc = true; }

                // TODO: These are the function description and aliases columns, which are
                // unimplemented for some reason.
                // console.log(rowData.functional_descriptions, rowData.aliases);

                // TODO: implement; was fully unimplemented (just empty cell); I don't currently
                // have access to an AMA with features with descriptions.
                // xss safe
                const $functionalDescriptions = $('<td>').html(this.$notImplemented());

                // xss safe
                $tr.append($functionalDescriptions);

                // TODO: implement; was fully unimplemented (just empty cell); I don't currently
                // have access to an AMA with aliases.
                // xss safe
                const $aliases = $('<td>').html(rowData.aliases ? this.$renderAliases(rowData.aliases) : this.$noData());

                // xss safe
                $tr.append($aliases);

                if (rowData['global_location']['contig_id']) {
                    const loc = rowData['global_location'];
                    // xss safe
                    $tr.append($('<td>').text(numberWithCommas(loc['start'])));
                    // xss safe
                    $tr.append($('<td>').text(loc['strand']));
                    // xss safe
                    $tr.append($('<td>').text(numberWithCommas(loc['stop'])));
                    if (contigClick) {
                        const getCallback = function () { return function () {contigClick(loc['contig_id']);};};
                        // xss safe
                        $tr.append($('<td>').append(
                            // xss safe
                            $('<div>')
                                .css({'word-break':'break-all'})
                                // xss safe
                                .html(
                                    $('<a>').css('cursor','pointer')
                                        .text(loc['contig_id'])
                                        .on('click',getCallback(loc['contig_id'])))));
                    } else {
                        // xss safe
                        $tr.append($('<td>').append($('<div>').css('word-break','break-all').text(loc['contig_id'])));
                    }
                } else {
                    // xss safe
                    $tr.append($('<td>')).append($('<td>')).append($('<td>')).append($('<td>'));
                }

                return {
                    $tr,
                    hasFunc,
                    hasOntology,
                    hasAlias
                };
            };

            const renderResult = function ($table, results) {
                $table.find('tr:gt(0)').remove();
                $loadingDiv.empty();
                $noResultsDiv.hide();
                clearInfo();

                const features = results['features'];
                if (features.length > 0) {
                    let hasFunc = false;
                    let hasOntology = false;
                    let hasAlias = false;
                    for (let k=0; k<features.length; k++) {
                        const row = buildRow(features[k]);
                        // xss safe
                        $table.append(row.$tr);
                        if (row.hasFunc) { hasFunc = true; }
                        if (row.hasOntology) { hasOntology = true; }
                        if (row.hasAlias) { hasAlias = true; }
                    }
                    n_results = results['num_found'];
                    showViewInfo(results['start'], features.length, results['num_found']);
                    showPaginate(results['num_found']);
                    if (hasFunc) {
                        $table.find('.feature-tbl-function').css('width',BIG_COL_WIDTH);
                    } else {
                        $table.find('.feature-tbl-function').css('width','1%');
                    }
                    if (hasOntology) {
                        $table.find('.feature-tbl-ontology_terms').css('width',BIG_COL_WIDTH);
                    } else {
                        $table.find('.feature-tbl-ontology_terms').css('width','1%');
                    }
                    if (hasAlias) {
                        $table.find('.feature-tbl-aliases').css('width',BIG_COL_WIDTH);
                    } else {
                        $table.find('.feature-tbl-aliases').css('width','1%');
                    }

                } else {
                    showNoResultsView();
                }
            };

            // Setup the actual table
            const $table = $('<table>')
                .addClass('table table-striped table-bordered table-hover')
                .css({'margin-left':'auto', 'margin-right':'auto'});
            // xss safe
            $resultDiv.append($table);


            const buildColumnHeader = function (name, id, click_event) {
                const $sortIcon = $('<i>').css('margin-left','8px');
                const $th = $('<th>')
                    // xss safe
                    .append(`<b>${name}</b>`)
                    // xss safe
                    .append($sortIcon);
                if (click_event) {
                    $th
                        .css('cursor','pointer')
                        .on('click', () => {
                            click_event(id, $sortIcon);
                        });
                }
                return {
                    id,
                    name,
                    $th,
                    $sortIcon
                };
            };

            const buildTableHeader = function () {
                let inFlight = false;

                const $colgroup = $('<colgroup>');

                const $tr = $('<tr>');
                const ASC=0; const DESC=1; const ID=0; const DIR=1;
                const cols = {};
                const sortEvent = function (id, $sortIcon) {
                    if (inFlight) { return; } // skip if a sort call is already running
                    if (sort_by[ID] == id) {
                        if (sort_by[DIR] === DESC) {
                            sort_by[DIR] = ASC;
                            $sortIcon.removeClass();
                            $sortIcon.addClass('fa fa-sort-asc');
                        } else {
                            sort_by[DIR] = DESC;
                            $sortIcon.removeClass();
                            $sortIcon.addClass('fa fa-sort-desc');
                        }
                    } else {
                        cols[sort_by[ID]].$sortIcon.removeClass();
                        sort_by[ID] = id;
                        sort_by[DIR] = DESC;
                        $sortIcon.addClass('fa fa-sort-desc');
                    }

                    setToLoad($loadingDiv);
                    inFlight=true;
                    start=0;
                    search($input.val(), start, limit, sort_by)
                        .then((result) => {
                            if (isLastQuery(result)) {
                                renderResult($table, result);
                            }
                            inFlight=false;
                            start=0;
                        })
                        .catch(() => {
                            inFlight=false;
                        });
                };

                const buildSingleColHeader = function (key, title, width, showSortedIcon, sortEvent, target) {
                    target.$colgroup.append($('<col span=1>').addClass(`feature-tbl-${key}`).css('width',width));
                    const h = buildColumnHeader(title, key, sortEvent);
                    // xss safe
                    target.$tr.append(h.$th);
                    if (showSortedIcon) {
                        h.$sortIcon.addClass('fa fa-sort-desc');
                    }
                    target.cols[h.id] = h;
                };

                const target = {
                    $colgroup,
                    $tr,
                    cols
                };

                buildSingleColHeader('id', 'Feature&nbsp;ID', '1%', true, sortEvent, target);
                buildSingleColHeader('type', 'Type', '1%', false, sortEvent, target);
                buildSingleColHeader('functions', 'Function', BIG_COL_WIDTH, false, sortEvent, target);
                buildSingleColHeader('functional_descriptions', 'Func. Desc.', BIG_COL_WIDTH, false, null, target);
                buildSingleColHeader('aliases', 'Aliases', BIG_COL_WIDTH, false, null, target);
                buildSingleColHeader('starts', 'Start', '1%', false, sortEvent, target);
                buildSingleColHeader('strands', 'Strand', '1%', false, sortEvent, target);
                buildSingleColHeader('stops', 'Length', '1%', false, sortEvent, target);
                buildSingleColHeader('contig_ids', 'Contig', '5%', true, sortEvent, target);

                return {$colgroup, $theader:$tr};
            };

            const headers = buildTableHeader();
            // xss safe
            $table.append(headers.$colgroup);
            // xss safe
            $table.append(headers.$theader);


            // Ok, do stuff.  First show the loading icon
            setToLoad($loadingDiv);

            // Perform the first search
            search('', start, limit, sort_by)
                .then(
                    (results) => {
                        $input.prop('disabled', false);
                        renderResult($table, results);
                    });



            $pageBack.on('click',() => {
                if (start===0) return;
                if ((start-limit)<0) {
                    start = 0;
                } else {
                    start = start-limit;
                }
                setToLoad($loadingDiv);
                search($input.val(),start, limit, sort_by)
                    .then((result) => {
                        if (isLastQuery(result)) {
                            renderResult($table, result);
                        }
                    });
            });
            $pageForward.on('click',() => {
                if (start+limit>n_results) {
                    return;
                }
                start = start+limit;
                setToLoad($loadingDiv);
                search($input.val(),start, limit, sort_by)
                    .then((result) => {
                        if (isLastQuery(result)) {
                            renderResult($table, result);
                        }
                    });
            });


            //put in a slight delay so on rapid typing we don't make a flood of calls
            let fetchTimeout = null;
            // var lastQuery = null;
            $input.on('input', () => {
                // if we were waiting on other input, cancel that request
                if (fetchTimeout) { window.clearTimeout(fetchTimeout); }
                fetchTimeout = window.setTimeout(() => {
                    fetchTimeout = null;
                    setToLoad($loadingDiv);
                    start=0;
                    search($input.val(),start, limit, sort_by)
                        .then((result) => {
                            if (isLastQuery(result)) { renderResult($table, result); }
                        });
                }, 300);
            });

        },

        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        ////////////////// Contig Search View ///////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        buildContigSearchView(params) {
            const self = this;
            // parse parameters
            const $div = params['$div'];
            if (!$div.is(':empty')) {
                return; // if it has content, then do not rerender
            }
            const metagenome_ref = params['ref'];

            let contigClick = null;
            if (params['contigClick']) {
                contigClick = params['contigClick'];
            }

            // setup some defaults and variables (should be moved to class variables)
            const limit = 10;
            let start = 0;
            const sort_by = ['contig_id', 1];

            let n_results = 0;

            function numberWithCommas(x) {
                return Intl.NumberFormat('en-us', {useGrouping: true}).format(x);
            }

            // setup the main search button and the results panel and layout
            // var $input = $('<input type="text" class="form-control" placeholder="Search Contigs">');
            // $input.prop('disabled', true);

            const isLastQuery = function () {

                return true;
            };

            const $resultDiv = $('<div>');
            // xss safe
            const $noResultsDiv = $('<div>').append('<center>No matching contigs found.</center>').hide();
            const $loadingDiv = $('<div>');
            const $errorDiv = $('<div>');
            const $pagenateDiv = $('<div>').css('text-align','left');
            const $resultsInfoDiv = $('<div>');

            const $container = $('<div>').addClass('container-fluid').css({margin:'15px 0px', 'max-width':'100%'});
            // xss safe
            $div.html($container);
            const $headerRow = $('<div>').addClass('row')
                // xss safe
                .append($('<div>').addClass('col-md-4').append($pagenateDiv))
                // xss safe
                .append($('<div>').addClass('col-md-4').append($loadingDiv));
                // .append($('<div>').addClass('col-md-4').append($input));
            const $resultsRow = $('<div>').addClass('row').css({'margin-top':'15px'})
                // xss safe
                .append($('<div>').addClass('col-md-12').append($resultDiv));
            const $noResultsRow = $('<div>').addClass('row')
                // xss safe
                .append($('<div>').addClass('col-md-12').append($noResultsDiv));
            // var $errorRow = $('<div>').addClass('row')
            //     .append($('<div>').addClass('col-md-8').append($errorDiv));
            const $infoRow = $('<div>').addClass('row')
                // xss safe
                .append($('<div>').addClass('col-md-4').append($resultsInfoDiv))
                // xss safe
                .append($('<div>').addClass('col-md-8'));
                // xss safe
            $container
                // xss safe
                .append($headerRow)
                // xss safe
                .append($resultsRow)
                // xss safe
                .append($errorDiv)
                // xss safe
                .append($noResultsRow)
                // xss safe
                .append($infoRow);

            // save
            const $pageBack = $('<button class="btn btn-default">').html('<i class="fa fa-caret-left" aria-hidden="true">');
            // xss safe
            const $pageForward = $('<button class="btn btn-default">').html('<i class="fa fa-caret-right" aria-hidden="true">');

            // xss safe
            $pagenateDiv.append($pageBack);
            // xss safe
            $pagenateDiv.append($pageForward);
            $pagenateDiv.hide();

            const clearInfo= function () {
                $resultsInfoDiv.empty();
                $pagenateDiv.hide();
            };

            // define the functions that do everything
            const setToLoad = function ($panel) {
                //clearInfo();
                $panel.empty();
                // xss safe
                const $loadingDiv = $('<div>').attr('align', 'left').append($('<i class="fa fa-spinner fa-spin fa-2x">'));
                // xss safe
                $panel.append($loadingDiv);
            };

            function search_contigs(start, limit, sort_by) {
                $errorDiv.empty();
                return self.metagenomeAPI
                    .callFunc('search_contigs', [{
                        ref: metagenome_ref,
                        sort_by,
                        start,
                        limit
                    }])
                    .spread((d) => {return d;})
                    .catch((err)=> {
                        console.error(err);
                        // xss safe
                        $errorDiv.html($errorAlert(err));
                    });
            }

            const showPaginate = function () {
                $pagenateDiv.show();
            };

            const showViewInfo = function (start, num_showing, num_found) {
                // xss safe
                $resultsInfoDiv.text(`Showing ${start+1} to ${start+num_showing} of ${num_found}`);
            };
            const showNoResultsView = function () {
                $noResultsDiv.show();
                $resultsInfoDiv.empty();
                $pagenateDiv.hide();
            };

            const buildRow = function (rowData) {
                const $tr = $('<tr>');
                if (contigClick) {
                    const getCallback = function (rowData) { return function () { contigClick(rowData['contig_id']); };};
                    // xss safe
                    $tr.append($('<td>').append(
                        $('<a>').css('cursor','pointer').text(rowData['contig_id'])
                            .on('click',getCallback(rowData)))
                    );
                } else {
                    $tr.append($('<td>').text(rowData['contig_id']));
                }
                // xss safe
                $tr.append($('<td>').text(numberWithCommas(rowData['length'])));
                // xss safe
                $tr.append($('<td>').text(numberWithCommas(rowData['feature_count'])));

                return $tr;
            };

            const renderResult = function ($table, results) {
                $table.find('tr:gt(0)').remove();
                $loadingDiv.empty();
                $noResultsDiv.hide();
                clearInfo();

                const contigs = results['contigs'];
                if (contigs.length>0) {
                    for (let k=0; k<contigs.length; k++) {
                        // xss safe
                        $table.append(buildRow(contigs[k]));
                    }
                    n_results = results['num_found'];
                    showViewInfo(results['start'], contigs.length, results['num_found']);
                    showPaginate(results['num_found']);
                } else {
                    showNoResultsView();
                }
            };

            // Setup the actual table
            const $table = $('<table>')
                .addClass('table table-striped table-bordered table-hover')
                .css({'margin-left':'auto', 'margin-right':'auto'});
            // xss safe
            $resultDiv.append($table);


            const buildColumnHeader = function (name, id, click_event) {
                const $sortIcon = $('<i>').css('margin-left','8px');
                const $th = $('<th>')
                    // xss safe
                    .append(`<b>${name}</b>`)
                    // xss safe
                    .append($sortIcon);
                if (click_event) {
                    $th
                        .css('cursor','pointer')
                        .on('click', () => {
                            click_event(id, $sortIcon);
                        });
                }
                return {
                    id,
                    name,
                    $th,
                    $sortIcon
                };
            };

            const buildTableHeader = function () {
                let inFlight = false;

                const $colgroup = $('<colgroup>');

                const $tr = $('<tr>');
                const ASC=0; const DESC=1; const ID=0; const DIR=1;
                const cols = {};
                const sortEvent = function (id, $sortIcon) {
                    if (inFlight) { return; } // skip if a sort call is already running
                    if (sort_by[ID] == id) {
                        if (sort_by[DIR] === DESC) {
                            sort_by[DIR] = ASC;
                            $sortIcon.removeClass();
                            $sortIcon.addClass('fa fa-sort-asc');
                        } else {
                            sort_by[DIR] = DESC;
                            $sortIcon.removeClass();
                            $sortIcon.addClass('fa fa-sort-desc');
                        }
                    } else {
                        cols[sort_by[ID]].$sortIcon.removeClass();
                        sort_by[ID] = id;
                        sort_by[DIR] = DESC;
                        $sortIcon.addClass('fa fa-sort-desc');
                    }

                    setToLoad($loadingDiv);
                    inFlight=true;
                    start=0;
                    search_contigs(start, limit, sort_by)
                        .then((result) => {
                            if (isLastQuery(result)) { renderResult($table, result); }
                            inFlight=false;
                            start=0;
                        })
                        .catch(()=> { inFlight=false; });
                };

                // xss safe
                $colgroup.append($('<col span=1>').css('width','20%'));
                let h = buildColumnHeader('Contig ID', 'contig_id', sortEvent);
                // xss safe
                $tr.append(h.$th);
                h.$sortIcon.addClass('fa fa-sort-desc');
                cols[h.id] = h;

                // xss safe
                $colgroup.append($('<col span=1>').css('width','5%'));
                h = buildColumnHeader('Length', 'length', sortEvent);
                // xss safe
                $tr.append(h.$th);
                cols[h.id] = h;


                // xss safe
                $colgroup.append($('<col span=1>').css('width','20%'));
                h = buildColumnHeader('Feature Count', 'feature_count', sortEvent);
                // xss safe
                $tr.append(h.$th);
                cols[h.id] = h;

                return {$colgroup, $theader:$tr};
            };

            const headers = buildTableHeader();
            // xss safe
            $table.append(headers.$colgroup);
            // xss safe
            $table.append(headers.$theader);


            // Ok, do stuff.  First show the loading icon
            setToLoad($loadingDiv);

            // Perform the first search
            search_contigs(start, limit, sort_by).then(
                (results) => {
                    // $input.prop('disabled', false);
                    renderResult($table, results);
                });



            $pageBack.on('click',() => {
                if (start===0) return;
                if ((start-limit)<0) {
                    start = 0;
                } else {
                    start = start-limit;
                }
                setToLoad($loadingDiv);
                search_contigs(start, limit, sort_by)
                    .then((result) => {
                        if (isLastQuery(result)) { renderResult($table, result); }
                    });
            });
            $pageForward.on('click',() => {
                if (start+limit>n_results) {
                    return;
                }
                start = start+limit;
                setToLoad($loadingDiv);
                search_contigs(start, limit, sort_by)
                    .then((result) => {
                        if (isLastQuery(result)) { renderResult($table, result); }
                    });
            });
        },

        renderContigData(metagenome_ref, contig_id, outputDivs) {
            const $length = outputDivs.$length;
            const $n_features = outputDivs.$n_features;
            return this.metagenomeAPI
                .callFunc('get_contig_info', [{
                    ref: metagenome_ref,
                    contig_id
                }])
                .spread((result) => {
                    const contigData = result['contig'];
                    // xss safe
                    $length.text(numberWithCommas(result['contig']['length']));
                    // xss safe
                    $n_features.text(numberWithCommas(result['contig']['feature_count']));
                    return contigData;
                })
                .catch((err) => {
                    console.error(err);
                    // xss safe
                    $length.html($errorAlert(err));
                });
        },

        ////////////////////////
        ////show contig tab////
        //////////////////////
        showContigTab(metagenome_ref, contig_id, pref, tabPane) {

            const self = this;

            function openTabGetId(tabName) {
                if (tabPane.hasTab(tabName))
                    return null;
                self.lastElemTabNum++;
                const tabId = `${  pref  }elem${  self.lastElemTabNum}`;
                const $tabDiv = $(`<div id="${tabId}"> `);
                tabPane.addTab({tab: tabName, content: $tabDiv, canDelete : true, show: true, deleteCallback(name) {
                    tabPane.removeTab(name);
                    tabPane.showTab(tabPane.activeTab());
                }});
                return $tabDiv;
            }

            // setup mini contig browser
            function translate_feature_data(featureData) {
                const cbFormat = {};
                cbFormat['raw'] = featureData; //Store this in order to span new tabs
                cbFormat['id'] = featureData['feature_id'];
                cbFormat['location'] = [];
                if (featureData['global_location']['contig_id']) {
                    for (let k=0; k<featureData['location'].length; k++) {
                        // only show things on the main contig
                        const loc = featureData['location'][k];
                        if (featureData['global_location']['contig_id']===loc['contig_id']) {
                            cbFormat['location'].push([
                                loc['contig_id'],
                                loc['start'],
                                loc['strand'],
                                loc['stop']
                            ]);
                        }
                    }
                }
                cbFormat['function'] = featureData['function'];
                return cbFormat;
            }

            function getFeaturesInRegionAndRenderBrowser(metagenome_ref, contig_id, start, length, contig_length, $div) {
                return self.metagenomeAPI
                    .callFunc('search_region', [{
                        ref: metagenome_ref,
                        contig_id,
                        region_start: start,
                        region_length: length,
                        page_start: 0,
                        page_limit: 2000
                    }])
                    .spread((result) => {
                        $div.empty();

                        const contigWindowData = {
                            name: contig_id,
                            length: contig_length,
                            genes: []
                        };

                        for (let f=0; f<result['features'].length; f++) {
                            contigWindowData['genes'].push(translate_feature_data(result['features'][f]));
                        }

                        const cgb = new ContigBrowserPanel();
                        cgb.data.options.contig = contigWindowData;
                        //cgb.data.options.svgWidth = self.width - 28;
                        cgb.data.options.onClickFunction = function (svgElement, feature) {
                            self.showFeatureTab(metagenome_ref, feature['original_data']['raw'], pref, tabPane);
                        };
                        cgb.data.options.start= start;
                        cgb.data.options.length= length;
                        // TODO: Button display is not fully implemented, so always set off
                        cgb.data.options.showButtons = false;
                        cgb.data.options.token = self.token;
                        cgb.data.$elem = $('<div style="width:100%; height: 120px; overflow: auto;"/>');
                        cgb.data.$elem.show(()=> {
                            cgb.data.update();
                        });
                        // xss safe
                        $div.append(cgb.data.$elem);
                        cgb.data.init();
                    })
                    .catch((err) => {
                        console.error(err);
                        // xss safe
                        $div.html($errorAlert(err));
                    });
            }
            function showContig(metagenome_ref, contig_id) {
                const $div = openTabGetId(contig_id);
                if ($div === null) {
                    tabPane.showTab(contig_id);
                    return;
                }

                const $tbl = $('<table>').addClass('table table-striped table-bordered table-hover')
                    .css({'margin-left':'auto', 'margin-right':'auto'});
                // xss safe
                $tbl.append($('<colgroup>').append($('<col span=1>').css('width','15%')));
                const $browserCtrlDiv = $('<div>');
                const $browserDiv = $('<div>');

                // basic layout
                const $container = $('<div>').addClass('container-fluid').css({margin:'15px 0px', 'max-width':'100%'});
                // xss safe
                $div.append($container);
                const $tblRow = $('<div>').addClass('row')
                    // xss safe
                    .append($('<div>').addClass('col-md-12').append($tbl));
                const $browserCtrlRow = $('<div>').addClass('row').css({'margin-top':'15px', 'text-align':'center'})
                    // xss safe
                    .append($('<div>').addClass('col-md-12').append($browserCtrlDiv));
                const $browserRow = $('<div>').addClass('row').css({'margin-top':'15px', 'text-align':'center'})
                    // xss safe
                    .append($('<div>').addClass('col-md-12').append($browserDiv));
                // xss safe
                $container.append($tblRow).append($browserCtrlRow).append($browserRow);


                // ID
                const $id = $('<tr>')
                    // xss safe
                    .append($('<td>').append('<b>Contig ID</b>'))
                    // xss safe
                    .append($('<td>').text(contig_id));
                // xss safe
                $tbl.append($id);

                // Length
                const $lengthField = $('<div>');
                const $len = $('<tr>')
                    // xss safe
                    .append($('<td>').append('<b>Length</b>'))
                    // xss safe
                    .append($('<td>').append($lengthField));
                // xss safe
                $tbl.append($len);

                // N Features
                const $featureField = $('<div>');
                const $nf = $('<tr>')
                    // xss safe
                    .append($('<td>').append('<b>Number of Features</b>'))
                    // xss safe
                    .append($('<td>').append($featureField));
                // xss safe
                $tbl.append($nf);

                self.renderContigData(metagenome_ref, contig_id, {
                    $length:$lengthField,
                    $n_features:$featureField
                })
                    .then((contigData) => {
                        // Browser
                        // xss safe
                        $browserRow.append($('<i class="fa fa-spinner fa-spin fa-2x">'));
                        let start = 0;
                        // var tenKb = 10000;
                        const twentyKb = 20000;
                        let length = twentyKb;
                        const contig_length = contigData['length'];

                        const $contigScrollBack = $('<button class="btn btn-default">')
                            // xss safe
                            .append('<i class="fa fa-caret-left" aria-hidden="true">')
                            .text(' back 20kb')
                            .on('click', () => {
                                if (start-twentyKb < 0) {
                                    return;
                                }
                                $browserRow.append($('<i class="fa fa-spinner fa-spin fa-2x">'));
                                start = start - twentyKb;
                                length = twentyKb;
                                getFeaturesInRegionAndRenderBrowser(metagenome_ref, contig_id, start, length, contig_length, $browserRow);
                            });

                        const $contigScrollForward = $('<button class="btn btn-default">')
                            .text('forward 20kb ')
                            // xss safe
                            .append('<i class="fa fa-caret-right" aria-hidden="true">')
                            .on('click', () => {
                                if (start+twentyKb>contig_length) {
                                    return;
                                }
                                $browserRow.append($('<i class="fa fa-spinner fa-spin fa-2x">'));
                                if (start+twentyKb>contig_length) {
                                    return;
                                }
                                start = start + twentyKb;
                                length = twentyKb;
                                getFeaturesInRegionAndRenderBrowser(metagenome_ref, contig_id, start, length, contig_length, $browserRow);
                            });

                        // xss safe
                        $browserCtrlDiv.append($contigScrollBack).append($contigScrollForward);

                        getFeaturesInRegionAndRenderBrowser(metagenome_ref, contig_id, start, length, contig_length, $browserRow);
                    });
            }

            showContig(metagenome_ref, contig_id);
        },
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        ///////////////////// Overview Tab  /////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////

        render() {
            const pref = new Uuid(4).format();
            const self = this;

            const container = this.$elem;
            if (self.token == null) {
                this.showError('You\'re not logged in');
                return;
            }

            const ready = function () {
                container.empty();
                const $tabPane = $(`<div id="${pref}tab-content">`);
                // xss safe
                container.append($tabPane);
                // var tabObj = new kbaseTabs($tabPane, {canDelete : true, tabs : []});
                const tabObj = $tabPane.kbaseTabs($tabPane, {canDelete : true, tabs : []});

                const tabData = self.tabData();
                const tabNames = tabData.names;
                const tabIds = tabData.ids;

                for (let i=0; i<tabIds.length; i++) {
                    const tabDiv = $(`<div id="${pref}${tabIds[i]}"> `);
                    tabObj.addTab({tab: tabNames[i], content: tabDiv, canDelete : false, show: (i == 0)});
                }

                const liElems = $tabPane.find('li');
                for (let liElemPos = 0; liElemPos < liElems.length; liElemPos++) {
                    const liElem = $(liElems.get(liElemPos));
                    const aElem = liElem.find('a');
                    if (aElem.length != 1)
                        continue;
                    const dataTab = aElem.attr('data-tab');
                    const metagenome_ref = self.metagenome_ref;
                    if (dataTab === 'Browse Features') {
                        aElem.on('click', () => {
                            self.buildGeneSearchView({
                                $div: $(`#${pref}browse_features`),
                                ref: metagenome_ref,
                                // idClick: null,
                                // contigClick: null,
                                idClick(featureData) {
                                    self.showFeatureTab(metagenome_ref, featureData, pref, tabObj);
                                },
                                contigClick(contigId) {
                                    self.showContigTab(metagenome_ref, contigId, pref, tabObj);
                                }
                            });
                        });
                        aElem.click();
                    } else if (dataTab === 'Browse Contigs') {
                        aElem.on('click', () => {
                            self.buildContigSearchView({
                                $div: $(`#${pref}browse_contigs`),
                                ref: metagenome_ref,
                                // contigClick: null
                                contigClick(contigId) {
                                    self.showContigTab(metagenome_ref, contigId, pref, tabObj);
                                }
                            });
                        });
                    }
                }
            };
            container.empty();
            // xss safe
            container.append($('<div>').attr('align', 'center').append($('<i class="fa fa-spinner fa-spin fa-2x">')));

            ready();
            return this;

        },

        normalizeMetagenomeDataFromQuery(wsReturnedData, metagenome_ref, noDataCallback) {
            const info = wsReturnedData['info'];
            const metadata = info[10];
            const genomeData = this.normalizeMetagenomeMetadata(metadata, metagenome_ref, noDataCallback);
            genomeData['ws_obj_name'] = info[1];
            genomeData['version'] = info[4];
            genomeData['ref'] = `${info[6]  }/${  info[1]  }/${  info[4]}`;
            return genomeData;
        },

        normalizeMetagenomeDataFromNarrative(metagenome_info, metagenome_ref, noDataCallback) {
            const genomeData = this.normalizeMetagenomeMetadata(metagenome_info['meta'], metagenome_ref, noDataCallback);
            genomeData['ws_obj_name'] = metagenome_info['name'];
            genomeData['version'] = metagenome_info['version'];
            genomeData['ref'] = `${metagenome_info['ws_id']  }/${  metagenome_info['name']  }/${  metagenome_info['version']}`;
            return genomeData;
        },

        normalizeMetagenomeMetadata(metadata) {
            const genomeData = {
                genetic_code: '',
                source: '',
                source_id: '',
                size: '',
                gc_content: ''
            };

            if (metadata['Genetic code']) {
                genomeData.genetic_code = metadata['Genetic code'];
            }
            if (metadata['Source']) {
                genomeData.source = metadata['Source'];
            }
            if (metadata['Source ID']) {
                genomeData.source_id = metadata['Source ID'];
            }
            if (metadata['Size']) {
                genomeData.size = metadata['Size'];
            }
            if (metadata['GC Content']){
                genomeData.gc_content = metadata['GC Content'];
            }
            if (metadata['Environment']){
                genomeData.environment = metadata['Environment'];
            }

            return genomeData;
        },

        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------- Feature Tab ----------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------

        showFeatureTab(metagenome_ref, featureData, pref, tabPane) {
            const self = this;

            function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }

            function openTabGetId(tabName) {
                if (tabPane.hasTab(tabName))
                    return null;
                self.lastElemTabNum++;
                const tabId = `${  pref  }elem${  self.lastElemTabNum}`;
                const $tabDiv = $(`<div id="${tabId}"> `);
                tabPane.addTab({tab: tabName, content: $tabDiv, canDelete : true, show: true, deleteCallback(name) {
                    tabPane.removeTab(name);
                    tabPane.showTab(tabPane.activeTab());
                }});
                return $tabDiv;
            }

            function printDNA(sequence, charWrap) {
                const $div = $('<div>').css({'font-family': '"Lucida Console", Monaco, monospace'});

                const $posTD = $('<td>').css({'text-align': 'right', border:'0', color:'#777'});
                const $seqTD = $('<td>').css({border:'0', color:'#000'});
                let lines=1;
                for (let i = 0; i < sequence.length; i++) {
                    if (i>0 && i%charWrap===0) {
                        // xss safe
                        $posTD.append('<br>').append(i+1).append(':&nbsp;');
                        // xss safe
                        $seqTD.append('<br>');
                        lines++;
                    } else if (i==0) {
                        // xss safe
                        $posTD.append(i+1).append(':&nbsp;');
                    }
                    const base = sequence[i];
                    $seqTD.append(domSafeText(base));
                }
                // xss safe
                $div.append($('<table>').css({border:'0','border-collapse':'collapse'}).append(
                    // xss safe
                    $('<tr>').css({border:'0'}).append($posTD).append($seqTD)));
                if (lines>5) {
                    $div.css({height:'6em', overflow:'auto', resize:'vertical'});
                }

                return $div;
            }

            function getFeatureLocationBounds(locationObject) {
                const loc = {};
                if (locationObject['strand'] && locationObject['strand'] === '-') {
                    loc['end'] = locationObject['start'];
                    loc['start'] = loc['end'] - locationObject['stop'];
                    // loc['start'] = loc['end'] - locationObject['length'];

                } else {
                    // assume it is on + strand
                    loc['start'] = locationObject['start'];
                    loc['end'] =  loc['start'] + locationObject['stop'];
                    // loc['end'] = loc['start'] + locationObject['length'];
                }
                return loc;
            }

            function showGene(featureData) {
                if (featureData['feature_array'] === null){
                    featureData['feature_array'] = 'features';
                }
                const fid = featureData['feature_id'];
                const $div = openTabGetId(fid);
                if ($div === null) {
                    tabPane.showTab(fid);
                    return;
                }
                const $tbl = $('<table>').addClass('table table-striped table-bordered table-hover')
                    .css({'margin-left':'auto', 'margin-right':'auto'});
                // xss safe
                $tbl.append($('<colgroup>').append($('<col span=1>').css('width','15%')));


                // basic layout
                const $container = $('<div>').addClass('container-fluid').css({margin:'15px 0px', 'max-width':'100%'});
                // xss safe
                $div.append($container);
                const $tblRow = $('<div>').addClass('row')
                    // xss safe
                    .append($('<div>').addClass('col-md-12').append($tbl));
                // xss safe
                $container.append($tblRow);

                const tblLabels = [];
                const tblData = [];

                tblLabels.push('Feature ID');
                // Landing pages don't work for all features yet
                //tblData.push('<a href="/#dataview/'+self.metagenome_ref+'?sub=Feature&subid='+fid+'" target="_blank">'+fid+'</a>');
                tblData.push(fid);

                tblLabels.push('Aliases');
                const $aliases = $('<div>');
                if (featureData['aliases']) {
                    // xss safe
                    $aliases.html($('<table>').addClass('table table-small').css('width', 'fit-content')
                        // xss safe
                        .append($('<tbody>')
                            // xss safe
                            .append(
                                featureData.aliases.map(([a, b]) => {
                                    return $('<tr>')
                                        // xss safe
                                        .append($('<td>').text(a))
                                        // xss safe
                                        .append($('<td>').text(b));
                                }))));
                } else {
                    // xss safe
                    $aliases.html($none());
                }
                tblData.push($aliases);

                tblLabels.push('Type');
                tblData.push(featureData['feature_type']);

                tblLabels.push('Product Function');
                if (featureData['function']) {
                    tblData.push(featureData['function']);
                } else {
                    tblData.push('None');
                }

                const $functions = $('<div>');
                tblLabels.push('Function Descriptions');
                tblData.push($functions);

                tblLabels.push('Location');
                const $loc = $('<div>');
                if (featureData['global_location']['contig_id']) {
                    // xss safe
                    $loc.append($('<div>')
                        // xss safe
                        .append($('<span>').text('Contig: '))
                        // xss safe
                        .append($('<a>').text(featureData['global_location']['contig_id'])
                            .css({cursor:'pointer'})
                            .on('click', () => {
                                self.showContigTab(metagenome_ref, featureData['global_location']['contig_id'], pref, tabPane);
                            })));
                    // Add the location if available
                    if (featureData['location']) {
                        const locs = featureData['location'];
                        const $locDiv = $('<div>');
                        let crop = false;
                        for (let i=0; i<locs.length; i++) {
                            // xss safe
                            if (i>0) { $locDiv.append('<br>'); }
                            if (i>6) { crop=true; }
                            const loc = locs[i];
                            const bounds = getFeatureLocationBounds(loc);
                            $locDiv.text(`${numberWithCommas(bounds['start'])} - ${ numberWithCommas(bounds['end'])} (${loc['strand']} Strand)`);
                        }
                        // xss safe
                        $loc.append($locDiv);
                        if (crop) {
                            $locDiv.css({height:'10em', overflow:'auto', resize:'vertical'});
                        }
                    }
                } else {
                    // xss safe
                    $loc.html($none());
                }

                tblData.push($loc);

                const $contigBrowser = $('<div>');

                // xss safe
                $contigBrowser.html($loadingAlert('Fetching nearby feature data...'));

                tblLabels.push('Feature Context');
                tblData.push($contigBrowser);

                const $relationships = $('<div>');
                tblLabels.push('Relationships');
                tblData.push($relationships);

                const $dnaLen = $('<div>');
                tblLabels.push('DNA Length');
                tblData.push($dnaLen);

                const $dnaSeq = $('<div>');
                tblLabels.push('DNA Sequence');
                tblData.push($dnaSeq);

                const $warnings = $('<div>');
                tblLabels.push('Warnings');
                tblData.push($warnings);


                for (let i=0; i<tblLabels.length; i++) {
                    // xss safe
                    $tbl.append($('<tr>')
                        // xss safe
                        .append($('<td>').append($('<b>').append(tblLabels[i])))
                        // xss safe
                        .append($('<td>').append(tblData[i])));
                }

                if (featureData['size']){
                    $dnaLen.text(numberWithCommas(featureData['size']));
                }
                if (featureData['dna_sequence']){
                    // xss safe
                    $dnaSeq.html(printDNA(domSafeValue(featureData['dna_sequence']), 100));
                } else {
                    // xss safe
                    $warnings.html($none('Not Available'));
                }
                if (featureData['warnings']){
                    // xss safe
                    $warnings.html(featureData['warnings'].map((value) => {return domSafeValue(value);}).join('<br>'));
                } else {
                    // xss safe
                    $warnings.html($none());
                }
                if (featureData['functional_descriptions']) {
                    // xss safe
                    $functions.html(featureData['functional_descriptions'].map((value) => {return domSafeValue(value);}).join('<br>'));
                } else {
                    // xss safe
                    $functions.html($none());
                }
                if (featureData['parent_gene']) {
                    $relationships.text(`Parent Gene: ${featureData['parent_gene']}`);
                } else {
                    // xss safe
                    $relationships.html($none());
                }
                if (featureData['inference_data']) {
                    $relationships.text(`Inference Data: ${featureData['inference_data']}`);
                }

                // setup mini contig browser
                const translate_feature_data = function (featureData) {
                    const cbFormat = {};
                    cbFormat['raw'] = featureData; //Store this in order to span new tabs
                    cbFormat['id'] = featureData['feature_id'];
                    cbFormat['location'] = [];
                    for (let k=0; k<featureData['location'].length; k++) {
                        // only show things on the main contig
                        const loc = featureData['location'][k];
                        if (featureData['global_location']['contig_id']===loc['contig_id']) {
                            cbFormat['location'].push([
                                loc['contig_id'],
                                loc['start'],
                                loc['strand'],
                                loc['stop']
                            ]);
                        }
                    }
                    cbFormat['function'] = featureData['function'];
                    return cbFormat;
                };

                if (!featureData['global_location']['contig_id']) {
                    $contigBrowser.text('Genomic context is not available.');
                } else {
                    const contigDataForBrowser = {
                        name: featureData.global_location.contig_id,
                        genes: [translate_feature_data(featureData)]
                    };
                    const range = 10000;
                    const bounds = getFeatureLocationBounds(featureData.global_location);

                    let search_start = bounds.start - range;
                    if (search_start < 0){
                        search_start = 0;
                    }
                    const search_stop = bounds.end + range;
                    let search_length = search_stop - search_start;
                    contigDataForBrowser.length = search_stop;

                    if (search_length > 40000) {
                        search_length = 40000;
                    }

                    self.metagenomeAPI
                        .callFunc('search_region', [{
                            ref: metagenome_ref,
                            contig_id: featureData['global_location']['contig_id'],
                            region_start: search_start,
                            region_length: search_length,
                            page_start: 0,
                            page_limit: 100
                        }])
                        .spread((result) => {
                            $contigBrowser.empty();
                            for (let f=0; f<result['features'].length; f++) {
                                contigDataForBrowser['genes'].push(translate_feature_data(result['features'][f]));
                            }

                            const cgb = new ContigBrowserPanel();
                            cgb.data.options.contig = contigDataForBrowser;
                            //cgb.data.options.svgWidth = self.width - 28;
                            cgb.data.options.onClickFunction = function (svgElement, feature) {
                                self.showFeatureTab(metagenome_ref, feature['original_data']['raw'], pref, tabPane);
                            };
                            cgb.data.options.start = search_start;
                            cgb.data.options.length = search_length;
                            cgb.data.options.centerFeature = featureData['feature_id'];
                            cgb.data.options.showButtons = false;
                            cgb.data.options.token = self.token;
                            cgb.data.$elem = $('<div style="width:100%; height: 200px; overflow: auto"/>');
                            cgb.data.$elem.show(()=> {
                                cgb.data.update();
                            });
                            // xss safe
                            $contigBrowser.append(cgb.data.$elem);
                            cgb.data.init();
                        })
                        .catch((err) => {
                            console.error(err);
                            // xss safe
                            $contigBrowser.html($errorAlert(err));
                        });
                }
                tabPane.showTab(fid);
            }
            showGene(featureData);
        },

        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------
        //-------------------------------------------------------

        loggedInCallback(event, auth) {
            if (!this.state.isOk()) {
                const errorMessage = `Widget is in invalid state -- cannot render: ${  this.state.info().message}`;
                console.error(errorMessage);
                this.showError(errorMessage);
                return;
            }
            this.token = auth.token;
            this.attachClients();
            this.render();
            return this;
        },

        loggedOutCallback() {
            if (!this.state.isOk()) {
                const errorMessage = `Widget is in invalid state -- cannot render: ${  this.state.info().message}`;
                console.error(errorMessage);
                this.showError(errorMessage);
                return;
            }
            this.token = null;
            this.attachClients();
            this.render();
            return this;
        }


    });
});