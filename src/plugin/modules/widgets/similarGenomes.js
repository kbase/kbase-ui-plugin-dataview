define([
    'kb_common/html',
    'kb_common/jsonRpc/dynamicServiceClient',
    'plugins/dataview/modules/collapsiblePanel',
    'bootstrap'
],
function (
    html,
    DynamicServiceClient,
    collapsiblePanel
) {
    'use strict';

    const t = html.tag,
        div = t('div'),
        p = t('p'),
        table = t('table'),
        thead = t('thead'),
        tr = t('tr'),
        th = t('th'),
        tbody = t('tbody'),
        td = t('td'),
        a = t('a');

    class Widget {
        constructor({runtime}) {
            this.runtime = runtime;
            // Both of the props below are assigned in the attach method
            this.hostNode = null;
            this.container = null;
        }

        dataLayout({distances}) {
            const resultsTable = table({class: 'table'}, [
                thead(
                    tr([
                        th('Distance'),
                        th('Name'),
                        th('Refseq ID'),
                        th('KBase ID')
                    ])
                ),
                tbody(distances.map((each) => {
                    // Check if each genome has a KBase ID; if so, construct a dataview link
                    const ncbiHref = `https://www.ncbi.nlm.nih.gov/assembly/${each.sourceid}/`
                    const ncbiLink = a({href: ncbiHref}, [each.sourceid])
                    let kbaseLink = '(none)'
                    if (each.kbase_id) {
                        kbaseLink = a({href: '/#dataview/' + each.kbase_id}, [each.kbase_id])
                    }
                    return tr([
                        td([String(each.dist)]), // Distance
                        td([each.sciname]), // Scientific name
                        td([ncbiLink]), // NCBI ID with link
                        td([kbaseLink]) // KBase ID with link (if present)
                    ]);
                }))
            ]);
            return collapsiblePanel({
                title: 'Similar Genomes',
                content: resultsTable,
                icon: 'copy',
                collapsed: true
            });
        }

        loadingLayout() {
            const loader = p(html.loading('Finding similar genomes'));
            return collapsiblePanel({
                title: 'Similar Genomes',
                content: loader,
                icon: 'copy',
                collapsed: true
            });
        }

        attach(node) {
            this.hostNode = node;
            this.container = node.appendChild(document.createElement('div'));
            this.container.innerHTML = this.loadingLayout();
        }

        start({workspaceId, objectId, objectVersion, objectInfo}) {
            if (!checkType(objectInfo.type)) {
                this.container.innerHTML = '';
                return;
            }
            const workspaceRef = [workspaceId, objectId, objectVersion || '1'].join('/');
            const sketchClient = new DynamicServiceClient({
                url: this.runtime.config('services.service_wizard.url'),
                token: this.runtime.service('session').getAuthToken(),
                module: 'sketch_service'
            });
            // Make an RPC method call to the sketch_service dynamic service
            // This will return a set of similar genomes, rendered by the dataLayout function
            sketchClient.callFunc('get_homologs', [workspaceRef])
                .then((data) => {
                    this.container.innerHTML = this.dataLayout(data);
                })
                .catch((err) => {
                    console.log('Error loading similar genomes:', err)
                    this.container.innerHTML = collapsiblePanel({
                        title: 'Similar Genomes',
                        content: 'Unable to search: ' + err.data.error,
                        icon: 'copy',
                        collapsed: true
                    })
                });
        }

        stop() {}

        detach() {
            // Just in case the widget attach method failed, or was never called...
            if (this.hostNode && this.container) {
                this.hostNode.removeChild(this.container);
            }
        }
    }

    /**
     * Check that the loaded workspace object is either a Reads, Assembly, or Genome type.
     */
    function checkType(type) {
        const validTypes = [
            'PairedEndLibrary-2.0',
            'SingleEndLibrary-2.0',
            'KBaseGenomeAnnotations.Assembly',
            'ContigSet',
            'Genome'
        ];
        for (const t of validTypes) {
            if (type.indexOf(t) !== -1) {
                return true;
            }
        }
        return false;
    }

    return {
        make: function (config) {
            return new Widget(config);
        }
    };
});
