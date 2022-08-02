
define([], () => {
    return {
        main: {
            // resize: 'vertical',
            // overflow: 'auto'
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'column'
        },
        headerRow: {
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '0.5em',
            padding: '0.5em',
            border: '1px solid rgba(150, 150, 150, 1)',
            borderRadius: '1em'
        },
        controlRow: {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '0.25em'
        },
        statusRow: {
            display: 'flex',
            flexDirection: 'row',
            padding: '0.5em',
            backgroundColor: 'rgba(200, 200, 200, 0.2)'
        },
        body: {
            flex: '1 1 0',
            overflowY: 'auto'
        },
        introText: {
            flex: '2 1 0'
        },
        controls: {
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end'
        },
        filterControls: {
            flex: '2 1 0',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        label: {
            fontWeight: 'bold',
            color: 'rgb(100, 100, 100)'
        }
    };
});
