require('extension.structure')
require('extension.creep')
require('extension.room')

module.exports.loop = function () {
    for (let roomName in Game.rooms) {
        if (Game.rooms.hasOwnProperty(roomName)) {
            Game.rooms[roomName].run()
        }
    }
}