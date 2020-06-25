define([], () => {
    'use strict';
    class Params {
        constructor(params) {
            this.params = params;
        }

        check(name, type, constraints) {
            if (!(name in this.params)) {
                if (constraints.required) {
                    throw new Error('Parameter "' + name + '" is required and was not provided');
                } else {
                    return undefined;
                }
            }
            const value = this.params[name];
            switch (type) {
            case 'string':
                return value;
            case 'integer':
                var intValue = parseInt(value);
                if (isNaN(intValue)) {
                    throw new Error(`Parameter ${name} could not be converted to an integer: ${value}`);
                }
                return intValue;
            case 'boolean':
                switch (value.toLowerCase()) {
                case 't':
                case 'true':
                case 'y':
                case 'yes':
                case '1':
                    return true;
                case 'f':
                case 'false':
                case 'n':
                case 'no':
                case '0':
                    return false;
                default:
                    throw new Error(`Parameter ${name} could not be converted to a boolean: ${value}`);
                }
            default:
                throw new Error(`Unsupported type coercion ${type} for parameter ${name}`);
            }

        }
    }
    return Params;
});