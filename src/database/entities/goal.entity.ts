import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PlayerEntity } from './player.entity';
import { TeamEntity } from './team.entity';
import { MatchEntity } from './match.entity';

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
