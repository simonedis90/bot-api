import { Column, Entity, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "../../database/entities/baseEntity";
import { Wallet } from "./wallet";

@Entity()
export class Outcome extends BaseEntity{
  @ManyToOne(() => Wallet, f => f.outcomes)
  wallet: Wallet;

  @ApiProperty()
  @Column({type: "decimal"})
  value: number;

  @ApiProperty()
  @Column({type: "varchar", length: 100, nullable: true})
  description: string;

  @ApiProperty()
  @Column({type: "jsonb", nullable: true})
  data: any;

  @ApiProperty({type: Date})
  @Column({type: "date"})
  date?: Date;

  @ApiProperty({type: String})
  @Column({type: "varchar", length: 100, nullable: true})
  betId: string;
}
