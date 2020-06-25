define([], () => {
    'use strict';

    function formattedDate(time) {
        return Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: 'numeric',
            hour12: true
        }).format(time);
    }

    function formattedInteger(value) {
        return Intl.NumberFormat('en-US', {
            useGrouping: true
        }).format(value);
    }

    return Object.freeze({ formattedDate, formattedInteger});
});