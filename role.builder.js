const roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let site = Game.getObjectById(creep.memory.constructionSite.id);
        if (!site) {
            creep.memory.state = 'idle'
            return
        }

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && !creep.gatherEnergy()) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(site);
            }
        }
    }
};

module.exports = roleBuilder;