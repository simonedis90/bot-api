"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MatchEntity = void 0;
var typeorm_1 = require("typeorm");
var goal_entity_1 = require("./goal.entity");
var season_entity_1 = require("./season.entity");
var stats_entity_1 = require("./stats.entity");
var team_entity_1 = require("./team.entity");
var MatchEntity = /** @class */ (function () {
    function MatchEntity() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], MatchEntity.prototype, "id");
    __decorate([
        typeorm_1.Column({ length: 200 })
    ], MatchEntity.prototype, "sourceId");
    __decorate([
        typeorm_1.Column({
            type: 'timestamp'
        })
    ], MatchEntity.prototype, "matchDate");
    __decorate([
        typeorm_1.OneToOne(function () { return team_entity_1.TeamEntity; }),
        typeorm_1.JoinColumn()
    ], MatchEntity.prototype, "home");
    __decorate([
        typeorm_1.OneToOne(function () { return team_entity_1.TeamEntity; }),
        typeorm_1.JoinColumn()
    ], MatchEntity.prototype, "away");
    __decorate([
        typeorm_1.OneToOne(function () { return season_entity_1.SeasonEntity; }),
        typeorm_1.JoinColumn()
    ], MatchEntity.prototype, "season");
    __decorate([
        typeorm_1.OneToMany(function () { return goal_entity_1.GoalEntity; }, function (g) { return g.match; })
    ], MatchEntity.prototype, "goals");
    __decorate([
        typeorm_1.OneToMany(function () { return goal_entity_1.GoalEntity; }, function (g) { return g.match; })
    ], MatchEntity.prototype, "corners");
    __decorate([
        typeorm_1.OneToOne(function () { return stats_entity_1.StatsEntity; }),
        typeorm_1.JoinColumn()
    ], MatchEntity.prototype, "stats");
    MatchEntity = __decorate([
        typeorm_1.Entity()
    ], MatchEntity);
    return MatchEntity;
}());
exports.MatchEntity = MatchEntity;
