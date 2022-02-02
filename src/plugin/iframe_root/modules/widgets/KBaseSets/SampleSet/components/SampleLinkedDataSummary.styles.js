define([], () => {
    return {
        main: {
            display: 'flex',
            flexDirection: 'row',
            padding: '1em'
        },
        label: {
            fontWeight: 'bold',
            color: 'rgba(150, 150, 150)',
            // padding matches the padding in the cells of the table used to display the summary
            padding: '5px'
        },
        typeSummary: {
            display: 'flex',
            flexDirection: 'row',
            marginLeft: '1em'
        },
        typeName: {
            color: 'rgba(150, 150, 150)'
        },
        linkCount: {
            fontFamily: 'monospace'
        },
        empty: {
            fontStyle: 'italic',
            color: 'rgba(150, 150, 150)',
            marginLeft: '1em'
        },
        col1: {
            flex: '0 0 10em'
        },
        col2: {
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'row'
        },
        DataPill: {
            border: '1px solid rgb(200, 200, 200)',
            borderRadius: '0.25em',
            display: 'flex',
            flexDirection: 'row'
        },
        DataPillLabel: {
            padding: '0.25em',
            backgroundColor: 'rgba(200, 200, 200, 0.5)',
            marginRight: '0.25em'
        },
        DataPillData: {
            padding: '0.25em',
            fontFamily: 'monospace'
        }
    };
});
