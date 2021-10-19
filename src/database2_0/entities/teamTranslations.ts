import { BaseEntity } from '../../database/entities/baseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Team } from './team';

@Entity({ name: 'team_translation' })
export class TeamTranslations extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  translation;
  @ManyToOne(() => Team, (t) => t.translations)
  team: Team;
  @Column({ type: 'varchar', length: 100 })
  provider: string;
}
