/*

 Simplified prompt for delete confirmations.

 var $deleteModal = $('<div></div>').kbaseDeletePrompt(
 {
 name : tab,
 callback :
 function(e, $prompt) {
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
 ,
 }
 );

 $deleteModal.openPrompt();

 Sure, you could just set it up through kbasePrompt. But why bother?
 */

define([
    'jquery',
    './widget',
    'lib/domUtils',

    // For effect
    './prompt'
], (
    $,
    {domSafeText}
) => {
    $.KBWidget({
        name: 'kbaseDeletePrompt',
        parent: 'kbasePrompt',
        version: '1.0.0',
        options: {
            controls: ['cancelButton', 'okayButton']
        },
        init(options) {
            this._super(options);

            return $('<div>').kbasePrompt({
                title: 'Confirm deletion',
                body: `Really delete <strong>${domSafeText(this.options.name)}</strong>?`,
                controls: [
                    'cancelButton',
                    {
                        name: 'Delete',
                        type: 'primary',
                        callback: this.options.callback
                    }
                ]
            });
        }
    });
});
