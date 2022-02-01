define([
    './Controller',
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
                return {linkedData, types};
            };
            const key = `detail-${id}:${version}`;
            return this.render(SampleLinkedDataDetail, loader, key);
        }
    }

    return SampleLinkedDataDetailController;
});
