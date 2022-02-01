define([
    './Controller',
    './SampleLinkedDataSummary',
    './SampleLinkedDataDetail',
    '../components/SampleSet2',
], (
    Controller,
    SampleLinkedDataSummaryController,
    SampleLinkedDataDetailController,
    SampleSet2,
) => {
    class SampleSetController extends Controller {
        constructor(params) {
            super(params);
            this.sampleSet = params.sampleSet;
            // TODO: move the samples, profile, etc. fetching into the
            // controller, via the model.
            this.samples = params.samples;
            this.userProfiles = params.userProfiles;
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
            return this.render(SampleSet2, loader);
        }
    }

    return SampleSetController;
});
