define([
    'preact',
    'htm',
    './ProvenancePanel.styles',
    './ProvenanceGraph',
    'kb_service/utils',
    'components/Alert',
    'components/Row',
    'components/Col',

    // For effect
    'css!./ProvenancePanel.css'
], (
    preact,
    htm,
    styles,
    ProvenanceGraph,
    APIUtils,
    Alert,
    Row,
    Col
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);


    function renderRow(rowTitle, rowContent, title) {
        if (typeof title === 'undefined') {
            title = rowContent;
        }
        return html`
            <tr>
                <th>${rowTitle}</th>
                <td>
                    <div class="CellContent" title=${title}>
                        ${rowContent}
                    </div>
                </td>
            </tr>
        `;
    }

    function renderLinkRow(rowTitle, url, label, title) {
        return renderRow(
            rowTitle,
            html`<a href=${url} target="_blank">${label}</a>`, title || label);
    }

    function renderJSONRow(rowTitle, rowContent, {title} = {}) {
        if (typeof title === 'undefined') {
            title = rowContent;
        }

        const content = JSON.stringify(authScrub(rowContent), null, '  ');

        return html`
            <tr>
                <th>${rowTitle}</th>
                <td>
                    <div class="CellContent" title=${title}>
                        <div class="ProvenancePanel-Code">${content}</div>
                    </div>
                </td>
            </tr>
        `;
    }

    function authScrub(objectList) {
        if (objectList && objectList.constructor === Array) {
            for (let k = 0; k < objectList.length; k++) {
                if (objectList[k] && typeof objectList[k] === 'object') {
                    if ('auth' in objectList[k]) {
                        delete objectList[k].auth;
                    }
                }
            }
        }
        return objectList;
    }

    function formatDate(objInfoTimeStamp) {
        if (!objInfoTimeStamp) {
            return '';
        }
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let date = new Date(objInfoTimeStamp);
        let seconds = Math.floor((new Date() - date) / 1000);

        // f-ing safari, need to add extra ':' delimiter to parse the timestamp
        if (isNaN(seconds)) {
            const tokens = objInfoTimeStamp.split('+'); // this is just the date without the GMT offset
            const newTimestamp = `${tokens[0]  }+${  tokens[0].substr(0, 2)  }:${  tokens[1].substr(2, 2)}`;
            date = new Date(newTimestamp);
            seconds = Math.floor((new Date() - date) / 1000);
            if (isNaN(seconds)) {
                // just in case that didn't work either, then parse without the timezone offset, but
                // then just show the day and forget the fancy stuff...
                date = new Date(tokens[0]);
                return `${months[date.getMonth()]  } ${  date.getDate()  }, ${  date.getFullYear()}`;
            }
        }

        // keep it simple, just give a date
        return `${months[date.getMonth()]  } ${  date.getDate()  }, ${  date.getFullYear()}`;
    }

    function formatProvenanceExternalData(extData) {
        /*
         * string resource_name - the name of the resource, for example JGI.
         * string resource_url - the url of the resource, for example
         *      http://genome.jgi.doe.gov
         * string resource_version - version of the resource
         * timestamp resource_release_date - the release date of the resource
         * string data_url - the url of the data, for example
         *      http://genome.jgi.doe.gov/pages/dynamicOrganismDownload.jsf?
         *      organism=BlaspURHD0036
         * string data_id - the id of the data, for example
         *    7625.2.79179.AGTTCC.adnq.fastq.gz
         * string description - a free text description of the data.
         */
        let rethtml = '';
        extData.forEach((edu) => {
            if ('resource_name' in edu) {
                rethtml += '<b>Resource Name</b><br/>';
                if ('resource_url' in edu) {
                    rethtml += `<a target="_blank" href=${  edu['resource_url']}`;
                    rethtml += '>';
                }
                rethtml += edu['resource_name'];
                if ('resource_url' in edu) {
                    rethtml += '</a>';
                }
                rethtml += '<br/>';
            }
            if ('resource_version' in edu) {
                rethtml += '<b>Resource Version</b><br/>';
                rethtml += `${edu['resource_version']  }<br/>`;
            }
            if ('resource_release_date' in edu) {
                rethtml += '<b>Resource Release Date</b><br/>';
                rethtml += `${formatDate(edu['resource_release_date'])  }<br/>`;
            }
            if ('data_id' in edu) {
                rethtml += '<b>Data ID</b><br/>';
                if ('data_url' in edu) {
                    rethtml += `<a target="_blank" href=${  edu['data_url']}`;
                    rethtml += '>';
                }
                rethtml += edu['data_id'];
                if ('data_url' in edu) {
                    rethtml += '</a>';
                }
                rethtml += '<br/>';
            }
            if ('description' in edu) {
                rethtml += '<b>Description</b><br/>';
                rethtml += `${edu['description']  }<br/>`;
            }
        });
        return rethtml;
    }

    class ProvenancePanel extends Component {
        constructor(props) {
            super(props);
            this.state = {
                selectedNode: {
                    nodeInfo: null,
                    over: false
                }
            };
        }

        renderObjectDetails() {
            if (this.state.selectedNode.nodeInfo === null) {
                return html`
                    <${Alert} type="info" message="Hover over graph node to display" />
                `;
            }
            const objectInfo = APIUtils.objectInfoToObject(this.state.selectedNode.nodeInfo.info);
            return html`
                <table class="table table-striped table-bordered ObjectDetails">
                    <tbody>
                        ${renderLinkRow('Name',`/#dataview/${objectInfo.ref}`, objectInfo.name)}
                        ${renderLinkRow('Object ID', `/#dataview/${objectInfo.ref}`, objectInfo.ref)}
                        ${renderLinkRow('Type', `/#spec/type/${objectInfo.type}`, objectInfo.type)}
                        ${renderRow('Saved on', html` ${formatDate(objectInfo.save_date)}`,  formatDate(objectInfo.save_date))}
                        ${renderLinkRow('Saved by', `/#people/${objectInfo.saved_by}`, objectInfo.saved_by)}
                    </tbody>
                </table>
            `;
        }

        renderObjectMetadata() {
            if (this.state.selectedNode.nodeInfo === null) {
                return html`
                    <${Alert} type="info" message="Hover over graph node to display" />
                `;
            }
            const objectInfo = APIUtils.objectInfoToObject(this.state.selectedNode.nodeInfo.info);
            if (objectInfo.metadata && Object.keys(objectInfo.metadata).length > 0) {
                const rows = Object.entries(objectInfo.metadata).map(([key, value]) => {
                    return renderRow(key, value);
                });
                return html`
                    <table class="table table-striped table-bordered">
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                `;
            }
            return html`
                <${Alert} type="neutral" message="No metadata" />
            `;
        }

        getProvRows(provenanceAction, prefix) {
            /* structure {
                 timestamp time;
                 string service;
                 string service_ver;
                 string method;
                 list<UnspecifiedObject> method_params;
                 string script;
                 string script_ver;
                 string script_command_line;
                 list<obj_ref> input_ws_objects;
                 list<obj_ref> resolved_ws_objects;
                 list<string> intermediate_incoming;
                 list<string> intermediate_outgoing;
                 string description;
                 } ProvenanceAction;*/
            const rows = [];
            if ('description' in provenanceAction) {
                rows.push(renderRow(`${prefix  }Description`, provenanceAction['description']));
            }
            if ('service' in provenanceAction) {
                rows.push(renderRow(`${prefix  }Service Name`, provenanceAction['service']));
            }
            if ('service_ver' in provenanceAction) {
                rows.push(renderRow(`${prefix  }Service Version`, provenanceAction['service_ver']));
            }
            if ('method' in provenanceAction) {
                rows.push(renderRow(`${prefix  }Method`, provenanceAction['method']));
            }
            if ('method_params' in provenanceAction) {
                rows.push(
                    renderJSONRow(
                        `${prefix  }Method Parameters`,
                        provenanceAction['method_params']
                    )
                );
            }

            if ('script' in provenanceAction) {
                rows.push(renderRow(`${prefix  }Command Name`, provenanceAction['script']));
            }
            if ('script_ver' in provenanceAction) {
                rows.push(renderRow(`${prefix  }Script Version`, provenanceAction['script_ver']));
            }
            if ('script_command_line' in provenanceAction) {
                rows.push(renderRow(`${prefix  }Command Line Input`, provenanceAction['script_command_line']));
            }

            if ('intermediate_incoming' in provenanceAction) {
                if (provenanceAction['intermediate_incoming'].length > 0)
                    rows.push(
                        renderJSONRow(
                            `${prefix  }Action Input`,
                            provenanceAction['intermediate_incoming']
                        )
                    );
            }
            if ('intermediate_outgoing' in provenanceAction) {
                if (provenanceAction['intermediate_outgoing'].length > 0)
                    rows.push(
                        renderJSONRow(
                            `${prefix  }Action Output`,
                            provenanceAction['intermediate_outgoing']
                        )
                    );
            }

            if ('external_data' in provenanceAction) {
                if (provenanceAction['external_data'].length > 0) {
                    rows.push(
                        renderJSONRow(
                            `${prefix  }External Data`,
                            provenanceAction['external_data']
                        )
                    );
                }
            }

            if ('time' in provenanceAction) {
                rows.push(renderRow(`${prefix  }Timestamp`, formatDate(provenanceAction['time'])));
            }

            return rows;
        }
        renderProvenanceTable() {
            if (this.state.selectedNode.nodeInfo === null) {
                return html`
                    <${Alert} type="info" message="Hover over graph node to display" />
                `;
            }
            const {objdata} = this.state.selectedNode.nodeInfo;
            if (objdata.length === 0) {
                return html`
                    <${Alert} type="neutral" message="No provenance data set." />
                `;
            }
            const rows = [];
            const objectData = objdata[0];
            if ('copied' in objectData) {
                rows.push(html`
                    <tr>
                        <th>Copied from</th>
                        <td>
                            <a href="/#dataview/${objectData.copied}" target="_blank">
                                ${objectData.copied}
                            </a>
                        </td>
                    </tr>
                `);
            }
            if (objectData.provenance.length > 0) {
                objectData.provenance.forEach((provenance, index) => {
                    const prefix = (() => {
                        if (objectData.provenance.length > 1) {
                            return `Action ${index}: `;
                        }
                        return '';
                    })();
                    rows.push(...this.getProvRows(provenance, prefix));
                });
            }
            if (rows.length > 0) {
                return html`
                    <table class="table table-striped table-bordered Provenance">
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                `;
            }
            return html`
                <${Alert} type="neutral" message="No provenance data set." />
            `;
        }

        renderLegend() {
            return html`
                <div class="LegendTableContainer">
                    <table class="LegendTable" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td style=${{width: '3em', backgroundColor: '#FF9800'}}></td>
                                <td>All Versions of this Data</td>
                            </tr>
                            <tr>
                                <td style=${{width: '3em', backgroundColor: '#C62828'}}></td>
                                <td>Data Referencing this Data</td>
                            </tr>
                            <tr>
                                <td style=${{width: '3em', backgroundColor: '#2196F3'}}></td>
                                <td>Data Referenced by this Data</td>
                            </tr>
                            <tr>
                                <td style=${{width: '3em', backgroundColor: '#4BB856'}}></td>
                                <td>Copied From</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        }

        onInspectNode(nodeInfo) {
            if (nodeInfo === null) {
                this.setState({
                    selectedNode: {
                        nodeInfo: null,
                        over: false
                    }
                });
            } else {
                this.setState({
                    selectedNode: {
                        nodeInfo,
                        over: true
                    }
                });
            }
        }

        onInspectNodeLeave() {
            this.setState({
                selectedNode: {
                    ...this.state.selectedNode,
                    over: false
                }
            });
        }

        render() {
            const detailClass = this.state.selectedNode.over ? 'NodeHovered' : 'NodeNotHovered';
            return html`
            <div class="ProvenancePanel">
                <${ProvenanceGraph} 
                    objectInfo=${this.props.objectInfo}
                    runtime=${this.props.runtime}
                    onInspectNode=${this.onInspectNode.bind(this)}
                    onInspectNodeLeave=${this.onInspectNodeLeave.bind(this)}
                    environment=${this.props.environment}
                />
                <${Row} style=${{marginBottom: '1em'}}>
                    <${Col} style=${{flex: '0 0 19em', marginRight: '0.5em'}}>
                        ${this.renderLegend()}
                    <//>
                    <${Col}style=${{flex: '1 1 0', marginRight: '0.5em'}}>
                        <div class=${`ObjectDetails ${detailClass}`}>
                            <h4>Data Object Details</h4>
                            ${this.renderObjectDetails()}
                        </div>
                    <//>
                    <${Col}style=${{flex: '1.75 1 0'}}>
                        <div class=${`Provenance ${detailClass}`}>
                            <h4>Provenance</h4>
                            ${this.renderProvenanceTable()}
                        </div>
                    <//>
                <//>
                <${Row}>
                    <${Col} style=${{flex: '0 0 19em', marginRight: '0.5em'}}>
                    <//>
                    <${Col}style=${{flex: '1 1 0'}}>
                        <div class=${`ObjectMetadata ${detailClass}`}>
                            <h4>Metadata</h4>
                            ${this.renderObjectMetadata()}
                        </div>
                    <//>
                <//>
            </div>
            `;
        }
    }

    return ProvenancePanel;
});