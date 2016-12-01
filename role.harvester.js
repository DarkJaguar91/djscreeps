const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (!creep.gatherEnergy()) {
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            } else {
                creep.memory.state = 'idle'
            }
        }
    }
};

module.exports = roleHarvester;