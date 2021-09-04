import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TeamEntity } from './team.entity';

@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @ManyToOne(() => TeamEntity, t => t.players)
  team: TeamEntity;
}
