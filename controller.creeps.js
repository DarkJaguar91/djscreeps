/**
 * Created by brandon on 2016/12/14.
 */
const C = require('constants')
const roleHarvester = require('role.harvester');
const roleMiner = require('role.miner');
const roleCarrier = require('role.carrier');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

module.exports = CreepsController

function CreepsController(creeps) {
    this.creeps = creeps;
}

CreepsController.prototype = {
    run: function () {
        for (let creep of this.creeps) {
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
    },
}