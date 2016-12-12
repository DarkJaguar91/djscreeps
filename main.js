// const _ = require('lodash');
require('extension.room')

module.exports.loop = function () {
    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName]
        room.run();
    }
}