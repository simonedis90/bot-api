import {  Column, Entity } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "../../database/entities/baseEntity";

@Entity('log')
export class Log extends BaseEntity{
  @ApiProperty()
  @Column({type: "varchar", length: 100})
  className: string;
  @ApiProperty()
  @Column({type: "varchar", length: 100})
  method: string;
  @ApiProperty()
  @Column({type: "jsonb"})
  error: any;
  @ApiProperty()
  @Column({type: "jsonb"})
  data: any;
  @ApiProperty()
  @Column({type: "jsonb"})
  args: any;
  @ApiProperty()
  @Column({type: "varchar", length: 20})
  level: 'INFO' | 'WARNING' | 'ERROR' | 'FATAL'
}
