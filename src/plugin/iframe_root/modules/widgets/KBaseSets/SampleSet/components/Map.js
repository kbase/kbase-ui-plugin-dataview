define([
    'preact',
    'htm',
    'leaflet',
    'components/Row',
    'components/Col',
    'components/Table',
    'components/DataTable',
    'components/common',

    'css!./Map.css'
], function (
    preact,
    htm,
    leaflet,
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

    class Map extends Component {
        constructor(props) {
            super(props);

            this.mapRef = preact.createRef();

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

        // removeLayer(key) {
        //     const openLayer = this.openLayers[key];
        //     if (!openLayer) {
        //         return;
        //     }

        //     if (this.map === null) {
        //         return;
        //     }
        //     this.map.removeLayer(openLayer.instance);
        // }

        componentDidMount() {
            if (this.mapRef.current === null) {
                return;
            }
            this.map = leaflet.map(this.mapRef.current);

            // leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            // }).addTo(map);
            // leaflet.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            //     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            // }).addTo(map);
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


            // Should be dynamic?

            // generate coords
            // const coords = this.props.sampleSet.samples.map((sample) => {
            //     const metadata = sample.sample.node_tree[0].meta_controlled;
            //     if (!isDefined(metadata.latitude)  || !isDefined(metadata.longitude)) {
            //         return;
            //     }
            //     return {
            //         id: sample.id,
            //         name: sample.name,
            //         coord: [metadata.latitude.value, metadata.longitude.value]
            //     }
            // })
            //     .filter((coord) => {
            //         return coord;
            //     });

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
                } else {
                    locationSamples.push({
                        samples: [{
                            id: sample.id,
                            name: sample.name
                        }],
                        coordinate: {
                            latitude: metadata.latitude.value,
                            longitude: metadata.longitude.value
                        },
                        coord: [metadata.latitude.value, metadata.longitude.value]
                    });
                }
            });

            // create markers.
            locationSamples.forEach((locationSample) => {
                leaflet.marker(locationSample.coord, {
                    title: `lat: ${locationSample.coord[0]}\nlng: ${locationSample.coord[1]}`
                })
                    .bindTooltip(`${locationSample.samples.length} samples`, {
                        permanent: true,
                        direction: 'auto'
                    })
                    .addTo(this.map)
                    .on('mouseover', () => {
                        const highlightedSamples = locationSample.samples.map((sample) => {
                            return sample.id;
                        });
                        this.setState({
                            freezeSamples: false,
                            highlightedSamples
                        });
                    })
                    .on('mouseout', () => {
                        if (this.state.freezeSamples) {
                            return;
                        }
                        this.setState({
                            highlightedSamples: []
                        });
                    })
                    .on('click', () => {
                        this.setState({
                            freezeSamples: true
                        });
                    });
            });

            // const bounds = new leaflet.LatLngBounds(coords);
            this.map.fitBounds(locationSamples.map((locationSample) => {
                return locationSample.coord;
            }));

        }

        renderMap() {
            return html`
                <div className="Map-container" ref=${this.mapRef}></div>
            `;
        }

        renderCoordsTable() {
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

                const isHighlighted =  (this.state.highlightedSamples.some((sampleId) => {
                    return sampleId === sample.id;
                }));
                return {
                    id: sample.id,
                    name: sample.name,
                    source: sample.sample.dataSourceDefinition.id,
                    sourceId: sample.sample.node_tree[0].id,
                    latitude: metadata.latitude.value,
                    longitude: metadata.longitude.value,
                    description: getMetadataField(sample, 'location_description'),
                    isHighlighted
                };
            })
                .filter((coord) => {
                    return coord;
                });

            const columns = [
                {
                    id: 'name',
                    label: 'Name',
                    type: 'string',
                    render: (name, row) => {
                        return html`
                            <a href=${`/#sampleview/${row.id}`} target="_blank">${name}</a>
                        `;
                    }
                },
                {
                    id: 'source',
                    label: 'Source',
                    type: 'string',
                    style: {
                        flex: '0 0 5em'
                    }
                },
                // {
                //     id: 'sourceId',
                //     label: 'ID',
                //     type: 'string',
                //     style: {
                //         flex: '0 0 7em'
                //     }
                // },
                {
                    id: 'latitude',
                    label: 'Latitude',
                    type: 'float',
                    precision: 4,
                    style: {
                        flex: '0 0 7em'
                    }
                },
                {
                    id: 'longitude',
                    label: 'Longitude',
                    type: 'float',
                    precision: 4,
                    style: {
                        flex: '0 0 7em'
                    }

                },
                {
                    id: 'description',
                    label: 'Description',
                    type: 'string',
                    style: {
                        flex: '0 0 10em'
                    },
                    render: (description) => {
                        if (!description) {
                            return html`
                                <div style=${{textAlign: 'center'}}>${common.na()}</div>
                            `;
                        }
                        return description;
                    }
                },
            ];

            return html`
                <${DataTable} dataSource=${coordsTable} columns=${columns} />
            `;
        }

        render() {
            return html`
                <div className="Map">
                    <${Row}>
                        <${Col}>
                            ${this.renderMap()}
                        <//>
                        <${Col}>
                            ${this.renderCoordsTable()}
                        <//>
                    <//>
                </div>
            `;
        }
    }

    return Map;
});