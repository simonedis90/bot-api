import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/entities/baseEntity';
import { Competition } from './competition';
import { Odd } from './odds';

@Entity({ name: 'event' })
export class BetfairEvent extends BaseEntity {
  @Column({ type: 'varchar', length: 80, nullable: true })
  sourceId: string;
  @Column({ type: 'varchar', length: 90, nullable: true })
  name: string;
  @Column({ type: 'date' })
  openDate: Date;
  @Column({ type: 'varchar', length: 80, nullable: true })
  timeZone: string;
  @Column({ type: 'varchar', length: 80, nullable: true })
  countryCode: string;
  @ManyToOne(() => Competition, (c) => c.events)
  competition: Competition;
  @OneToMany(() => Odd, (c) => c.event)
  odds: Odd[];
}
