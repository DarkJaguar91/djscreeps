/**
 * Created by brandon on 2016/12/13.
 */
module.exports =  {
    run: function(creep) {
        creep._checkEnergyLevel()

        if (creep._isCollecting()) {
            creep._harvestSource()
        } else {
            creep._supplyStructures()
        }
        return true
    }
}