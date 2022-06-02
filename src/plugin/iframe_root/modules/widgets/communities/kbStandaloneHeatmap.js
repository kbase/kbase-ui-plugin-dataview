/*
 Heatmap Renderer

 Displays a heatmap.

 Options

 width (int)
 Number of pixels the resulting image is wide. Default is 700

 height (int)
 Number of pixels the resulting image is high. This will be adjusted to at least rows * min_cell_height + legend and tree heights. Default is 600.

 tree_height (int)
 Number of pixels the dendogram tree for the columns is high. Default is 50.

 tree_width (int)
 Number of pixels the dendogram tree for the rows is wide. Default is 50.

 legend_height (int)
 Number of pixels for the column names. Default is 250.

 legend_width (int)
 Number of pixels for the row names. Default is 250.

 row_text_size (int)
 Number of pixels of the row text font size. Default is 15.

 col_text_size (int)
 Number of pixels of the column text font size. Default is 15.

 min_cell_height (int)
 Minimum number of pixels a row is high. This may cause the defined height of the resulting image to be overwritten. Default is 19.

 selectedRows (array of boolean)
 Returns an array that has a value of true for all row indices that are currently selected.

 data (object)
 columns (array of string)
 names of the columns
 rows (array of string)
 names of the rows
 colindex (array of int)
 1 based indices of the original column order. This converts the original order (columns) into the one ordered by distance.
 rowindex (array of int)
 1 based indices of the original row order. This converts the original order (rows) into the one ordered by distance.
 coldend (array of array of float)
 distance matrix for the columns
 rowdend (array of array of float)
 distance matrix for the rows
 data (array of array of float)
 normalized value matrix
 */
