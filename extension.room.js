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

const getWorkerBody = function(room) {
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

Room.prototype.checkWorkerPopulation = function (numSourceWorkers) {
    const creeps = this.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return creep.memory.type == 'worker' && creep.memory.role != 'harvester'
        }
    })
    this.memory.extraCreeps = this.memory.extraCreeps || 4
    const totCreeps = this.memory.extraCreeps

    if (creeps.length < totCreeps) {
        const spawns = this.find(FIND_MY_SPAWNS, {
            filter: (spawn) => {
                return !spawn.spawning
            }
        })
        if (spawns.length > 0) {
            const num = Math.min(spawns.length, totCreeps - creeps.length)
            let body = getWorkerBody(this)

            for (let i = 0; i < num; ++i) {
                if (spawns[i].canCreateCreep(body) == OK) {
                    spawns[i].createCreep(body, null, { type: 'worker' })
                }
            }
        }
    }
}

Room.prototype.checkSourceWorkers = function(sources) {
    for (let source of sources) {
        if (!source.memory.worker || !Game.creeps[source.memory.worker]) {
            delete source.memory.worker

            // const creeps = this.find(FIND_MY_CREEPS, {
            //     filter: (creep) => {
            //         return creep.memory.type == 'worker' && creep.memory.role != 'harvester'
            //     }
            // })
            // if (creeps.length > 0) {
            //     source.memory.worker = creeps[creeps.length - 1].name
            //     creeps[creeps.length - 1].memory.role = 'harvester'
            //     creeps[creeps.length - 1].memory.source = source.id
            // }
            const spawns = this.find(FIND_MY_SPAWNS, {
                filter: (spawn) => {
                    return !spawn.spawning
                }
            })
            if (spawns && spawns.length > 0) {
                source.memory.worker = spawns[0].createCreep(getWorkerBody(this), null, { type: 'worker', role: 'harvester', source: source.id})
            }
        }
    }
}

Room.prototype.manageCreeps = function() {
    const harvesters = this.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return creep.memory.role == 'harvester'
        }
    })
    for (let creep of harvesters) {
        creep.gather()
    }

    const others = this.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return creep.memory.type == 'worker' && creep.memory.role != 'harvester'
        }
    })
    for (let creep of others) {
        creep.work()
    }
}

Room.prototype.manageLinks = function() {
    const links = this.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_LINK
        }
    })

    for (let link of links) {
        link.run()
    }
}

Room.prototype.manageTowers = function() {
    const towers = this.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER
        }
    })

    for (let tower of towers) {
        tower.run()
    }
}

Room.prototype.run = function () {
    const sources = this.find(FIND_SOURCES)

    this.checkWorkerPopulation(sources.length)
    this.checkSourceWorkers(sources)
    this.manageLinks()
    this.manageTowers()
    this.manageCreeps()
}