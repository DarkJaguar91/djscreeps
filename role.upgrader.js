/**
 * Created by brandon on 2016/12/13.
 */
module.exports =  {
    run: function(creep) {
        creep._checkEnergyLevel();

        if (creep._isCollecting()) {
            if (!creep._getEnergyFromStorage()) {
                creep._harvestSource();
            }
            return true;
        } else {
            let controller = creep.room.controller;
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        }
        return true;
    }
}