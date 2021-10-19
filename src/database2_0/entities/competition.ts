import { BaseEntity } from '../../database/entities/baseEntity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Sport } from './sport';
import { BetfairEvent } from './event';

@Entity({ name: 'competition' })
export class Competition extends BaseEntity {
  @Column({ type: 'varchar', length: 80 })
  sourceId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToOne(() => Sport, (s) => s.competitions)
  sport: Sport;

  @OneToMany(() => BetfairEvent, (e) => e.competition)
  events: BetfairEvent[];

  @Column({ type: 'boolean', default: false })
  collect: boolean;

  @Column({type: "numeric", default: 0})
  order: number;
}
