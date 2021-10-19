import { BaseEntity } from '../../database/entities/baseEntity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Sport } from './sport';
import { Selection } from './selection';

@Entity('market')
export class Market extends BaseEntity {
  @Column({ type: 'varchar', length: 80, nullable: true })
  marketSourceName: string;
  @Column({ type: 'varchar', length: 80, nullable: true })
  marketName: string;
  @Column({ type: 'varchar', length: 80, nullable: true })
  marketIdentifier: string;
  @Column({ type: 'numeric', default: -1 })
  order: number;
  @Column({ type: 'boolean', default: true })
  collect: boolean;
  @ManyToOne(() => Sport, (f) => f.markets)
  sport: Sport;
  @OneToMany(() => Selection, (f) => f.market)
  selections: Selection[];
}
