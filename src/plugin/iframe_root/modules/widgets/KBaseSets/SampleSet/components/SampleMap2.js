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
    './SampleMap.styles',
    'css!./SampleMap2.css'
], function (
    preact,
    htm,
    leaflet,
    Uuid,
    Row,
    Col,
    Table,
    DataTable,
    common,
    styles
) {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    function isDefined(value) {
        return (typeof value !== 'undefined');
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
                EsriWorldImagery: {
                    title: 'Esri.WorldImagery',
                    urlTemplate: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    options: {
                        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    }
                }
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

            this.updateSampleMapping();
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

        updateSampleMapping() {
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
                    existingLocationSample.samples.push({
                        id: sample.id,
                        name: sample.name
                    });
                    existingLocationSample.sampleIds.push(sample.id);
                } else {
                    locationSamples.push({
                        samples: [{
                            id: sample.id,
                            version: sample.version,
                            name: sample.name
                        }],
                        sampleIds: [sample.id],
                        coordinate: {
                            latitude: metadata.latitude.value,
                            longitude: metadata.longitude.value
                        },
                        primaryPhysiographicFeature: metadata['sesar:physiographic_feature_primary'].value,
                        physiographicFeatureName: metadata['sesar:physiographic_feature_name'].value,
                        markerId: new Uuid(4).format(),
                        coord: [metadata.latitude.value, metadata.longitude.value]
                    });
                }
            });

            const radius = (() => {
                if (locationSamples.length <= 10) {
                    return 10;
                }
                return 5;
            })();

            // create markers.
            locationSamples.forEach((location) => {
                const marker = leaflet.circleMarker(location.coord, {
                    title: `lat: ${location.coord[0]}\nlng: ${location.coord[1]}`,
                    color: 'red',
                    radius
                })
                    .bindPopup(this.renderPopup(location), {
                        maxHeight: 200,
                    })
                    .addTo(this.map);
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

        renderPopup(location) {
            const samples = location.samples.map((sample) => {
                const sampleURL = `${window.location.origin}#samples/view/${sample.id}/${sample.version}`;
                return `
                    <div>
                        <a href="${sampleURL}" target="_blank">${sample.name}</a>
                    </div>
                `;
            }).join('');
            return `
                <div class="MapPopUp">
                    <div style="white-space: nowrap">
                        <table>
                            <tbody>
                                <tr>
                                    <th >Lat</th>
                                    <td>
                                        ${this.formatNumber(location.coordinate.latitude)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Long</th>
                                    <td>
                                        ${this.formatNumber(location.coordinate.longitude)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Feature</th>
                                    <td>
                                        ${location.primaryPhysiographicFeature}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Name</th>
                                    <td>
                                        ${location.physiographicFeatureName}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Samples</th>
                                    <td>
                                        ${Intl.NumberFormat('en-US', {useGrouping: true}).format(location.samples.length)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="border-top: 1px solid rgba(200, 200, 200, 1); margin-top: 4px; padding-top: 4px;">
                        ${samples}
                    </div>
                </div>
            `;
        }

        formatNumber(num) {
            return Intl
                .NumberFormat('en-US', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3
                })
                .format(num);
        }

        render() {
            return html`
                <div style=${styles.main}>
                    <${Row}>
                        <${Col}>
                        ${this.renderMap()}
                    <//>
                </div>
            `;
        }
    }

    return SampleMap;
});
