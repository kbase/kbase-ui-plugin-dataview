define([], () => {
    return {
        'Spreadsheet_outer': {
            'flex': '1 1 0px',
            'display': 'flex',
            'flexDirection': 'column',
            'minHeight': '0',
            'minWidth': '0',
            'overflowX': 'hidden'
        },
        'Spreadsheet_wrapper': {
            'flex': '1 1 0px',
            'display': 'flex',
            'flexDirection': 'column',
            'minHeight': '0',
            'minWidth': '0',
            'position': 'relative',
            'overflow': 'hidden'
        },
        'Spreadsheet': {
            'flex': '1 1 0px',
            'display': 'flex',
            'flexDirection': 'column',
            'minHeight': '0',
            'minWidth': '0',
            'overflowX': 'auto',
            'boxSizing': 'border-box'
        },
        'Spreadsheet_container': {
            'flex': '1 1 0px',
            'display': 'flex',
            'flexDirection': 'column',
            'minHeight': '0'
        },
        'Spreadsheet_header': {
            'flex': '0 0 auto',
            'display': 'flex',
            'flexDirection': 'column',
            'overflowX': 'hidden',
            borderTop: '1px solid silver',
            backgroundColor: 'rgba(200, 200, 200, 0.2)'
        },
        'Spreadsheet_header_container': {
            'flex': '0 0 auto',
            'display': 'flex',
            'flexDirection': 'row'
        },
        'Spreadsheet_header_cell': {
            'flex': '0 0 auto',
            'display': 'flex',
            'flexDirection': 'row',
            'alignItems': 'center',
            'padding': '4px',
            // 'border': '1px solid silver',
            'minWidth': '0',
            'fontWeight': 'bold',
            cursor: 'default',
            borderBottom: '1px solid silver',
            borderRight: '1px solid silver'
        },
        'Spreadsheet_header_cell_sort_control': {
            'flex': '0 0 auto',
            'color': 'silver',
            'marginLeft': '4px'
        },
        'Spreadsheet_header_cell_menu': {
            'flex': '0 0 auto',
            'visibility': 'hidden',
            'marginLeft': '4px'
        },
        'Spreadsheet_header_cell_menu_active': {
            'visibility': 'visible'
        },
        'Spreadsheet_header_cell__active': {
            'backgroundColor': 'rgba(200, 200, 200, 0.3)',
            'cursor': 'pointer'
        },
        'Spreadsheet_header_cell_sort_control__active': {
            'color': '#337ab7'
        },
        'Spreadsheet_header_cell_Spreadsheet_sample_cell': {
            'fontWeight': 'bold'
        },
        'Spreadsheet_header_cell_Spreadsheet_user_cell': {
            'fontStyle': 'italic'
        },
        'Spreadsheet_body': {
            'flex': '1 1 0px',
            'position': 'relative',
            'overflow': 'scroll',
            'minWidth': '0',
            'minHeight': '0'
        },
        'Spreadsheet_grid': {
            'position': 'relative'
        },
        'Spreadsheet_grid_row': {
            'position': 'absolute'
        },
        'Spreadsheet_grid_cell': {
            'position': 'absolute'
        },
        'Spreadsheet_row': {
            'flex': '0 0 40px',
            'display': 'flex',
            'flexDirection': 'row',
            'minWidth': '0'
        },
        'Spreadsheet_cell': {
            'flex': '0 0 auto',
            'display': 'flex',
            'flexDirection': 'row',
            'alignItems': 'center',
            'padding': '4px',
            // 'border': '1px solid silver',
            'minWidth': '0',
            'position': 'absolute',
            borderBottom: '1px solid silver',
            borderRight: '1px solid silver'
        },
        'Spreadsheet_cell_measurer': {
            'display': 'inline-block',
            'visibility': 'hidden'
        },
        'Spreadsheet_cell_content_measurer': {
            'display': 'flex',
            'flexDirection': 'row',
            'whiteSpace': 'nowrap',
            'minWidth': '0',
            'padding': '4px',
            // border: '1px solid white',
            borderBottom: '1px solid white',
            borderRight: '1px solid white'
        },
        'Spreadsheet_header_cell_content_measurer': {
            'display': 'flex',
            'flexDirection': 'row',
            'whiteSpace': 'nowrap',
            'minWidth': '0',
            'padding': '4px',
            // 'border': '1px solid white',
            'fontWeight': 'bold',
            borderBottom: '1px solid white',
            borderRight: '1px solid white'
        },
        'Spreadsheet_cell_content': {
            'flex': '1 1 0px',
            'display': 'block',
            'overflow': 'hidden',
            'whiteSpace': 'nowrap',
            'textOverflow': 'ellipsis',
            'minWidth': '0'
        },
        'Spreadsheet_user_field': {
            'backgroundColor': 'yellow'
        },
        'Spreadsheet_unknown_field': {
            'backgroundColor': 'red'
        },
        'Spreadsheet_unmapped_field': {
            'backgroundColor': 'orange'
        },
        'Spreadsheet_centeringContainer': {
            'flex': '1 1 0px',
            'display': 'flex',
            'flexDirection': 'column',
            'alignItems': 'center',
            'justifyContent': 'center',
            'position': 'absolute',
            'top': '0',
            'right': '0',
            'bottom': '0',
            'left': '0'
        }
    };
});