/**
 * Created by brandon on 2016/12/13.
 */
module.exports =  {
    run: function(creep) {
        creep._checkEnergyLevel();

        if (creep._isCollecting()) {
            if (!creep.memory.container) {
                creep.say('o.O');
                console.log("Error with carrier: " + creep.name);
                return
            }
            const container = Game.getObjectById(creep.memory.container);
            const resource = creep.room.lookForAt(LOOK_RESOURCES, container);
            if (resource && creep.pickup(resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(resource);
            } else if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        } else {
            creep._supplyStructures();
        }
        return true;
    }
}