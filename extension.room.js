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

Room.prototype.run = function() {
    runLinks(this)
    runCreeps(this)
}