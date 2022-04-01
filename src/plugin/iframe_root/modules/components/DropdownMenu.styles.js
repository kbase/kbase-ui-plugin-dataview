define([], () => {
    return {
        main: {
            position: 'relative'
        },
        hover: {
            visibility: 'visible'
        },
        dropdown: {
            position: 'absolute',
            display: 'block',
            border: '1px solid rgba(200, 200, 200, 1)',
            borderRadius: '4px',
            top: '100%',
            backgroundColor: 'white',
            padding: '4px',
            whiteSpace: 'nowrap',
            filter: 'blur(0px)'
        },
        positionLeft: {
            left: '0'
        },
        positionRight: {
            right: '0'
        },
        wrapper: {},
        title: {
            padding: '4px',
            flex: '1 1 0px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            cursor: 'normal',
            fontWeight: 'bold',
            color: 'rgb(150, 150, 150)',
            textDecoration: 'underline'
        },
        item: {
            padding: '4px',
            flex: '1 1 0px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            cursor: 'pointer'
        },
        dataMenu: {
            maxHeight: '10em',
            overflowY: 'auto',
            position: 'absolute',
            top: '90%',
            border: '1px solid rgba(200, 200, 200, 1)',
            borderRadius: '4px',
            padding: '4px',
            backgroundColor: 'white'
        },
        dataMenuPositionRight: {
            right: '10%'
        },
        dataMenuPositionLeft: {
            left: '90%'
        },
        itemLabel: {
            flex: '1 1 0px'
        },
        itemSubmenuIcon: {
            flex: '0 0 auto'
        },
        itemLabelWithSubmenu: {},
        itemOpen: {},
        itemHover: {
            backgroundColor: 'rgba(200, 200, 200, 0.5)'
        },
        icon: {
            color: 'gray'
        }
    };
});
