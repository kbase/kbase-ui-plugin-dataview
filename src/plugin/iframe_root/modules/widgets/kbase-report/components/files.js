define([
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_knockout/lib/viewModelBase',
    'kb_lib/html'
], (reg, gen, ViewModelBase, html) => {
    const t = html.tag,
        iframe = t('iframe'),
        p = t('p'),
        a = t('a'),
        div = t('div'),
        ul = t('ul'),
        li = t('li');

    class ViewModel extends ViewModelBase {
        constructor(params, context) {
            super(params);
            self.runtime = context['$root'].runtime;

            this.files = params.files.map((file, index) => {
                const name = file.name || `download-${  index}`;
                return {
                    url: file.URL,
                    name: file.name,
                    title: file.name || file.URL,
                    downloadUrl: this.makeDownloadLink(file.URL, name)
                };
            });

            this.iframeId = html.genId();
        }

        makeDownloadLink(shock_url, name) {
            const m = shock_url.match(/\/node\/(.+)$/);
            if (m) {
                const shock_id = m[1];
                const query = {
                    id: shock_id,
                    wszip: 0,
                    name
                };
                const queryString = Object.keys(query)
                    .map((key) => {
                        return [key, query[key]].map(encodeURIComponent).join('=');
                    })
                    .join('&');
                const url = `${self.runtime.config('services.KBaseDataImport.url')}/download?${  queryString}`;
                return url;
            }
        }

        doDownload(data) {
            const iframeNode = document.getElementById(this.iframeId);
            iframeNode.setAttribute('src', data.downloadUrl);
        }
    }

    function buildLinks() {
        return [
            iframe({
                dataBind: {
                    attr: {
                        id: 'iframeId'
                    }
                },
                style: {
                    display: 'none'
                }
            }),
            ul(
                {
                    style: {},
                    dataBind: {
                        foreach: 'files'
                    }
                },
                li([
                    a({
                        dataBind: {
                            attr: {
                                href: '$data.url'
                            },
                            text: '$data.title',
                            click: 'function(d,e){$component.doDownload.call($component,d,e);}'
                        },
                        download: true,
                        target: '_blank'
                    })
                ])
            )
        ];
    }

    function buildNoLinks() {
        return p(
            {
                style: {
                    fontStyle: 'italic'
                }
            },
            'No file links for this report'
        );
    }

    function template() {
        return div(gen.if('files && files.length > 0', buildLinks(), buildNoLinks()));
    }

    function component() {
        return {
            viewModelWithContext: ViewModel,
            template: template()
        };
    }

    return reg.registerComponent(component);
});
