import { HttpService, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppService } from 'src/app.service';
import {
  EventsResponseDTO,
  MarketDTO,
  MarketPriceDTO,
} from 'src/models/response.dto';
import { ConfigService } from '../config/config.service';
import { HttpCustomService } from '../http-custom/http-custom.service';
import {
  LoginResponse,
  EventTypeResponse,
  bf,
  chunkArrayInGroups,
  bfSingle,
} from '../../models/betfair';
import { type } from 'os';

@Injectable()
export class BetfairService {
  connectedUsers = {};

  constructor(
    private HttpCustomService: HttpCustomService,
    private appService: AppService,
    private httpClient: HttpService,
    private configService: ConfigService,
  ) {}

  async keepAlive(req: Request): Promise<any> {
    const result = await this.HttpCustomService.get(
      this.configService.keepAlive,
      {},
      req,
    );
    return result;
  }

  login(
    username: string,
    password: string,
    req: Request,
  ): Observable<LoginResponse> {
    return this.HttpCustomService.post(
      this.configService.login,
      null,
      {
        params: {
          username,
          password,
        },
      },
      req,
    ).pipe<LoginResponse>(
      tap<LoginResponse>((f) => {
        if (f.status === 'SUCCESS') {
          this.connectedUsers[username] = f;
        }
        return f;
      }),
    );
  }

  eventTypes(req: Request): Observable<EventTypeResponse[]> {
    const request = [
      {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/listEventTypes',
        params: {
          filter: {},
        },
      },
    ];

    return this.HttpCustomService.post<any, bf<EventTypeResponse>>(
      this.configService.basePath,
      request,
      {},
      req,
    ).pipe(map((f) => f[0].result));
  }

  events(
    req: Request,
    types: string[],
    inPlayOnly: boolean = undefined,
    competitionIds: string[] = [],
  ): Observable<EventsResponseDTO[]> {
    const from = new Date();
    from.setHours(0);
    from.setMinutes(0);
    const to = new Date();
    to.setHours(23);
    to.setMinutes(59);
    const filters: any = {};
    if (types) {
      filters.eventTypeIds = types;
    }
    if (inPlayOnly === true) {
      filters.inPlayOnly = true;
    }
    if (competitionIds?.length) {
      filters.competitionIds = competitionIds;
    }
    const request = [
      {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/listEvents',
        params: {
          filter: filters,
          marketProjection: ['COMPETITION'],
        },
        id: 1,
      },
    ];

    return this.HttpCustomService.post<any, bf<EventsResponseDTO>>(
      this.configService.basePath,
      request,
      {},
      req,
    ).pipe(
      map((f) => {
        return f[0].result;
      }),
    );
  }

  markets(req: Request, events: string[] = []): Observable<MarketDTO[]> {
    const request = [
      {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/listMarketCatalogue',
        params: {
          filter: {
            marketTypeCodes: [
              'FIRST_HALF_GOALS_05',
              'FIRST_HALF_GOALS_15',
              'OVER_UNDER_05',
              'OVER_UNDER_15',
              'OVER_UNDER_25',
              'OVER_UNDER_35',
              'BOTH_TEAMS_TO_SCORE',
              'MATCH_ODDS',
              'CORRECT_SCORE',
            ],
            eventIds: [...events.map((f) => f.toString())],
          },
          maxResults: 1000,
          marketProjection: [
            'COMPETITION',
            'EVENT',
            'EVENT_TYPE',
            'RUNNER_DESCRIPTION',
            'MARKET_START_TIME',
          ],
        },
        id: 1,
      },
    ];

    return this.HttpCustomService.post<any, bf<MarketDTO>>(
      this.configService.basePath,
      request,
      {},
      req,
    ).pipe(
      map((f) => {
        return f[0].result;
      }),
    );
  }

  marketPrice(req: Request, markets: string[]): Observable<MarketPriceDTO[]> {
    const arrRequest = chunkArrayInGroups<string>(markets, 5).map(
      (f, index) => {
        return {
          jsonrpc: '2.0',
          method: 'SportsAPING/v1.0/listMarketBook',
          params: {
            marketIds: [...f.map((f) => f.toString())],
            priceProjection: {
              priceData: ['EX_BEST_OFFERS'],
              virtualise: 'true',
            },
          },
          id: index + 1,
        };
      },
    );
    const request = arrRequest;
    return this.HttpCustomService.post<any, bf<MarketPriceDTO>>(
      this.configService.basePath,
      request,
      {},
      req,
    ).pipe(
      map((f) => {
        return (f || [])
          .filter((f) => !f.error)
          .reduce((pre, items) => {
            pre.push(...items.result);
            return pre;
          }, []);
      }),
    );
  }

  competitions(req: Request, types: string[]) {
    const request = [
      {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/listCompetitions',
        params: {
          filter: {
            eventTypeIds: [...types],
          },
        },
        id: 1,
      },
    ];

    return this.HttpCustomService.post<any, bf<EventsResponseDTO>>(
      this.configService.basePath,
      request,
      {},
      req,
    ).pipe(
      map((f) => {
        debugger;
        return f[0].result;
      }),
    );
  }

