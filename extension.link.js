Object.defineProperty(StructureLink.prototype, 'memory', {
    get: function () {
        if (_.isUndefined(Memory.links)) {
            Memory.links = {};
        }
        if (!_.isObject(Memory.links)) {
            return undefined;
        }
        return Memory.links[this.id] = Memory.links[this.id] || {};
    },
    set: function (value) {
        if (_.isUndefined(Memory.links)) {
            Memory.links = {};
        }
        if (!_.isObject(Memory.links)) {
            throw new Error('Could not set link memory');
        }
        Memory.links[this.id] = value;
    },
    configurable: true
});

StructureLink.prototype.isStorageLink = function() {
    if (this.memory.isStorageLink == undefined) {
        this.memory.isStorageLink = this.pos.findInRange(FIND_STRUCTURES, 5, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_STORAGE
                }
            }).length > 0
    }
    return this.memory.isStorageLink
}

StructureLink.prototype.run = function() {
    if (this.isStorageLink() || this.energy < this.energyCapacity) return

    const links = this.room.storage.pos.findInRange(FIND_STRUCTURES, 5, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_LINK && structure.energy < structure.energyCapacity
        }
    })
    if (links && links.length > 0) {
        this.transferEnergy(links[0])
    }
}

