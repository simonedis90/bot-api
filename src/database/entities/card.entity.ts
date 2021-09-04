import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { MatchEntity } from "./match.entity";
import { PlayerEntity } from "./player.entity";

@Entity()
export class CardEntity extends BaseEntity{
    @Column({type: 'varchar', length: 6})
    type: 'yellow' | 'red'

    @OneToOne(() => PlayerEntity)
    @JoinColumn()
    player: PlayerEntity;

    @OneToOne(() => MatchEntity)
    @JoinColumn()
    match: MatchEntity;

    @Column('int')
    minute: number;
}