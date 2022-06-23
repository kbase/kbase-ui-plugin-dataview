define([
    'preact',
    'htm',
    'jquery',
    'dompurify',
    'components/ErrorView',
    'components/Loading',
    'components/Empty'

    // For effect
    // 'css!./Overview.css'
], (
    preact,
    htm,
    $,
    DOMPurify,
    ErrorView,
    Loading,
    Empty
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    const DEFAULT_IMAGE_WIDTH = 400;
    const DEFAULT_MAX_TEXT_HEIGHT = 300;

    class GenomeWikipedia extends Component {
        constructor(props) {
            super(props);
            this.state = {
                status: 'NONE'
            };
        }

        componentDidMount() {
            this.loadData();
        }

        async loadData() {
            try {
                this.setState({
                    status: 'PENDING'
                });

                // Build the term list to try to locate at Wikipedia.
                const genome = this.props.genomeObject.data;
                const taxList = (() => {
                    if ('taxonomy' in this.props.genomeObject.data) {
                        const tax = genome['taxonomy'];
                        let taxList = [];
                        const nameTokens = genome['scientific_name'].split(/\s+/);
                        for (let i = nameTokens.length; i > 0; i--) {
                            taxList.push(nameTokens.slice(0, i).join(' '));
                        }
                        if (taxList && taxList !== 'Unknown') {
                            // parse the taxonomy, a string with semicolon separated components.
                            taxList = taxList.concat(tax.split(/;\s*/).reverse());
                        }
                        return taxList;
                    } else if ('scientific_name' in this.props.genomeObject.data) {
                        const taxList = [];
                        const nameTokens = genome['scientific_name'].split(/\s+/);
                        for (let i = nameTokens.length; i > 0; i--) {
                            taxList.push(nameTokens.slice(0, i).join(' '));
                        }
                        return taxList;
                    }
                    throw new Error('Cannot lookup genome without taxonomy or scientific_name');
                })();

                const searchResult = await this.wikipediaLookup(taxList);
                this.setState({
                    status: 'SUCCESS',
                    value: {
                        searchResult
                    }
                });
            } catch (ex) {
                console.error(ex);
                this.setState({
                    status: 'ERROR',
                    error: {
                        message: ex.message
                    }
                });
            }
        }

        makeImageURL(title) {
            // return `https://en.wikipdia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=${this.props.width || DEFAULT_IMAGE_WIDTH}&callback=?&titles=${title}`;
            const url = new URL('https://en.wikipedia.org/w/api.php');
            const searchParams = url.searchParams;
            searchParams.set('action', 'query');
            searchParams.set('format', 'json');
            searchParams.set('prop', 'pageimages');
            searchParams.set('pithumbsize', this.props.width || DEFAULT_IMAGE_WIDTH);
            // searchParams.set('origin', window.location.origin);
            searchParams.set('origin', '*');
            searchParams.set('titles', title);
            return url.toString();
        }

        makeSearchURL(searchTerm) {
            // const x =  `https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text|pageimages&section=0&redirects=&callback=?&page=${searchTerm}`;
            const url = new URL('https://en.wikipedia.org/w/api.php');
            const searchParams = url.searchParams;
            searchParams.set('action', 'parse');
            searchParams.set('format', 'json');
            searchParams.set('prop', 'text');
            searchParams.set('section', '0');
            searchParams.set('redirects', '');
            // searchParams.set('origin', window.location.origin);
            searchParams.set('origin', '*');
            searchParams.set('page', searchTerm);
            return url.toString();
        }

        async wikipediaLookup(termList) {
            // if (!termList || termList instanceof Array || termList.length === 0) {
            //     if (!this.searchedOnce) {
            //         throw new Error('No search term given');
            //     }
            // }
            // this.searchedOnce = true;
            // take the first term off the list, so we can pass the rest of it if we need to re-call this functionk


            let found = null;
            while (!found) {
                if (termList.length === 0) {
                    throw new Error('Nothing found!');
                }
                const searchTerm = termList.shift();
                const requestURL = this.makeSearchURL(searchTerm);
                const response = await fetch(requestURL, {
                    headers: {
                        Accept: 'application/json'
                    },
                    mode: 'cors'
                });

                const data = JSON.parse(await response.text());

                if (data.error) {
                    continue;
                    // do the next one in the list.
                    // this.wikipediaLookup(termList, successCallback, errorCallback);
                }
                if (data.parse && data.parse.text) {
                    found = {
                        parse: data.parse,
                        searchTerm
                    };
                    break;
                }
            }

            if (!found) {
                throw new Error('Nothing found!');
            }


            // Our abstract is the whole text part.
            // xss safe - as long as we trust WikiPedia
            const $abstract = $('<div>').html(found.parse.text['*']);

            // Remove active links to avoid confusion
            $abstract.find('a').each(function () {
                // xss safe
                $(this).replaceWith($(this).html());
            });
            // Remove Wiki page references
            $abstract.find('sup.reference').remove();
            $abstract.find('.mw-ext-cite-error').remove();

            // The 'description' property of our hit is the parsed abstract field
            // This is a trick to just get all of the 'p' fields, and concatenate the
            // jQuery nodes together as a single HTML text blob.
            // Top level child is a div wrapper.
            const description = (() => {
                if ($abstract.children().length === 1) {
                    return $abstract.children().children('p').map((idx, val) => {
                        // xss safe
                        // We keep the contents of any paragraph.
                        return $(val).get(0).innerHTML;
                    }).get();
                }
                return null;
            })();

            // The title is the actual Wikipedia page link, so put that here.
            const wikiUri = `https://www.wikipedia.org/wiki/${found.parse.title}`;

            // If we have a redirect, save it.
            const redirectFrom = (() => {
                if (found.parse.redirects && found.parse.redirects.length > 0) {
                    return found.parse.redirects[0].from;
                }
            })();

            const imageUri = await (async () => {
                // Do image lookup based on the title
                const imageResponse = await fetch(this.makeImageURL(found.parse.title), {
                    headers: {
                        Accept: 'application/json'
                    },
                    mode: 'cors'
                });

                const imageData = JSON.parse(await imageResponse.text());

                // Really, all we want is in imageData.query.pages.<pageNum>.thumbnail.source
                // Since we're only looking up a single title here, there's a single pageNum
                // property, but we don't know what it is! So we look in the Object.keys()[0]
                if (
                    imageData.query &&
                    imageData.query.pages &&
                    Object.keys(imageData.query.pages).length > 0
                ) {
                    // joys of Javascript!
                    const page = Object.keys(imageData.query.pages)[0];
                    if (imageData.query.pages[page].thumbnail) {
                        return imageData.query.pages[page].thumbnail.source;
                    }
                }
                return null;
            })();

            return {
                searchTerm: found.searchTerm,
                description,
                wikiUri,
                imageUri,
                redirectFrom
            };
        }

        renderLoading() {
            return html`
                <${Loading} message="Loading Wikipedia entry..." />
            `;
        }

        renderError(error) {
            return html`
                <div className="alert alert-danger">
                    ${error.message}
                </div>
            `;
        }

        renderSuccess({searchResult: {searchTerm, description, wikiUri, imageUri}}) {
            // return html`<div>GenomeWikipedia here...</div>`;
            const descriptionStyle = {textAlign: 'justify',
                maxHeight: `${this.props.maxTextHeight || DEFAULT_MAX_TEXT_HEIGHT}px`,
                overflowY: 'auto',
                paddingRight: '5px'
            };
            if (description === null) {
                return html`
                    <div className="alert alert-danger">>No information could be extracted from the WikiPedia entry.</div>
                `;
            }

            const descriptionContent = description.map((paragraph) => {
                return html`<p dangerouslySetInnerHTML=${{__html: DOMPurify.sanitize(paragraph)}} />`;
            });

            return html`
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">

                            <div style=${{descriptionStyle}}>
                                ${descriptionContent}
                            </div>

                            <div style=${{borderTop: '1px solid rgba(200, 200, 200)', margin: '1em 0', paddingTop: '1em'}}>
                                <p>
                                    Wikipedia summary for <i><a href="${wikiUri}" target="_blank">${searchTerm} <span className="fa fa-link" style=${{color: 'gray'}} /></a></i>
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6" style=${{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            ${this.renderImage(imageUri)}
                        </div>
                    </div>
                </div>
            `;
        }

        renderImage(url) {
            if (url) {
                return html`<img src=${url} style=${{maxWidth: '100%'}} alt="Image from Wikipedia"/>`;
            }
            return html`<${Empty} message="Image not available" />`;
        }

        renderState() {
            switch (this.state.status) {
            case 'NONE':
            case 'PENDING':
                return this.renderLoading();
            case 'ERROR':
                return this.renderError(this.state.error);
            case 'SUCCESS':
                return this.renderSuccess(this.state.value);
            }

        }

        render() {
            return html`
                <div className="GenomeWikipedia">
                    ${this.renderState()}
                </div>
            `;
        }
    }
    return GenomeWikipedia;
});
