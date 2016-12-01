module.exports = {
    run: function(tower) {
        var enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if (enemy) {
            tower.attack(enemy)
            return
        }
        var damagedObject = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (struct) => {
                return struct.hits < struct.hitsMax
            }
        })
        if (damagedObject) {
            tower.repair(damagedObject)
            return
        }
    }
};