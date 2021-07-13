define([], () => {
    function pluralize(count, singular, plural) {
        const noun = count === 1 ? singular : plural || `${singular}s`;
        return `${count} ${noun}`;
    }

    return {
        pluralize,
        constants: {
            BORDER_INACTIVE: 'rgba(200, 200, 200, 1)',
            BORDER_HOVERED: 'rgba(150, 150, 150, 1)',
            BORDER_ACTIVE: 'rgba(100, 100, 100, 1)',

            MARKER_INACTIVE: 'rgba(3, 119, 252, 1)',
            MARKER_HOVERED: 'rgba(75, 173, 29, 1)',
            MARKER_ACTIVE: 'rgba(232, 116, 7, 1)'
        }
    };
});