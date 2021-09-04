"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TeamEntity = void 0;
var typeorm_1 = require("typeorm");
var league_entity_1 = require("./league.entity");
var player_entity_1 = require("./player.entity");
var TeamEntity = /** @class */ (function () {
    function TeamEntity() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], TeamEntity.prototype, "id");
    __decorate([
        typeorm_1.Column({ length: 200 })
    ], TeamEntity.prototype, "sourceId");
    __decorate([
        typeorm_1.Column({ length: 150 })
    ], TeamEntity.prototype, "name");
    __decorate([
        typeorm_1.ManyToOne(function () { return league_entity_1.LeagueEntity; }, function (l) { return l.teams; }),
        typeorm_1.JoinColumn()
    ], TeamEntity.prototype, "league");
    __decorate([
        typeorm_1.OneToMany(function () { return player_entity_1.PlayerEntity; }, function (p) { return p.team; })
    ], TeamEntity.prototype, "players");
    TeamEntity = __decorate([
        typeorm_1.Entity()
    ], TeamEntity);
    return TeamEntity;
}());
exports.TeamEntity = TeamEntity;
