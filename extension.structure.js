/**
 * Created by brandon on 2016/12/14.
 */
Object.defineProperty(Structure.prototype, 'memory', {
    get: function () {
        if (_.isUndefined(Memory.structures)) {
            Memory.structures = {};
        }
        if (!_.isObject(Memory.structures)) {
            return undefined;
        }
        return Memory.structures[this.id] = Memory.structures[this.id] || {};
    },
    set: function (value) {
        if (_.isUndefined(Memory.structures)) {
            Memory.structures = {};
        }
        if (!_.isObject(Memory.structures)) {
            throw new Error('Could not set source memory');
        }
        Memory.structures[this.id] = value;
    },
    configurable: true
});