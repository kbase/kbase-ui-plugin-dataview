define([
    'jquery',
    'underscore',
    'd3',
    'kb_common/html',
    'lib/domUtils',

    // For effect
    'kbaseUI/widget/legacy/widget',
    'datatables_bootstrap'
], (
    $,
    _,
    d3,
    html,
    {domSafeText}
) => {
    $.KBWidget({
        name: 'KBaseLitWidget',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            genomeID: null,
            workspaceID: null,
            isInCard: false,
            width: 600,
            height: 700,
            maxPubCount: 50
        },
        init(options) {
            this._super(options);

            if (this.options.row === null) {
                //throw an error
                return;
            }
            return this.render();
        },
        xmlToJson(xml) {
            const self = this;
            // Create the return object
            let obj = {};

            if (xml.nodeType === 1) {
                // element
                // do attributes
                if (xml.attributes.length > 0) {
                    obj['@attributes'] = {};
                    for (let j = 0; j < xml.attributes.length; j++) {
                        const attribute = xml.attributes.item(j);
                        obj['@attributes'][attribute.nodeName] = attribute.value;
                    }
                }
            } else if (xml.nodeType === 3) {
                // text
                obj = xml.nodeValue;
            }

            // do children
            if (xml.hasChildNodes()) {
                for (let i = 0; i < xml.childNodes.length; i++) {
                    const item = xml.childNodes.item(i);
                    const nodeName = item.nodeName;
                    if (typeof obj[nodeName] === 'undefined') {
                        obj[nodeName] = self.xmlToJson(item);
                    } else {
                        if (typeof obj[nodeName].push === 'undefined') {
                            const old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(self.xmlToJson(item));
                    }
                }
            }
            return obj;
        },
        render() {
            const self = this;

            self.tooltip = d3
                .select('body')
                .append('div')
                .classed('kbcb-tooltip', true);

            let lit = self.options.literature;
            const loader = $(html.loading());

            const resultsDiv = $('<div>')
                // safe
                .append(
                    `<table cellpadding="0" cellspacing="0" border="0" id="literature-table" 
                                class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>`
                );
            const searchBarDiv = $('<div>')
                // safe
                .append('<input type="text" name="lit-query-box">');

            const searchBarButton = $('<input type=\'button\' id=\'lit-search-button\' value=\'Update Search\'>').on(
                'click',
                () => {
                    lit = $litQueryBox.val();
                    litDataTable.fnDestroy();
                    populateSearch(lit);
                }
            );

            let litDataTable;

            self.$elem
                // safe
                .append(searchBarDiv.append(searchBarButton))
                // safe
                .append(loader)
                // safe
                .append(resultsDiv);

            // nb: needs to be after that stuff is added to the dom.
            const $litQueryBox = self.$elem.find('[name="lit-query-box"]');
            $litQueryBox.val(lit);
            $litQueryBox.css({width: '300px'});

            populateSearch(lit);

            function populateSearch(lit) {
                loader.show();
                $.ajax({
                    async: true,
                    url:
                        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=${
                            self.options.maxPubCount
                        }&sort=pub+date&term=${
                            lit.replace(/\s+/g, '+')}`,
                    type: 'GET',
                    success(data) {
                        let htmlJson = self.xmlToJson(data);
                        let query = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=';
                        let abstr =
                            'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&id=';
                        if (htmlJson.eSearchResult[1].Count['#text'] === '0') {
                            const tableSettings = {
                                // "sPaginationType": "full_numbers",
                                iDisplayLength: 4,
                                sDom: 't<flip>',
                                aaSorting: [[3, 'desc']],
                                aoColumns: [
                                    {sTitle: 'Journal', mData: 'source'},
                                    {sTitle: 'Authors', mData: 'author'},
                                    {sTitle: 'Title', mData: 'title'},
                                    {sTitle: 'Date', mData: 'date'}
                                ],
                                aaData: []
                            };
                            loader.hide();
                            litDataTable = self.$elem.find('#literature-table').dataTable(tableSettings);
                            return;
                        }
                        if (_.isArray(htmlJson.eSearchResult[1].IdList.Id)) {
                            let x;
                            for (x = 0; x < htmlJson.eSearchResult[1].IdList.Id.length; x++) {
                                query += htmlJson.eSearchResult[1].IdList.Id[x]['#text'];
                                abstr += htmlJson.eSearchResult[1].IdList.Id[x]['#text'];
                                if (x !== htmlJson.eSearchResult[1].IdList.Id.length - 1) {
                                    query += ',';
                                    abstr += ',';
                                }
                                // tableInput.push(parseLitSearchDataTable(query))
                            }
                        } else {
                            // I think this means no results? So here I just show an empty table--mike
                            // this line below was throwing an error:
                            query += htmlJson.eSearchResult[1].IdList.Id['#text'];
                            abstr += htmlJson.eSearchResult[1].IdList.Id['#text'];
                        }
                        const tableInput = [];
                        const abstractsDict = {};

                        $.when(
                            $.ajax({
                                async: true,
                                url: abstr,
                                type: 'GET'
                            })
                        ).then((data) => {
                            htmlJson = self.xmlToJson(data);

                            const abstracts = htmlJson.PubmedArticleSet[1].PubmedArticle;
                            if (_.isArray(abstracts)) {
                                let abstract_idx;
                                for (abstract_idx in abstracts) {
                                    const article = abstracts[abstract_idx].MedlineCitation;
                                    const articleID = article.PMID['#text'];
                                    let articleAbstract;
                                    if (typeof article.Article.Abstract !== 'undefined') {
                                        articleAbstract = article.Article.Abstract.AbstractText['#text'];
                                    } else {
                                        articleAbstract = 'No abstract found for this article.';
                                    }
                                    abstractsDict[articleID] = articleAbstract;
                                }
                            } else {
                                const article = abstracts.MedlineCitation;
                                const articleID = article.PMID['#text'];
                                let articleAbstract;
                                if (typeof article.Article.Abstract !== 'undefined') {
                                    articleAbstract = article.Article.Abstract.AbstractText['#text'];
                                } else {
                                    articleAbstract = 'No abstract found for this article.';
                                }
                                abstractsDict[articleID] = articleAbstract;
                            }

                            $.when(
                                $.ajax({
                                    async: true,
                                    url: query,
                                    type: 'GET'
                                })
                            ).then(
                                (data) => {
                                    htmlJson = self.xmlToJson(data);

                                    const summaries = htmlJson.eSummaryResult[1].DocSum; // Add pub date field into table as well.
                                    let summaryList;
                                    if (_.isArray(summaries)) {
                                        summaryList = [];
                                        for (const summary in summaries) {
                                            summaryList.push(summaries[summary]);
                                        }
                                    } else {
                                        summaryList = [summaries];
                                    }

                                    const articleIDs = [];
                                    let summary_idx,
                                        summary,
                                        item_idx,
                                        infoRow;

                                    for (summary_idx in summaryList) {
                                        summary = summaryList[summary_idx].Item;
                                        const tableInputRow = {};
                                        let isJournal = false;
                                        for (item_idx in summary) {
                                            infoRow = summary[item_idx];
                                            // date
                                            if (infoRow['@attributes'].Name === 'PubDate') {
                                                tableInputRow['date'] = domSafeText(infoRow['#text'].substring(0, 4));
                                            }
                                            // source
                                            if (infoRow['@attributes'].Name === 'Source') {
                                                tableInputRow['source'] = domSafeText(infoRow['#text']);
                                            }
                                            // abstract
                                            if (infoRow['@attributes'].Name === 'Title') {
                                                tableInputRow['title'] =
                                                    '<a href=' +
                                                    `https://www.ncbi.nlm.nih.gov/pubmed/${
                                                        summaryList[summary_idx].Id['#text']
                                                    } target=_blank>${domSafeText(infoRow['#text'])}</a>`;
                                                tableInputRow['abstract'] = summaryList[summary_idx].Id['#text'];
                                                articleIDs.push(summaryList[summary_idx].Id['#text']);
                                            }
                                            // authors
                                            if (infoRow['@attributes'].Name === 'AuthorList') {
                                                let authors = '';
                                                if ('#text' in infoRow) {
                                                    if (_.isArray(infoRow.Item)) {
                                                        let commaDelay = 1;
                                                        let author_idx,
                                                            author;
                                                        for (author_idx in infoRow.Item) {
                                                            author = infoRow.Item[author_idx];
                                                            if (commaDelay === 0) {
                                                                authors += ', ';
                                                            } else {
                                                                commaDelay--;
                                                            }
                                                            authors += author['#text'];
                                                        }
                                                    } else {
                                                        authors = infoRow.Item['#text'];
                                                    }
                                                } else {
                                                    authors = 'No authors found for this article.';
                                                }
                                                tableInputRow['author'] = domSafeText(authors);
                                            }
                                            // Flag if this is a journal; we only display journals.
                                            if (infoRow['@attributes'].Name === 'PubTypeList') {
                                                if ('#text' in infoRow) {
                                                    if (_.isArray(infoRow.Item)) {
                                                        let pub_idx;
                                                        for (pub_idx in infoRow.Item) {
                                                            if (infoRow.Item[pub_idx]['#text'] === 'Journal Article') {
                                                                isJournal = true;
                                                            }
                                                        }
                                                    } else if (infoRow.Item['#text'] === 'Journal Article') {
                                                        isJournal = true;
                                                    }
                                                }
                                            }
                                        }
                                        if (isJournal) {
                                            tableInput.push(tableInputRow);
                                        }
                                    }

                                    let sDom = 't<flip>';
                                    if (tableInput.length <= 10) {
                                        sDom = 'tfi';
                                    }
                                    const tableSettings = {
                                        iDisplayLength: 4,
                                        sDom,
                                        aaSorting: [],
                                        aoColumns: [
                                            {sTitle: 'Journal', mData: 'source'},
                                            {sTitle: 'Authors', mData: 'author'},
                                            {sTitle: 'Title', mData: 'title'},
                                            {sTitle: 'Date', mData: 'date'}
                                        ],
                                        aaData: tableInput,
                                        fnRowCallback(nRow, aaData) {
                                            nRow.setAttribute('id', aaData['abstract']);
                                        }
                                    };
                                    loader.hide();
                                    litDataTable = self.$elem.find('#literature-table').dataTable(tableSettings);
                                    self.$elem
                                        .find('#literature-table tbody')
                                        .on('mouseover', 'tr', function () {
                                            self.tooltip = self.tooltip.text(abstractsDict[$(this).attr('id')]);
                                            return self.tooltip.style('visibility', 'visible');
                                        })
                                        .on('mouseout', () => {
                                            return self.tooltip.style('visibility', 'hidden');
                                        })
                                        .on('mousemove', (e) => {
                                            return self.tooltip
                                                .style('top', `${e.pageY + 15  }px`)
                                                .style('left', `${e.pageX - 10  }px`);
                                        });
                                },
                                () => {
                                    loader.hide();
                                    // safe
                                    self.$elem.append(
                                        '<br><b>Failed to retrieve literature search results. Try again later.</b>'
                                    );
                                }
                            );
                        });
                    }
                });
            }

            return this;
        },
        getData() {
            return {
                type: 'LitWidget',
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: 'Literature'
            };
        }
    });
});
