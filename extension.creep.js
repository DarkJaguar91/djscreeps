/**
 * Created by brandon on 2016/12/13.
 */

Creep.prototype = Object.assign(Creep.prototype, {
    _checkEnergyLevel: function () {
        if (this.carry.energy == 0) {
            this.memory.task = "collecting"
        }
        if (this.carry.energy == this.carryCapacity) {
            this.memory.task = "working"
        }
    },
    _isCollecting: function () {
        return this.memory.task == "collecting"
    },
    _harvestSource: function () {
        const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
        if (source) {
            const result = this.harvest(source)
            if (result == ERR_NOT_IN_RANGE) {
                this.moveTo(source)
            }
            return true
        }
        this.say("No sources")
        return false
    },
    _getEnergyFromStorage: function () {
        const storage = this.room.storage
        const carryCap = this.carryCapacity
        const target = (storage && _.sum(storage.store) > carryCap) ? storage :
            this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy >
                carryCap
            })

        if (target) {
            if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target)
            }
            return true
        }
        return false
    },
    _supplyStructures: function () {
        let storage = this.room.storage;
        let buildingStructure =
            this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN)
                && s.energy < s.energyCapacity
            })
        const target = buildingStructure || (storage && _.sum(storage.store) < storage.storeCapacity ? storage :
                this.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity
                }))


        if (target) {
            if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target)
            }
            return true
        }
        return false
    }
})