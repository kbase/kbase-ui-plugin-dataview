define([
    'preact',
    'htm',
    'dompurify',
    'lib/domUtils',
    'lib/format',
    'components/Loading',
    'components/Empty3',
    'components/DataTable7',

    // For effect
    'css!./common.css',
    'css!./Publications.css'
], (
    preact,
    htm,
    DOMPurify,
    {domSafeText},
    {pluralize},
    Loading,
    Empty,
    DataTable
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    // const DEFAULT_WIDTH = 600;
    // const DEFAULT_HEIGHT = 700;
    const MAX_PUBLICATION_COUNT = 100;
    const PAGE_SIZE = 100;

    const SORT_OPTIONS = [{
        value: 'most-recent',
        label: 'Most Recent'
    },{
        value: 'journal',
        label: 'Journal'
    },{
        value: 'author',
        label: 'First Author'
    },{
        value: 'title',
        label: 'Title'
    }];

    function childrenNamed(node, childName) {
        if (!node) {
            return;
        }
        return node.children.filter(({name}) => {
            return name === childName;
        });
    }

    // function childrenOf(node, childName) {
    //     if (!node) {
    //         return;
    //     }
    //     return node.children.filter(({name}) => {
    //         return name === childName;
    //     });
    // }

    function textOf(node) {
        const firstText = node.children.find(({text}) => {
            return text !== null;
        });
        if (firstText) {
            return firstText.text;
        }
    }

    function firstChildNamed(node, childName) {
        if (!node) {
            return;
        }
        return node.children.find(({name}) => {
            return name === childName;
        });
    }

    function nodeAtPath(startingNode, path) {
        let current = startingNode;
        for (const elementName of path) {
            // We assume just one child with the given name.
            // We _could_ through and exception if there is more than one,
            // or leave the behavior undefined.
            current = firstChildNamed(current, elementName);
            if (!current) {
                return null;
            }
        }
        return current;
    }

    // function childrenOfPathNamed(startingNode, path, childName) {
    //     const node = nodeAtPath(startingNode);
    //     // Then get all the children.

    //     return node.children
    //         .filter(({name}) => {
    //             return name === childName;
    //         });
    // }

    function textNodesOfPath(startingNode, fullPath) {
        const path = fullPath.slice(0, -1);
        const finalElement = fullPath.slice(-1)[0];
        const node = nodeAtPath(startingNode, path);

        return childrenNamed(node, finalElement).map((node) => {
            return textOf(node);
        });
    }

    /*
    THe publication xml doc is rather twisted.
    One element named "Id" contains the doc id, as requested.
    The rest of the elements are named "Item", and themselves have one
    child which has a name which we take to be a property name.
     */
    function parsePublications(startingNode) {
        // Gets all the children of the results named "DocSum", each of which
        // represents a document.
        return nodeAtPath(startingNode, ['eSummaryResult'])
            .children.filter(({name}) => {
                return name === 'DocSum';
            })
            // Now, for each "document summary" we form an object out of its children
            // which have the name "Item", and also set the id from the child named "Id".
            // Pretty convoluted if you ask me.
            .map((node) => {
                const id = textOf(childrenNamed(node, 'Id')[0]);
                const document = childrenNamed(node, 'Item')
                    .reduce((itemAsObject, item) => {
                        const name = item.attributes.Name;
                        const type = item.attributes.Type;
                        if (type === 'List') {
                            // Take the text of the first node of
                            // each child with attribute Name="Author"
                            const value = item.children.map(({name, attributes, children}) => {
                                if (name === 'Item' && attributes.Type === 'String') {
                                    return children[0].text;
                                }
                                return null;
                            })
                                .filter((value) => {
                                    return value !== null;
                                });
                            itemAsObject[name] = {
                                type, value
                            };
                        } else {
                            const value = textOf(item);
                            itemAsObject[name] = {
                                type, value
                            };
                        }

                        return itemAsObject;
                    }, {});

                // Here we add the id to the row
                document.Id = {
                    type: 'String',
                    value: id
                };

                return document;
            });
    }

    function XMLtoObject(xmlString) {
        const treeToObject = (xmlNode, depth) => {
            depth ++;
            // Create the return object
            const obj = {
                name: null,
                attributes: {},
                children: [],
                text: null
            };

            switch (xmlNode.nodeType) {
            case 1: {
                // element
                // do attributes
                obj.name = xmlNode.nodeName;
                if (xmlNode.hasAttributes()) {
                    for (let j = 0; j < xmlNode.attributes.length; j++) {
                        const {name, value} = xmlNode.attributes.item(j);
                        obj.attributes[name] = value;
                    }
                }
                if (xmlNode.hasChildNodes()) {
                    for (let i = 0; i < xmlNode.childNodes.length; i++) {
                        const item = xmlNode.childNodes.item(i);
                        const child = treeToObject(item, depth);
                        if (child !== null) {
                            obj.children.push(child);
                        }
                        // const nodeName = item.nodeName;
                        // if (typeof obj[nodeName].children === 'undefined') {
                        //     obj[nodeName].children = treeToObject(item);
                        // } else {
                        //     if (!(obj.children[nodeName] instanceof Array)) {
                        //         const old = obj.children[nodeName];
                        //         obj[nodeName].children = [];
                        //         obj[nodeName].children.push(old);
                        //     }
                        //     obj[nodeName].push(self.xmlToJson(item));
                        // }
                    }
                }
                break;
            }
            case 3:
                obj.text = xmlNode.nodeValue;
                break;
            case 9: {
                // document node, ignore.
                if (xmlNode.hasChildNodes()) {
                    for (let i = 0; i < xmlNode.childNodes.length; i++) {
                        const item = xmlNode.childNodes.item(i);
                        const child = treeToObject(item, depth);
                        if (child !== null) {
                            obj.children.push(child);
                        }
                    }
                }
                break;
            }
            case 7:
                // processing instruction, skip
                return null;
            case 10:
                // doctype node, skip it.
                return null;
            case 11:
                // document fragment node, skip it.
                return null;
            }
            return obj;
        };
        const xmlTree = new DOMParser().parseFromString(xmlString, 'application/xml');
        return treeToObject(xmlTree, 0);
    }

    class Publications extends Component {
        constructor(props) {
            super(props);
            this.state = {
                searchState: {
                    status: 'NONE'
                },
                currentSearchTerm: this.props.searchTerm,
                sortBy: 'most-recent'
            };
        }

        componentDidMount() {
            this.loadData();
        }

        searchURL(term, max) {
            const url = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi');
            const params = url.searchParams;
            params.set('db', 'pubmed');
            // params.set('sort', 'pub date');
            params.set('retmax', max);
            params.set('term', term);
            if (this.state.sortBy !== 'most-recent') {
                // "most recent" the default sort order
                params.set('sort', this.state.sortBy);
            }
            return url.toString();
        }

        searchSummaryURL(ids) {
            const url = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi');
            const params = url.searchParams;
            params.set('db', 'pubmed');
            params.set('id', ids.join(','));
            return url.toString();
        }

        articleLinkURL(id) {
            return `https://www.ncbi.nlm.nih.gov/pubmed/${id}`;
        }

        async fetchPublications(ids) {
            const summaryURL = this.searchSummaryURL(ids);
            const publicationsResponse = await fetch(summaryURL);
            if (publicationsResponse.status != 200) {
                throw new Error(`Error fetching publications ${publicationsResponse.status}`);
            }
            const xmlString = await publicationsResponse.text();
            const publicationsObject = XMLtoObject(xmlString);

            return parsePublications(publicationsObject);
        }

        async loadData() {
            this.setState({
                ...this.state,
                searchState: {
                    status: 'PENDING'
                }
            });

            try {
                const {pubMaxCount} = this.props;
                const {currentSearchTerm} = this.state;
                const searchURL = this.searchURL(currentSearchTerm, pubMaxCount || MAX_PUBLICATION_COUNT);
                const response = await fetch(searchURL);
                if (response.status !== 200) {
                    throw new Error(`Invalid response ${response.status}`);
                }
                const result = XMLtoObject(await response.text());
                const count = parseInt(textOf(firstChildNamed(firstChildNamed(result, 'eSearchResult'), 'Count')), 10);

                if (count === 0) {
                    this.setState({
                        ...this.state,
                        searchState: {
                            status: 'SUCCESS',
                            value: {
                                count,
                                searchTerm: currentSearchTerm
                            }
                        }
                    });
                    return;
                }

                const ids = textNodesOfPath(result, ['eSearchResult', 'IdList', 'Id']);
                const publications = await this.fetchPublications(ids.slice(0, PAGE_SIZE));

                this.setState({
                    ...this.state,
                    searchState: {
                        status: 'SUCCESS',
                        value: {
                            count,
                            searchTerm: currentSearchTerm,
                            publications
                        }
                    }
                });
                return;
            } catch (ex) {
                console.error(ex);
                this.setState({
                    ...this.state,
                    searchState: {
                        status: 'ERROR',
                        error: {
                            message: ex.message
                        }
                    }
                });
            }
        }

        renderSuccess({count, searchTerm}) {
            if (count === 0) {
                return html`<div style="flex: 0 0 auto">
                <${Empty} title="Not Found">
                    <p>
                        Sorry, nothing found for "${searchTerm}".
                    </p>
                    <p>
                        You may find results by removing terms from the end of the search string and then searching again.
                    </p>
                <//>
                </div>`;
            }

            // return html`<${Alert} type="info" message=${`Wow, ${count} publications found for "${searchTerm}".`}/>`;
            const columns = [{
                id: 'FullJournalName',
                label: 'Journal',
                style: {
                    flex: '1.5 0 0'
                },
                sortable: true,
                searchable: true,
                // sortComparator: ({valueA}, {valueB}) => {
                //     return valueA.localeCompare(valueB);
                // },
                sortKey: 'value',
                filterValue: (({value}) => {
                    return value;
                }),
                render: ({value}) => {
                    return value;
                }
            },
            {
                id: 'AuthorList',
                label: 'Authors',
                style: {
                    flex: '1.5 0 0'
                },
                sortable: true,
                searchable: true,
                sortComparator: (a, b) => {
                    return a.value.join(', ').localeCompare(b.value.join(', '));
                },
                filterValue: (({value}) => {
                    return value.join(', ');
                }),
                render: ({value}) => {
                    if (value.length === 0) {
                        return html`<i>No authors listed</i>`;
                    }
                    return value.join(', ');
                }
            },
            {
                id: 'Title',
                label: 'Title',
                style: {
                    flex: '3 0 0'
                },
                sortable: true,
                searchable: true,
                sortComparator: (a, b) => {
                    return domSafeText(a.value).localeCompare(domSafeText(b.value));
                },
                filterValue: (({value}) => {
                    return value;
                }),
                render: ({value}, row) => {
                    const url =  this.articleLinkURL(row.Id.value);
                    return html`<a href="${url}" target="_blank" dangerouslySetInnerHTML=${{__html: DOMPurify.sanitize(value)}} /a>`;
                }
            },
            {
                id: 'PubDate',
                label: 'Date',
                style: {
                    flex: '0 0 5em'
                },
                sortable: false,
                searchable: true,
                filterValue: (({value}) => {
                    return value.split(/[\s]+/)[0];
                }),
                render: ({value}) => {
                    return value.split(/[\s]+/)[0];
                }
            }
            ];

            const props = {
                columns,
                dataSource: this.state.searchState.value.publications,
                // onRowDblClick: (row) => {
                //     // window.open(this.articleLinkURL(row.Id.value), '_blank');
                // }
            };

            return html`
                <${DataTable} heights=${{row: 40, col: 40}} flex=${true} ...${props} />
            `;
        }

        renderLoading() {
            return html`
                <${Loading} message="Loading publications..." />
            `;
        }

        renderError(error) {
            return html`
                <div className="alert alert-danger">
                    ${error.message}
                </div>
            `;
        }

        renderState() {
            switch (this.state.searchState.status) {
            case 'NONE':
            case 'PENDING':
                return this.renderLoading();
            case 'ERROR':
                return this.renderError(this.state.searchState.error);
            case 'SUCCESS':
                return this.renderSuccess(this.state.searchState.value);
            }
        }

        renderSummary() {
            switch (this.state.searchState.status) {
            case 'NONE':
            case 'PENDING':
            case 'ERROR':
                return html`<${Loading} inline=${true} />`;
            case 'SUCCESS': {
                // const orderedByMessage = `ordered by "${SORT_OPTIONS.filter(({value}) => value === this.state.sortBy)[0].label}"`;
                if (this.state.searchState.value.count > MAX_PUBLICATION_COUNT) {
                    return html`
                    <span>
                        Found ${Intl.NumberFormat('en-US', {useGrouping: true}).format(this.state.searchState.value.count)} ${pluralize(this.state.searchState.value.count, 'publication')}, showing first ${MAX_PUBLICATION_COUNT}.
                    </span>
                `;
                }
                return html`
                    <span>
                        Found ${this.state.searchState.value.count} ${pluralize(this.state.searchState.value.count, 'publication')}.
                    </span>
                `;
            }
            }
        }

        onSearchFormSubmit(e) {
            e.preventDefault(e);
            this.loadData();
        }

        searchInputChanged(e) {
            this.setState({
                ...this.state,
                currentSearchTerm: e.target.value
            });
        }

        sortByChanged(e) {
            this.setState({
                ...this.state,
                sortBy: e.target.value
            }, this.loadData.bind(this));
        }

        renderSearchControls() {
            const sortOptions = SORT_OPTIONS.map(({value, label}) => {
                return html`
                    <option value=${value} selected=${this.state.sortBy === value}>
                        ${label}
                    </option>
                `;
            });
            return html`
                <div className="-search-controls">
                    <form onSubmit=${this.onSearchFormSubmit.bind(this)} className="form form-inline">
                        <input className="form-control" style=${{width: '20em'}}
                            value=${this.state.currentSearchTerm} 
                            onChange=${this.searchInputChanged.bind(this)}
                            />
                        <button type="submit" className="form-control">
                            Search
                        </button>
                        <span style=${{margin: '0 0.5em 0 1em'}}>Sort by:</span>
                        <select className="form-control" onChange=${this.sortByChanged.bind(this)}>
                            ${sortOptions}
                        </select>
                        <div className="-summary">
                        ${this.renderSummary()}
                        </div>
                    </form>
                </div>
            `;
        }

        renderToolbar() {
            return html`
                ${this.renderSearchControls()}
            `;
        }

        renderPublications() {
            return html`
                <div className="PubMedPublications">
                    <div className="-toolbar">
                        ${this.renderToolbar()}
                    </div>
                    <div className="-table">
                        ${this.renderState()}
                    </div>
                </div>
            `;
        }

        render() {
            return html`
                <div className="Genome Publications">
                    <section className="-flex-column">
                        <h4>Publications in PubMed</h4>
                        ${this.renderPublications()}
                    </section>
                </div>
            `;
        }
    }
    return Publications;
});
