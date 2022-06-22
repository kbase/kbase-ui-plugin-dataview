define([
    'preact',
    'htm',
    'components/Tabs',
    'components/ErrorView',
    './Overview',
    './Publications',
    './Taxonomy',
    './AssemblyAnnotation',
], (
    preact,
    htm,
    Tabs,
    ErrorView,
    Overview,
    Publications,
    Taxonomy,
    AssemblyAnnotation
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Genome extends Component {
        renderTabs() {
            const tabs = [
                {
                    id: 'overview',
                    title: 'Genome Overview',
                    render: () => {
                        return html`<${Overview} ...${this.props}/>`;
                    }
                },
                {
                    id: 'publications',
                    title: 'Publications',
                    render: () => {
                        return html`<${Publications}  searchTermx=${this.props.genomeObject.data.scientific_name} searchTerm="Prochlorococcus marinus" />`;
                    }
                },
                {
                    id: 'taxonomy',
                    title: 'Taxonomy',
                    render: () => {
                        return html`<${Taxonomy} ...${this.props} />`;
                    }
                },
                {
                    id: 'assemblyAnnotation',
                    title: 'Assembly and Annotation',
                    render: () => {
                        return html`<${AssemblyAnnotation}  ...${this.props}/>`;
                    }
                },
            ];
            return html`<${Tabs} tabs=${tabs} />`;
        }

        render() {
            return this.renderTabs();
        }
    }
    return Genome;
});
