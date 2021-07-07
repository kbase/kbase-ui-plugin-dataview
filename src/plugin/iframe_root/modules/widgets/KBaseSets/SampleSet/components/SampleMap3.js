define([
    'jquery',
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
    $,
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

    const DETAIL_FIELDS = ['latitude', 'longitude', 'location_description', 'locality'];

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


    function pluralize(count, singular, plural) {
        const noun = count === 1 ? singular : plural || `${singular}s`;
        return `${count} ${noun}`;
    }

    class Detail extends Component {
        constructor(props) {
            super(props);
            this.schemaMap = props.fieldSchemas.reduce((schemaMap, schema) => {
                schemaMap[schema.key] = schema;
                return schemaMap;
            }, {});
        }

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
                        <div>
                            <div>${schema.title}</div>
                            <div>${this.renderMetadataField(location.samples[0], fieldKey)}</div>
                        </div>`;
                });
        }

        renderMoreDetail(location) {
            if (!this.props.fieldKeys) {
                return;
            }

            return this.props.fieldKeys
                .filter((key) => {
                    return !DETAIL_FIELDS.includes(key) && key in this.schemaMap
                })
                .map((key) => {
                    const label = this.schemaMap[key].title;
                    const field = this.renderMetadataField(location.samples[0], key);
                    if (typeof field === 'undefined') {
                        return;
                    }
                    return html`
                        <div>
                            <div>${label}</div>
                            <div>${field}</div>
                        </div>
                    `;
                })
                .filter((field) => {
                    return field;
                });

            // return html`
            //     <div>
            //         <div>Country</div>
            //         <div>${getMetadataField(location.samples[0], 'country')}</div>
            //     </div>
            //     <div>
            //         <div>Elevation</div>
            //         <div>${getMetadataField(location.samples[0], 'sesar:elevation_start')}</div>
            //     </div>
            //     <div>
            //         <div>Feature name</div>
            //         <div>${getMetadataField(location.samples[0], 'sesar:physiographic_feature_name')}</div>
            //     </div>
            //     <div>
            //         <div>Feature primary</div>
            //         <div>${getMetadataField(location.samples[0], 'sesar:physiographic_feature_primary')}</div>
            //     </div>
            // `;
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
                if (index === this.state.hoveredRow) {
                    itemStyle.cursor = 'pointer';
                    if (!isSelected) {
                        itemStyle.border = '2px solid aqua';
                    }
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
                         onclick=${(ev) => {
                             if (ev.target.tagName === 'A') {
                                 return;
                             }
                             this.onClick(location);
                         }}
                    >
                        <div style=${{borderBottom: '1px solid silver', marginBottom: '4px'}}>
                            <div className="LatLongTable">
                                <div>
                                    ${index + 1}
                                </div>
                                <div>
                                    ${pluralize(location.samples.length, 'sample')}
                                </div>
                            </div>
                        </div>
                        <div className="LocationDescription">
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

    class SampleMap extends Component {
        constructor(props) {
            super(props);

            this.mapRef = createRef();
            this.samplesMarkers = new Map();
            this.markers = new Map();

            const locationSamples = this.calcSampleMapping();

            // this.updateSampleMapping(locationSamples);

            this.mapLayers = {
                OpenStreetMap: {
                    title: 'Open Street Map',
                    urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    options: {
                        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    },
                    maxZoom: 19
                },
                OpenTopoMap: {
                    title: 'Open Topo Map',
                    urlTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                    options: {
                        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                    },
                    maxZoom: 17
                },
                EsriWorldImagery: {
                    title: 'Esri.WorldImagery',
                    urlTemplate: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    options: {
                        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    },
                    maxZoom: 18
                },
                // MapTilerSatellite: {
                //     title: 'MapTiler Satellite',
                //     urlTemplate: 'https://api.maptiler.com/tiles/{tilesId}/tiles.json?key=ZeHDEmtNulpld1D0IibR',
                //     options: {
                //         attribution: 'ATTRIBUTION HERE'
                //     }
                // }
                //
                // MapTilerSatellite: {
                //     title: 'MapTiler Satellite',
                //     urlTemplate: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=ZeHDEmtNulpld1D0IibR',
                //     options: {
                //         attribution: 'ATTRIBUTION HERE'
                //     }
                // },
                // MapTilerTerrainRGB: {
                //     title: 'MapTiler Terrain RGB',
                //     urlTemplate: 'https://api.maptiler.com/tiles/terrain-rgb/{z}/{x}/{y}.png?key=ZeHDEmtNulpld1D0IibR',
                //     options: {
                //         attribution: 'ATTRIBUTION HERE'
                //     }
                // },
                // MapTilerHillshades: {
                //     title: 'MapTiler Terrain RGB',
                //     urlTemplate: 'https://api.maptiler.com/tiles/hillshades/{z}/{x}/{y}.png?key=ZeHDEmtNulpld1D0IibR',
                //     options: {
                //         attribution: 'ATTRIBUTION HERE'
                //     }
                // },
                // MapTilerOutdoor: {
                //     title: 'MapTiler Outdoor',
                //     urlTemplate: 'https://api.maptiler.com/tiles/outdoor/{z}/{x}/{y}.pbf?key=ZeHDEmtNulpld1D0IibR',
                //     options: {
                //         attribution: 'ATTRIBUTION HERE'
                //     }
                // },
                // MapTilerContours: {
                //     title: 'MapTiler Contours',
                //     urlTemplate: 'https://api.maptiler.com/tiles/contours/{z}/{x}/{y}.pbf?key=ZeHDEmtNulpld1D0IibR',
                //     options: {
                //         attribution: 'ATTRIBUTION HERE'
                //     }
                // }
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
                map: null,
                zoom: null,
                locationSamples
            };
        }

        addLayer(map, key) {
            const layerConfig = this.mapLayers[key];
            if (!layerConfig) {
                console.warn(`Layer not found: ${key}`);
                return;
            }
            if (map === null) {
                return;
            }
            const layer = leaflet.tileLayer(layerConfig.urlTemplate, layerConfig.options);
            layer.addTo(map);
            return layer;
        }

        componentDidMount() {
            if (this.mapRef.current === null) {
                return;
            }
            const maxZoom = Object.entries(this.mapLayers).reduce((maxZoom, [, value]) => {
                if (maxZoom === null) {
                    return value.maxZoom;
                } else {
                    return Math.min(maxZoom, value.maxZoom);
                }
            }, null);
            const map = leaflet.map(this.mapRef.current, {
                preferCanvas: true,
                minZoom: 1,
                maxZoom
            });

            const tile1 = this.addLayer(map, 'OpenStreetMap');
            const tile2 = this.addLayer(map, 'OpenTopoMap');
            const tile4 = this.addLayer(map, 'EsriWorldImagery');
            // const layers = [tile1, tile2, tile4];
            // const tile1 = this.addLayer('MapTilerSatellite');
            // const tile2 = this.addLayer('MapTilerTerrainRGB');
            // const tile3 = this.addLayer('MapTilerHillshades');
            // const tile3 = this.addLayer('MapTilerContours');
            const baseMaps = {
                OpenStreetMap: tile1,
                OpenTopoMap: tile2,
                EsriWorldImagery: tile4
                // MapTilerSatellite: tile1,
                // MapTilerTerrainRGB: tile2,
                // MapTilerHillshades: tile3
                // MapTilerContours: tile3
            };
            leaflet.control.layers(baseMaps, null).addTo(map);

            leaflet.control.scale({
                position: 'topleft'
            }).addTo(map);

            //  this.map.on('zoomstart', (ev) => {
            //     const {type, target} = ev;
            //     const zoom = this.map.getZoom();
            //     console.log('zoom start', zoom, ev);
            //
            // });

            map.on('zoomend', () => {
                if (this.state.map === null) {
                    return;
                }
                const zoom = this.state.map.getZoom();
                this.setState({
                    zoom
                });
            });
            //     // const maxZoom = Object.entries(this.mapLayers).reduce((maxZoom, [, value]) => {
            //     // if (maxZoom === null) {
            //     //     return value.maxZoom;
            //     // } else {
            //     //    return Math.min(maxZoom, value.maxZoom);
            //     // }
            //     Object.entries(baseMaps).forEach(([name, layer]) => {
            //         if (this.map.getMaxZoom() <= zoom) {
            //             layersControl.addBaseLayer(layer, name);
            //             layer.addTo(this.map);
            //         } else {
            //             layersControl.removeLayer(layer);
            //             layer.removeFrom(this.map);
            //         }
            //     });
            // }, null);

            this.updateSampleMapping(map, this.state.locationSamples);
            this.setState({
                map,
                zoom: map.getZoom()
            }, () => {
                $(() => {
                    $('[data-toggle="tooltip"]').tooltip();
                });
            });

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
                    // const additionalInfo = {};
                    //
                    // for (const {from, to} of ADDITIONAL_INFO_FIELDS) {
                    //     if (from in metadata) {
                    //         additionalInfo[to] = metadata[from].value;
                    //     }
                    // }

                    locationSamples.push({
                        samples: [sample],
                        sampleIds: [sample.id],
                        coordinate: {
                            latitude: metadata.latitude.value,
                            longitude: metadata.longitude.value
                        },
                        // additionalInfo,
                        markerId: new Uuid(4).format(),
                        coord: [metadata.latitude.value, metadata.longitude.value]
                    });
                }
            });
            return locationSamples;
        }


        updateSampleMapping(map, locationSamples) {
            const radius = (() => {
                if (locationSamples.length <= 10) {
                    return 20;
                }
                return 10;
            })();

            // create markers.
            locationSamples.forEach((location, index) => {
                const marker = leaflet.circleMarker(location.coord, {
                    title: `lat: ${location.coord[0]}\nlng: ${location.coord[1]}`,
                    color: 'blue',
                    fillOpacity: 0.4,
                    weight: 5,
                    text: String(index),
                    radius
                })
                    .on('click', () => {
                        this.onClickMarker(location, index);
                    })
                    .addTo(map);
                const tooltipContent = `
                    <div>
                        <div style="display: flex; flex-direction: row; align-items: center;">
                            <div class="Tooltip-circle">${String(index + 1)}</div>
                            
                            <span style="margin-left: 1em">${pluralize(location.samples.length, 'sample')}</span>
                        </div>
                        <div style="border-top: 1px silver solid; margin-top: 4px; padding-top: 4px; font-style: italic;">
                            Click to show ${location.samples.length === 1 ? 'sample' : 'samples'}
                        </div>
                    </div>
                `;
                marker.bindTooltip(tooltipContent, {
                    permanent: false,
                    className: 'MarkerLabel',
                    offset: [0, 0]
                });
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
                map.setView([0, 0], 1);
            } else {
                map.fitBounds(locationSamples.map((locationSample) => {
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
            marker.marker.removeFrom(this.state.map);
            marker.marker.addTo(this.state.map);
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
            marker.marker.removeFrom(this.state.map);
            marker.marker.addTo(this.state.map);
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
                this.state.map.invalidateSize();
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
                           fieldKeys=${this.props.fieldKeys}
                           fieldSchemas=${this.props.fieldSchemas}
                           onSelectLocation=${this.onSelectLocation.bind(this)}
                           selectedMarkerId=${this.state.selectedMarkerId}/>
            `;
        }

        onZoomToSamples() {
            if (this.state.map === null) {
                return;
            }
            if (this.state.locationSamples.length === 0) {
                this.state.map.setView([0, 0], 1);
            } else {
                this.state.map.fitBounds(this.state.locationSamples.map((locationSample) => {
                    return locationSample.coord;
                }), {
                    padding: [50, 50]
                });
            }
        }

        onZoomOutFully() {
            if (this.state.map === null) {
                return;
            }

            this.state.map.setZoom(1);
        }

        renderToolbar() {
            if (!this.state.map) {
                return;
            }
            return html`
                <div className="Toolbar">
                    <div>
                        <div>
                            Zoom Level:
                        </div>
                        <div style=${{width: '2em', fontSize: '150%', marginLeft: '0.5em'}}>
                            ${this.state.zoom}
                        </div>
                    </div>
                    <div>
                        <button type="button"
                                class="btn btn-default"
                                style="border: none;"
                                onclick=${this.onZoomToSamples.bind(this)}
                                data-toggle="tooltip"
                                data-placement="top"
                                data-trigger="hover"
                                title="Zoom to Samples">
                            <span className="fa-stack fa-1x">
                                <span className="fa fa-map-o fa-stack-2x" style="color: rgba(80, 80, 80, 1);"/>
                                <span className="fa fa-circle-o fa-stack-1x" style="color: blue;"/>
                            </span>
                        </button>
                        <button type="button"
                                class="btn btn-default"
                                style="border: none;"
                                onclick=${this.onZoomOutFully.bind(this)}
                                data-toggle="tooltip"
                                data-placement="top"
                                data-trigger="hover"
                                title="Zoom to World">
                            <span className="fa fa-globe fa-2x" style="color: rgba(80, 80, 80, 1);"></span>
                        </button>
                    </div>
                </div>
            `;
        }

        render() {
            return html`
                <div style=${styles.main}>
                    <div style=${{
                        flex: '0 0 auto',
                        display: 'flex',
                        flexDirection: 'row',
                        minHeight: '0',
                    }}>
                        ${this.renderToolbar()}
                    </div>
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
                    </
                    />

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
