define([
    './Controller',
    './SampleLinkedDataSummary',
    './SampleLinkedDataDetail',
    '../components/SampleSet3',
], (
    Controller,
    SampleLinkedDataSummaryController,
    SampleLinkedDataDetailController,
    SampleSet3,
) => {
    class SampleSetController3 extends Controller {
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
            const loader = () => {
                return Promise.resolve({
                    sampleSet: this.model.sampleSet,
                    samples: this.model.samples,
                    totalCount: this.model.samples.length,
                    userProfiles: this.model.userProfiles,
                    sampleLinkedDataSummaryController: this.sampleLinkedDataSummaryController(),
                    sampleLinkedDataDetailController: this.sampleLinkedDataDetailController()
                });
            };
            return this.render(SampleSet3, loader);
        }
    }

    return SampleSetController3;
});
