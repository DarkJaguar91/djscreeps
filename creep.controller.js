const resourceManager = require('resource.manager')
const clearMemory = function () {
    for (let creepName in Memory.creeps) {
        if (Memory.creeps.hasOwnProperty(creepName) && !Game.creeps[creepName]) {
            console.log('RIP: ' + creepName)
            if (Memory.creeps[creepName].targetSource) {
                resourceManager.release(Memory.creeps[creepName].targetSource)
            }
            delete Memory.creeps[creepName]
        }
    }
};
const birthWorkers = function () {
    Memory.CREEP_SIZE = Memory.CREEP_SIZE || 5

    const creeps = _.filter(Game.creeps, (creep) => {
        return creep.memory.state != 'warrior'
    });
    const cnt = creeps.length;
    const type = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
    const availableSpawns = _.filter(Game.spawns, (spawn) => {
        return spawn.canCreateCreep(type, null, {state: 'idle'}) == 0
    });
    for (let i = 0; i < (Memory.CREEP_SIZE - cnt) && i < availableSpawns.length; ++i) {
        availableSpawns[i].createCreep(type, null, {state: 'idle'})
    }
};

module.exports = {
    run: function() {
        clearMemory()
        birthWorkers()
        
        for (let creepName in Game.creeps) {
            if (Game.creeps.hasOwnProperty(creepName)) {
                const creep = Game.creeps[creepName];
                creep.work()
            }
        }
        
        // var harvesters = _.filter(Game.creeps, {memory: { state: 'harvester' }})
        // // var builders = _.filter(Game.creeps, {memory: { state: 'builder' }})
        // var idle = _.filter(Game.creeps, {memory: { state: 'idle' }})
        // var emptyStructures = _.filter(Game.structures, (struct) => {
        //     if (struct.structureType == STRUCTURE_CONTROLLER) return false
        //     return struct.energy && struct.energy < struct.energyCapacity
        // })
        
        // while (idle.length > 0 && harvesters.length < emptyStructures.length * 2) {
        //     var creep = idle[0]
        //     creep.memory.state = 'harvester'
        //     harvesters.push(creep)
        //     idle.splice(0, 1)
        // }

        // for (var siteName in Game.constructionSites) {
        //     if (builders.length > Math.floor(0.7 * Memory.CREEP_SIZE)) {
        //         break;
        //     }
        //     var site = Game.constructionSites[siteName]
        //     var closestIdleCreep = site.pos.findClosestByPath(FIND_MY_CREEPS, {
        //         filter: (creep) => {
        //             return creep.memory.state == 'idle'
        //         }
        //     })
        //     if (closestIdleCreep) {
        //         builders.push(closestIdleCreep)
        //         idle.splice(0, 1)
        //         closestIdleCreep.memory.state = 'builder'
        //         closestIdleCreep.memory.constructionSite = site
        //     }
        // }
        
        // executeRole(harvesterRole, harvesters)
        // executeRole(builderRole, builders)
        // executeRole(upgraderRole, idle)
    }
};