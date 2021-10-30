import { BaseEntity } from '../../database/entities/baseEntity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Competition } from './competition';
import { Market } from './market';
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'sport' })
export class Sport extends BaseEntity {
  @Column({ type: 'varchar', length: 80 , nullable: true})
  sourceId: string;
  @Column({ type: 'varchar', length: 80, nullable: true })
  name: string;
  @OneToMany(() => Competition, (c) => c.sport)
  competitions: Competition[];
  @OneToMany(() => Market, (m) => m.sport)
  markets: Market[];
  @ApiProperty()
  @Column({ type: "decimal", default: 0, nullable: true })
  order: string;
}
