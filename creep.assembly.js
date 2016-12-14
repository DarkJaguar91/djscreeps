/**
 * Created by brandon on 2016/12/13.
 */
const C = require('constants');

module.exports = CreepAssembly;

function CreepAssembly(room) {
    this.room = room;
    this.checkRoomMemory();
    this.percentCapacityUsage = 0.6;
}

CreepAssembly.prototype = {
    checkRoomMemory: function () {
        this.room.memory.builders = this.room.memory.builders || 2;
        this.room.memory.upgraders = this.room.memory.upgraders || 1;
        for (let creepName in Memory.creeps) {
            if (!Game.creeps[creepName]) {
                delete Memory.creeps[creepName]
            }
        }
    },
    createBody: function (move, carry, work = 0, attack = 0, ranged = 0, tough = 0, claim = 0) {
        let body = [];
        const moveArr = _.fill(new Array(move), MOVE);
        const carryArr = _.fill(new Array(carry), CARRY);
        const workArr = _.fill(new Array(work), WORK);

        // TODO add attack, ranged, tough and claim

        body = body.concat(workArr, carryArr, moveArr);

        return body;
    },
    buildHarvester: function (spawn) {
        const energy = this.room.energyAvailable * this.percentCapacityUsage;
        const bodyParts = Math.max(1, Math.floor(energy / 200));

        const body = this.createBody(bodyParts, bodyParts, bodyParts);

        spawn.createCreep(body, null, {role: C.CREEP_ROLE.HARVESTER});
    },
    buildMiner: function (spawn) {
        const energy = this.room.energyAvailable * this.percentCapacityUsage;
        const numWork = Math.min(5, Math.max(2, Math.floor(energy / 125)));
        const numMove = Math.max(1, Math.ceil(numWork / 2));

        const body = this.createBody(numMove, 0, numWork);
        const mine = spawn.pos.findClosestByPath(FIND_SOURCES, {
            filter: (s) => {
                return s._getContainer() != undefined && (!s.memory.miner || !Game.creeps[s.memory.miner]);
            }
        })
        if (mine) {
            mine.memory.miner = spawn.createCreep(body, null, {
                role: C.CREEP_ROLE.MINER,
                source: mine.id,
                container: mine.memory.container
            });
        }
    },
    buildCarrier: function (spawn) {
        const energy = this.room.energyAvailable * this.percentCapacityUsage;
        const numCarry = Math.min(32, Math.max(2, Math.floor(energy / 75)));
        const numMove = Math.max(1, Math.ceil(numCarry / 2));

        const body = this.createBody(numMove, numCarry);
        const mine = spawn.pos.findClosestByPath(FIND_SOURCES, {
            filter: (s) => {
                return s._getContainer() != undefined && (!s.memory.carrier || !Game.creeps[s.memory.carrier]);
            }
        })

        if (mine) {
            mine.memory.carrier = spawn.createCreep(body, null, {
                role: C.CREEP_ROLE.CARRIER,
                container: mine.memory.container
            });
        }
    },
    buildBuilder: function (spawn) {
        const energy = this.room.energyAvailable * this.percentCapacityUsage;
        const bodyParts = Math.max(1, Math.floor(energy / 200));

        const body = this.createBody(bodyParts, bodyParts, bodyParts);

        spawn.createCreep(body, null, {role: C.CREEP_ROLE.BUILDER})
    },
    buildUpgrader: function (spawn) {
        const energy = this.room.energyAvailable * this.percentCapacityUsage;
        const bodyParts = Math.max(1, Math.floor(energy / 200));

        const body = this.createBody(bodyParts, bodyParts, bodyParts);

        spawn.createCreep(body, null, {role: C.CREEP_ROLE.UPGRADER})
    },
    run: function () {
        const spawns = this.room.find(FIND_MY_SPAWNS);

        let harvesters = _.sum(this.room.creeps, (c) => c.memory.role == C.CREEP_ROLE.HARVESTER);
        let miners = _.sum(this.room.creeps, (c) => c.memory.role == C.CREEP_ROLE.MINER);
        let carriers = _.sum(this.room.creeps, (c) => c.memory.role == C.CREEP_ROLE.CARRIER);
        let builders = _.sum(this.room.creeps, (c) => c.memory.role == C.CREEP_ROLE.BUILDER);
        let upgraders = _.sum(this.room.creeps, (c) => c.memory.role == C.CREEP_ROLE.UPGRADER);
        let mineSources = _.filter(this.room.sources, (c) => c._getContainer() != undefined);
        let mines = mineSources.length;
        let sources = this.room.sources.length - mines;

        for (let spawn of spawns) {
            if ((miners == 0 || carriers == 0) && harvesters == 0) {
                this.buildHarvester(spawn);
                ++harvesters;
                continue;
            }
            let created = false;
            for (let src of mineSources) {
                if (!src.memory.miner || !Game.creeps[src.memory.miner]) {
                    this.buildMiner(spawn);
                    ++miners;
                    created = true;
                    break;
                }
                if (!src.memory.carrier || !Game.creeps[src.memory.carrier]) {
                    this.buildCarrier(spawn);
                    ++carriers;
                    created = true;
                    break;
                }
            }
            if (created) {
                continue;
            }
            if (harvesters < sources) {
                this.buildHarvester(spawn);
                ++harvesters;
                continue;
            }
            if (builders < this.room.memory.builders) {
                this.buildBuilder(spawn);
                continue;
            }
            if (upgraders < this.room.memory.upgraders) {
                this.buildUpgrader(spawn);
            }
        }
    },
}