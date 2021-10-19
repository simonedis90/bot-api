import { BaseEntity } from "../../database/entities/baseEntity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Selection } from "./selection";
import { BetfairEvent } from "./event";
import { HistoryOdd } from "./historyOdds";

@Entity({ name: "odd" })
export class Odd extends BaseEntity {
  @ManyToOne(() => BetfairEvent)
  event: BetfairEvent;

  @ManyToOne(() => Selection)
  selection: Selection;

  @OneToMany(() => HistoryOdd, (o) => o.odd)
  oddHistories: HistoryOdd[];

  @Column({ type: "numeric" })
  back: number;

  @Column({ type: "numeric" })
  lay: number;

  @Column({ type: "varchar", length: 80, nullable: true })
  sourceSelectionId: string;

  @Column({ type: "varchar", length: 80, nullable: true })
  marketSourceId: string;
}
