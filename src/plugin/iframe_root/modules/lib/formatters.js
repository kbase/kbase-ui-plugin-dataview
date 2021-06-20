define([], () => {
    function formattedDate(time) {
        return Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(time);
    }

    function timestamp(time) {
        return Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(time);
    }

    function date(time) {
        return Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(time);
    }

    function formattedInteger(value) {
        return Intl.NumberFormat('en-US', {
            useGrouping: true
        }).format(value);
    }

    return Object.freeze({formattedDate, formattedInteger, timestamp, date});
});