define([
    'jquery',
    'bootstrap',
    'css!font_awesome',

    // For effect
    './widget'
], (
    $
) => {
    $.KBWidget({
        name: 'kbaseSearchControls',
        version: '1.0.0',
        options: {
            controls: [],
            onMouseover: true,
            position: 'top',
            type: 'floating'
        },
        init(options) {
            this._super(options);

            this.appendUI($(this.$elem));

            return this;
        },
        appendUI($elem) {
            const $sc = this;

            const restoreMouseOver = this.options.onMouseover;

            if (this.options.type === 'floating') {
                $elem.css('position', 'relative');
            }
            const $filterbox = $.jqElem('div')
                .addClass('input-group input-group-sm')
                // xss safe
                .append(
                    $.jqElem('input')
                        .attr('type', 'text')
                        .addClass('form-control')
                        .attr('id', 'searchBox')
                        .on('keyup', function (e) {
                            if (e.keyCode === 27) {
                                $sc.value(undefined);
                            }

                            const value = $sc.value();

                            if (value.length) {
                                $sc.data('searchIcon').removeClass('fa-search');
                                $sc.data('searchIcon').addClass('fa-times');
                                $sc.options.onMouseover = false;
                            } else {
                                $sc.data('searchIcon').addClass('fa-search');
                                $sc.data('searchIcon').removeClass('fa-times');
                                if (restoreMouseOver) {
                                    $sc.options.onMouseover = true;
                                }
                            }

                            $sc.options.searchCallback.call(this, e, value, $sc.options.context);
                        })
                )
                // xss safe
                .append(
                    $.jqElem('span')
                        .addClass('input-group-btn')
                        // xss safe
                        .append(
                            $.jqElem('button')
                                .addClass('btn btn-default')
                                .attr('id', 'searchButton')
                                // xss safe
                                .append(
                                    $.jqElem('i')
                                        .attr('id', 'searchIcon')
                                        .addClass('fa fa-search')
                                )
                                .on('click', function (e) {
                                    if ($sc.data('searchIcon').hasClass('fa-times')) {
                                        $sc.value(undefined);
                                        $sc.data('searchBox').focus();
                                        if (restoreMouseOver) {
                                            $sc.options.onMouseover = true;
                                        }
                                    }

                                    $sc.options.searchCallback.call(this, e, $sc.value(), $sc.options.context);
                                })
                        )
                );

            if (this.options.type === 'floating') {
                $filterbox
                    .css('right', '0px')
                    .css('top', '0px')
                    .css('position', 'absolute')
                    .css('margin-right', '3px')
                    .attr('z-index', 10000);
            }

            this._rewireIds($filterbox, this);

            // xss safe
            $elem.append($filterbox);

            $elem.data('searchControls', $filterbox);

            $elem
                .on('mouseover.kbaseSearchControls', () => {
                    if ($sc.options.onMouseover) {
                        $filterbox.show();
                    }
                })
                .on('mouseout.kbaseSearchControls', () => {
                    if ($sc.options.onMouseover) {
                        $filterbox.hide();
                    }
                    $sc.data('searchBox').blur();
                });
            if (this.options.onMouseover) {
                $filterbox.hide();
            }

            return this;
        },
        value(newVal) {
            if (arguments.length) {
                this.data('searchBox').val(newVal);
            }
            return this.data('searchBox').val();
        }
    });
});
