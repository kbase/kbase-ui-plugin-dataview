define([
    './Controller',
    '../components/LinkedData',
], (
    Controller,
    LinkedDataComponent,
) => {
    class LinkedDataController extends Controller {
        constructor(params) {
            super(params);
            this.samples = params.samples;
            this.inlineLoading = false;
        }

        calcTable(samplesNLinks, objectInfos) {
            const table = [];

            // Data Links is an array of raw data links in the same
            // order as the sample set.
            // Our job here is to turn that into table, in which each row
            // is a unique combination of sample and linked object. We count
            // the number of links from that sample to that object.
            samplesNLinks.forEach(({sample, links}) => {
                const objects = links.filter((link) => {
                // only keep links which have a valid object info.
                // TODO: check -- this might have already been done in the model??
                    return !!objectInfos[link.upa];
                })
                    .reduce((objects, link) => {
                        if (!(link.upa in objects)) {
                            objects[link.upa] = [];
                        }
                        objects[link.upa].push(link);
                        return objects;
                    }, {});

                for (const [upa, links] of Object.entries(objects)) {
                    const {ref, name, type, typeName, workspaceId, id, version} = objectInfos[upa];
                    table.push({
                        sampleId: sample.id,
                        sampleName: sample.name,
                        sampleVersion: sample.version,
                        objectRef: ref,
                        objectName: name,
                        objectTypeName: typeName,
                        objectType: type,
                        linkCount: links.length,
                        objectRefArray: [workspaceId, id, version],
                        links
                    });
                }
            });
            return table;
        }

        view() {
            const loader = async () => {
                const {
                    samplesNLinks,
                    objectInfos,
                    types
                } = await this.model.getTheSheBang();

                const table = this.calcTable(samplesNLinks, objectInfos);

                return {
                    table,
                    types
                };
            };

            return this.render(LinkedDataComponent, loader);
        }
    }

    return LinkedDataController;
});
