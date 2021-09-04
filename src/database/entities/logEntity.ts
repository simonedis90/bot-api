import { Column, Entity } from "typeorm";
import { BaseEntity } from "./baseEntity";

@Entity()
export class LogEntity extends BaseEntity {

    @Column({type: 'varchar', length: 5000})
    log: string;

    @Column({type: 'varchar', length: 10})
    type: string;
}