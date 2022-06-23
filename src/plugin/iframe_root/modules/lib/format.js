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

    const donorNode = document.createElement('div');
    function domSafeText(rawContent) {
        donorNode.innerText = rawContent;
        // xss safe
        return donorNode.innerHTML;
    }

    function pluralize(count, singular, plural) {
        return count === 1 ? singular : plural || `${singular}s`;
    }

    return Object.freeze({formattedDate, formattedInteger, timestamp, date, domSafeText, pluralize});
});