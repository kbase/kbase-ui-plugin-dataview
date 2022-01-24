define([
    './Controller',
    '../components/LinkedData2',
], (
    Controller,
    LinkedDataComponent,
) => {
    class LinkedDataController extends Controller {
        constructor(params) {
            super(params);
            this.samples = params.samples;
        }

        view() {
            const loader = () => {
                return this.model.getLinkedData({samples: this.samples});
            };

            return this.render(LinkedDataComponent, loader);
        }
    }

    return LinkedDataController;
});
