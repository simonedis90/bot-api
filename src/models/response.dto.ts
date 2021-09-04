import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IMatch } from './scrap';

export class LoginResponseDTO {
  @ApiResponseProperty({ type: String })
  token: string;
  @ApiResponseProperty({ type: String })
  product: string;
  @ApiResponseProperty({ type: String })
  status: string;
  @ApiResponseProperty({ type: String })
  error: string;
}

export class EventType {
  @ApiResponseProperty({ type: Number })
  id: string;
  @ApiResponseProperty({ type: String })
  name: string;
}

export class EventTypeResponseDTO {
  @ApiResponseProperty({ type: EventType })
  eventType: EventType;
  @ApiResponseProperty({ type: Number })
  marketCount: number;
}

export class EventDTO {
  @ApiResponseProperty({ type: Number })
  id: string;
  @ApiResponseProperty({ type: String })
  name: string;
  @ApiResponseProperty({ type: String })
  countryCode: string;
  @ApiResponseProperty({ type: String })
  timezone: string;
  @ApiResponseProperty({ type: Date })
  openDate: Date;
}

export class Config {
  exclude?: boolean;
  minOdds: {
    0: number;
    1: number;
    2: number;
    GG?: number;
  };
  stakes: {
    0: number;
    1: number;
    2: number;
    GG?: number;
  };
  exclusions: {
    0: boolean;
    1: boolean;
    2: boolean;
    GG?: number;
  };
}

export class ICalc {
  home: {
    score: { from: number; to: any };
    concede: { from: number; to: any };
  };
  away: {
    score: { from: number; to: any };
    concede: { from: number; to: any };
  };
  btts: boolean;
  ov: { 0: boolean; 1: boolean; 2: boolean; un2_5: boolean };
  ovValues: { 0: number; 1: number; 2: number; un2_5?: number };
  results?: Array<{ result: string; probability: number }>;
}
export class EventsResponseDTO {
  @ApiResponseProperty({ type: EventDTO })
  event: EventDTO;
  @ApiResponseProperty({ type: Number })
  marketCount: number;
  @ApiResponseProperty({ type: ICalc })
  calc: {
    ht: ICalc;
    ft: ICalc;
    tennis?: {
      odd1: number;
      odd2: number;
    };
  };
  @ApiResponseProperty({ type: Config })
  config: { ht: Config; ft: Config };
  teams: { home: any; away: any };
  match: IMatch;
  type: 'SOCCER' | 'TENNIS' = 'SOCCER';
}

///markets

export class Metadata {
  runnerId: string;
}

export class Runner {
  @ApiProperty({ type: Number })
  selectionId: number;
  @ApiProperty({ type: String })
  runnerName: string;
  @ApiProperty({ type: Number })
  handicap: number;
  @ApiProperty({ type: Number })
  sortPriority: number;
  @ApiProperty({ type: Metadata })
  metadata: Metadata;
}

export class CompetitionDTO {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  name: string;
}

export class MarketDTO {
  @ApiProperty({ type: String })
  marketId: string;
  @ApiProperty({ type: String })
  marketName: string;
  @ApiProperty({ type: String })
  marketStartTime: Date;
  @ApiProperty({ type: Number })
  totalMatched: number;
  @ApiProperty({ type: Runner, isArray: true })
  runners: Runner[];
  @ApiProperty({ type: EventType })
  eventType: EventType;
  @ApiProperty({ type: CompetitionDTO })
  competition: CompetitionDTO;
  @ApiProperty({ type: EventDTO })
  event: EventDTO;
}

export class AvailableToBack {
  @ApiProperty({ type: Number }) price: number;
  @ApiProperty({ type: Number }) size: number;
}

export class AvailableToLay {
  @ApiProperty({ type: Number }) price: number;
  @ApiProperty({ type: Number }) size: number;
}

export class Ex {
  @ApiProperty({ type: AvailableToBack, isArray: true })
  availableToBack: AvailableToBack[];
  @ApiProperty({ type: AvailableToLay, isArray: true })
  availableToLay: AvailableToLay[];
  tradedVolume: any[];
}

export class RunnerMarketPriceDTO {
  @ApiProperty({ type: String })
  selectionId: number;
  @ApiProperty({ type: Number })
  handicap: number;
  @ApiProperty({ type: String })
  status: string;
  @ApiProperty({ type: String })
  totalMatched: number;
  @ApiProperty({ type: Ex })
  ex: Ex;
}

export class MarketPriceDTO {
  @ApiProperty({ type: String })
  marketId: string;
  @ApiProperty({ type: Boolean })
  isMarketDataDelayed: boolean;
  status: string;
  @ApiProperty({ type: Number })
  betDelay: number;
  @ApiProperty({ type: Boolean })
  bspReconciled: boolean;
  @ApiProperty({ type: Boolean })
  complete: boolean;
  @ApiProperty({ type: Boolean })
  inplay: boolean;
  @ApiProperty({ type: Number })
  numberOfWinners: number;
  @ApiProperty({ type: Number })
  numberOfRunners: number;
  @ApiProperty({ type: Number })
  numberOfActiveRunners: number;
  @ApiProperty({ type: Number })
  totalMatched: number;
  @ApiProperty({ type: Number })
  totalAvailable: number;
  @ApiProperty({ type: Boolean })
  crossMatching: boolean;
  @ApiProperty({ type: Boolean })
  runnersVoidable: boolean;
  @ApiProperty({ type: Number })
  version: number;
  @ApiProperty({ type: RunnerMarketPriceDTO, isArray: true })
  runners: RunnerMarketPriceDTO[];
}

export class LoginDTO {
  @ApiProperty({ type: String })
  username: string;
  @ApiProperty({ type: String })
  password: string;
}

export class EventsCompetitionsRequest {
  @ApiProperty({
    type: [String],
  })
  types: string[];
  @ApiProperty({
    type: [String],
  })
  competitions: string[];
}

export interface Home {
  name: string;
  score: string;
  halfTimeScore: string;
  fullTimeScore: string;
  penaltiesScore: string;
  penaltiesSequence: any[];
  games: string;
  sets: string;
  numberOfYellowCards: number;
  numberOfRedCards: number;
  numberOfCards: number;
  numberOfCorners: number;
  numberOfCornersFirstHalf: number;
  bookingPoints: number;
}

export interface Away {
  name: string;
  score: string;
  halfTimeScore: string;
  fullTimeScore: string;
  penaltiesScore: string;
  penaltiesSequence: any[];
  games: string;
  sets: string;
  numberOfYellowCards: number;
  numberOfRedCards: number;
  numberOfCards: number;
  numberOfCorners: number;
  numberOfCornersFirstHalf: number;
  bookingPoints: number;
}

export interface Score {
  home: Home;
  away: Away;
  numberOfYellowCards: number;
  numberOfRedCards: number;
  numberOfCards: number;
  numberOfCorners: number;
  numberOfCornersFirstHalf: number;
  bookingPoints: number;
}

export interface UpdateDetail {
  updateTime: Date;
  updateId: number;
  matchTime: number;
  elapsedRegularTime: number;
  type: string;
  updateType: string;
}

export interface IBetFairLiveResult {
  eventId: number;
  eventTypeId: number;
  score: Score;
  timeElapsed: number;
  elapsedRegularTime: number;
  updateDetails: UpdateDetail[];
  status: string;
  inPlayMatchStatus: string;
}
