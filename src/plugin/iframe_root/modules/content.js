define([
    'kb_common/html',
], (
    html
) => {
    const t = html.tag,
        span = t('span');

    function na() {
        return span({
            style: {
                color: 'gray'
            }
        }, '∅');
    }

    function niceNumber(value) {
        return Intl.NumberFormat('en-US', {useGrouping: true}).format(value);
    }

    return {
        na, niceNumber
    };
});