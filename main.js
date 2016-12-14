require('extension.structure');
require('extension.source');
require('extension.creep');
require('extension.room');

module.exports.loop = function () {
    for (let roomName in Game.rooms) {
        if (!Game.rooms.hasOwnProperty(roomName)) continue;
        Game.rooms[roomName].run();
    }
}