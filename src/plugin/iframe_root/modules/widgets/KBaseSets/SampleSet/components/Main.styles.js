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
        summaryFieldValue: {},
        DataPill: {
            display: 'flex',
            flexDirection: 'row',
            marginLeft: '0.5em'
        },
        DataPillLabel: {
            color: 'rgba(150, 150, 150)',
            marginRight: '0.25em'
        },
        DataPillValue: {

        },
        DataPillGroup: {
            display: 'flex',
            flexDirection: 'row'
        },
        DataPillGroupTitle: {
            // border: '1px solid rgba(200, 200, 200)',
            // borderRadius: '0.5em',
            fontWeight: 'bold',
            color: 'rgba(150, 150, 150)',
            marginRight: '0.5em'
        },
        DataPillGroupBody: {
            display: 'flex',
            flexDirection: 'row'
        },
    };
});
