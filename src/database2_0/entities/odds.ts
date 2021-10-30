import { BaseEntity } from "../../database/entities/baseEntity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Selection } from "./selection";
import { BetfairEvent } from "./event";
import { HistoryOdd } from "./historyOdds";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "odd" })
export class Odd extends BaseEntity {
  @ManyToOne(() => BetfairEvent)
  event: BetfairEvent;

  @ApiProperty({type: () => Selection, name: 'selection'})
  @ManyToOne(() => Selection)
  selection: Selection;

  @OneToMany(() => HistoryOdd, (o) => o.odd)
  oddHistories: HistoryOdd[];
  @ApiProperty({name: 'back', type: Number})
  @Column({ type: "decimal" })
  back: number;
  @ApiProperty({name: 'lay', type: Number})
  @Column({ type: "decimal" })
  lay: number;
  @ApiProperty({name: 'sourceSelectionId', type: String})
  @Column({ type: "varchar", length: 80, nullable: true })
  sourceSelectionId: string;
  @ApiProperty({name: 'marketSourceId', type: String})
  @Column({ type: "varchar", length: 80, nullable: true })
  marketSourceId: string;
  @ApiProperty({name: 'inPlay', type: Boolean})
  @Column({ type: "boolean", nullable: true })
  inPlay: boolean;
  @ApiProperty({name: 'active', type: String})
  @Column({ type: "boolean", nullable: true })
  active: boolean;
}
