Creep.prototype.gather = function () {
    const source = Game.getObjectById(this.memory.source)
    const links = source.getLongRangeLinks()
    const storage = this.room.storage

    if (!this.memory.gathering && this.carry.energy == 0) {
        this.memory.gathering = true;
    }
    if (this.memory.gathering && this.carry.energy == this.carryCapacity) {
        this.memory.gathering = false;
    }

    if (this.memory.gathering) {
        if (source.getLongRangeLinks().length == 0) {
            const link = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_LINK && structure.isStorageLink() &&
                        structure.energy > 0
                }
            })
            if (link) {
                if (this.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(link)
                }
                return
            }
        }
        if (this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source)
        }
    } else {
        let target = null
        if (links && links.length > 0) {
            target = links[0]
            for (let link of links) {
                if (link && link.energy <= link.energyCapacity) {
                    target = link
                    break;
                }
            }
        }
        target = target || storage || this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION)
                        && structure.energy < structure.energyCapacity
                }
            })
        if (target) {
            if (target == storage) {
                this.transfer(target, RESOURCE_ENERGY)
            }
            if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target)
            }
        }
    }
}

Creep.prototype.work = function () {
    const name = this.name
    if (!this.memory.gathering && this.carry.energy == 0) {
        this.memory.gathering = true;
    }
    if (this.memory.gathering && this.carry.energy == this.carryCapacity) {
        this.memory.gathering = false;
    }

    if (this.memory.gathering) {
        const storage = this.room.storage
        if (storage && storage.store[RESOURCE_ENERGY] >= this.carryCapacity) {
            if (this.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(storage)
            }
        } else {
            const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            if (source && this.harvest(source) == ERR_NOT_IN_RANGE) {
                this.moveTo(source)
            }
        }
    } else {
        const energyStructure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                let worker = (!structure.memory.worker) || !Game.creeps[structure.memory.worker] || name == structure.memory.worker
                return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity && worker
            }
        })
        if (energyStructure) {
            energyStructure.memory.worker = name
            const result = this.transfer(energyStructure, RESOURCE_ENERGY)
            if (result == ERR_NOT_IN_RANGE) {
                this.moveTo(energyStructure)
            } else if (result == OK) {
                delete energyStructure.memory.worker
            }
            return
        }
        let constructionSites = this.room.find(FIND_MY_CONSTRUCTION_SITES)
        constructionSites.sort((a, b) => (b.progress / b.progressTotal) - (a.progress / a.progressTotal))
        if (constructionSites && constructionSites.length > 0) {
            if (this.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                this.moveTo(constructionSites[0])
            }
            return
        }
        if (this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.controller)
        }
    }
}