const C = require('constants')
const Queue = require('queue')

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

Room.prototype = Object.assign(Room.prototype,
    {
        setMemoryDefaults: function () {
            this.memory.extraCarriers = this.memory.extraCarriers || 0
            this.memory.upgraders = this.memory.upgraders || 1
            this.memory.builders = this.memory.builders || 2
        },
        getCurrentObjects: function () {
            this.sources = this.find(FIND_SOURCES)
            this.creeps = _.groupBy(this.find(FIND_MY_CREEPS), "memory.type")

            console.log(C.TYPE.MINER + ' MOFOs ' + this.creeps)
            for (let a in this.creeps) {
                console.log(a)
                console.log(this.creeps[a])
            }
        },
        checkCreepPopulation: function () {

        },
        run: function () {
            this.setMemoryDefaults()
            this.getCurrentObjects()
            // this.checkCreepPopulation()
        }
    }
)