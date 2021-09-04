import { LeagueEntity } from '../entities/league.entity';
import { Connection } from 'typeorm';
import { TeamEntity } from '../entities/team.entity';
import { MatchEntity } from '../entities/match.entity';
import { StatsEntity } from '../entities/stats.entity';
import { LeagueConfigEntity } from '../entities/league-config.entity';
import { LogEntity } from '../entities/logEntity';
import { ScrapMatchEntity } from '../entities/scrap-match-entity';
import { BetEntity } from '../entities/bet.entity'
import { EventEntity } from '../entities/events.entity';
import { EventConfigEntity } from '../entities/event-config.entity';
import { ProviderRewriteTeam } from '../entities/rewriteTeam.entity';
import { ProviderRewriteLeague } from '../entities/rewriteLeague.entity';

export const LEAGUE_REPOSITORY = 'LEAGUE_REPOSITORY';
export const TEAM_REPOSITORY = 'TEAM_REPOSITORY';
export const MATCH_REPOSITORY = 'MATCH_REPOSITORY';
export const CONFIG_LEAGUE = 'CONFIG_LEAGUE';
export const STATS_REPOSITORY = 'STATS_REPOSITORY';
export const LOG_REPOSITORY = 'LOG_REPOSITORY';
export const SRAP_MATCH_REPOSITORY = 'SRAP_MATCH_REPOSITORY';
export const BET_REPOSITORY = 'BET_REPOSITORY';
export const EVENT_REPOSITORY = 'EVENT_REPOSITORY';
export const EVENT_CONFIG_REPOSITORY = 'EVENT_CONFIG_REPOSITORY';
export const PROVIDER_REWRITE_TEAM = 'PROVIDER_REWRITE_TEAM';
export const PROVIDER_REWRITE_LEAGUE = 'PROVIDER_REWRITE_LEAGUE';

export const scraperRepository = [
  {
    provide: LEAGUE_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(LeagueEntity),
    inject: ['DATABASE_CONNECTION']
  },
  {
    provide: TEAM_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(TeamEntity),
    inject: ['DATABASE_CONNECTION']
  },
  {
    provide: MATCH_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(MatchEntity),
    inject: ['DATABASE_CONNECTION']
  },
  {
    provide: CONFIG_LEAGUE,
    useFactory: (connection: Connection) => connection.getRepository(LeagueConfigEntity),
    inject: ['DATABASE_CONNECTION']
  },
  {
    provide: STATS_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(StatsEntity),
    inject: ['DATABASE_CONNECTION']
  },
  {
    provide: LOG_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(LogEntity),
    inject: ['DATABASE_CONNECTION']
  },
  {
    provide: SRAP_MATCH_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(ScrapMatchEntity),
    inject: ['DATABASE_CONNECTION']
  },
  {
    provide: BET_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(BetEntity),
    inject: ['DATABASE_CONNECTION']
  },
  {
    provide: EVENT_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(EventEntity),
    inject: ['DATABASE_CONNECTION']
  },
  {
    provide: EVENT_CONFIG_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(EventConfigEntity),
    inject: ['DATABASE_CONNECTION']
  },
  {
    provide: PROVIDER_REWRITE_TEAM,
    useFactory: (connection: Connection) => connection.getRepository(ProviderRewriteTeam),
    inject: ['DATABASE_CONNECTION']
  },
  {
    provide: PROVIDER_REWRITE_LEAGUE,
    useFactory: (connection: Connection) => connection.getRepository(ProviderRewriteLeague),
    inject: ['DATABASE_CONNECTION']
  }
];

