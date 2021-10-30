import { PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";

export class BaseEntity {
  @ApiProperty({name: 'id', type: Number})
  @PrimaryGeneratedColumn()
  id: number;
}
