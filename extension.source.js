Object.defineProperty(Source.prototype, 'memory', {
    get: function () {
        if (_.isUndefined(Memory.sources)) {
            Memory.sources = {};
        }
        if (!_.isObject(Memory.sources)) {
            return undefined;
        }
        return Memory.sources[this.id] = Memory.sources[this.id] || {};
    },
    set: function (value) {
        if (_.isUndefined(Memory.sources)) {
            Memory.sources = {};
        }
        if (!_.isObject(Memory.sources)) {
            throw new Error('Could not set source memory');
        }
        Memory.sources[this.id] = value;
    },
    configurable: true
});

Source.prototype.getLongRangeLinks = function () {
    return this.pos.findInRange(FIND_MY_STRUCTURES, 5, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_LINK && structure.pos.findInRange(FIND_MY_STRUCTURES, 5, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE
                    }
                }).length == 0
        }
    })
}