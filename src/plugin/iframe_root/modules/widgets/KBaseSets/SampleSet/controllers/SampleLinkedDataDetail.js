define([
    './VisibleController',
    '../components/SampleLinkedDataDetail',
], (
    Controller,
    SampleLinkedDataDetail,
) => {
    class SampleLinkedDataDetailController extends Controller {
        constructor(params) {
            super(params);
            this.inlineLoading = true;
        }
        view({id, version}) {
            const loader = async () => {
                const {linkedData, types} = await this.model.getSampleLinkedData({id, version});

                const linkedDataSorted = linkedData.sort((a, b) => {
                    return a.objectInfo.typeName.localeCompare(b.objectInfo.typeName);
                });

                return {linkedData: linkedDataSorted, types};
            };
            const key = `detail-${id}:${version}`;
            return this.render(SampleLinkedDataDetail, loader, key);
        }
    }

    return SampleLinkedDataDetailController;
});
