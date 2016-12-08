const c = require('constants')

if (!Object.getOwnPropertyDescriptor(Room.prototype, 'memory')) {
    Object.defineProperty(Room.prototype, 'memory', {
        get: function () {
            if (_.isUndefined(Memory.rooms)) {
                Memory.rooms = {};
            }
            if (!_.isObject(Memory.rooms)) {
                return undefined;
            }
            return Memory.rooms[this.id] = Memory.rooms[this.id] || {};
        },
        set: function (value) {
            if (_.isUndefined(Memory.rooms)) {
                Memory.rooms = {};
            }
            if (!_.isObject(Memory.rooms)) {
                throw new Error('Could not set room memory');
            }
            Memory.rooms[this.id] = value;
        },
        configurable: true
    });
}

function getWorkerBody(room) {
    const energyStructures =  room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN
        }
    })
    let capacity = 0
    for (let structure of energyStructures) {
        capacity += structure.energy
    }
    room.memory.percentCapacityForWorkers = room.memory.percentCapacityForWorkers || 0.33
    capacity = Math.floor(Math.max(1, (capacity * room.memory.percentCapacityForWorkers) / 200))

    let body = [WORK]
    for (let i = 0; i < capacity - 1; ++i) {
        body.push(WORK)
    }
    for (let i = 0; i < capacity; ++i) {
        body.push(CARRY)
    }
    for (let i = 0; i < capacity; ++i) {
        body.push(MOVE)
    }

    return body
}

function checkWorkerPopulation(room) {
    const workers = room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return creep.memory.type == c.TYPE.WORKER
        }
    })
    room.memory.numWorkers = room.memory.numWorkers || 4
    if (workers.length < room.memory.numWorkers) {
        const spawns = room.find(FIND_MY_SPAWNS, {
            filter: (spawn) => {
                return !spawn.spawning
            }
        })
        if (spawns.length > 0) {
            const body = getWorkerBody(room)
            const numToSpawn = Math.min(spawns.length, room.memory.numWorkers - workers.length)
            for (let i = 0; i < numToSpawn; ++i) {
                spawns[i].createCreep(body, null, { type: c.TYPE.WORKER })
            }
        }
    }
}

function checkMinerPopulation(room) {
    if (room.storage) {
        const sources = room.find(FIND_SOURCES)
        const spawns = room.find(FIND_MY_SPAWNS, {
            filter: (spawn) => {
                return !spawn.spawning
            }
        })
        for (let source of sources){
            if (!source.memory.worker || !Game.creeps[source.memory.worker]) {
                if (spawns.length > 0) {
                    const body = getWorkerBody(room)
                    source.memory.worker = spawns[0].createCreep(body, null, {type: c.TYPE.MINER, source: source.id})
                    spawns.splice(0, 1)
                }
            }
        }
    }
}

function runLinks(room) {
    const links = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_LINK
        }
    })
    for (let link of links) {
        link.run()
    }
}

function runTowers(room) {
    const towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structures) => {
            return structures.structureType == STRUCTURE_TOWER
        }
    })

    for (let tower of towers) {
        tower.run()
    }
}

function runCreeps(room) {
    let creeps = room.find(FIND_MY_CREEPS);
    let numUpgraders = _.filter(creeps, (creep) => {
        return creep.memory.task == c.TASK.UPGRADE
    }).length
    for (let creep of creeps) {
        let currentTask = creep.memory.task
        let newTask = creep.getTask(numUpgraders == 0)

        if (newTask != currentTask) {
            creep.memory.task = newTask
            if (currentTask == c.TASK.UPGRADE)
                --numUpgraders;
            else if (newTask == c.TASK.UPGRADE)
                ++numUpgraders
        }
        creep.run()
    }
}

Room.prototype.run = function() {
    checkWorkerPopulation(this)
    checkMinerPopulation(this)
    runLinks(this)
    runTowers(this)
    runCreeps(this)
}