var _ = require('lodash')
var harvesterRole = require('role.harvester')
var builderRole = require('role.builder')
var upgraderRole = require('role.upgrader')

var executeRole = function(role, creepers) {
   for (var creepIndex in creepers) {
        role.run(creepers[creepIndex])
   }
}
var clearMemory = function() {
    for (var creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            console.log('RIP: ' + creepName)
            delete Memory.creeps[creepName]
        }
    }
}
var birthWorkers = function() {
    Memory.CREEP_SIZE = Memory.CREEP_SIZE || 5
    
    var creeps = _.filter(Game.creeps, (creep) => {
        return creep.memory.state != 'warrior'
    })
    var cnt = creeps.length
    var type = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    var availableSpawns = _.filter(Game.spawns, (spawn) => {
        return spawn.canCreateCreep(type, null, { state: 'idle'}) == 0
    })
    for (var i = 0; i < (Memory.CREEP_SIZE - cnt) && i < availableSpawns.length; ++i) {
        availableSpawns[i].createCreep(type, null, { state: 'idle'})
    }
}

module.exports = {
    run: function() {
        clearMemory()
        birthWorkers()
        
        var harvesters = _.filter(Game.creeps, {memory: { state: 'harvester' }})
        var builders = _.filter(Game.creeps, {memory: { state: 'builder' }})
        var idle = _.filter(Game.creeps, {memory: { state: 'idle' }})
        var emptyStructures = _.filter(Game.structures, (struct) => {
            if (struct.structureType == STRUCTURE_CONTROLLER) return false
            return struct.energy && struct.energy < struct.energyCapacity
        })
        
        while (idle.length > 0 && harvesters.length < emptyStructures.length * 2) {
            var creep = idle[0]
            creep.memory.state = 'harvester'
            harvesters.push(creep)
            idle.splice(0, 1)
        }
        
        for (var siteName in Game.constructionSites) {
            if (builders.length > Math.floor(0.7 * Memory.CREEP_SIZE)) {
                break;
            }
            var site = Game.constructionSites[siteName]
            var closestIdleCreep = site.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return creep.memory.state == 'idle'
                }
            })
            if (closestIdleCreep) {
                builders.push(closestIdleCreep)
                idle.splice(0, 1)
                closestIdleCreep.memory.state = 'builder'
                closestIdleCreep.memory.constructionSite = site
            }
        }
        
        executeRole(harvesterRole, harvesters)
        executeRole(builderRole, builders)
        executeRole(upgraderRole, idle)
    }
};