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
            throw new Error('Could not set towers memory');
        }
        Memory.towers[this.id] = value;
    },
    configurable: true
});

StructureTower.prototype.run = function() {
    const hostile = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
    if (hostile) {
        this.attack(hostile)
    }

    if (!this.memory.defenceOnly) {
        const structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (struct) => {
                return struct.hits < struct.hitsMax
            }
        })
        if (structure) {
            this.repair(structure)
        }
    }
}