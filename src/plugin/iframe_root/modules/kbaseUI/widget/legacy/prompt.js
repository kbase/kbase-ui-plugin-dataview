/*

 Generic prompting widget. Documented via example!

 var tab = 'Some Tab Value';

 var $deleteModal = $('<div></div>').kbasePrompt(
 {
 title : 'Confirm deletion',
 body : 'Really delete <strong>' + tab + '</strong>?',
 modalClass : 'fade', //Not required. jquery animation class to show/hide. Defaults to 'fade'
 controls : [
 'cancelButton',
 {
 name : 'Delete',
 type : 'primary',
 callback : function(e, $prompt) {
 $prompt.closePrompt();
 if ($nav.hasClass('active')) {
 if ($nav.next('li').length) {
 $nav.next().find('a').trigger('click');
 }
 else {
 $nav.prev('li').find('a').trigger('click');
 }
 }
 $tab.remove();
 $nav.remove();
 }
 }
 ],
 footer : 'Some footer value here',
 }
 );

 $deleteModal.openPrompt();

 It takes 4 values - title, body, and footer are jQuery objects containing HTML elements. They will
 be placed as the title, body, and footer of the prompt, respectively. The footer is left justified.

 controls is a little more involved, it governs the buttons used from left->right. Each element is either a string,
 in which case it is a method call on the prompt object, or it's an object with a few keys:
 name : the name to present on the button. It's appended, so you can use an icon!
 type : specify a bootstrap button type (primary, info, success, warning, danger, inverse, link)
 callback: a function callback which is invoked when the button is clicked. The default is prevented.
 arguments received are the original event object and the associated prompt object. 'this' is the button.
 Note that the callback is expected to close the modal itself.
 id : an id to tack onto the button, which will be rewired out of existance and hang on the prompt's data().
 Default controls are cancelButton and okayButton, which do nothing other than close the prompt w/o action.

 useful additional methods would be openPrompt() and closePrompt();

 */

define(['jquery', './widget'], ($) => {
    $.KBWidget({
        name: 'kbasePrompt',
        version: '1.0.0',
        options: {
            controls: ['cancelButton', 'okayButton'],
            modalClass: 'fade',
            keyboard: true
        },
        init(options) {
            this._super(options);

            return this;
        },
        openPrompt() {
            this.dialogModal().modal({keyboard: this.options.keyboard});
        },
        closePrompt() {
            this.dialogModal().modal('hide');
        },
        cancelButton() {
            return {
                name: 'Cancel',
                callback(e, $prompt) {
                    $prompt.closePrompt();
                }
            };
        },
        okayButton() {
            return {
                name: 'Okay',
                type: 'primary',
                callback(e, $prompt) {
                    $prompt.closePrompt();
                }
            };
        },
        dialogModal() {
            if (this.data('dialogModal') !== undefined) {
                return this.data('dialogModal');
            }

            const $dialogModal = $('<div></div>')
                .attr('class', `modal ${  this.options.modalClass}`)
                .attr('tabindex', '-1')
                // xss safe
                .append(
                    $.jqElem('div')
                        .addClass('modal-dialog')
                        // xss safe
                        .append(
                            $.jqElem('div')
                                .addClass('modal-content')
                                // xss safe
                                .append(
                                    $('<div></div>')
                                        .attr('class', 'modal-header')
                                        // xss safe
                                        .append(
                                            $('<button></button>')
                                                .attr('type', 'button')
                                                .attr('class', 'close')
                                                .attr('data-dismiss', 'modal')
                                                .attr('aria-hidden', 'true')
                                                // xss safe
                                                .append('x\n')
                                        )
                                        // xss safe
                                        .append(
                                            $('<h3></h3>')
                                                .addClass('modal-title')
                                                .attr('id', 'title')
                                        )
                                )
                                // xss safe
                                .append(
                                    $('<div></div>')
                                        .attr('class', 'modal-body')
                                        .attr('id', 'body')
                                )
                                // xss safe
                                .append(
                                    $('<div></div>')
                                        .attr('class', 'modal-footer')
                                        // xss safe
                                        .append(
                                            $('<div></div>')
                                                .addClass('row')
                                                .addClass('form-horizontal')
                                                // xss safe
                                                .append(
                                                    $('<div></div>')
                                                        .addClass('col-sm-5')
                                                        .addClass('text-left')
                                                        .attr('id', 'footer')
                                                )
                                                // xss safe
                                                .append(
                                                    $('<div></div>')
                                                        .addClass('col-sm-7')
                                                        .attr('id', 'controls')
                                                        .css('white-space', 'nowrap')
                                                )
                                        )
                                )
                        )
                );

            $dialogModal.unbind('keypress');
            $dialogModal.keypress((e) => {
                if (e.keyCode === 13) {
                    e.stopPropagation();
                    e.preventDefault();
                    $('a:last', $dialogModal).trigger('click');
                }
            });

            this._rewireIds($dialogModal, $dialogModal);

            if (this.options.title) {
                // xss safe (need to trust)
                $dialogModal.data('title').append(this.options.title);
            }

            if (this.options.body) {
                // xss safe (need to trust)
                $dialogModal.data('body').append(this.options.body);
            }

            if (this.options.footer) {
                // xss safe (need to trust)
                $dialogModal.data('footer').append(this.options.footer);
            }

            const $prompt = this;

            $.each(this.options.controls, (idx, val) => {
                if (typeof val === 'string') {
                    val = $prompt[val]();
                }
                let btnClass = 'btn btn-default';
                if (val.type) {
                    btnClass = `${btnClass  } btn-${  val.type}`;
                }

                const $button = $('<a></a>')
                    .attr('href', '#')
                    .attr('class', btnClass)
                    // xss safe (need to trust)
                    .append(val.name)
                    .bind('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        val.callback.call(this, e, $prompt);
                    });

                if (val.id) {
                    $button.attr('id', val.id);
                }

                // xss safe
                $dialogModal.data('controls').append($button);
            });

            this._rewireIds($dialogModal, $dialogModal);

            this.data('dialogModal', $dialogModal);

            let $firstField;
            let selection = false;

            $dialogModal.on(
                'shown.bs.modal',
                $.proxy(() => {
                    $.each($dialogModal.find('input[type=text],input[type=password],textarea'), (idx, val) => {
                        if ($firstField === undefined) {
                            $firstField = $(val);
                        }

                        if ($(val).is('input') && $(val).val() === undefined) {
                            $(val).focus();
                            selection = true;
                            return;
                        } else if ($(val).is('textarea') && $(val).text().length === 0) {
                            $(val).focus();
                            selection = true;
                            return;
                        }
                    });

                    if (!selection && $firstField !== undefined) {
                        $firstField.focus();
                    }
                }, this)
            );

            return $dialogModal;
        }
    });
});
