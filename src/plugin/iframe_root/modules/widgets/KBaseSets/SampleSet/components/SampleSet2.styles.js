define([], () => {
    return {
        main: {
            flex: '1 1 0px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '0'
        },
        header: {
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: '0.5em',
            marginBottom: '1em',
            marginLeft: '1em'
        },
        label: {
            fontWeight: 'bold',
            color: 'rgb(150, 150, 150)',
            marginRight: '1em'
        }
    };
});