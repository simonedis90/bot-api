import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SeasonEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: 'varchar', length: 9})
    season: string;
}