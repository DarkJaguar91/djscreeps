var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && !creep.gatherEnergy()) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
            const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (struct) => {
                    return struct.hits < struct.hitsMax * 0.7
                }
            });
            if (structure) {
                if(creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);    
                }
            } else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;