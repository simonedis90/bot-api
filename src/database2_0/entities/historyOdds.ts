import { BaseEntity } from '../../database/entities/baseEntity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Odd } from './odds';

@Entity({ name: 'history_odd' })
export class HistoryOdd extends BaseEntity {
  @ManyToOne(() => Odd)
  odd: Odd;

  @Column({ type: 'numeric' })
  oldLayValue: number;

  @Column({ type: 'numeric' })
  newLayValue: number;

  @Column({ type: 'numeric' })
  oldBackValue: number;

  @Column({ type: 'numeric' })
  newBackValue: number;

  @Column({ type: 'date', default: new Date() })
  timeStamp: Date;
}
