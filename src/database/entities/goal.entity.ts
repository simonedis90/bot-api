import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MatchEntity } from './match.entity';
import { PlayerEntity } from './player.entity';
import { TeamEntity } from './team.entity';

@Entity()
export class GoalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  minute: number;

  @OneToOne(() => PlayerEntity)
  player: PlayerEntity;

  @OneToOne(() => TeamEntity)
  team: TeamEntity;

  @OneToOne(() => MatchEntity)
  match: MatchEntity;
}
