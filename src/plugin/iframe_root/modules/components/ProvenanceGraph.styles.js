define([], () => {
    return {
        main: {
            // resize: 'vertical',
            // overflow: 'auto'
        },
        intro: {
            display: 'flex',
            flexDirection: 'row'
        },
        introText: {
            flex: '3 1 0'
        },
        introControls: {
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        }
    };
});
