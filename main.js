require('extension.structure');
require('extension.source');
require('extension.creep');
const C = require('constants');
const Assembly = require('creep.assembly');
const roleHarvester = require('role.harvester');
const roleMiner = require('role.miner');
const roleCarrier = require('role.carrier');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

module.exports.loop = function () {
    for (let roomName in Game.rooms) {
        if (!Game.rooms.hasOwnProperty(roomName)) continue;

        const room = Game.rooms[roomName];
        room.creeps = room.find(FIND_MY_CREEPS);
        room.sources = room.find(FIND_SOURCES);
        room.towers = room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}})

        for (let creep of room.creeps) {
            switch (creep.memory.role) {
                case C.CREEP_ROLE.HARVESTER:
                    roleHarvester.run(creep);
                    break;
                case C.CREEP_ROLE.MINER:
                    roleMiner.run(creep);
                    break;
                case C.CREEP_ROLE.CARRIER:
                    roleCarrier.run(creep);
                    break;
                case C.CREEP_ROLE.BUILDER:
                    if (roleBuilder.run(creep)) break;
                case C.CREEP_ROLE.UPGRADER:
                    roleUpgrader.run(creep);
                    break;
                default:
                    creep.say('nothing');
                    break;
            }
        }

        for (let tower of room.towers) {
            const injuredStructure = tower.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.hits < s.hitsMax
                }
            })

            if (injuredStructure) {
                tower.repair(injuredStructure)
            }
        }

        new Assembly(room).run()
    }
}