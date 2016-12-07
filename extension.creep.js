let c = require('constants')

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
    const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)

    if (source) {
        let result = creep.harvest(source)
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
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

function checkForRenewal(creep) {
    if (creep.memory.task == c.TASK.RENEW) return

    const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS)
    if (creep.pos.getRangeTo(spawn) + 50 >= creep.ticksToLive) {
        creep.memory.target = spawn.id
        creep.memory.task = c.TASK.RENEW
    }
}

function getWorkerTask(creep) {
    if (creep.carry.energy == 0) {
        return c.TASK.HARVEST
    }
    const energyDeprivedStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            let worker = (!structure.memory.worker) || !Game.creeps[structure.memory.worker] || creep.name == structure.memory.worker
            return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity && worker
        }
    })
    if (energyDeprivedStructure) {
        energyDeprivedStructure.memory.worker = creep.name
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

function work(creep) {
    checkForRenewal(creep)
    if (!creep.memory.task)
        creep.memory.task = getWorkerTask(creep)

    switch (creep.memory.task) {
        case c.TASK.HARVEST:
            harvest(creep)
            break
        case c.TASK.ENERGIZE:
            energize(creep)
            break
        case c.TASK.RENEW:
            renew(creep)
            break
        case c.TASK.BUILD:
            build(creep)
            break
        case c.TASK.UPGRADE:
        default:
            upgradeController(creep)
    }
}

Creep.prototype.run = function () {
    this.memory.type = this.memory.type || c.TYPE.WORKER
    switch (this.memory.type) {
        case c.TYPE.WORKER:
            work(this)
            break
        default:
            this.say('No type')
            this.memory.type = c.TYPE.WORKER
    }
}