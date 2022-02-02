define([], () => {
    return {
        main: {
            flex: '1 1 0px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '0',
            marginTop: '10px',
        },
        Header: {
            // border: '1px solid rgb(200, 200, 200)',
            padding: '0.5em',
            flex: '0 0 auto',
            marginBottom: '1em'
        },
        LinkedData: {
            flex: '1 1 0px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '0',
            overflowY: 'auto'
        },
        container: {
            height: '100%'
            // aspectRatio: '1/1'
        },
        SampleLinks: {
            // borderBottom: '1px solid rgb(150, 150, 150)',
            marginBottom: '1em',
            border: '1px solid rgb(200, 200, 200)',
            borderRadius: '1em',
            padding: '1em'
        },
        Sample: {
            fontWeight: 'bold',
            marginBottom: '0.5em',
            // marginLeft: '1em'
            display: 'flex',
            flexDirection: 'row'
        },
        SampleField: {
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        SampleName: {
            flex: '0 0 15em'
        },
        SampleDescription: {
            flex: '1 1 0',
        },
        SampleSaveDate: {
            flex: '0 0 8em'
        },
        SampleVersion: {
            flex: '0 0 3em'
        },
        SampleOwner: {
            flex: '0 0 10em'
        },
        Links: {

        },
        Link: {
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '1em'
        },
        LinkHeader: {
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '1em',
            borderBottom: '1px dashed rgb(200, 200, 200)',
            fontWeight: 'bold',
            color: 'rgb(150, 150, 150)'
        },
        Label: {
            fontWeight: 'bold',
            color: 'rgb(150, 150, 150)',
            marginLeft: '1em',
            marginRight: '0.5em'
        },
        LinkCol1: {
            flex: '1 1 0'
        },
        LinkCol2: {
            flex: '2 1 0'
        },
        LinkCol3: {
            flex: '1 1 0'
        },
        LinkCol4: {
            flex: '1 1 0',
            overflow: 'hidden'
        },
        LinkCol5: {
            flex: '1 1 0'
        },
        LinkCol6: {
            flex: '1 1 0'
        },
        LinkHeaderCol1: {
            flex: '1 1 0'
        },
        LinkHeaderCol2: {
            flex: '2 1 0'
        },
        LinkHeaderCol3: {
            flex: '1 1 0'
        },
        LinkHeaderCol4: {
            flex: '1 1 0'
        },
        LinkHeaderCol5: {
            flex: '1 1 0'
        },
        LinkHeaderCol6: {
            flex: '1 1 0'
        },
    };
});