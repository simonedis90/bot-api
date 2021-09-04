import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { ProviderEntity } from "./bfair.entity";


@Entity()
export class ProviderRewriteTeam extends BaseEntity {
    @Column({type: 'varchar', nullable: false, length: 200})
    rewrite: string;

    @Column({type: 'varchar', nullable: false, length: 200})
    sourceId: string;

    @Column({type: 'boolean', nullable: false})
    owner: boolean;

    @ManyToOne(() => ProviderEntity, provider => provider.teamsRewrite)
    provider: ProviderEntity;
}