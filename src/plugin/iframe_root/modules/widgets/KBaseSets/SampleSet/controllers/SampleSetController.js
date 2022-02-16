define([
    './Controller',
    './SampleLinkedDataSummary',
    './SampleLinkedDataDetail',
    '../components/SampleSet',
], (
    Controller,
    SampleLinkedDataSummaryController,
    SampleLinkedDataDetailController,
    SampleSet,
) => {
    class SampleSetController extends Controller {
        constructor(params) {
            super(params);
            this.sampleSet = params.sampleSet;
            // TODO: move the samples, profile, etc. fetching into the
            // controller, via the model.
            this.samples = params.samples;
            this.userProfiles = params.userProfiles;
            this.inlineLoading = true;
        }

        sampleLinkedDataSummaryController() {
            return new SampleLinkedDataSummaryController({
                runtime: this.runtime,
                model: this.model
            });
        }

        sampleLinkedDataDetailController() {
            return new SampleLinkedDataDetailController({
                runtime: this.runtime,
                model: this.model
            });
        }

        view() {
            const loader = async () => {
                const {
                    sampleSet,
                    samples,
                    totals: {
                        samples: sampleCount
                    },
                    dataLinks,
                    objectInfos,
                    userProfiles,
                } = await this.model.getTheSheBang();

                const samplesWithCounts = samples.map((sample, index) => {
                    const sampleDataLinks = dataLinks[index];
                    const workspaces = sampleDataLinks.reduce((workspaces, link) => {
                        workspaces.add(objectInfos[link.upa].workspaceId);
                        return workspaces;
                    }, new Set());
                    const workspaceCount = workspaces.size;

                    return {
                        sample,
                        workspaceCount,
                        linkCount: sampleDataLinks.length
                    };
                });

                // Count total # of unique narrative workspaces
                return {
                    sampleSet,
                    samples,
                    samplesWithCounts,
                    totalCount: sampleCount,
                    objectInfos,
                    userProfiles,
                    sampleLinkedDataSummaryController: this.sampleLinkedDataSummaryController(),
                    sampleLinkedDataDetailController: this.sampleLinkedDataDetailController()
                };
            };
            return this.render(SampleSet, loader);
        }
    }

    return SampleSetController;
});
