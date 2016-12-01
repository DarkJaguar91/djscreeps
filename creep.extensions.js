const resourceManager = require('resource.manager')

Creep.prototype.gatherEnergy = function () {
    const needsToHarvest = this.carry.energy < this.carryCapacity
    let sourceId = this.memory.targetSource

    if(needsToHarvest) {
        if (!sourceId) {
            const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
                filter: (source) => {
                    return resourceManager.canHarvest(source)
                }
            })
            if (source) {
                this.say('Energizing')
                sourceId = source.id
                this.memory.targetSource = sourceId
                resourceManager.book(source.id)
            }
        }
        let source = Game.getObjectById(sourceId)
        if (source && this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source)
        } else if (!source) {
            this.say('No MC²')
        }
        return true
    }
    if (sourceId) {
        this.say('Energized')
        resourceManager.release(sourceId)
        delete this.memory.targetSource
    }
    return false
}