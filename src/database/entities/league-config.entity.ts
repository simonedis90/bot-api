import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LeagueConfigEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 250})
    league: string;

    @Column({type: 'varchar', length: 300})
    path: string;
}