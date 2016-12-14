/**
 * Created by brandon on 2016/12/14.
 */
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
            throw new Error('Could not set sources memory');
        }
        Memory.sources[this.id] = value;
    },
    configurable: true
});


Object.assign(Source.prototype, {
    _getContainer: function() {
        if (!this.memory.container) {
            const containers = this.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: {structureType: STRUCTURE_CONTAINER}
            })
            if (containers && containers.length > 0) {
                this.memory.container = containers[0].id
            }
        }
        return this.memory.container
    }
})