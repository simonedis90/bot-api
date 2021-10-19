import { Connection, createConnection } from 'typeorm';
import { Sport } from './entities/sport';
import { Competition } from './entities/competition';
import { BetfairEvent } from './entities/event';
import { Team } from './entities/team';
import { Market } from './entities/market';
import { Selection } from './entities/selection';
import { TeamTranslations } from './entities/teamTranslations';
import { Odd } from './entities/odds';
import { HistoryOdd } from './entities/historyOdds';

export const DatabaseBotProvider = [
  {
    provide: 'DATABASE_CONNECTION_BOT',
    useFactory: async () =>
      await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'root',
        password: 'root',
        database: 'bot',
        entities: [
          Sport,
          Competition,
          BetfairEvent,
          Team,
          Market,
          Selection,
          TeamTranslations,
          Odd,
          HistoryOdd,
        ],
        synchronize: true,
      }),
  },
];

export const SPORT = 'SPORT_BOT_REPOSITORY';
export const COMPETITION = 'COMPETITION_BOT_REPOSITORY';
export const TEAM = 'TEAM_BOT_REPOSITORY';
export const EVENT = 'EVENT_BOT_REPOSITORY';
export const HISTORY = 'HISTORY_BOT_REPOSITORY';
export const ODD = 'ODD_BOT_REPOSITORY';
export const MARKET = 'MARKET_BOT_REPOSITORY';
export const T_TRANSLATION = 'T_BOT_TRANSLATION_REPOSITORY';
export const SELECTION = 'SELECTION_BOT_REPOSITORY';
export const botRepository = [
  {
    provide: SPORT,
    useFactory: (connection: Connection) => connection.getRepository(Sport),
    inject: ['DATABASE_CONNECTION_BOT'],
  },
  {
    provide: COMPETITION,
    useFactory: (connection: Connection) =>
      connection.getRepository(Competition),
    inject: ['DATABASE_CONNECTION_BOT'],
  },
  {
    provide: TEAM,
    useFactory: (connection: Connection) => connection.getRepository(Team),
    inject: ['DATABASE_CONNECTION_BOT'],
  },
  {
    provide: EVENT,
    useFactory: (connection: Connection) =>
      connection.getRepository(BetfairEvent),
    inject: ['DATABASE_CONNECTION_BOT'],
  },
  {
    provide: ODD,
    useFactory: (connection: Connection) => connection.getRepository(Odd),
    inject: ['DATABASE_CONNECTION_BOT'],
  },
  {
    provide: HISTORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(HistoryOdd),
    inject: ['DATABASE_CONNECTION_BOT'],
  },
  {
    provide: MARKET,
    useFactory: (connection: Connection) => connection.getRepository(Market),
    inject: ['DATABASE_CONNECTION_BOT'],
  },
  {
    provide: T_TRANSLATION,
    useFactory: (connection: Connection) =>
      connection.getRepository(TeamTranslations),
    inject: ['DATABASE_CONNECTION_BOT'],
  },
  {
    provide: SELECTION,
    useFactory: (connection: Connection) => connection.getRepository(Selection),
    inject: ['DATABASE_CONNECTION_BOT'],
  },
];
