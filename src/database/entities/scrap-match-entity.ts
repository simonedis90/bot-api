import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ICalc } from './match.entity';
import { IStats } from './stats.entity';
export interface IMatch {
  end?: boolean;
  time?: number;
  matchDate: any;
  sourceId: string;
  league: string;
  home: string;
  away: string;
  stats: {
    home: Partial<IStats>,
    away: Partial<IStats>
  },
  goals: any[],

  linkedMatches?: {
    home: IMatch[],
    away: IMatch[]
  }
};
@Entity()
export class ScrapMatchEntity implements IMatch{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 50})
  sourceId: string;

  @Column({
    type: 'timestamp'
  })
  matchDate: Date;
  
  @Column({type: 'varchar', length: 200})
  home: string;

  @Column({type: 'varchar', length: 200})
  away: string;

  @Column({type: 'varchar', length: 400})
  league: string;

  @Column({type: 'jsonb'})
  stats: {
    home: IStats,
    away: IStats,
    
      totals: {
        u: number,
        o: number
      },
      btts: {
        y: number,
        n: number
      }
    
  };

  @Column({type: 'jsonb'})
  goals: Array<{minute: number, player: string, team: string}>

  @Column({type: 'int'})
  round: number;

  calc?: ICalc;
}

