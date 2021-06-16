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
            left: '0',
            backgroundColor: 'white',
            padding: '4px',
            whiteSpace: 'nowrap',
            filter: 'blur(0px)'
        },
        wrapper: {},
        item: {
            padding: '4px',
            flex: '1 1 0px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        dataMenu: {
            maxHeight: '10em',
            overflowY: 'auto',
            position: 'absolute',
            top: '90%',
            left: '90%',
            border: '1px solid rgba(200, 200, 200, 1)',
            borderRadius: '4px',
            padding: '4px',
            backgroundColor: 'white'
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
            backgroundColor: 'silver',
            cursor: 'pointer'
        },
        icon: {
            color: 'gray'
        }
    };
});
