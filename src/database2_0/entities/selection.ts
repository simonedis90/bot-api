import { BaseEntity } from "../../database/entities/baseEntity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Market } from "./market";
import { Odd } from "./odds";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "selection" })
export class Selection extends BaseEntity {
  @ApiProperty()
  @Column({ type: "varchar", length: 100, nullable: true })
  name: string;
  @ApiProperty()
  @Column({ type: "varchar", length: 100, nullable: true })
  sourceName: string;
  @ApiProperty()
  @Column({ type: "decimal", default: 0, nullable: true })
  order: string;
  @ApiProperty({ type: () => Market })
  @ManyToOne(() => Market, (m) => m.selections)
  market: Market;
  @OneToMany(() => Odd, o => o.selection)
  odds: Odd[];
}
