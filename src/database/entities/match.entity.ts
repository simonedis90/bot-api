import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CornerEntity } from './corner.entity';
import { GoalEntity } from './goal.entity';
import { SeasonEntity } from './season.entity';
import { StatsEntity } from './stats.entity';
import { TeamEntity } from './team.entity';

@Entity()
export class MatchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  sourceId: string;

  @Column({
    type: 'timestamp'
  })
  matchDate: Date;

  @ManyToOne(() => TeamEntity)
  @JoinColumn()
  home: TeamEntity;

  @ManyToOne(() => TeamEntity)
  @JoinColumn()
  away: TeamEntity;

  @ManyToOne(() => SeasonEntity)
  @JoinColumn()
  season: SeasonEntity;

  @Column('jsonb', {nullable: false})
  goals: Array<{minute: number, player: string, team: string}>;

  @OneToMany(() => GoalEntity, g => g.match)
  corners: CornerEntity[];

  @OneToOne(() => StatsEntity)
  @JoinColumn()
  stats: StatsEntity;

  calc?: ICalc;

  linkedMatches?: {
    home: MatchEntity[],
    away: MatchEntity[]
  }
}

interface IResult {
  score: IRange;
  concede: IRange;
}

interface IRange {
  from: number;
  to: number;
}

export interface ICalcTeam {
  home: IResult;
  away: IResult;
}

export interface ICalc {
  ft: ICalcTeam;
  ht: ICalcTeam;
  resultFrequency: {
    home: {
      [key: string]: number
    };
    away: {
      [key: string]: number
    }
  },
  ov0_5: {ft: number;ht: number};
  ov1_5: {ft: number;ht: number};
  ov2_5: {ft: number;ht: number};
}
