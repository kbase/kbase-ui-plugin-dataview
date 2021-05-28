define([], () => {
    return {
        main: {
            'flex': '1 1 0px',
            'display': 'flex',
            'flexDirection': 'column',
            'minHeight': '0',
            'marginTop': '10px'
        },
        container: {
            'height': '100%'
        },
        detailRow: {
            'flex': '1 1 0px',
            'display': 'flex',
            'flexDirection': 'column',
            'border': '1px solid rgba(200, 200, 200, 0.5)',
            'boxShadow': '4px 4px 4px rgba(100, 100, 100, 0.5)',
            'margin': '4px 8px 6px 4px',
            'padding': '4px'
        },
        colWrapper: {
            'overflow': 'hidden',
            'whiteSpace': 'nowrap',
            'textOverflow': 'ellipsis'
        },
        detailRowCol: {
            'overflow': 'hidden'
        },
        fieldLabel: {
            'color': 'rgba(150, 150, 150, 1)'
        },
        fieldValue: {}
    };
});