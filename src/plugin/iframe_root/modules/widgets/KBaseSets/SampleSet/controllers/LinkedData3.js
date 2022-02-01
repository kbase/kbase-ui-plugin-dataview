define([
    './Controller',
    '../components/LinkedData3',
], (
    Controller,
    LinkedDataComponent,
) => {
    class LinkedDataController extends Controller {
        constructor(params) {
            super(params);
            this.samples = params.samples;
            this.inlineLoading = false;
        }

        view() {
            const loader = () => {
                return this.model.getLinkedData3({samples: this.samples});
            };

            return this.render(LinkedDataComponent, loader);
        }
    }

    return LinkedDataController;
});
