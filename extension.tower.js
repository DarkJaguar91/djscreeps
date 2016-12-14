/**
 * Created by brandon on 2016/12/14.
 */
Object.defineProperty(StructureTower.prototype, 'memory', {
    get: function () {
        if (_.isUndefined(Memory.towers)) {
            Memory.towers = {};
        }
        if (!_.isObject(Memory.towers)) {
            return undefined;
        }
        return Memory.towers[this.id] = Memory.towers[this.id] || {};
    },
    set: function (value) {
        if (_.isUndefined(Memory.towers)) {
            Memory.towers = {};
        }
        if (!_.isObject(Memory.towers)) {
            throw new Error('Could not set source memory');
        }
        Memory.towers[this.id] = value;
    },
    configurable: true
});