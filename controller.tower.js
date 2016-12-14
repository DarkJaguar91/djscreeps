/**
 * Created by brandon on 2016/12/14.
 */
module.exports = TowerController

function TowerController(towers) {
    this.towers = towers;
}

TowerController.prototype = {
    run: function () {
        for (let tower of this.towers) {
            const creep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (creep) {
                tower.attack(creep)
                continue;
            }
            if (!tower.memory.defender) {
                const structure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => {
                        return s.hits < s.hitsMax;
                    }
                })
                if (structure) {
                    tower.repair(structure)
                }
            }
        }
    }
}