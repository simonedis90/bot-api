"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LeagueEntity = void 0;
var typeorm_1 = require("typeorm");
var team_entity_1 = require("./team.entity");
var LeagueEntity = /** @class */ (function () {
    function LeagueEntity() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], LeagueEntity.prototype, "id");
    __decorate([
        typeorm_1.Column({ length: 200 })
    ], LeagueEntity.prototype, "sourceId");
    __decorate([
        typeorm_1.Column({ length: 150 })
    ], LeagueEntity.prototype, "name");
    __decorate([
        typeorm_1.Column({ type: 'int', "default": -1 })
    ], LeagueEntity.prototype, "order");
    __decorate([
        typeorm_1.Column({ length: 150, "default": '' })
    ], LeagueEntity.prototype, "nation");
    __decorate([
        typeorm_1.OneToMany(function () { return team_entity_1.TeamEntity; }, function (l) { return l.league; })
    ], LeagueEntity.prototype, "teams");
    LeagueEntity = __decorate([
        typeorm_1.Entity()
    ], LeagueEntity);
    return LeagueEntity;
}());
exports.LeagueEntity = LeagueEntity;
