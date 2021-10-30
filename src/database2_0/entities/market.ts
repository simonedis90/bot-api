import { BaseEntity } from '../../database/entities/baseEntity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Sport } from './sport';
import { Selection } from './selection';
import { ApiProperty } from "@nestjs/swagger";

@Entity('market')
export class Market extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 80, nullable: true })
  marketSourceName: string;
  @ApiProperty()
  @Column({ type: 'varchar', length: 80, nullable: true })
  marketName: string;
  @ApiProperty()
  @Column({ type: 'varchar', length: 80, nullable: true })
  marketIdentifier: string;
  @ApiProperty()
  @Column({ type: 'decimal', default: -1 })
  order: number;
  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  collect: boolean;
  @ManyToOne(() => Sport, (f) => f.markets)
  sport: Sport;
  @ApiProperty({type: () => Selection, isArray: true})
  @OneToMany(() => Selection, (f) => f.market)
  selections: Selection[];
}
