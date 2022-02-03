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
                const {linkedData} = await this.model.getSampleLinkedData({id, version});

                // compute the summary of links by object type name.
                const linksByType = Object.entries(linkedData.reduce((linksByType, {objectInfo}) => {
                    const typeName = objectInfo.typeName;
                    if (!(typeName in linksByType)) {
                        linksByType[typeName] = 0;
                    }
                    linksByType[typeName] += 1;
                    return linksByType;
                }, {}))
                    .map(([key, value]) => {
                        return {
                            typeName: key,
                            count: value
                        };
                    })
                    .sort((a, b) => {
                        return a.typeName.localeCompare(b.typeName);
                    });

                return {linksByType};
            };

            const key = `summary-${id}:${version}`;

            return this.render(SampleLinkedDataSummary, loader, key);
        }
    }

    return SampleLinkedDataSummaryController;
});
