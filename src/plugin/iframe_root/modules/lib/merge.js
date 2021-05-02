define([], () => {
    function merge(...objects) {
        return Object.assign(...[{}, ...objects]);
    }

    return {merge};
})