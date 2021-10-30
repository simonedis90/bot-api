import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/entities/baseEntity';
import { Competition } from './competition';
import { Odd } from './odds';
import { ApiProperty } from "@nestjs/swagger";
import { IBetFairLiveResult, IStatsBetfair } from "../../models/betfair";

@Entity({ name: 'event' })
export class BetfairEvent extends BaseEntity {
  @ApiProperty({name: 'sourceId', type: String})
  @Column({ type: 'varchar', length: 80, nullable: true })
  sourceId: string;
  @Column({ type: 'varchar', length: 90, nullable: true })
  @ApiProperty({name: 'name', type: String})
  name: string;
  @ApiProperty({name: 'openDate', type: Date})
  @Column({ type: 'timestamptz' })
  openDate: Date;
  @Column({ type: 'varchar', length: 80, nullable: true })
  timeZone: string;
  @Column({ type: 'varchar', length: 80, nullable: true })
  countryCode: string;
  @ApiProperty({name: 'competition', type: () => Competition})
  @ManyToOne(() => Competition, (c) => c.events)
  competition: Competition;
  @ApiProperty({name: 'odds', type: () => Odd, isArray: true})
  @OneToMany(() => Odd, (c) => c.event)
  odds: Odd[];
  stats: IStatsBetfair;
  live: IBetFairLiveResult;
}
