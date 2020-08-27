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

    'css!./SampleMap.css'
], function (
    preact,
    htm,
    leaflet,
    Uuid,
    Row,
    Col,
    Table,
    DataTable,
    common
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    function isDefined(value) {
        return (typeof value !== 'undefined');
    }
    function pluralOf(value, singular, plural) {
        if (value === 1) {
            return `${value} ${singular}`;
        } else {
            return `${value} ${plural}`;
        }
    }

    function getMetadataField(sample, key, defaultValue) {
        const metadata = sample.sample.node_tree[0].meta_controlled;
        if (metadata[key]) {
            return metadata[key].value;
        }
        const userMetadata = sample.sample.node_tree[0].meta_user;
        if (userMetadata[key]) {
            return userMetadata[key].value;
        }

        return defaultValue;
    }

    class SampleMap extends Component {
        constructor(props) {
            super(props);

            this.mapRef = preact.createRef();

            this.samplesMarkers = new Map();
            this.markers = new Map();

            this.map = null;

            this.mapLayers = {
                OpenStreetMap: {
                    title: 'Open Street Map',
                    urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    options: {
                        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    }
                },
                OpenTopoMap: {
                    title: 'Open Topo Map',
                    urlTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                    options: {
                        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                    }
                },
                StamenWatercolor: {
                    title: 'Stamen Watercolor',
                    urlTemplate: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}',
                    options: {
                        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        ext: 'png'
                    }
                },
                NASAGIBSModisTerraTrueColorCR: {
                    title: 'NASAGIBS.ModisTerraTrueColorCR',
                    urlTemplate: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}',
                    options: {
                        attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
                        format: 'png'
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
                highlightedSamples: []
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
            const tile3 = this.addLayer('StamenWatercolor');
            const tile4 = this.addLayer('EsriWorldImagery');
            const baseMaps = {
                OpenStreetMap: tile1,
                OpenTopoMap: tile2,
                StamenWatercolor: tile3,
                EsriWorldImagery: tile4
            };
            leaflet.control.layers(baseMaps, null).addTo(this.map);

            leaflet.control.scale({
                position: 'topleft'
            }).addTo(this.map);

            this.updateSampleMapping();
        }

        renderMap() {
            return html`
                <div className="SampleMap-container" ref=${this.mapRef}></div>
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
                <span style=${{fontSize: '150%', marginRight: '4px'}}>∅</span> - Sorry, no samples in this set have geolocation information.
                </div>
            `;
        }

        updateSampleMapping() {
            const locationSamples = [];
            this.props.sampleSet.samples.forEach((sample) => {
                const metadata = sample.sample.node_tree[0].meta_controlled;
                if (!isDefined(metadata.latitude)  || !isDefined(metadata.longitude)) {
                    return;
                }
                const existing = locationSamples.findIndex((locationSample) => {
                    return ((locationSample.coordinate.latitude === metadata.latitude.value) &&
                         (locationSample.coordinate.longitude === metadata.longitude.value));
                });

                if (existing >= 0) {
                    const existingLocationSample = locationSamples[existing];
                    existingLocationSample.samples.push({
                        id: sample.id,
                        name: sample.name
                    });
                    existingLocationSample.sampleIds.push(sample.id);
                } else {
                    locationSamples.push({
                        samples: [{
                            id: sample.id,
                            name: sample.name
                        }],
                        sampleIds: [sample.id],
                        coordinate: {
                            latitude: metadata.latitude.value,
                            longitude: metadata.longitude.value
                        },
                        markerId: new Uuid(4).format(),
                        coord: [metadata.latitude.value, metadata.longitude.value]
                    });
                }
            });

            // var circleMarker = L.circleMarker(latLng, {
            //     color: '#3388ff'
            // }).addTo(map);

            const showTooltips = (locationSamples.length < 50);

            // create markers.
            locationSamples.forEach((location) => {
                const marker = leaflet.circleMarker(location.coord, {
                    title: `lat: ${location.coord[0]}\nlng: ${location.coord[1]}`,
                    color: 'red',
                    radius: 5
                })
                    .bindTooltip(`${pluralOf(location.samples.length, 'sample', 'samples')}`, {
                        permanent: showTooltips,
                        direction: 'auto'
                    })
                    .addTo(this.map)
                    .on('mouseover', () => {
                        // const highlightedSamples = locationSample.samples.map((sample) => {
                        //     return sample.id;
                        // });
                        // this.setState({
                        //     freezeSamples: false,
                        //     highlightedSamples
                        // });
                    })
                    .on('mouseout', () => {
                        // if (this.state.freezeSamples) {
                        //     return;
                        // }
                        // this.setState({
                        //     highlightedSamples: []
                        // });
                    })
                    .on('click', () => {
                        this.onClickMarker(location);
                    });
                // const markerId = new Uuid(4).format();
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

        onClickMarker(location) {
            this.selectLocation(location);
        }

        selectLocation(location) {
            const marker = this.markers.get(location.markerId);
            if (!marker) {
                return;
            }

            const highlightedSamples = location.samples.map((sample) => {
                return sample.id;
            });
            if (marker.selected) {
                const newHighlighted = this.state.highlightedSamples.filter((sampleId) => {
                    return !location.sampleIds.includes(sampleId);
                });
                this.setState({highlightedSamples: newHighlighted});
            } else {
                this.setState({
                    highlightedSamples: this.state.highlightedSamples.concat(highlightedSamples)
                });
            }

            if (marker.selected) {
                marker.marker.setStyle({
                    color: 'red'
                });
            } else {
                marker.marker.setStyle({
                    color: 'green',
                    fill: true,
                    fillColor: 'green'
                });
            }

            marker.marker.removeFrom(this.map);
            marker.marker.addTo(this.map);
            marker.selected = !marker.selected;
            this.markers.set(location.markerId, marker);
        }



        clearSelectedSamples() {
            const markerIds = this.state.highlightedSamples.reduce((markerIds, sampleId) => {
                // return !location.sampleIds.includes(sampleId);

                const sample = this.samplesMarkers.get(sampleId);
                markerIds.add(sample.markerId);
                return markerIds;
            }, new Set());
            Array.from(markerIds).forEach((markerId) => {
                const marker = this.markers.get(markerId);
                marker.marker.setStyle({
                    color: 'red'
                });
            });
            this.setState({
                highlightedSamples: []
            });
        }

        onRowClick(sample) {
            const {markerId} = this.samplesMarkers.get(sample.id);
            const {location} = this.markers.get(markerId);
            this.selectLocation(location);
        }

        renderCoordsTable() {
            if (this.props.sampleSet.samples.length === 0) {
                return this.renderEmptySet();
            }

            const coordsTable = this.props.sampleSet.samples.map((sample) => {
                const metadata = sample.sample.node_tree[0].meta_controlled;
                if (!isDefined(metadata.latitude)  || !isDefined(metadata.longitude)) {
                    return;
                }

                if (this.state.highlightedSamples.length > 0) {
                    if (!this.state.highlightedSamples.includes(sample.id)) {
                        return;
                    }
                }

                // const isHighlighted =  (this.state.highlightedSamples.some((sampleId) => {
                //     return sampleId === sample.id;
                // }));
                return {
                    id: sample.id,
                    name: sample.name,
                    source: sample.sample.dataSourceDefinition.id,
                    sourceId: sample.sample.node_tree[0].id,
                    material: getMetadataField(sample, 'material'),
                    latitude: metadata.latitude.value,
                    longitude: metadata.longitude.value,
                    description: getMetadataField(sample, 'location_description')
                };
            })
                .filter((coord) => {
                    return coord;
                });

            if (coordsTable.length === 0) {
                return this.renderNoGeolocation();
            }

            const formatLatLong = (value) => {
                return Intl.NumberFormat('en-US', {
                    maximumFractionDigits: 4,
                    minimumFractionDigits: 4,
                    useGrouping: true
                }).format(value);
            };

            const row = (row) => {
                return html`
                    <div className="SampleMap-detail-row">
                        <div className="Row">
                            <div className="Col" style=${{flex: '1 1 0px'}}>
                                <div className="Row">
                                    <div className="Col" >
                                        <div className="SampleMap-col-wrapper">
                                            <div className="SampleMap-field-label">sample name</div>
                                            <div className="SampleMap-field-value" role="cell" data-k-b-testhook-cell="name">
                                                <a href=${`/#samples/view/${row.id}`} target="_blank">${row.name}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="Row">
                                    <div className="Col" >
                                        <div className="SampleMap-col-wrapper">
                                            <div className="SampleMap-field-label">latitude</div>
                                            <div className="SampleMap-field-value" role="cell" data-k-b-testhook-cell="latitude">
                                                ${formatLatLong(row.longitude)}
                                            </div>
                                        </div>
                                    </div>
                                
                                    <div className="Col" >
                                        <div className="SampleMap-col-wrapper">
                                            <div className="SampleMap-field-label">longitude</div>
                                            <div className="SampleMap-field-value" role="cell" data-k-b-testhook-cell="longitude">
                                                ${formatLatLong(row.latitude)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="Col" style=${{flex: '1 1 0px'}}>
                                <div className="Row">
                                    <div className="Col">
                                        <div className="SampleMap-col-wrapper">
                                            <div className="SampleMap-field-label">material</div>
                                            <div className="SampleMap-field-value" role="cell" data-k-b-testhook-cell="material">
                                                ${row.material}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="Row">
                                    <div className="Col" >
                                        <div className="SampleMap-col-wrapper">
                                            <div className="SampleMap-field-label">description</div>
                                            <div className="SampleMap-field-value" role="cell" data-k-b-testhook-cell="description">
                                                ${row.description || common.na()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            };

            const header = () => {
                const selected = (() => {
                    if (this.state.highlightedSamples.length === 0) {
                        return;
                    }
                    return html`
                        <span style=${{marginLeft: '4px'}}>
                        (
                            ${this.state.highlightedSamples.length} selected
                            <span 
                            style=${{color: '#337ab7', cursor: 'pointer', marginLeft: '4px'}} 
                            onClick=${this.clearSelectedSamples.bind(this)}>clear</span>
                            </span>
                        )
                    `;
                })();
                return html`
                <div style=${{flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    ${pluralOf(this.props.sampleSet.samples.length, 'sample', 'samples')}
                    ${selected}
                </div>
                `;
            };

            return html`
                <${DataTable} 
                    dataSource=${coordsTable} 
                    render=${{row, header}}
                    heights=${{row: 120, header: 30}}
                    onClick=${this.onRowClick.bind(this)}/>
            `;
        }


        render() {
            return html`
                <div className="SampleMap">
                    <${Row}>
                        <${Col} style=${{marginRight: '5px'}}>
                            ${this.renderMap()}
                        <//>
                        <${Col} style=${{marginLeft: '5px'}}>
                            ${this.renderCoordsTable()}
                        <//>
                    <//>
                </div>
            `;
        }
    }

    return SampleMap;
});