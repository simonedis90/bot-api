import { Column, Entity, OneToOne } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { MatchEntity } from "./match.entity";

@Entity()
export class CornerEntity extends BaseEntity{
    @OneToOne(() => MatchEntity)
    match: MatchEntity;

    @Column('int')
    minute: number;
}