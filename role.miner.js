/**
 * Created by brandon on 2016/12/13.
 */
module.exports =  {
    run: function(creep) {
        if (!creep.memory.source || !creep.memory.container) {
            console.log("Error with miner: " + creep.name)
            creep.say('o.O')
            return
        }
        const container = Game.getObjectById(creep.memory.container)
        const source = Game.getObjectById(creep.memory.source)

        if (creep.pos.getRangeTo(container) > 0) {
            creep.moveTo(container)
        } else {
            creep.harvest(source)
        }
    }
}