define([
    './VisibleController',
    '../components/SampleLinkedDataSummary',
], (
    Controller,
    SampleLinkedDataSummary,
) => {
    class SampleLinkedDataSummaryController extends Controller {
        constructor(params) {
            super(params);
            this.inlineLoading = true;
        }
        view({id, version}) {
            const loader = async () => {
                // wrap this up ourselves.
                // we will produce an object with "linksByType", which
                // contains a map of type name to object count.

                const [links] = await this.model.getDataLinks([{id, version}]);

                // get unique upas.
                const upas = links.reduce((upas, {upa}) => {
                    upas.add(upa);
                    return upas;
                }, new Set());

                const objectInfos = await this.model.getObjectInfos(Array.from(upas));

                const linksByType = links.reduce((linksByType, {upa}) => {
                    const objectInfo = objectInfos[upa];
                    const type = objectInfo.typeName;
                    if (!(type in linksByType)) {
                        linksByType[type] = {};
                    }
                    if (!(upa in linksByType[type])) {
                        linksByType[type][upa] = 0;
                    }
                    linksByType[type][upa] +=1;
                    return linksByType;
                }, {});

                const sorted = Object.entries(linksByType).map(([typeName, objectCounts]) => {
                    return {typeName, objectCounts};
                })
                    .sort((a, b) => {
                        return a.typeName.localeCompare(b.typeName);
                    });


                return {linksByType: sorted};
            };

            const key = `summary-${id}:${version}`;

            return this.render(SampleLinkedDataSummary, loader, key);
        }
    }

    return SampleLinkedDataSummaryController;
});
