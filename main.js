// const _ = require('lodash');
require('extension.creep')
require('extension.structure')
require('extension.source')
require('extension.link')
require('extension.tower')
require('extension.room')

module.exports.loop = function () {
    if (Memory.creeps) {
        for (let creepName in Memory.creeps) {
            if (Memory.creeps.hasOwnProperty(creepName) && !Game.creeps[creepName]) {
                delete Memory.creeps[creepName]
            }
        }
    }
    
    for (let roomName in Game.rooms) {
        if (!Game.rooms.hasOwnProperty(roomName)) continue

        let room = Game.rooms[roomName]
        room.run()
    }

    // delete Memory.sources
    // delete Memory.rooms
    // delete Memory.towers
    // delete Memory.CREEP_SIZE
    // delete Memory.links
    // for (let name in Game.creeps) {
    //     delete Game.creeps[name].memory.targetSource
    //     delete Game.creeps[name].memory.work
    //     delete Game.creeps[name].memory.upgrading
    //     delete Game.creeps[name].memory.state
    //     Game.creeps[name].memory.type = 'worker'
    // }
}