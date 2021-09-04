"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GoalEntity = void 0;
var typeorm_1 = require("typeorm");
var player_entity_1 = require("./player.entity");
var team_entity_1 = require("./team.entity");
var match_entity_1 = require("./match.entity");
var GoalEntity = /** @class */ (function () {
    function GoalEntity() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], GoalEntity.prototype, "id");
    __decorate([
        typeorm_1.Column('int')
    ], GoalEntity.prototype, "minute");
    __decorate([
        typeorm_1.OneToOne(function () { return player_entity_1.PlayerEntity; })
    ], GoalEntity.prototype, "player");
    __decorate([
        typeorm_1.OneToOne(function () { return team_entity_1.TeamEntity; })
    ], GoalEntity.prototype, "team");
    __decorate([
        typeorm_1.OneToOne(function () { return match_entity_1.MatchEntity; })
    ], GoalEntity.prototype, "match");
    GoalEntity = __decorate([
        typeorm_1.Entity()
    ], GoalEntity);
    return GoalEntity;
}());
exports.GoalEntity = GoalEntity;
