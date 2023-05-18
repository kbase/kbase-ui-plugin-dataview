define([], () => {
    function filterScientificName(scientificName) {
        if (!scientificName) {
            return null;
        }
        if (['unknown', 'unknown_taxon'].includes(scientificName.toLowerCase())) {
            return null;
        }
        return scientificName;
    }

    function filterTaxonomy(taxonomy) {
        if (!taxonomy) {
            return null;
        }
        if (['unknown', 'unconfirmed organism'].includes(taxonomy.toLowerCase())) {
            return null;
        }
        return taxonomy;
    }

    return {filterScientificName, filterTaxonomy}
});