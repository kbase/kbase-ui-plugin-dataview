define([], () => {
    return {
        main: {
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgb(200, 200, 200)',
            borderRadius: '1em',
            padding: '0.5em',
            margin: '0.5em 1em 1em 1em'
        },
        label: {
            fontWeight: 'bold',
            color: 'rgba(150, 150, 150)'
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
        Empty: {
            fontStyle: 'italic',
            color: 'rgba(150, 150, 150)',
        }
    };
});
