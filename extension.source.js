Object.defineProperty(Structure.prototype, 'memory', {
    get: function () {
        if (_.isUndefined(Memory.structure)) {
            Memory.structure = {};
        }
        if (!_.isObject(Memory.structure)) {
            return undefined;
        }
        return Memory.structure[this.id] = Memory.structure[this.id] || {};
    },
    set: function (value) {
        if (_.isUndefined(Memory.structure)) {
            Memory.structure = {};
        }
        if (!_.isObject(Memory.structure)) {
            throw new Error('Could not set source memory');
        }
        Memory.structure[this.id] = value;
    },
    configurable: true
});