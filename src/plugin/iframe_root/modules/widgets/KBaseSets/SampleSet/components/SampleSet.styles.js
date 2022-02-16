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
            marginBottom: '10px',
            marginLeft: '1em'
        },
        label: {
            fontWeight: 'bold',
            color: 'rgb(150, 150, 150)',
            marginRight: '1em'
        },
        DetailWrapper: {
            border: '1px solid rgb(200, 200, 200)',
            borderRadius: '1em',
        }
    };
});