  marketTypes(req: Request) {
    const request = [
      {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/listMarketTypes',
        params: {
          filter: {},
        },
        id: 1,
      },
    ];
    return this.HttpCustomService.post<any, bf<EventTypeResponse>>(
      this.configService.basePath,
      request,
      {},
      req,
    ).pipe(map((f) => f));
  }

  placeBet(
    request: Request,
    bets: Array<{
      marketId: string;
      selectionId: string;
      side;
      price: number;
      size: number;
    }>,
  ) {
    const requestBfair = bets.map((f, index) => {
      const request = {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/placeOrders',
        params: {
          marketId: f.marketId,
          instructions: [
            {
              selectionId: f.selectionId,
              handicap: '0',
              side: f.side,
              orderType: 'LIMIT',
              limitOrder: {
                size: f.size,
                price: f.price,
                persistenceType: 'PERSIST',
              },
            },
          ],
        },
        id: index + 1,
      };
      return request;
    });
    return this.HttpCustomService.post<any, bfSingle<BetResponse>[]>(
      this.configService.basePath,
      requestBfair,
      {},
      request,
    ).pipe(
      map((f) => {
        return f;
      }),
    );
  }

  cancelOrder(req, betId, marketId, size) {
    const request: any = {
      jsonrpc: '2.0',
      method: 'SportsAPING/v1.0/cancelOrders',
      params: {
        marketId: marketId,
        instructions: [
          {
            betId: betId,
          },
        ],
      },
      id: 1,
    };
    if (size) {
      request.params.instructions[0].sizeReduction = size;
    }
    return this.HttpCustomService.post<any, any>(
      this.configService.basePath,
      request,
      {},
      req,
    ).pipe(
      map((f) => {
        return f;
      }),
    );
  }

  replaceOrder(req, betId, marketId, newPrice) {
    const request = {
      jsonrpc: '2.0',
      method: 'SportsAPING/v1.0/replaceOrders',
      params: {
        marketId: marketId,
        instructions: [
          {
            betId: betId,
            newPrice: newPrice,
          },
        ],
      },
      id: 1,
    };
    return this.HttpCustomService.post<any, any>(
      this.configService.basePath,
      request,
      {},
      req,
    ).pipe(map((f) => f));
  }

  async betLessThan2(
    request: Request,
    bets: Array<{
      marketId: string;
      selectionId: string;
      side;
      price: number;
      size: number;
    }>,
  ) {
    const size = bets[0].size;
    const diff = 5 - size;
    const price = bets[0].price;
    bets[0].size = 5;
    bets[0].price = bets[0].side === 'LAY' ? 1.01 : 1000;
    const response = await this.placeBet(request, bets).toPromise();
    if (response[0].result.status === 'SUCCESS') {
      const betId = response[0].result.instructionReports[0].betId;
      const f = await this.cancelOrder(
        request,
        betId,
        bets[0].marketId,
        diff,
      ).toPromise();
      const z = await this.replaceOrder(
        request,
        betId,
        bets[0].marketId,
        price,
      ).toPromise();
      return z;
    }
  }

  async listMarketBook(req: Request, marketId: string): Promise<any> {
    const params: any = {};
    if (marketId) {
      params.marketIds = [marketId];
    }
    const request = [
      {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/listCurrentOrders',
        params: params,
        id: 1,
      },
    ];
    return this.HttpCustomService.post<any, bf<EventTypeResponse>>(
      this.configService.basePath,
      request,
      {},
      req,
    )
      .pipe(
        map((f) => {
          return f;
        }),
      )
      .toPromise();
  }
}

export interface PriceSize {
  price: number;
  size: number;
}

export interface IBetBetfair {
  betId: string;
  marketId: string;
  selectionId: number;
  handicap: number;
  priceSize: PriceSize;
  bspLiability: number;
  side: string;
  status: string;
  persistenceType: string;
  orderType: string;
  placedDate: Date;
  matchedDate: Date;
  averagePriceMatched: number;
  sizeMatched: number;
  sizeRemaining: number;
  sizeLapsed: number;
  sizeCancelled: number;
  sizeVoided: number;
  regulatorAuthCode: string;
  regulatorCode: string;
}

export interface LimitOrder {
  size: number;
  price: number;
  persistenceType: string;
}

export interface Instruction {
  side: string;
  handicap: number;
  orderType: string;
  limitOrder: LimitOrder;
  selectionId: number;
}

export interface InstructionReport {
  betId: string;
  status: string;
  placedDate: Date;
  instruction: Instruction;
  orderStatus: string;
  sizeMatched: number;
  averagePriceMatched: number;
}

export interface BetResponse {
  status: string;
  marketId: string;
  instructionReports: InstructionReport[];
}
