const resourceManager = require('resource.manager')

Creep.prototype._gather = function() {
    const needsToHarvest = this.carry.energy < this.carryCapacity
    let sourceId = this.memory.targetSource

    if(needsToHarvest) {
        if (!sourceId) {
            const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
                filter: (source) => {
                    return resourceManager.canHarvest(source) && source.pos.findInRange(FIND_HOSTILE_CREEPS, 5).length == 0
                }
            })
            if (source) {
                this.say('Energizing')
                sourceId = source.id
                this.memory.targetSource = sourceId
                resourceManager.book(source.id)
            }
        }
        let source = Game.getObjectById(sourceId)
        if (source && this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source)
        } else if (!source) {
            this.say('No MC²')
        }
        return true
    }
    if (sourceId) {
        this.say('Energized')
        resourceManager.release(sourceId)
        delete this.memory.targetSource
    }
    return false
}

Creep.prototype._energize = function() {
    let struct = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity;
        }
    })
    if ((Memory.rooms[this.room].energizers < Memory.CREEP_SIZE * 0.5) && struct && struct.needsEnergy() && this.carry.energy > 0) {
        if (this.memory.work != '_energize') {
            ++Memory.rooms[this.room].energizers
        }
        this.memory.work = '_energize'
        if (this.transfer(struct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(struct)
        }
        return true
    }
    if (this.memory.work == '_energize') {
        --Memory.rooms[this.room].energizers
    }
    delete this.memory.work
    return false
}

Creep.prototype._upgrade = function() {
    if (this.carry.energy > 0) {
        this.memory.work = '_upgrade'
        if (this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.controller)
        }
        return true
    }
    delete this.memory.work
    return false
}

Creep.prototype._build = function() {
    let sites = this.room.find(FIND_MY_CONSTRUCTION_SITES)
    sites.sort((a, b) => (b.progress / b.progressTotal) - (a.progress / a.progressTotal))
    
    if ((Memory.rooms[this.room].builders < Memory.CREEP_SIZE * 0.5) && sites.length > 0 && this.carry.energy > 0) {
        if (this.memory.work != '_build') {
            ++Memory.rooms[this.room].builders
        }
        this.memory.work = '_build'
        if (this.build(sites[0]) == ERR_NOT_IN_RANGE) {
            this.moveTo(sites[0])
        }
        return true
    }
    if (this.memory.work == '_build') {
        --Memory.rooms[this.room].builders
    }
    delete this.memory.work
    return false
}

Creep.prototype.work = function() {
    Memory.rooms = Memory.rooms || {}
    Memory.rooms[this.room] = Memory.rooms[this.room] || {
        builders: 0,
        energizers: 0,
    }
    if (!this.memory.work) {
        if (!this._gather()) {
            return this._energize() || this._build() || this._upgrade()
        }
    } else {
        this[this.memory.work]()
    }
}