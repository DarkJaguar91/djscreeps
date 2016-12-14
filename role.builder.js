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
            let site = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES)
            if (site) {
                if (creep.build(site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site);
                }
                return true;
            }
        }
        return false;
    }
}