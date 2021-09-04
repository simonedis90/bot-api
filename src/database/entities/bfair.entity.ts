import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { ProviderRewriteLeague } from "./rewriteLeague.entity";
import { ProviderRewriteTeam } from "./rewriteTeam.entity";
import { TeamEntity } from "./team.entity";

@Entity()
export class ProviderEntity extends BaseEntity {
    @Column({type: 'varchar', nullable: false, length: 200})
    name: string;

    @OneToMany(() => ProviderRewriteTeam, f => f.provider)
    teamsRewrite: ProviderRewriteTeam[]

    @OneToMany(() => ProviderRewriteLeague, f => f.provider)
    leaguesRewrite: ProviderRewriteLeague[]

    @OneToMany(() => TeamEntity, f => f.provider)
    teams: TeamEntity[]
}