define(['jquery', 'widgets/communities/jquery.svg'], ($) => {
    const standaloneHeatmap = {
        about: {
            name: 'heatmap',
            title: 'Heatmap',
            author: 'Tobias Paczian',
            version: '1.0',
            requires: ['jquery.svg.js']
        },
        defaults: {
            width: 200,
            height: 200,
            tree_height: 50,
            tree_width: 50,
            legend_height: 80,
            legend_width: 100,
            row_text_size: 15,
            col_text_size: 15,
            min_cell_height: 19,
            selectedRows: [],
            selectedColumns: [],
            cells: []
        },
        options: [
            {
                text: [
                    {
                        name: 'row_text_size',
                        type: 'int',
                        description: 'font size of the row text in pixel',
                        title: 'row font size'
                    },
                    {
                        name: 'col_text_size',
                        type: 'int',
                        description: 'font size of the column text in pixel',
                        title: 'column font size'
                    },
                    {
                        name: 'min_cell_height',
                        type: 'int',
                        description: 'minimum height of a cell',
                        title: 'minimum cell height'
                    }
                ]
            },
            {
                layout: [
                    {name: 'height', type: 'int', description: 'height of the plot', title: 'height'},
                    {name: 'width', type: 'int', description: 'width of the plot', title: 'width'},
                    {
                        name: 'tree_height',
                        type: 'int',
                        description: 'height of the dendogram',
                        title: 'dendogram height'
                    },
                    {
                        name: 'tree_width',
                        type: 'int',
                        description: 'width of the dendogram',
                        title: 'dendogram width'
                    },
                    {name: 'legend_height', type: 'int', description: 'height of the legend', title: 'legend height'},
                    {name: 'legend_width', type: 'int', description: 'width of the legend', title: 'legend width'}
                ]
            }
        ],
        exampleData() {
            return {
                columns: ['4441619.3', '4441656.4', '4441620.3'],
                rows: ['Eukaryota', 'unassigned', 'Bacteria', 'Archaea'],
                data: [
                    [0.338159580408187, 0.717179237742824, 0.514052821211353],
                    [0.238159580408187, 0.317179237742824, 0.114052821211353],
                    [0.553202346761363, 0.614080873307415, 0.555096325148052],
                    [0.996159994861707, 0.940468112695288, 1]
                ]
            };
        },
        create(params) {
            const instance = {
                settings: {}
            };
            // Create new graph instance, copying this instance into it.
            $.extend(true, instance, this);

            // Mix in the defaults and whatever the user provided in params.
            $.extend(true, instance.settings, this.defaults, params);

            // disable caching these, the user can do that themselves.
            // window.rendererGraph.push(instance);

            return instance;
        },
        render() {
            const min_height =
                this.settings.data.rows.length * this.settings.min_cell_height +
                this.settings.tree_height +
                this.settings.legend_height;
            if (this.settings.height < min_height) {
                this.settings.height = min_height;
            }
            const min_width =
                this.settings.data.columns.length * this.settings.min_cell_height +
                this.settings.tree_width +
                this.settings.legend_width;
            if (this.settings.width < min_width) {
                this.settings.width = min_width;
            }

            // get the target div
            const target = this.settings.target;
            // xss safe
            target.innerHTML = '<div class=\'heatmap-container\'><div class=\'heatmap_div\'></div></div>';
            const heatmap = $(target).find('.heatmap_div');
            heatmap.attr('style', `width: ${  this.settings.width  }px; height: ${  this.settings.height  }px;`);

            // not pretty, but add event handlers here.
            const that = this;
            $(target)
                .find('.heatmap-container')
                .on('click', '[data-type="label"]', function () {
                    const row = parseInt($(this).attr('data-row'), 10);
                    const dir = parseInt($(this).attr('data-dir'), 10);
                    that.toggleSelected(row, dir);
                });

            $(target)
                .find('.heatmap-container')
                .on('click', '[data-type="cell"]', function () {
                    const row = parseInt($(this).attr('data-row'), 10);
                    const col = parseInt($(this).attr('data-col'), 10);
                    const value = parseFloat($(this).attr('data-value'));
                    that.cellClick(row, col, value, this);
                });
            $(target)
                .find('.heatmap-container')
                .on('mouseover', '[data-type="cell"]', function () {
                    const row = parseInt($(this).attr('data-row'), 10);
                    const col = parseInt($(this).attr('data-col'), 10);
                    const value = parseFloat($(this).attr('data-value'));
                    that.cellHover(1, row, col, value, this);
                });
            $(target)
                .find('.heatmap-container')
                .on('mouseout', '[data-type="cell"]', function () {
                    const row = parseInt($(this).attr('data-row'), 10);
                    const col = parseInt($(this).attr('data-col'), 10);
                    const value = parseFloat($(this).attr('data-value'));
                    that.cellHover(0, row, col, value, this);
                });

            heatmap.svg();
            this.drawImage(heatmap.svg('get'));

            return this;
        },
        drawImage(svg) {
            // initialize shortcut variables
            const numrows = this.settings.data.rows.length;
            const numcols = this.settings.data.columns.length;
            const boxwidth = parseInt(
                (this.settings.width - this.settings.legend_width - this.settings.tree_width - 5) / numcols,
                10
            );
            this.settings.boxwidth = boxwidth;
            const boxheight = parseInt(
                (this.settings.height - this.settings.legend_height - this.settings.tree_height - 5) / numrows,
                10
            );
            this.settings.boxheight = boxheight;
            const displaywidth = parseInt(
                this.settings.width - this.settings.legend_width - this.settings.tree_width - 5,
                10
            );


            let x = 0;
            let y = 0;
            const rx = 0;
            const ry = 0;
            let width = 0;
            let height = 0;
            const settings = {fill: 'red', strokeWidth: 1, stroke: 'black'};
            if ('coldend' in this.settings.data && 'colindex' in this.settings.data) {
                this.settings.data.colcluster = this.settings.data.coldend;
            } else {
                const col_result = this.cluster(this.transpose(this.settings.data.data));
                this.settings.data.colcluster = col_result[0];
                this.settings.data.colindex = col_result[1];
            }
            if ('rowdend' in this.settings.data && 'rowindex' in this.settings.data) {
                this.settings.data.rowcluster = this.settings.data.rowdend;
            } else {
                const row_result = this.cluster(this.settings.data.data);
                this.settings.data.rowcluster = row_result[0];
                this.settings.data.rowindex = row_result[1];
            }
            this.drawDendogram(svg, 0);
            this.drawDendogram(svg, 1);

            // draw the heatmap
            for (let i = 0; i < this.settings.data.data.length; i++) {
                // draw row text
                const textx = this.settings.tree_width + displaywidth + 5;
                const texty =
                    this.settings.tree_height +
                    this.settings.legend_height +
                    (boxheight * (i + 1) - parseInt((boxheight - this.settings.row_text_size) / 2)) -
                    2;
                let fontColor = 'black';
                if (this.settings.selectedRows[i]) {
                    fontColor = 'blue';
                }

                /* TODO: rewire as delegated events on the container ... */
                svg.text(null, textx, texty, `${  this.settings.data.rows[this.settings.data.rowindex[i] - 1]}`, {
                    fill: fontColor,
                    fontSize: `${this.settings.row_text_size  }px`,
                    'data-type': 'label',
                    'data-row': String(i),
                    'data-dir': '0',
                    cursor: 'pointer'
                });

                svg.text(null, textx, texty, `${  this.settings.data.rows[this.settings.data.rowindex[i] - 1]}`, {
                    fill: fontColor,
                    fontSize: `${this.settings.row_text_size  }px`,
                    'data-type': 'label',
                    'data-row': String(i),
                    'data-dir': '0',
                    cursor: 'pointer'
                });
                this.settings.cells.push([]);

                // draw cells
                for (let h = 0; h < this.settings.data.data[i].length; h++) {
                    // draw column text
                    if (i === 0) {
                        const ctextx =
                            this.settings.tree_width +
                            boxwidth * h +
                            parseInt((boxwidth - this.settings.col_text_size) / 2, 10) +
                            12;
                        const ctexty = this.settings.legend_height - 5;
                        fontColor = 'black';
                        if (this.settings.selectedColumns[h]) {
                            fontColor = 'blue';
                        }
                        svg.text(null, ctextx, ctexty, this.settings.data.columns[this.settings.data.colindex[h] - 1], {
                            fill: fontColor,
                            fontSize: `${this.settings.col_text_size  }px`,
                            transform: `rotate(-90, ${  ctextx  }, ${  ctexty  })`,
                            'data-type': 'label',
                            'data-row': String(h),
                            'data-dir': '1',
                            cursor: 'pointer'
                        });
                    }

                    // calculate box margins
                    x = h * boxwidth + this.settings.tree_width;
                    width = boxwidth;
                    y = i * boxheight + this.settings.tree_height + this.settings.legend_height;
                    height = boxheight;

                    // calculate box color
                    let color = 'black';
                    const adjusted_value =
                        this.settings.data.data[this.settings.data.rowindex[i] - 1][
                            this.settings.data.colindex[h] - 1
                        ] *
                            2 -
                        1;
                    const cval = parseInt(255 * Math.abs(adjusted_value), 10);
                    if (adjusted_value < 0) {
                        color = `rgb(${  cval  },0,0)`;
                    } else {
                        color = `rgb(0,${  cval  },0)`;
                    }
                    settings.fill = color;

                    settings['data-type'] = 'cell';
                    settings['data-row'] = String(i);
                    settings['data-col'] = String(h);
                    settings['data-value'] = String(adjusted_value);

                    // draw the box
                    this.settings.cells[i][h] = svg.rect(null, x, y, width, height, rx, ry, settings);
                }
            }
        },
        drawDendogram(svg, rotation) {
            const height = rotation ? this.settings.tree_width : this.settings.tree_height;
            const data = rotation ? this.settings.data.rowcluster : this.settings.data.colcluster;
            const cell_w = rotation ? this.settings.boxheight : this.settings.boxwidth;
            let xshift = rotation ? this.settings.tree_height : this.settings.tree_width;
            let yshift = this.settings.legend_height + this.settings.tree_height;
            const interval = parseInt(height / data.depth, 10);
            let path = '';
            if (rotation) {
                xshift++;
                for (let i = 0; i < data.depth; i++) {
                    let curr_shift = 0 + yshift;
                    for (let h = 0; h < data[i].length; h++) {
                        const cluster = data[i][h];
                        path +=
                            `M${
                                xshift
                            },${
                                parseInt(curr_shift + (cell_w * cluster.a) / 2)
                            }l-${
                                parseInt(interval)
                            },0`;
                        if ('b' in cluster) {
                            path +=
                                `l0,${
                                    parseInt(cell_w * (cluster.a / 2) + cell_w * (cluster.b / 2), 10)
                                }l${
                                    parseInt(interval, 10)
                                },0`;
                        }
                        curr_shift += cluster.b ? (cluster.a + cluster.b) * cell_w : cluster.a * cell_w;
                    }
                    xshift -= interval;
                }
            } else {
                for (let i = 0; i < data.depth; i++) {
                    let curr_shift = 0 + xshift;
                    for (let h = 0; h < data[i].length; h++) {
                        const cluster = data[i][h];
                        path +=
                            `M${
                                parseInt(curr_shift + (cell_w * cluster.a) / 2, 10)
                            },${
                                yshift
                            }l0,-${
                                parseInt(interval, 10)}`;
                        if ('b' in cluster) {
                            path +=
                                `l${
                                    parseInt(cell_w * (cluster.a / 2) + cell_w * (cluster.b / 2), 10)
                                },0l0,${
                                    parseInt(interval, 10)}`;
                        }
                        curr_shift += cluster.b ? (cluster.a + cluster.b) * cell_w : cluster.a * cell_w;
                    }
                    yshift -= interval;
                }
            }
            svg.path(null, path, {fill: 'none', stroke: 'black'});
        },
        toggleSelected(row, dir) {
            if (dir) {
                if (typeof this.settings.colClicked === 'function') {
                    this.settings.colClicked({
                        col: row,
                        label: this.settings.data.cols[this.settings.data.colindex[row] - 1]
                    });
                } else if (this.settings.selectedColumns[row]) {
                    this.settings.selectedColumns[row] = 0;
                } else {
                    this.settings.selectedColumns[row] = 1;
                }
            } else if (typeof this.settings.rowClicked === 'function') {
                this.settings.rowClicked({
                    row,
                    label: this.settings.data.rows[this.settings.data.rowindex[row] - 1]
                });
            } else if (this.settings.selectedRows[row]) {
                this.settings.selectedRows[row] = 0;
            } else {
                this.settings.selectedRows[row] = 1;
            }

            this.render();
        },

        cellClick(row, col, value, cell) {
            if (typeof this.settings.cellClicked === 'function') {
                this.settings.cellClicked({
                    row,
                    col,
                    value,
                    cell
                });
            }
        },
        cellHover(over, row, col, value, cell) {
            if (typeof this.settings.cellHovered === 'function') {
                this.settings.cellHovered({
                    over,
                    row,
                    col,
                    value,
                    cell
                });
            }
        },
        /* TODO: this will not work because x is undefined -- doesnt seem to be called so commenting out.*/
        /*
            normalize: function (data, min, max) {
                var normdata = [];
                min = min ? min : 0;
                max = max ? max : 1;
                for (var i = 0; i < data.length; i++) {
                    var dmin = data[i][0];
                    var dmax = data[i][0];
                    for (var h = 0; h < data[i].length; h++) {
                        if (data[i][h] < dmin) {
                            dmin = data[i][h];
                        }
                        if (data[i][h] > dmax) {
                            dmax = data[i][h];
                        }
                    }
                    normdata[i] = [];
                    for (var h = 0; h < data[i][h].length; h++) {
                        normdata[i][h] = min + (x - dmin) * (dmax - min) / (dmax - dmin);
                    }
                }

                return normdata;
            },
            */
        clustsort(a, b) {
            return a.amin - b.amin;
        },
        distance(data) {
            const distances = {};
            for (let i = 0; i < data.length; i++) {
                distances[i] = {};
            }
            for (let i = 0; i < data.length; i++) {
                for (let h = 0; h < data.length; h++) {
                    if (i >= h) {
                        continue;
                    }
                    let dist = 0;
                    for (let j = 0; j < data[i].data[0].length; j++) {
                        dist += Math.pow(data[i].data[0][j] - data[h].data[0][j], 2);
                    }
                    distances[i][h] = Math.pow(dist, 0.5);
                }
            }
            return distances;
        },
        transpose(data) {
            const result = [];
            for (let i = 0; i < data.length; i++) {
                for (let h = 0; h < data[i].length; h++) {
                    if (i === 0) {
                        result.push([]);
                    }
                    result[h][i] = data[i][h];
                }
            }
            return result;
        },
        cluster(data) {
            let num_avail = data.length;
            const avail = {};
            const clusters = [];
            for (let i = 0; i < data.length; i++) {
                clusters.push({points: [i], data: [data[i]], basepoints: [i], level: [0]});
                avail[i] = true;
            }

            // get the initial distances between all nodes
            const distances = this.distance(clusters);

            // calculate clusters
            let min;
            let coords;
            while (num_avail > 1) {
                let found = false;
                for (const i in distances) {
                    if (i in distances) {
                        for (const h in distances[i]) {
                            if (h in distances[i] && avail[i] && avail[h]) {
                                min = distances[i][h];
                                coords = [i, h];
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                            break;
                        }
                    }
                }
                for (const i in distances) {
                    if (i in distances) {
                        for (const h in distances[i]) {
                            if (h in distances[i]) {
                                if (avail[i] && avail[h] && distances[i][h] < min) {
                                    coords = [i, h];
                                    min = distances[i][h];
                                }
                            }
                        }
                    }
                }
                avail[coords[0]] = false;
                avail[coords[1]] = false;
                num_avail--;
                avail[clusters.length] = true;

                let sumpa = 0;
                let sumpb = 0;
                for (let h = 0; h < 2; h++) {
                    for (let i = 0; i < clusters[coords[h]].data.length; i++) {
                        if (h === 0) {
                            sumpa += clusters[coords[h]].data[i];
                        } else {
                            sumpb += clusters[coords[h]].data[i];
                        }
                    }
                }
                const pdata = [];
                const bpoints = [];
                for (let h = 0; h < 2; h++) {
                    let j = h;
                    if (sumpa > sumpb) {
                        if (h === 0) {
                            j = 1;
                        } else {
                            j = 0;
                        }
                    }
                    for (let i = 0; i < clusters[coords[j]].data.length; i++) {
                        pdata.push(clusters[coords[j]].data[i]);
                    }
                    for (let i = 0; i < clusters[coords[j]].basepoints.length; i++) {
                        bpoints.push(clusters[coords[j]].basepoints[i]);
                    }
                }
                let coord_a = coords[0];
                let coord_b = coords[1];
                if (sumpa > sumpb) {
                    const triangle = coord_a;
                    coord_a = coord_b;
                    coord_b = triangle;
                }
                coord_a = parseInt(coord_a, 10);
                coord_b = parseInt(coord_b, 10);

                clusters.push({
                    points: [coord_a, coord_b],
                    data: pdata,
                    basepoints: bpoints,
                    level: [
                        Math.max.apply(null, clusters[coord_a].level) + 1,
                        Math.max.apply(null, clusters[coord_b].level) + 1
                    ]
                });

                const row_a = [];
                for (let h = 0; h < 2; h++) {
                    for (let i = 0; i < clusters[coords[h]].data.length; i++) {
                        for (let j = 0; j < clusters[coords[h]].data[i].length; j++) {
                            if (h === 0 && i === 0) {
                                row_a[j] = 0;
                            }
                            row_a[j] += clusters[coords[h]].data[i][j];
                        }
                    }
                }
                for (let i = 0; i < row_a.length; i++) {
                    row_a[i] = row_a[i] / (clusters[coord_a].data.length + clusters[coord_b].data.length);
                }
                const index = clusters.length - 1;
                distances[index] = {};
                for (let h = 0; h < index; h++) {
                    const row_b = [];
                    for (let i = 0; i < clusters[h].data.length; i++) {
                        for (let j = 0; j < clusters[h].data[i].length; j++) {
                            if (i === 0) {
                                row_b[j] = 0;
                            }
                            row_b[j] += clusters[h].data[i][j];
                        }
                    }
                    for (let i = 0; i < row_b.length; i++) {
                        row_b[i] = row_b[i] / clusters[h].data.length;
                    }
                    let dist = 0;
                    for (let i = 0; i < row_a.length; i++) {
                        dist += Math.pow(row_a[i] - row_b[i], 2);
                    }
                    distances[h][index] = Math.pow(dist, 0.5);
                }
            }

            // record the row order after clustering
            const rowindex = [];
            const cind = clusters.length - 1;
            for (let i = 0; i < clusters[cind].basepoints.length; i++) {
                rowindex.push(clusters[cind].basepoints[i] + 1);
            }

            // record the reverse row order for lookup
            const roworder = {};
            for (let i = 0; i < rowindex.length; i++) {
                roworder[rowindex[i]] = i;
            }

            // get the depth
            let depth = 0;
            for (var i = 0; i < clusters.length; i++) {
                if (clusters[i].level[0] && clusters[i].level[0] > depth) {
                    depth = clusters[i].level[0];
                }
                if (clusters[i].level[1] && clusters[i].level[1] > depth) {
                    depth = clusters[i].level[1];
                }
            }

            // format the cluster data for visualization
            const clusterdata = {depth};
            for (let i = 0; i < clusterdata.depth; i++) {
                clusterdata[i] = [];
            }
            for (let i = data.length; i < clusters.length; i++) {
                // get the level this cluster is at
                const level = Math.max.apply(null, clusters[i].level) - 1;

                clusterdata[level].push({
                    a: clusters[clusters[i].points[0]].data.length,
                    b: clusters[clusters[i].points[1]].data.length,
                    amin: roworder[Math.min.apply(null, clusters[clusters[i].points[0]].basepoints) + 1]
                });

                // draw single lines until we reach the next root
                if (clusters[i].level[0] !== clusters[i].level[1]) {
                    let n = 0;
                    if (clusters[i].level[1] < clusters[i].level[0]) {
                        n = 1;
                    }
                    for (let h = 0; h < Math.abs(clusters[i].level[0] - clusters[i].level[1]); h++) {
                        clusterdata[level - (h + 1)].push({
                            a: clusters[clusters[i].points[n]].data.length,
                            amin: roworder[Math.min.apply(null, clusters[clusters[i].points[n]].basepoints) + 1]
                        });
                    }
                }
            }

            // sort the clusterdata
            for (const i in clusterdata) {
                if (i in clusterdata && !isNaN(i)) {
                    clusterdata[i].sort(this.clustsort);
                }
            }

            //if (data.length < 20) {
            //    window.clustersx = clusters;
            //    window.clusterdatax = clusterdata;
            //}

            return [clusterdata, rowindex];
        }
    };
    return standaloneHeatmap;
});
