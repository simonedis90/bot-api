import { Column, Entity } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { IEventConfig } from "./events.entity";

@Entity()
export class EventConfigEntity extends BaseEntity {


    @Column({type: 'varchar', length: 15})
    eventId: string;

    @Column({type: 'varchar', length: 100})
    username: string;

    @Column({
        type: 'jsonb'
    })
    config: IEventConfig;
}