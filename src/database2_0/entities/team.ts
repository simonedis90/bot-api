import { BaseEntity } from '../../database/entities/baseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { TeamTranslations } from './teamTranslations';

@Entity({ name: 'team' })
export class Team extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => TeamTranslations, (f) => f.team)
  translations: TeamTranslations;
}
