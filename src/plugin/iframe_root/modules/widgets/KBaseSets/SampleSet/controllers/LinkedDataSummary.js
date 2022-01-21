define([
    './Controller',
    '../components/LinkedDataSummary',
], (
    Controller,
    LinkedDataSummaryComponent,
) => {
    class LinkedDataController extends Controller {
        constructor(params) {
            super(params);
            this.samples = params.samples;
        }

        view() {
            const loader = () => {
                return this.model.getLinkedDataSummary({samples: this.samples});
            };

            return this.render(LinkedDataSummaryComponent, loader);
        }
    }

    return LinkedDataController;
});
