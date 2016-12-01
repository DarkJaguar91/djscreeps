const _ = require('lodash');
require('creep.extensions')
const creepController = require('creep.controller');
const towerRole = require('role.tower');

module.exports.loop = function () {
    creepController.run()

    // delete Memory.sources
    // for (let name in Game.creeps) {
    //     delete Game.creeps[name].memory.targetSource
    //     Game.creeps[name].memory.state = 'idle'
    //     Game.creeps[name].memory.upgrading = false
    // }

    const towers = _.filter(Game.structures, (structure) => {
        return structure.structureType == STRUCTURE_TOWER
    });
    for (let towerIndex of towers) {
        towerRole.run(towerIndex)
    }
}