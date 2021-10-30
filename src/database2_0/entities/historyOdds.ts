import { BaseEntity } from '../../database/entities/baseEntity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Odd } from './odds';

@Entity({ name: 'history_odd' })
export class HistoryOdd extends BaseEntity {
  @ManyToOne(() => Odd)
  odd: Odd;

  @Column({ type: 'decimal' })
  oldLayValue: number;

  @Column({ type: 'decimal' })
  newLayValue: number;

  @Column({ type: 'decimal' })
  oldBackValue: number;

  @Column({ type: 'decimal' })
  newBackValue: number;

  @Column({ type: 'timestamptz', default: new Date() })
  timeStamp: Date;
}
