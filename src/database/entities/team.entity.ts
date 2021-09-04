import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProviderEntity } from './bfair.entity';
import { LeagueEntity } from './league.entity';
import { PlayerEntity } from './player.entity';

@Entity()
export class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  sourceId: string;

  @Column({ length: 150 })
  name: string;

  @ManyToOne(() => LeagueEntity, l => l.teams)
  @JoinColumn()
  league: LeagueEntity;

  @OneToMany(() => PlayerEntity, p => p.team)
  players: PlayerEntity[];

  @Column({ type: String, nullable: true })
  mapping: string;

  @ManyToOne(() => ProviderEntity, l => l.teams)
  provider: ProviderEntity
}
