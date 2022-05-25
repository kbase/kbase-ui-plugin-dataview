define(['preact'], ({render}) => {
    function htmlToString(htmContent) {
        const element = document.createElement('div');
        render(htmContent, element);
        return element.innerHTML;
    }

    return {htmlToString};
});
