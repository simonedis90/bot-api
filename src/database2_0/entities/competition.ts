import { BaseEntity } from '../../database/entities/baseEntity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Sport } from './sport';
import { BetfairEvent } from './event';
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'competition' })
export class Competition extends BaseEntity {
  @ApiProperty({name: 'sourceId', type: String})
  @Column({ type: 'varchar', length: 80 })
  sourceId: string;
  @ApiProperty({name: 'name', type: String})
  @Column({ type: 'varchar', length: 100 })
  name: string;
  @ApiProperty({name: 'sport', type: () => Sport})
  @ManyToOne(() => Sport, (s) => s.competitions)
  sport: Sport;
  @ApiProperty({name: 'events', type: () => BetfairEvent, isArray: true})
  @OneToMany(() => BetfairEvent, (e) => e.competition)
  events: BetfairEvent[];
  @ApiProperty({name: 'collect', type: Boolean})
  @Column({ type: 'boolean', default: false })
  collect: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  liveCollect: boolean;

  @ApiProperty({name: 'order', type: Number})
  @Column({type: "decimal", default: 0})
  order: number;
}
