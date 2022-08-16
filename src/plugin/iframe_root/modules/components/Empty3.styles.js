define([], () => {
    const mutedHeaderColor = 'rgba(150, 150, 150, 1)';
    return {
        main: {
            display: 'flex',
            flexDirection: 'column',
            flex: '0 0 auto',
            border: '1px solid rgba(150, 150, 150, 0.5)',
            borderRadius: '4px',
            margin: '4px',
            padding: '10px',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(200, 200, 200, 0.3)'
        },
        wrapper: {
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        icon: {
            color: mutedHeaderColor,
            marginRight: '6px'
        },
        header: {
            flex: '0 0 auto',
            fontWeight: 'bold',
            color: mutedHeaderColor,
            marginBottom: '1em'
        },
        body: {
            flex: '1 1 0'
        }
    };
});