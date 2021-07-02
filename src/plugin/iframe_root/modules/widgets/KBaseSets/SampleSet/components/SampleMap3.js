define([
    'preact',
    'htm',
    'leaflet',
    'uuid',
    'components/Row',
    'components/Col',
    'components/Table',
    'components/DataTable',
    'components/common',
    './SampleMap3.styles',
    'css!./SampleMap3.css'
], (
    {Component, h, createRef},
    htm,
    leaflet,
    Uuid,
    Row,
    Col,
    Table,
    DataTable,
    common,
    styles
) => {
    const html = htm.bind(h);

    const ADDITIONAL_INFO_FIELDS = [{
        from: 'sesar:physiographic_feature_primary',
        to: 'feature',
        label: 'Feature'
    }, {
        from: 'sesar:physiographic_feature_name',
        to: 'featureName',
        label: 'Name'
    }];

    const SELECTED_MARKER_STYLE = {
        color: 'red'
    };

    const NORMAL_MARKER_STYLE = {
        color: 'blue',
        fill: true,
        fillColor: 'white'
    };

    function isDefined(value) {
        return (typeof value !== 'undefined');
    }

    function getMetadataField(sample, name, defaultValue) {
        const metadata = sample.node_tree[0].meta_controlled;
        const userMetadata = sample.node_tree[0].meta_user;

        if (metadata[name]) {
            if (metadata[name].units) {
                return html`<span>${metadata[name].value}</span> <span style="font-style: italic;">${metadata[name].units}</span>`;
            }
            return metadata[name].value;
        }

        if (userMetadata[name]) {
            return userMetadata[name].value;
        }

        return defaultValue;
    }

    class Detail extends Component {
        onMouseOver(index) {
            this.setState({
                hoveredRow: index
            });
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

        onMouseOut() {
            this.setState({
                hoveredRow: null
            });
        }

        onClick(location) {
            this.props.onSelectLocation(location);
        }

        renderMoreDetail(location) {
            return html`
                 <div>
                    <div>Country</div>
                     <div>${getMetadataField(location.samples[0], 'country')}</div>
                </div>
                <div>
                    <div>Elevation</div>
                    <div>${getMetadataField(location.samples[0], 'sesar:elevation_start')}</div>
                </div>
                <div>
                    <div>Feature name</div>
                    <div>${getMetadataField(location.samples[0], 'sesar:physiographic_feature_name')}</div>
                </div>
                <div>
                    <div>Feature primary</div>
                    <div>${getMetadataField(location.samples[0], 'sesar:physiographic_feature_primary')}</div>
                </div>
            `;
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
                <div className="SampleTable">
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
                    border: '2px solid rgba(200, 200, 200, 0.2)',
                    borderRadius: '8px',
                    margin: '0 0 8px 4px',
                    padding: '4px'
                };
                const isSelected = this.props.selectedMarkerId === location.markerId;
                if (isSelected) {
                    // itemStyle.backgroundColor = 'rgba(200, 200, 200, 0.5)';
                    itemStyle.border = '2px solid red';
                }
                if (index === this.state.hoveredRow && !isSelected) {
                    // itemStyle.backgroundColor = 'rgba(200, 200, 200, 0.2)';
                    itemStyle.border = '2px solid aqua';
                    itemStyle.cursor = 'pointer';
                }
                if (index === this.state.pressedRow) {
                    itemStyle.border = '2px solid red';
                }

                return html`
                    <div style=${itemStyle} 
                        id=${`location_${String(index)}`}
                        onmouseover=${() => {
                            this.onMouseOver(index);
                        }}
                       onmouseout=${() => {
                            this.onMouseOut();
                        }}
                       onmousedown=${() => {
                            this.onMouseDown(index);
                       }}
                       onmouseup=${() => {
                            this.onMouseUp(index);
                       }}
                        onclick=${() => {
                            this.onClick(location);
                        }}
                    >
                        <div style=${{borderBottom: '1px solid silver', marginBottom: '4px'}}>
                            <div className="LatLongTable"> 
                                <div>
                                    ${index + 1}
                                </div>
                                <div>
                                     ${location.samples.length} samples
                                </div>
                            </div>
                        </div>
                        <div className="LocationDescription">
                            <div>
                                <div>Latitude</div>
                                <div>${getMetadataField(location.samples[0], 'latitude')}</div>
                            </div>
                            <div>
                                <div>Longitude</div>
                                <div>${getMetadataField(location.samples[0], 'longitude')}</div>
                            </div>
                            <div>
                                <div>Location desc</div>
                                <div>${getMetadataField(location.samples[0], 'location_description')}</div>
                            </div>
                            <div>
                                <div>Locality</div>
                                <div>${getMetadataField(location.samples[0], 'locality')}</div>
                            </div>
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

    class SampleMap extends Component {
        constructor(props) {
            super(props);

            this.mapRef = createRef();
            this.samplesMarkers = new Map();
            this.markers = new Map();
            this.map = null;

            const locationSamples = this.calcSampleMapping();

            // this.updateSampleMapping(locationSamples);

            this.mapLayers = {
                OpenStreetMap: {
                    title: 'Open Street Map',
                    urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    options: {
                        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    }
                },
                OpenTopoMap: {
                    title: 'Open Topo Map',
                    urlTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                    options: {
                        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                    }
                },
                EsriWorldImagery: {
                    title: 'Esri.WorldImagery',
                    urlTemplate: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    options: {
                        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    }
                }
            };

            this.state = {
                grabber: {
                    status: 'NONE'
                },
                grow: {
                    map: 0.75,
                    details: 0.25
                },
                selectedMarkerId: null,
                locationSamples
            };
        }

        addLayer(key) {
            const layerConfig = this.mapLayers[key];
            if (!layerConfig) {
                console.warn(`Layer not found: ${key}`);
                return;
            }
            if (this.map === null) {
                return;
            }
            const layer = leaflet.tileLayer(layerConfig.urlTemplate, layerConfig.options);
            layer.addTo(this.map);
            return layer;
        }

        componentDidMount() {
            if (this.mapRef.current === null) {
                return;
            }
            this.map = leaflet.map(this.mapRef.current, {
                preferCanvas: true
            });

            const tile1 = this.addLayer('OpenStreetMap');
            const tile2 = this.addLayer('OpenTopoMap');
            const tile4 = this.addLayer('EsriWorldImagery');
            const baseMaps = {
                OpenStreetMap: tile1,
                OpenTopoMap: tile2,
                EsriWorldImagery: tile4
            };
            leaflet.control.layers(baseMaps, null).addTo(this.map);

            leaflet.control.scale({
                position: 'topleft'
            }).addTo(this.map);

            this.updateSampleMapping(this.state.locationSamples);
        }

        renderMap() {
            return html`
                <div style=${styles.container} ref=${this.mapRef}></div>
            `;
        }

        renderEmptySet() {
            return html`
                <div class="alert alert-warning">
                    <span style=${{fontSize: '150%', marginRight: '4px'}}>∅</span> - Sorry, no samples in this set.
                </div>
            `;
        }

        renderNoGeolocation() {
            return html`
                <div class="alert alert-warning">
                    <span style=${{fontSize: '150%', marginRight: '4px'}}>∅</span> - Sorry, no samples in this set have
                    geolocation information.
                </div>
            `;
        }

        calcSampleMapping() {
            const locationSamples = [];
            this.props.samples.forEach((sample) => {
                const metadata = sample.node_tree[0].meta_controlled;
                if (!isDefined(metadata.latitude) || !isDefined(metadata.longitude)) {
                    return;
                }
                const existing = locationSamples.findIndex((locationSample) => {
                    return ((locationSample.coordinate.latitude === metadata.latitude.value) &&
                        (locationSample.coordinate.longitude === metadata.longitude.value));
                });

                if (existing >= 0) {
                    const existingLocationSample = locationSamples[existing];
                    existingLocationSample.samples.push(sample);
                    existingLocationSample.sampleIds.push(sample.id);
                } else {
                    const additionalInfo = {};

                    for (const {from, to} of ADDITIONAL_INFO_FIELDS) {
                        if (from in metadata) {
                            additionalInfo[to] = metadata[from].value;
                        }
                    }

                    locationSamples.push({
                        samples: [sample],
                        sampleIds: [sample.id],
                        coordinate: {
                            latitude: metadata.latitude.value,
                            longitude: metadata.longitude.value
                        },
                        additionalInfo,
                        markerId: new Uuid(4).format(),
                        coord: [metadata.latitude.value, metadata.longitude.value]
                    });
                }
            });
            return locationSamples;
        }

        updateSampleMapping(locationSamples) {
            const radius = (() => {
                if (locationSamples.length <= 10) {
                    return 10;
                }
                return 5;
            })();

            // create markers.
            locationSamples.forEach((location, index) => {
                const marker = leaflet.circleMarker(location.coord, {
                    title: `lat: ${location.coord[0]}\nlng: ${location.coord[1]}`,
                    color: 'blue',
                    text: String(index),
                    radius
                })
                    .on('click', () => {
                        this.onClickMarker(location, index);
                    })
                    .addTo(this.map);
                // marker.bindTooltip(String(index + 1), {
                //    permanent: true,
                //     opacity: 0,
                //     className: 'MarkerLabel',
                //    offset: [0, 0]
                // });
                location.samples.forEach((sample) => {
                    this.samplesMarkers.set(sample.id, {
                        markerId: location.markerId
                    });
                });
                this.markers.set(location.markerId, {
                    selected: false,
                    marker,
                    location
                });
            });

            if (locationSamples.length === 0) {
                this.map.setView([0, 0], 1);
            } else {
                this.map.fitBounds(locationSamples.map((locationSample) => {
                    return locationSample.coord;
                }), {
                    padding: [50, 50]
                });
            }
        }

        formatNumber(num) {
            return Intl
                .NumberFormat('en-US', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3
                })
                .format(num);
        }

        onGrabberMouseDown(ev) {
            ev.preventDefault();
            this.setState({
                grabber: {
                    ...this.state.grabber,
                    status: 'GRABBED'
                }
            });
        }

        onGrabberMouseOver(ev) {
            ev.preventDefault();
            this.setState({
                grabber: {
                    ...this.state.grabber,
                    status: 'OVER'
                }
            });
        }

        onGrabberMouseOut(ev) {
            ev.preventDefault();

            switch (this.state.grabber.status) {
            case 'OVER':
                this.setState({
                    grabber: {
                        ...this.state.grabber,
                        status: 'FREE'
                    }
                });
            }
        }

        onGrabberMouseUp(ev) {
            ev.preventDefault();
            this.setState({
                grabber: {
                    ...this.state.grabber,
                    status: 'FREE'
                }
            });
        }

        onClickMarker(location, index) {
            this.selectLocation(location);
            document.getElementById(`location_${index}`).scrollIntoView({behavior: 'smooth'});
        }

        selectMarker(markerId) {
            const marker = this.markers.get(markerId);
            if (!marker) {
                return;
            }
            marker.selected = true;
            marker.marker.setStyle(SELECTED_MARKER_STYLE);
            marker.marker.removeFrom(this.map);
            marker.marker.addTo(this.map);
            this.markers.set(markerId, marker);
            this.setState({
                selectedMarkerId: markerId
            });
        }

        unselectMarker(markerId) {
            const marker = this.markers.get(markerId);
            if (!marker) {
                return;
            }
            marker.selected = false;
            marker.marker.setStyle(NORMAL_MARKER_STYLE);
            marker.marker.removeFrom(this.map);
            marker.marker.addTo(this.map);
            this.markers.set(markerId, marker);
            this.setState({
                selectedMarkerId: null
            });
        }

        selectLocation(location) {
            if (this.state.selectedMarkerId) {
                this.unselectMarker(this.state.selectedMarkerId);

                if (location.markerId !== this.state.selectedMarkerId) {
                    this.selectMarker(location.markerId);
                }
            } else {
                this.selectMarker(location.markerId);
            }
        }

        renderColumnGrabber() {
            const style = {
                flex: '0 0 10px'
            };
            style.backgroundColor = (() => {
                switch (this.state.grabber.status) {
                case 'NONE':
                case 'FREE':
                    return 'silver';
                case 'OVER':
                    return 'aqua';
                case 'GRABBED':
                    return 'red';
                }
            })();
            switch (this.state.grabber.status) {
            case 'OVER':
                style.cursor = 'col-resize';
                break;
            case 'GRABBED':
                style.cursor = 'col-resize';
            }
            return html`
                <div style=${style}
                     onmousedown=${this.onGrabberMouseDown.bind(this)}
                     onmouseup=${this.onGrabberMouseUp.bind(this)}
                     onmouseover=${this.onGrabberMouseOver.bind(this)}
                     onmouseout=${this.onGrabberMouseOut.bind(this)}
                ></div>
            `;
        }

        onContainerMouseMove(ev) {
            if (this.state.grabber.status !== 'GRABBED') {
                return;
            }
            const x = ev.clientX;
            const width = ev.currentTarget.offsetWidth;
            const relativeWidth = x / width;
            this.setState({
                grow: {
                    map: relativeWidth,
                    details: 1 - relativeWidth
                }
            }, () => {
                this.map.invalidateSize();
            });
        }

        onContainerMouseEnter() {
            if (this.state.grabber.status === 'GRABBED') {
                this.setState({
                    grabber: {
                        ...this.state.grabber,
                        status: 'FREE'
                    }
                });
            }
        }

        onContainerMouseUp(ev) {
            ev.preventDefault();
            if (this.state.grabber.status === 'GRABBED') {
                this.setState({
                    grabber: {
                        ...this.state.grabber,
                        status: 'FREE'
                    }
                });
            }
        }

        renderGrabberOverlay() {
            const style = {
                position: 'absolute',
                top: 0, right: 0, bottom: 0, left: 0,
                backgroundColor: 'rgba(200, 200, 200, 0.2)',
                zIndex: 10000,
                cursor: 'col-resize',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            };
            if (this.state.grabber.status !== 'GRABBED') {
                return;
            }
            return html`
                <div style=${style}
                     onmousemove=${this.onContainerMouseMove.bind(this)}>
                    <div style=${{
                        padding: '20px',
                        border: '1px solid silver',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                    }}>
                        Move the mouse back and forth to resize the map.
                    </div>
                </div>
            `;
        }

        onSelectLocation(location) {
            this.selectLocation(location);
        }

        renderDetail() {
            return html`
                <${Detail} locationSamples=${this.state.locationSamples} 
                           onSelectLocation=${this.onSelectLocation.bind(this)}
                           selectedMarkerId=${this.state.selectedMarkerId} />
            `;
        }

        render() {
            return html`
                <div style=${styles.main}>
                    <div style=${{
                        flex: '1 1 0px',
                        display: 'flex',
                        flexDirection: 'row',
                        minHeight: '0',
                        position: 'relative'
                    }}
                         onmouseenter=${this.onContainerMouseUp.bind(this)}
                         onmouseup=${this.onContainerMouseUp.bind(this)}>

                        ${this.renderGrabberOverlay()}

                        <${Col} style=${{flexGrow: this.state.grow.map}}>
                            ${this.renderMap()}
                        <//>

                        ${this.renderColumnGrabber()}

                        <${Col} style=${{flexGrow: this.state.grow.details, overflow: 'auto'}}>
                            ${this.renderDetail()}
                        <//>
                    <//>
                </div>
            `;
        }
    }

    return SampleMap;
});
