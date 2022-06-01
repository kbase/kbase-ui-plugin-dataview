define([
    'jquery',
    './domUtils',

    // For effect
    'bootstrap'
], (
    $,
    {errorMessage}
) => {
    function $errorAlert(err, title) {
        const message = errorMessage(err);
        const errorTitle = title || 'Error';
        return $('<div>')
            .addClass('alert alert-danger')
            .append($('<p>').css('font-weight', 'bold').addClass('alert-heading').text(errorTitle))
            .append($('<p>').text(message));
    }

    function $loadingAlert(message = '') {
        return $('<div>').addClass('alert alert-info')
            .append($('<span>').text(message).css('margin-right', '0.5em'))
            .append($('<span>').addClass('fa fa-spinner fa-pulse fa-fw'));
    }

    function $none(message = 'none') {
        return $('<i>').text(message);
    }

    return {
        $errorAlert,
        $loadingAlert,
        $none
    };
});