import { BaseEntity } from "../../database/entities/baseEntity";
import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty, ApiResponse } from "@nestjs/swagger";
import { Outcome } from "./outcome";

@Entity('wallet')
export class Wallet extends BaseEntity{
  @ApiProperty()
  @Column({type: "varchar", length: 80})
  name: string;
  @ApiProperty()
  @Column({type: "decimal"})
  cash: number;
  @ApiProperty()
  @Column({type: "decimal"})
  dailyTarget: number;
  @ApiProperty()
  @Column({type: "decimal"})
  risk: number;
  @ApiProperty({type: Outcome, isArray: true})
  @OneToMany(() => Outcome, r => r.wallet)
  outcomes: Outcome[];

  @Column({type: "decimal", nullable: true})
  kind: number
}
