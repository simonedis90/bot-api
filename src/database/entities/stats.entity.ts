import { Column, Entity, OneToOne } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { GoalEntity } from "./goal.entity";
import { MatchEntity } from "./match.entity";

@Entity()
export class StatsEntity extends BaseEntity {

    @OneToOne(() => MatchEntity)
    match: MatchEntity;

    @Column('jsonb', {nullable: false})
    home: IStats;

    @Column('jsonb', {nullable: false})
    away: IStats;
}

export interface IStats {
    calc?: any;
    ballPossession: number;
    shoots: number;
    shootsOnTarget: number;
    shootsOut: number;
    shootsLocked: number;
    freekick: number;
    corners: number;
    offsides: number;
    lineOut: number;
    faults: number;
    yellowCards: number;
    attack: number;
    dangerousAttack: number;
    goals?: GoalEntity;
    ht: {
        gol: number
    },
    ft: {
        gol: number
    }
}