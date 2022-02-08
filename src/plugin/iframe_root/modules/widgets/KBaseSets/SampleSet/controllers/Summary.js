define([
    './Controller',
    '../components/Summary',
], (
    Controller,
    Summary,
) => {
    class SummaryController extends Controller {
        constructor(params) {
            super(params);
            this.samples = params.samples;
            this.inlineLoading = false;
        }

        view() {
            const loader = async () => {
                const {
                    sampleSet: {data: {description}},
                    samples,
                    dataLinks,
                    objectInfos
                } = await this.model.getTheSheBang();

                // Field count
                const fieldCount = this.model.getKeysForSamples(samples).length;

                // Per type links
                // console.log('hmm', samples, dataLinks, objectInfos);
                const objectTypeCounts = Object.entries(dataLinks.reduce((typeCounts, links) => {
                    for (const {upa} of links) {
                        const {typeName} = objectInfos[upa];
                        if (!(typeName in typeCounts)) {
                            typeCounts[typeName] = 0;
                        }
                        typeCounts[typeName] += 1;
                    }
                    return typeCounts;
                }, {}))
                    .map(([typeName, count]) => {
                        return {typeName, count};
                    })
                    .sort((a, b) => {
                        return a.typeName.localeCompare(b.typeName);
                    });


                return {
                    description,
                    sampleCount: samples.length,
                    fieldCount,
                    objectTypeCounts
                };
            };

            return this.render(Summary, loader);
        }
    }

    return SummaryController;
});
