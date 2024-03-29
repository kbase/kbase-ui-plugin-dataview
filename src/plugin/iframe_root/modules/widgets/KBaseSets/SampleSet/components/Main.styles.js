define([], () => {
    return {
        main: {
            flex: '1 1 0px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '0'
        },
        summary: {
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '1em',
            marginLeft: '1em'
        },
        summaryField: {
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'row',
            marginRight: '14px'
        },
        summaryFieldLabel: {
            color: 'rgba(150, 150, 150, 1)',
            marginRight: '3px'
        },
        summaryFieldValue: {}
    };
});
