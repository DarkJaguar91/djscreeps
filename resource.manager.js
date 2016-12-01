const getNumSlots = function (source) {
    let free = 0
    for (let x = source.pos.x - 1; x <= source.pos.x + 1; ++x) {
        for (let y = source.pos.y - 1; y <= source.pos.y + 1; ++y) {
            if (x == source.pos.x && source.pos.y == y) continue

            const objects = source.room.lookAt(x, y)
            let blocked = false
            for (let obj of objects) {
                if (blocked) break
                if (obj.type == 'structure' && obj.structure.structureType != STRUCTURE_ROAD) {
                    blocked = true
                } else if (obj.type == 'terrain' && obj.terrain == 'wall') {
                    blocked = true
                }
            }
            if (!blocked) {
                ++free
            }
        }
    }

    return free
}
const loadResourcesForRoom = function (source) {
    if (!Memory.sources[source.id]) {
        Memory.sources[source.id] = {
            totalSlots: getNumSlots(source),
            harvesters: 0
        }
    }
    return Memory.sources[source.id]
}
module.exports = {
    canHarvest: function (source) {
        Memory.sources = Memory.sources || {}
        let src = loadResourcesForRoom(source)
        return src.harvesters < src.totalSlots
    },
    book: function (sourceId) {
        Memory.sources[sourceId].harvesters++
    },
    release: function(sourceId) {
        Memory.sources[sourceId].harvesters--
    }
}