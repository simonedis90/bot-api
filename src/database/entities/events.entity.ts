import {
  EventDTO,
  ICalc,
  MarketDTO,
  MarketPriceDTO,
  RunnerMarketPriceDTO,
} from 'src/models/response.dto';
import { IMatch } from 'src/models/scrap';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './baseEntity';

@Entity()
export class EventEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  home: string;

  @Column({ type: 'varchar', length: 200 })
  away: string;

  @Column({ type: 'date' })
  matchDate: Date;

  @Column({ type: 'int' })
  eventId: number;

  @Column({ type: 'jsonb' })
  event: EventDTO;

  @Column({ type: 'jsonb' })
  calc: {
    ht: ICalc;
    ft: ICalc;
    tennis?: {
      odd1: any;
      odd2: any;
    };
  };

  @Column({
    type: 'jsonb',
  })
  markets: MarketDTO[];

  @Column({
    type: 'jsonb',
  })
  marketPrices: MarketPriceDTO[];

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  startMarketPrices: MarketPriceDTO[];

  eventConfig: IEventConfig;

  match: IMatch;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  sourceId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  competitionId: string;
}

export function defaultConfig(knownLeague?: boolean): IEventConfig {
  return {
    enabled: knownLeague,
    ht: {
      enabled: knownLeague,
      marketsEnabled: {
        ov_0: knownLeague,
        ov_1: knownLeague,
        ov_2: knownLeague,
        un_1: knownLeague,
        un_2: knownLeague,
      },
      stakes: {
        ov_0: 5,
        ov_1: 2.5,
        ov_2: 2,
      },
      minOdds: {
        ov_0: 1.6,
        ov_1: 4,
        ov_2: 10,
      },
    },
    ft: {
      enabled: knownLeague,
      marketsEnabled: {
        ov_0: knownLeague,
        ov_1: knownLeague,
        ov_2: knownLeague,
        un_1: knownLeague,
        un_2: knownLeague,
      },
      stakes: {
        ov_0: 2,
        ov_1: 8,
        ov_2: 4,
        ov_1special: 2,
        ov_2special: 2,
        ov_3special: 2,
      },
      minOdds: {
        ov_0: 2.5,
        ov_1: 1.55,
        ov_2: 1.85,
        ov_1special: 4,
        ov_2special: 6,
        un_2: 1.85,
      },
    },
  };
}

export interface IEventConfig {
  enabled: boolean;
  ht: IMatchSection;
  ft: IMatchSection;
}

export class MarketObject<T> {
  ov_0?: T;
  ov_1?: T;
  ov_2?: T;
  ov_3?: T;
  un_1?: T;
  un_2?: T;
  un_3?: T;
  ov_0special?: T;
  ov_1special?: T;
  ov_2special?: T;
  ov_3special?: T;
}

export interface IMatchSection {
  enabled: boolean;
  marketsEnabled: MarketObject<boolean>;
  stakes: MarketObject<number>;
  minOdds: MarketObject<number>;
}
