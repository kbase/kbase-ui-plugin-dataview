define([
    'jquery',
    'd3',
    'bluebird',
    'kb_service/client/workspace',
    'lib/domUtils',

    // for effect
    '../kbaseBarchart',
    '../../legacy/authenticatedWidget',
    'bootstrap'
], (
    $,
    d3,
    Promise,
    Workspace,
    {errorMessage, domSafeText}
) => {
    $.KBWidget({
        name: 'kbasePMIBarchart',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        options: {
            subsystem_annotation_object: 'PlantSEED_Subsystems',
            subsystem_annotation_workspace: 'PlantSEED',
            selected_subsystems: ['Central Carbon: Glycolysis_and_Gluconeogenesis_in_plants']
        },
        _accessors: [{name: 'dataset', setter: 'setDataset'}],
        setDataset: function setDataset(newDataset) {
            const $pmi = this;

            if (this.data('loader')) {
                this.data('loader').hide();
                this.data('barchartElem').show();
                this.data('formElem').show();
            }

            const colorScale = d3.scale.category20();
            const groups = {};

            if (this.data('selectbox')) {
                this.data('selectbox').empty();

                const keys = Object.keys(newDataset.subsystems).sort();

                for (let f = 0; f < keys.length; f++) {
                    const func = keys[f];

                    const name = func.replace(/_/g, ' ');
                    const group = name.replace(/:.+/, '');
                    const sub_name = name.replace(/.+:\s*/, '');

                    // xss safe
                    this.data('selectbox').append(
                        $.jqElem('option')
                            .attr('value', func)
                            .prop('selected', f === 0)
                            .css('background-color', colorScale(f))
                            .text(name)
                    );

                    for (let bar = 0; bar < newDataset.subsystems[func].length; bar++) {
                        newDataset.subsystems[func][bar].color = colorScale(f);
                    }

                    if (!groups[group]) {
                        const $groupButton = $.jqElem('div')
                            .addClass('btn-group dropup')
                            .css({'padding-right': '5px'})
                            // xss safe
                            .append(
                                $.jqElem('button')
                                    .attr('type', 'button')
                                    .addClass('btn btn-sm btn-default')
                                    // xss safe
                                    .append(
                                        $.jqElem('span')
                                            .css('display', 'none')
                                            .addClass('check fa fa-check')
                                            // xss safe
                                            .append('&nbsp;')
                                    )
                                    .append(domSafeText(group))
                                    .on('click', function () {
                                        /*var isOpen = $(this).parent().hasClass('open');
                                     $pmi.data('formElem').find('.btn-group').removeClass('open');
                                     if (! isOpen) {
                                     $(this).parent().addClass('open');
                                     }*/

                                        if (
                                            $(this)
                                                .parent()
                                                .hasClass('open')
                                        ) {
                                            $(this)
                                                .parent()
                                                .removeClass('open');
                                            const $span = $(this)
                                                .next()
                                                .find('span');
                                            $span.toggleClass('fa-plus fa-caret-up');
                                        }

                                        const $check = $(this)
                                            .parent()
                                            .find('.check');
                                        const shouldOpen = !$check.data('checked');

                                        $.each(
                                            $(this)
                                                .parent()
                                                .find('.subsystem-checkbox'),
                                            (i, c) => {
                                                if (shouldOpen && !c.checked) {
                                                    $(c).prop('checked', true);
                                                } else if (!shouldOpen && c.checked) {
                                                    $(c).prop('checked', false);
                                                }
                                            }
                                        );

                                        if (shouldOpen) {
                                            $check.show();
                                            $check.data(
                                                'checked',
                                                $(this)
                                                    .parent()
                                                    .find('.subsystem-checkbox').length
                                            );
                                            $check.addClass('fa-check-square-o');
                                            $check.removeClass('fa-check');
                                        } else {
                                            $check.hide();
                                            $check.data('checked', 0);
                                            $check.removeClass('fa-check-square-o');
                                            $check.addClass('fa-check');
                                        }

                                        const selected_subsystems = [];
                                        $.each($pmi.$elem.find('.subsystem-checkbox'), (i, c) => {
                                            if (c.checked) {
                                                selected_subsystems.push($(c).val());
                                            }
                                        });

                                        $pmi.displaySubsystems(selected_subsystems);
                                    })
                            )
                            // xss safe
                            .append(
                                $.jqElem('button')
                                    .attr('type', 'button')
                                    .addClass('btn btn-sm btn-default dropdown-toggle')
                                    // xss safe
                                    .append($.jqElem('span').addClass('fa fa-caret-up'))
                                    .on('click', function () {
                                        const isOpen = $(this)
                                            .parent()
                                            .hasClass('open');
                                        $pmi.data('formElem')
                                            .find('.btn-group')
                                            .removeClass('open');
                                        if (!isOpen) {
                                            $(this)
                                                .parent()
                                                .addClass('open');
                                        }

                                        $(this)
                                            .find('span')
                                            .toggleClass('fa-caret-up');
                                        $(this)
                                            .find('span')
                                            .toggleClass('fa-plus');

                                        const $check = $pmi.data('formElem').find('.check');
                                        if (this.checked) {
                                            $check.data('checked', ($check.data('checked') || 0) + 1);
                                            if (
                                                $check.data('checked') ===
                                                $(this)
                                                    .closest('.btn-group')
                                                    .find('.subsystem-checkbox').length
                                            ) {
                                                $check.addClass('fa-check-square-o');
                                                $check.removeClass('fa-check');
                                            } else {
                                                $check.removeClass('fa-check-square-o');
                                                $check.addClass('fa-check');
                                            }
                                            $check.show();
                                        } else {
                                            $check.data('checked', $check.data('checked') - 1);
                                            $check.removeClass('fa-check-square-o');
                                            $check.addClass('fa-check');
                                            if ($check.data('checked') === 0) {
                                                $check.hide();
                                            }
                                        }

                                        const selected_subsystems = [];
                                        $.each($pmi.$elem.find('.subsystem-checkbox'), (i, c) => {
                                            if (c.checked) {
                                                selected_subsystems.push($(c).val());
                                            }
                                        });

                                        $pmi.displaySubsystems(selected_subsystems);
                                    })
                            )
                            // xss safe
                            .append(
                                $.jqElem('ul')
                                    .addClass('dropdown-menu')
                                    .css({width: '450px', 'padding-left': '5px', 'text-align': 'left'})
                            );
                        // xss safe
                        this.data('formElem').append($groupButton);

                        groups[group] = $groupButton;
                    }

                    // xss safe
                    groups[group].find('ul').append(
                        // xss safe
                        $.jqElem('li').append(
                            $.jqElem('label')
                                // xss safe
                                .append(
                                    $.jqElem('input')
                                        .attr('type', 'checkbox')
                                        .attr('value', func)
                                        .addClass('subsystem-checkbox')
                                        .on('change', () => {
                                            return;
                                            // var $check = $(this).closest('.btn-group').find('.check');
                                            // if (this.checked) {
                                            //     $check.data('checked', ($check.data('checked') || 0) + 1);
                                            //     if ($check.data('checked') === $(this).closest('.btn-group').find('.subsystem-checkbox').length) {
                                            //         $check.addClass('fa-check-square-o');
                                            //         $check.removeClass('fa-check');
                                            //     } else {
                                            //         $check.removeClass('fa-check-square-o');
                                            //         $check.addClass('fa-check');
                                            //     }
                                            //     $check.show();
                                            // } else {
                                            //     $check.data('checked', $check.data('checked') - 1);
                                            //     $check.removeClass('fa-check-square-o');
                                            //     $check.addClass('fa-check');
                                            //     if ($check.data('checked') === 0) {
                                            //         $check.hide();
                                            //     }
                                            // }

                                            // var selected_subsystems = [];
                                            // $.each(
                                            //     $pmi.$elem.find('.subsystem-checkbox'),
                                            //     function (i, c) {
                                            //         if (c.checked) {
                                            //             selected_subsystems.push($(c).val());
                                            //         }
                                            //     }
                                            // );

                                            //$pmi.displaySubsystems(selected_subsystems);
                                        })
                                )
                                // xss safe
                                .append(
                                    $.jqElem('span')
                                        .css('color', colorScale(f))
                                        // xss safe
                                        .append(`&nbsp;&nbsp;${domSafeText(sub_name)}`)
                                )
                        )
                    );
                }
            }

            this.setValueForKey('dataset', newDataset);

            if (this.data('barchart') && this.options.selected_subsystems) {
                this.displaySubsystems(this.options.selected_subsystems);
            }
        },
        setBarchartDataset: function setBarchartDataset(newDataset, legend) {
            this.data('barchart').setDataset(newDataset);

            this.data('barchart').options.xAxisTransform = this.data('barchart').yScale()(0);
            this.data('barchart').renderXAxis();
            this.data('barchart').setLegend(legend);
        },
        parseWorkspaceData: function parseWorkspaceData(d1, d2) {
            const $pmi = this;
            const sub_anno = d1[0].data;
            const fba_obj = d2[0].data;

            /* //for easy testing
             $.when(
             $.ajax('./sub_anno.json'),
             $.ajax('./fba_obj.json')
             ).then(function(r1, r2) {
             var sub_anno = r1[0];//JSON.parse(r1[0]);
             var fba_obj = r2[0];//JSON.parse(r2[0]);*/

            const subsystem_fluxes = {};

            const all_subsystems = Object.keys(sub_anno.subsystems);

            $.each(all_subsystems, (i, subsystem) => {
                if (subsystem_fluxes[subsystem] === undefined) {
                    subsystem_fluxes[subsystem] = {};
                }

                const my_fluxes = subsystem_fluxes[subsystem];

                $.each(sub_anno.subsystems[subsystem], (i, val) => {
                    const ss_rxn = val[0];
                    const rxn_dict = val[1];

                    $.each(fba_obj.FBAReactionVariables, (i, fba_rxn) => {
                        let model_rxn = fba_rxn.modelreaction_ref;
                        const tmp = model_rxn.split(/\//);
                        model_rxn = tmp[tmp.length - 1];

                        let biochem_rxn = model_rxn;
                        biochem_rxn = biochem_rxn.replace(/_\w\d+$/, '');

                        if (biochem_rxn === ss_rxn) {
                            if (my_fluxes[model_rxn] === undefined) {
                                my_fluxes[model_rxn] = {};
                            }

                            my_fluxes[model_rxn]['flux'] = fba_rxn.value;

                            let tooltip = rxn_dict.tooltip;

                            tooltip = tooltip.replace(/\n/g, '<br>');
                            //tooltip = tooltip.replace(/:(.+?)<br>/g, ": <i>$1</i><br>");
                            tooltip = tooltip.replace(/^(.+?):/g, '<b>$1:</b>');
                            tooltip = tooltip.replace(/<br>(.+?):/g, '<br><b>$1:</b>');
                            //tooltip = tooltip.replace(/Equation:(.+?)<br>/, "<div style = 'text-align : right'>$1</div>");
                            my_fluxes[model_rxn].tooltip = tooltip;
                            //'<span style = "white-space : nowrap">' + tooltip + '</span>';
                        }
                    });
                });
            });

            const dataset = {subsystems: {}};

            $.each(subsystem_fluxes, (subsystem, data) => {
                const sortedKeys = Object.keys(data).sort();

                $.each(sortedKeys, (i, k) => {
                    const v = data[k];

                    if (dataset.subsystems[subsystem] === undefined) {
                        dataset.subsystems[subsystem] = [];
                    }

                    dataset.subsystems[subsystem].push({
                        bar: k,
                        value: v.flux,
                        tooltip: v.tooltip,
                        id: k
                    });
                });
            });

            $pmi.setDataset(dataset);
        },
        init: function init(options) {
            this.$elem.parent().rmLoading();

            this._super(options);

            const $pmi = this;

            const workspaceClient = new Workspace(this.runtime.config('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });

            const subanno_params = {
                workspace: this.options.subsystem_annotation_workspace,
                name: this.options.subsystem_annotation_object
            };

            const fbaobj_params = {
                workspace: this.options.fba_workspace,
                name: this.options.fba_object
            };

            Promise.all([workspaceClient.get_objects([subanno_params]), workspaceClient.get_objects([fbaobj_params])])
                .spread((d1, d2) => {
                    const interval = setInterval(() => {
                        if ($pmi.data('loader').is(':visible')) {
                            clearInterval(interval);
                            $pmi.parseWorkspaceData(d1, d2);
                        }
                    }, 2000);
                    return null;
                })
                .catch((err) => {
                    $pmi.$elem.empty();
                    // xss safe
                    $pmi.$elem.addClass('alert alert-danger').text(`Could not load object : ${errorMessage(err)}`);
                });

            this.appendUI(this.$elem);

            return this;
        },
        displaySubsystems: function displaySubsystems(subsystems) {
            const lastSubsystems = this.lastSubsystems;

            if (lastSubsystems !== undefined) {
                const newKeys = {};
                $.each(subsystems, (i, v) => {
                    newKeys[v] = 1;
                });

                const oldKeys = {};
                $.each(lastSubsystems, (i, v) => {
                    oldKeys[v] = 1;
                });

                const newSubsystems = [];
                $.each(lastSubsystems, (i, v) => {
                    if (newKeys[v]) {
                        newSubsystems.push(v);
                    }
                });

                $.each(subsystems, (i, v) => {
                    if (!oldKeys[v]) {
                        newSubsystems.push(v);
                    }
                });

                subsystems = newSubsystems;
            }

            this.lastSubsystems = subsystems;

            const $pmi = this;
            const merged = {};
            const legend = {};
            $.each(subsystems, (i, subsystem) => {
                const $check = $pmi.$elem.find(`[value='${  subsystem  }']`);
                $check.prop('checked', true);
                $check
                    .closest('.btn-group')
                    .find('.check')
                    .show();
                $check
                    .closest('.btn-group')
                    .find('.check')
                    .data('checked', subsystems.length);

                $.each($pmi.dataset().subsystems[subsystem], (i, bar) => {
                    if (legend[subsystem] === undefined) {
                        legend[subsystem] = bar.color;
                    }

                    if (merged[bar.bar] === undefined) {
                        merged[bar.bar] = {
                            bar: bar.bar,
                            value: [bar.value],
                            color: [bar.color],
                            tooltip: [bar.tooltip],
                            id: bar.bar
                        };
                    } else {
                        merged[bar.bar].value.push(bar.value);
                        merged[bar.bar].color.push(bar.color);
                        merged[bar.bar].tooltip.push(bar.tooltip);
                    }
                });
            });

            const sortedKeys = Object.keys(merged).sort();
            const bars = [];
            $.each(sortedKeys, (i, bar) => {
                bars.push(merged[bar]);
            });

            const sortedLegendKeys = Object.keys(legend).sort();
            const sortedLegend = [];
            $.each(sortedLegendKeys, (i, key) => {
                sortedLegend.push({
                    label: key,
                    color: legend[key],
                    shape: 'square'
                });
            });

            //$pmi.setBarchartDataset($pmi.dataset().subsystems[$(this).val()[0]]);
            $pmi.setBarchartDataset(bars, sortedLegend);
        },
        appendUI: function appendUI($elem) {
            const $pmi = this;

            const $container = $.jqElem('div')
                // xss safe
                .append(
                    $.jqElem('div')
                        .css('display', 'none')
                        .attr('id', 'old-formElem')
                        // xss safe
                        .append(
                            $.jqElem('span')
                            // xss safe
                                .append('Select subsystem(s):&nbsp;&nbsp;')
                                .css('float', 'left')
                        )
                        // xss safe
                        .append(
                            // xss safe
                            $.jqElem('form').append(
                                $.jqElem('select')
                                    .attr('id', 'selectbox')
                                    .prop('multiple', true)
                                    .css('border', '1px solid black')
                                    .on('change', function () {
                                        //alert('changed! ' + this.value);
                                        //$pmi.setBarchartDataset($pmi.dataset().subsystems[this.value]);
                                        $pmi.displaySubsystems($(this).val());
                                    })
                            )
                        )
                )
                // xss safe
                .append(
                    $.jqElem('div')
                        .attr('id', 'barchartElem')
                        .css('display', 'none')
                        .css('width', 1100) //$elem.width())
                        .css('height', 500) //$elem.height() - 30)
                )
                // xss safe
                .append(
                    $.jqElem('div')
                        .attr('id', 'formElem')
                        .css({width: '100%', 'text-align': 'center'})
                )
                // xss safe
                .append(
                    $.jqElem('div')
                        .attr('id', 'loader')
                        // xss safe
                        .append(
                            '<br>&nbsp;Loading data...<br>&nbsp;please wait...<br>&nbsp;Data parsing may take upwards of 30 seconds, during which time this window may be unresponsive.'
                        )
                        // xss safe
                        .append($.jqElem('br'))
                        // xss safe
                        .append(
                            $.jqElem('div')
                                .attr('align', 'center')
                                // xss safe
                                .append(
                                    $.jqElem('i')
                                        .addClass('fa fa-spinner')
                                        .addClass('fa fa-spin fa fa-4x')
                                )
                        )
                );

            this._rewireIds($container, this);

            this.data(
                'barchart',
                this.data('barchartElem').kbaseBarchart({
                    scaleAxes: true,
                    yLabelRegion: 'xPadding',
                    xGutter: 300,
                    xAxisRegion: 'chart',
                    xAxisVerticalLabels: true,
                    yLabel: 'Reaction Flux',
                    hGrid: true,
                    useUniqueID: true,
                    legendRegion: 'xGutter'
                })
            );

            const $barchart = this.data('barchart');
            $barchart.superYDomain = $barchart.defaultYDomain;
            $barchart.defaultYDomain = function () {
                const domain = $barchart.superYDomain();
                const max = Math.max(Math.abs(domain[0]), Math.abs(domain[1]));
                return [-max, max];
            };

            $barchart.superRenderChart = $barchart.renderChart;
            $barchart.renderChart = function () {
                $barchart.superRenderChart();
                this.D3svg()
                    .selectAll('.xAxis .tick text')
                    .data(this.dataset() || [])
                    .on('mouseover', (L, i) => {
                        $barchart.showToolTip({
                            label: $barchart.dataset()[i].tooltip[0]
                        });
                    })
                    .on('mouseout', () => {
                        $barchart.hideToolTip();
                    });
            };

            $barchart.superToolTip = $barchart.showToolTip;
            $barchart.showToolTip = function (args) {
                args.maxWidth = 1500;
                $barchart.superToolTip(args);
            };

            this.data('barchart').initialized = false;
            if (this.dataset()) {
                this.setDataset(this.dataset());
            }

            // xss safe
            $elem.append($container);
        }
    });
});
