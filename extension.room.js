/**
 * Created by brandon on 2016/12/14.
 */

const C = require('constants');
const CreepsController = require('controller.creeps');
const TowerController = require('controller.tower');
const Assembly = require('creep.assembly');

Object.assign(Room.prototype, {
    run: function () {
        this.creeps = this.find(FIND_MY_CREEPS);
        this.sources = this.find(FIND_SOURCES);
        this.towers = this.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}})

        new CreepsController(this.creeps).run();
        new TowerController(this.towers).run();
        new Assembly(this).run();
    }
})