define(['preact'], ({render}) => {
    function htmlToString(htmContent) {
        const element = document.createElement('div');
        render(htmContent, element);
        // xss safe
        return element.innerHTML;
    }

    return {htmlToString};
});
