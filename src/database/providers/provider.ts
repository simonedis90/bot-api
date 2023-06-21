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
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        username: process.env.DB_HOST || 'addo',
        password: process.env.DB_PASSWORD || 'wo23Kiep_;34',
        database: process.env.DB_NAME || 'bot',
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
          ProviderEntity,
        ],
        synchronize: true,
      }),
  },
];
