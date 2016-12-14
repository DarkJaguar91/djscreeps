/**
 * Created by brandon on 2016/12/13.
 */
module.exports = {
    run: function (creep) {
        creep._checkEnergyLevel();

        if (creep._isCollecting()) {
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
                filter: (s) => !s.memory.miner || !Game.creeps[s.memory.miner]
            });
            if (!source) {
                creep._harvestSource();
            } else {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        } else {
            creep._supplyStructures();
        }
        return true;
    }
}