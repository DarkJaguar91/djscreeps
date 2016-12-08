require('extension.structure')
require('extension.tower')
require('extension.link')
require('extension.source')
require('extension.creep')
require('extension.room')

module.exports.loop = function () {
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            console.log('RIP ' + creepName + ' - Check -- ' + Memory.creeps[creepName].type)
            delete Memory.creeps[creepName]
        }
    }

    for (let roomName in Game.rooms) {
        if (Game.rooms.hasOwnProperty(roomName)) {
            Game.rooms[roomName].run()
        }
    }
}