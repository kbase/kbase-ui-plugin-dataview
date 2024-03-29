define(['jquery', 'd3', '../legacy/authenticatedWidget'], ($, d3) => {
    $.KBWidget({
        name: 'kbaseHistogram',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        options: {
            numBins: 50,
            minCutoff: 0.001,
            tickColor: 'blue',
            colors: ['#0000FF', '#000099']
        },
        getState() {
            return {
                numBins: this.options.numBins,
                minCutoff: this.options.minCutoff,
                maxCutoff: this.options.maxCutoff
            };
        },
        loadState(state) {
            this.options.numBins = parseInt(state.numBins, 10);
            this.options.minCutoff = parseFloat(state.minCutoff);
            this.options.maxCutoff = parseFloat(state.maxCutoff);

            if (isNaN(this.options.minCutoff)) {
                delete this.options.minCutoff;
            }

            if (isNaN(this.options.maxCutoff)) {
                delete this.options.maxCutoff;
            }

            this.data('minCutoff').val(this.options.minCutoff);
            this.data('maxCutoff').val(this.options.maxCutoff);
            this.data('numBins').text(this.options.numBins);
            this.data('numBinsRange').val(this.options.numBins);
        },
        _accessors: ['dataset'],
        setDataset(newDataset) {
            this.dataset(newDataset);
            this.renderHistogram(this.options.numBins);
        },
        renderXAxis() {
            this.data('barchart').renderXAxis();
        },
        init: function init(options) {
            this._super(options);

            this.appendUI(this.$elem);

            this.gradientID = this.data('barchart').linearGradient({colors: this.options.colors});

            return this;
        },
        appendUI: function appendUI($elem) {
            const $me = this;

            const $barElem = $.jqElem('div').css({width: 800, height: 500});

            const $barContainer = $.jqElem('div')
                // xss safe
                .append(
                    // xss safe
                    $.jqElem('div')
                        .attr('class', 'col-md-10')
                        // xss safe
                        .append(
                            $.jqElem('div')
                                .attr('class', 'col-md-1')
                                // xss safe
                                .append(
                                    $.jqElem('div')
                                        // xss safe
                                        .append(
                                            $.jqElem('span')
                                                .attr('id', 'numBins')
                                                .text($me.options.numBins)
                                        )
                                        .append(' bins')
                                )
                        )
                        // xss safe
                        .append(
                            $.jqElem('div')
                                .attr('class', 'col-md-8')
                                // xss safe
                                .append(
                                    $.jqElem('input')
                                        .attr('id', 'numBinsRange')
                                        .attr('type', 'range')
                                        .attr('min', 0)
                                        .attr('max', 100)
                                        .attr('value', $me.options.numBins)
                                        .attr('step', 1)
                                        .css('width', '800px')
                                        .on('input', function () {
                                            $me.data('numBins').text($(this).val());
                                        })
                                        .on('change', function () {
                                            $me.data('numBins').text($(this).val());
                                            $me.options.numBins = parseInt($(this).val());
                                            $me.renderHistogram();
                                        })
                                )
                        )
                )
                // xss safe
                .append(
                    $.jqElem('div')
                        .attr('class', 'col-md-4')
                        // xss safe
                        .append(
                            $.jqElem('div')
                                .attr('class', 'input-group')
                                // xss safe
                                .append(
                                    $.jqElem('div')
                                        .attr('class', 'input-group-addon')
                                        .append(' Expression level at least ')
                                )
                                // xss safe
                                .append(
                                    $.jqElem('input')
                                        .attr('type', 'input')
                                        .attr('id', 'minCutoff')
                                        .attr('class', 'form-control')
                                        .attr('value', $me.options.minCutoff)
                                        .on('change', function () {
                                            $me.options.minCutoff = parseFloat($(this).val());
                                            $me.renderHistogram();
                                        })
                                )
                        )
                )
                // xss safe
                .append(
                    // xss safe
                    $.jqElem('div')
                        .attr('class', 'col-md-4 col-md-offset-3')
                        // xss safe
                        .append(
                            $.jqElem('div')
                                .attr('class', 'input-group')
                                // xss safe
                                .append(
                                    $.jqElem('div')
                                        .attr('class', 'input-group-addon')
                                        .text(' Expression level at most ')
                                )
                                // xss safe
                                .append(
                                    $.jqElem('input')
                                        .attr('type', 'input')
                                        .attr('class', 'form-control')
                                        .attr('id', 'maxCutoff')
                                        .attr('value', $me.options.maxCutoff)
                                        .on('change', function () {
                                            $me.options.maxCutoff = parseFloat($(this).val());
                                            $me.renderHistogram();
                                        })
                                )
                        )
                )
                // xss safe
                .append($barElem);

            // xss safe
            $elem.append($barContainer);

            const $barchart = $barElem.kbaseBarchart(this.options);

            $barchart.superRenderXAxis = $barchart.renderXAxis;
            $barchart.renderXAxis = function () {
                $barchart.superRenderXAxis();

                $barchart
                    .D3svg()
                    .selectAll('.xAxis .tick text')
                    .attr('fill', this.options.tickColor)
                    .on('mouseover', (L) => {
                        $.each($barchart.dataset(), (i, d) => {
                            if (d.bar === L) {
                                $barchart.showToolTip({label: d.tooltip});
                            }
                        });
                    })
                    .on('mouseout', () => {
                        $barchart.hideToolTip();
                    });
            };

            this._rewireIds($elem, this);
            this.data('barElem', $barElem);
            this.data('barchart', $barchart);
        },
        renderHistogram: function renderHistogram(bins) {
            const $me = this;

            if (bins === undefined) {
                bins = this.options.numBins;
            }

            let filteredDataset = this.dataset();

            if (!isNaN(this.options.minCutoff) || !isNaN(this.options.maxCutoff)) {
                filteredDataset = [];

                $.each(this.dataset(), (i, v) => {
                    if (
                        (isNaN($me.options.minCutoff) || v >= $me.options.minCutoff) &&
                        (isNaN($me.options.maxCutoff) || v <= $me.options.maxCutoff)
                    ) {
                        filteredDataset.push(v);
                    }
                });
            }

            const barData = d3.layout.histogram().bins(bins)(filteredDataset);

            const bars = [];
            const sigDigits = 1000;
            $.each(barData, (i, bin) => {
                const range =
                    `${Math.round(bin.x * sigDigits) / sigDigits
                    } to ${
                        Math.round((bin.x + bin.dx) * sigDigits) / sigDigits}`;

                bars.push({
                    bar: range,
                    value: bin.y,
                    color: `url(#${  $me.gradientID  })`, //'blue',
                    //color : 'blue',
                    tooltip: `${bin.y  } in range<br>${  range}`,
                    id: bin.x
                });
            });

            this.data('barchart').setDataset(bars);
        }
    });
});
