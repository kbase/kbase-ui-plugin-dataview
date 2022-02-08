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

                const [rawDataLinks] = await this.model.getDataLinks([{id, version}]);

                const upas = rawDataLinks.reduce((upas, {upa}) => {
                    upas.add(upa);
                    return upas;
                }, new Set());

                const objectInfos = await this.model.getObjectInfos(Array.from(upas));

                const dataLinks = rawDataLinks
                    .filter((link) => {
                        return (link.upa in objectInfos);
                    })
                    .sort((a, b) => {
                        return objectInfos[a.upa].typeName.localeCompare(objectInfos[b.upa].typeName);
                    });

                return {dataLinks, objectInfos};
            };
            const key = `detail-${id}:${version}`;
            return this.render(SampleLinkedDataDetail, loader, key);
        }
    }

    return SampleLinkedDataDetailController;
});
