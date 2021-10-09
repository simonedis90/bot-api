import { createConnection } from 'typeorm';
import { join } from 'path';
import { SeasonEntity } from '../entities/season.entity';
import { TeamEntity } from '../entities/team.entity';
import { LeagueEntity } from '../entities/league.entity';
import { CardEntity } from '../entities/card.entity';
import { GoalEntity } from '../entities/goal.entity';
import { MatchEntity } from '../entities/match.entity';
import { PlayerEntity } from '../entities/player.entity';
import { CornerEntity } from '../entities/corner.entity';
import { StatsEntity } from '../entities/stats.entity';
import { LeagueConfigEntity } from '../entities/league-config.entity';
import { LogEntity } from '../entities/logEntity';
import { ScrapMatchEntity } from '../entities/scrap-match-entity';
import { BetEntity } from '../entities/bet.entity';
import { EventEntity } from '../entities/events.entity';
import { EventConfigEntity } from '../entities/event-config.entity';
import { ProviderEntity } from '../entities/bfair.entity';
import { ProviderRewriteLeague } from '../entities/rewriteLeague.entity';
import { ProviderRewriteTeam } from '../entities/rewriteTeam.entity';

export const DatabaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'root',
        password: 'root',
        database: 'test_db',
        entities: [
          SeasonEntity,
          TeamEntity,
          LeagueEntity,
          CardEntity,
          GoalEntity,
          MatchEntity,
          PlayerEntity,
          CornerEntity,
          StatsEntity,
          LeagueConfigEntity,
          LogEntity,
          ScrapMatchEntity,
          BetEntity,
          EventEntity,
          EventConfigEntity,
          ProviderRewriteLeague,
          ProviderRewriteTeam,
          ProviderEntity
        ],
        synchronize: true
      })
  }
];
