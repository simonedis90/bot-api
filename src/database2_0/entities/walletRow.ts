// import { BaseEntity } from "../../database/entities/baseEntity";
// import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
// import { ApiProperty } from "@nestjs/swagger";
// import { Wallet } from "./wallet";
// import { Outcome } from "./outcome";
//
// @Entity('wallet_row')
// export class WalletRow extends BaseEntity{
//   @Column({type: "date"})
//   date?: Date;
//   @ApiProperty()
//   @Column({type: "decimal"})
//   target?: number;
//   @ApiProperty()
//   @Column({type: "decimal"})
//   targetProfit?: number;
//   @ApiProperty()
//   @Column({type: "decimal"})
//   profit?: number;
//   @ApiProperty()
//   @Column({type: "decimal"})
//   cash?: number;
//   @ApiProperty()
//   @Column({type: "decimal"})
//   availableAmount?: number;
//   @ApiProperty()
//   @Column({type: "decimal"})
//   percentage?: number;
//   @ApiProperty()
//   @Column({type: "decimal"})
//   marginOnTarget?: number;
//
//   @ApiProperty({
//     type: Outcome,
//     isArray: true
//   })
//   @OneToMany(() => Outcome, f => f.row)
//   outcomes: Array<Outcome>;
//
//   @ManyToOne(() => Wallet, w => w.rows)
//   wallet: Wallet;
// }
