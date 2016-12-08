const c = require('constants')

function energize(creep) {
    creep.say('energize')
    if (!creep.memory.target) {
        creep.memory.task = undefined
        return
    }
    const target = Game.getObjectById(creep.memory.target)
    let result = creep.transfer(target, RESOURCE_ENERGY)
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
    }
    if (result == OK || target.energy == target.energyCapacity || result == ERR_NOT_ENOUGH_ENERGY) {
        creep.memory.task = undefined
        creep.memory.target = undefined
        target.memory.worker = undefined
    }
}

function harvest(creep) {
    creep.say('harvest')
    const storage = creep.room.storage
    if (storage && storage.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
        let result = creep.withdraw(storage, RESOURCE_ENERGY)
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage)
        }
    } else {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
        if (source) {
            let result = creep.harvest(source)
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(source)
            }
        }
    }
    if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.task = undefined
    }
}

function mine(creep) {
    creep.say('mine')
    const source = Game.getObjectById(creep.memory.source)
    const result = creep.harvest(source)
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
    }
    if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.task = undefined
    }
}


function upgradeController(creep) {
    creep.say('upgrade')
    const result = creep.upgradeController(creep.room.controller)
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
    } else if (result == ERR_NOT_ENOUGH_RESOURCES || creep.carry.energy == 0) {
        creep.memory.task = undefined
    }
}

function renew(creep) {
    creep.say('renew')
    if (!creep.memory.target) {
        creep.memory.task = undefined
        return
    }
    const target = Game.getObjectById(creep.memory.target)
    const result = target.renewCreep(creep)
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
    }
    if (result == ERR_FULL || result == ERR_NOT_ENOUGH_ENERGY) {
        creep.memory.task = undefined
        creep.memory.target = undefined
    }
}

function build(creep) {
    creep.say('build')
    if (!creep.memory.target) {
        creep.memory.task = undefined
        return
    }
    const target = Game.getObjectById(creep.memory.target)
    const result = creep.build(target)
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
    }
    if (result == ERR_NOT_ENOUGH_ENERGY || creep.carry.energy == 0 || result == ERR_INVALID_TARGET) {
        creep.memory.task = undefined
        creep.memory.target = undefined
    }
}

function transferFromLink(creep) {
    creep.say('Transfer')
    if (!creep.memory.target) {
        creep.memory.task = undefined
    }
    const target = Game.getObjectById(creep.memory.target)
    const result = creep.withdraw(target, RESOURCE_ENERGY)
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
    }
    if (creep.carry.energy >= creep.carryCapacity || target.energy == 0) {
        creep.memory.task = undefined
        creep.memory.target = undefined
    }
}

function needsRenewal(creep) {
    if (creep.memory.task == c.TASK.RENEW) return

    const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS)
    if (creep.pos.getRangeTo(spawn) + 50 >= creep.ticksToLive) {
        creep.memory.target = spawn.id
        return true
    }
}

function getWorkerTask(creep, forceUpgrader) {
    if (creep.carry.energy == 0) {
        return c.TASK.HARVEST
    }
    if (forceUpgrader) {
        return c.TASK.UPGRADE
    }
    const name = creep.name
    const energyDeprivedStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            let worker = (!structure.memory.worker) || !Game.creeps[structure.memory.worker] || name == structure.memory.worker
            return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity && worker
        }
    })
    if (energyDeprivedStructure) {
        energyDeprivedStructure.memory.worker = name
        creep.memory.target = energyDeprivedStructure.id
        return c.TASK.ENERGIZE
    }
    const constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
    if (constructionSites.length > 0) {
        constructionSites.sort((a, b) => (b.progress / b.progressTotal) - (a.progress / a.progressTotal))
        creep.memory.target = constructionSites[0].id
        return c.TASK.BUILD
    }
    return c.TASK.UPGRADE
}

function getMinerTask(creep) {
    const storage = creep.room.storage
    if (creep.carry.energy == 0) {
        if (creep.pos.getRangeTo(storage) <= 5) {
            const storageLinks = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_LINK && structure.isStorageLink()
                }
            })
            storageLinks.sort((a, b) => (a.energy / a.energyCapacity) - (b.energy / b.energyCapacity))
            if (storageLinks[0].energy > 0) {
                creep.memory.target = storageLinks[0].id
                return c.TASK.TRANSFER_LINK
            }
        }
        return c.TASK.MINE
    }
    const source = Game.getObjectById(creep.memory.source)
    let longRangeLinks = source.getLongRangeLinks();
    if (longRangeLinks.length > 0) {
        longRangeLinks.sort((a, b) => (b.energy / b.energyCapacity) - (a.energy / a.energyCapacity))
        creep.memory.target = longRangeLinks[0].id
        return c.TASK.ENERGIZE
    } else {
        creep.memory.target = storage.id
        return c.TASK.ENERGIZE
    }
}

Creep.prototype.getTask = function (forceUpgrader) {
    if (needsRenewal(this)) {
        return c.TASK.RENEW
    }
    if (this.memory.task) {
        return this.memory.task
    }
    switch (this.memory.type) {
        case c.TYPE.MINER:
            return getMinerTask(this);
        default:
        case c.TYPE.WORKER:
            return getWorkerTask(this, forceUpgrader)
    }
}

Creep.prototype.run = function () {
    switch (this.memory.task) {
        case c.TASK.HARVEST:
            harvest(this)
            break
        case c.TASK.ENERGIZE:
            energize(this)
            break
        case c.TASK.RENEW:
            renew(this)
            break
        case c.TASK.BUILD:
            build(this)
            break
        case c.TASK.MINE:
            mine(this)
            break;
        case c.TASK.TRANSFER_LINK:
            transferFromLink(this)
            break;
        case c.TASK.UPGRADE:
        default:
            upgradeController(this)
    }
}