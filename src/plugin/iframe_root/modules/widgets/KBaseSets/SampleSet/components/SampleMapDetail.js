define([
    'jquery',
    'preact',
    'htm',
    './common'
], (
    $,
    {Component, h},
    htm,
    {constants, pluralize}
) => {
    const html = htm.bind(h);

    const DETAIL_FIELDS = ['latitude', 'longitude', 'location_description', 'locality'];

    class Detail extends Component {
        constructor(props) {
            super(props);
            this.schemaMap = props.fieldSchemas.reduce((schemaMap, schema) => {
                schemaMap[schema.key] = schema;
                return schemaMap;
            }, {});
        }

        onMouseOver(location, index) {
            // Ignore mouse over for a selected location.
            if (this.props.selectedMarkerId === location.markerId) {
                return;
            }
            this.setState({
                hoveredRow: index
            });
            this.props.onHoverLocation(location);
        }

        onMouseDown(index) {
            this.setState({
                pressedRow: index
            });
        }

        onMouseUp() {
            this.setState({
                pressedRow: null
            });
        }

        onMouseOut(location) {
            // Ignore mouse out for a selected location.
            if (this.props.selectedMarkerId === location.markerId) {
                return;
            }
            this.setState({
                hoveredRow: null
            });
            this.props.onHoverLocation(null);
        }

        onClick(location) {
            this.props.onSelectLocation(location);
        }

        renderMetadataField(sample, fieldKey, defaultValue) {
            const metadata = sample.node_tree[0].meta_controlled;
            // const userMetadata = sample.node_tree[0].meta_user;

            if (!(fieldKey in metadata)) {
                return defaultValue;
            }

            const formattedValue = this.schemaMap[fieldKey].formatter(metadata[fieldKey].value);

            if (metadata[fieldKey].units) {
                return html`<span>${formattedValue}</span> <span
                        style="font-style: italic;">${metadata[fieldKey].units}</span>`;
            }
            return metadata[fieldKey].value;

            // if (userMetadata[name]) {
            //     return userMetadata[name].value;
            // }
        }

        renderDetail(location) {
            return DETAIL_FIELDS
                .filter((fieldKey) => {
                    return fieldKey in this.schemaMap;
                })
                .map((fieldKey) => {
                    const schema = this.schemaMap[fieldKey];
                    return html`
                        <div role="row">
                            <div title="${schema.title}" role="cell">${schema.title}</div>
                            <div role="cell">${this.renderMetadataField(location.samples[0], fieldKey)}</div>
                        </div>`;
                });
        }

        renderMoreDetail(location) {
            if (!this.props.fieldKeys) {
                return;
            }

            return this.props.fieldKeys
                .filter((key) => {
                    return !DETAIL_FIELDS.includes(key) && key in this.schemaMap;
                })
                .map((key) => {
                    const field = this.renderMetadataField(location.samples[0], key);
                    if (typeof field === 'undefined') {
                        return;
                    }
                    const schema = this.schemaMap[key];
                    return html`
                        <div role="row">
                            <div title="${schema.title}" role="cell">${schema.title}</div>
                            <div role="cell">${field}</div>
                        </div>
                    `;
                })
                .filter((field) => {
                    return field;
                });
        }

        renderSamples(location) {
            const samples = location.samples.map(({id, version, name, node_tree}, index) => {
                return html`
                    <div>
                        <div>
                            ${index + 1}
                        </div>
                        <div>
                            <a href="/#samples/view/${id}/${version}" target="_blank">${node_tree[0].id}</a>
                        </div>
                        <div>
                            <a href="/#samples/view/${id}/${version}" target="_blank">${name}</a>
                        </div>
                    </div>
                `;
            });
            return html`
                <div style=${{borderBottom: '1px solid silver', margin: '4px 0'}}></div>
                <div class="SampleTable">
                    <div>
                        <div>
                            <div>
                            </div>
                            <div>
                                ID
                            </div>
                            <div>
                                Name
                            </div>
                        </div>
                    </div>
                    <div>
                        ${samples}
                    </div>
                </div>
            `;
        }

        render() {
            if (!this.props.locationSamples) {
                return;
            }
            const locations = this.props.locationSamples.map((location, index) => {
                const itemStyle = {
                    border: `2px solid ${constants.BORDER_INACTIVE}`,
                    borderRadius: '8px',
                    margin: '0 0 8px 4px',
                    padding: '4px',
                    cursor: 'pointer'
                };
                const isSelected = this.props.selectedMarkerId === location.markerId;
                if (isSelected) {
                    itemStyle.border = `2px solid ${constants.MARKER_ACTIVE}`;
                }
                if (location.markerId === this.props.hoveredMarkerId) {
                    // itemStyle.cursor = 'pointer';
                    if (!isSelected) {
                        itemStyle.border = `2px dashed ${constants.MARKER_HOVERED}`;
                    }
                }
                if (index === this.state.pressedRow) {
                    itemStyle.border = `2px solid ${constants.MARKER_ACTIVE}`;
                }

                return html`
                    <div style=${itemStyle}
                         data-testid=${`location_${String(index)}`}
                         id=${`location_${String(index)}`}
                         onmouseover=${() => {
        this.onMouseOver(location, index);
    }}
                         onmouseout=${() => {
        this.onMouseOut(location);
    }}
                         onmousedown=${() => {
        this.onMouseDown(index);
    }}
                         onmouseup=${() => {
        this.onMouseUp(index);
    }}
                         onclick=${(ev) => {
        if (ev.target.tagName === 'A') {
            return;
        }
        this.onClick(location);
    }}
                    >
                        <div style=${{borderBottom: '1px solid silver', marginBottom: '4px'}}>
                            <div class="LatLongTable">
                                <div>
                                    ${index + 1}
                                </div>
                                <div>
                                    ${pluralize(location.samples.length, 'sample')}
                                </div>
                            </div>
                        </div>
                        <div class="LocationDescription" role="table" data-testid="location-detail">
                            ${this.renderDetail(location)}
                            ${isSelected ? this.renderMoreDetail(location) : ''}
                        </div>
                        ${isSelected ? this.renderSamples(location) : ''}
                    </div>
                `;
            });
            return html`
                <div>
                    ${locations}
                </div>
            `;
        }
    }

    return Detail;
});