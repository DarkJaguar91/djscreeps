// const _ = require('lodash');
require('struct.extensions')
require('creep.extensions')
const creepController = require('creep.controller');

module.exports.loop = function () {
    creepController.run()

    // delete Memory.sources
    // for (let name in Game.creeps) {
    //     delete Game.creeps[name].memory.targetSource
    //     delete Game.creeps[name].memory.work
    //     delete Game.creeps[name].memory.upgrading
    //     delete Game.creeps[name].memory.state
    // }
    
    const towers = _.filter(Game.structures, (structure) => {
        return structure.structureType == STRUCTURE_TOWER
    });
    for (let towerIndex of towers) {
        towerRole.run(towerIndex)
    }
}