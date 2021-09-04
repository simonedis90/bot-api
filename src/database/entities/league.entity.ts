import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TeamEntity } from './team.entity';

@Entity()
export class LeagueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  sourceId: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'int', default: -1 })
  order: number;

  @Column({ length: 150, default: '' })
  nation: string;

  @OneToMany(() => TeamEntity, l => l.league)
  teams: TeamEntity[];

  @Column({type: 'varchar', length: 150, nullable: true})
  mapping: string;

  @Column({type: 'int', default: -1, nullable: true})
  providerId: number;

  @Column({type: 'boolean', default: false, nullable: true})
  enabled: boolean;
}
