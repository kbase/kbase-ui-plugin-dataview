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

                const [dataLinks] = await this.model.getDataLinks([{id, version}]);

                const upas = dataLinks.reduce((upas, {upa}) => {
                    upas.add(upa);
                    return upas;
                }, new Set());

                const objectInfos = await this.model.getObjectInfos(Array.from(upas));

                const sortedDataLinks = dataLinks.sort((a, b) => {
                    return objectInfos[a.upa].typeName.localeCompare(objectInfos[b.upa].typeName);
                });

                return {dataLinks: sortedDataLinks, objectInfos};
            };
            const key = `detail-${id}:${version}`;
            return this.render(SampleLinkedDataDetail, loader, key);
        }
    }

    return SampleLinkedDataDetailController;
});
