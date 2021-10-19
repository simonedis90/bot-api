import { BaseEntity } from '../../database/entities/baseEntity';
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Market } from './market';
import { Odd } from "./odds";

@Entity({ name: 'selection' })
export class Selection extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  sourceName: string;
  @ManyToOne(() => Market, (m) => m.selections)
  market: Market;
  @OneToMany(() => Odd, o => o.selection)
  odds: Odd[];
}
