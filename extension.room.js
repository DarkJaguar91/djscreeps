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

let workers = undefined
let miners = undefined

function checkCreepPopulation(room) {

}

function runCreeps(room) {
    let creeps = room.find(FIND_MY_CREEPS);
    for (let creep of creeps) {
        creep.run()
    }
}

Room.prototype.run = function() {
    runCreeps(this)
}