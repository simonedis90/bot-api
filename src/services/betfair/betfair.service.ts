import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  EventsResponseDTO,
  MarketDTO,
  MarketPriceDTO,
} from 'src/models/response.dto';
import {
  bf,
  bfSingle,
  chunkArrayInGroups,
  EventTypeResponse,
  LoginResponse,
} from '../../models/betfair';
import { ConfigService } from '../config/config.service';
import { HttpCustomService } from '../http-custom/http-custom.service';

@Injectable()
export class BetfairService {
  private tennisEventTypeIds = '2';
  private basketEventTypeIds = '7522';
  private americanFootballEventTypeIds = '6423';

  connectedUsers = {};

  constructor(
    private httpCustomService: HttpCustomService,
    private configService: ConfigService,
  ) {}

  async keepAlive(req: Request): Promise<any> {
    const result = await this.httpCustomService.get(
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
    return this.httpCustomService
      .post(
        this.configService.login,
        null,
        {
          params: {
            username,
            password,
          },
        },
        req,
      )
      .pipe<LoginResponse>(
        tap<LoginResponse>((f) => {
          if (f.status === 'SUCCESS') {
            this.connectedUsers[username] = f;
          }
          return f;
        }),
      );
  }

  eventTypes(
    req: Request,
    inPlay: boolean | undefined,
  ): Observable<EventTypeResponse[]> {
    const filters: any = {};

    if (inPlay ?? false) {
      filters.inPlayOnly = inPlay;
    }

    const request = [
      {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/listEventTypes',
        params: {
          filter: filters,
        },
      },
    ];

    return this.httpCustomService
      .post<any, bf<EventTypeResponse>>(
        this.configService.basePath,
        request,
        {},
        req,
      )
      .pipe(map((f) => f[0].result));
  }

  events(
    req: Request,
    types?: string[],
    inPlay?: boolean,
    competitionIds: string[] = [],
    today = false,
  ): Observable<EventsResponseDTO[]> {
    const from = new Date();
    from.setHours(0);
    from.setMinutes(0);

    const to = new Date();
    to.setHours(23);
    to.setMinutes(59);

    const filters: any = {};

    if (inPlay ?? false) {
      filters.inPlayOnly = inPlay;
    }

    if (types && types.length > 0 && types[0] !== undefined) {
      filters.eventTypeIds = [...types];
    }

    if (competitionIds ?? false) {
      filters.competitionIds = competitionIds;
    }

    // const tennisEventTypeIdsRequested =
    //   filters.eventTypeIds?.length === 1 &&
    //   filters.eventTypeIds[0] === this.tennisEventTypeIds;

    // const basketEventTypeIdsRequested =
    //   filters.eventTypeIds?.length === 1 &&
    //   filters.eventTypeIds[0] === this.basketEventTypeIds;

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

    return this.httpCustomService
      .post<any, bf<EventsResponseDTO>>(
        this.configService.basePath,
        request,
        {},
        req,
      )
      .pipe(
        map((f) => {
          return f[0].result?.filter((f) => {
            const d = new Date();
            d.setHours(23);
            d.setMinutes(59);

            if (today) {
              return new Date(f.event.openDate) < d;

              // if (basketEventTypeIdsRequested) return f.event; // Force return for Basket (Nba) Events

              // if (tennisEventTypeIdsRequested || basketEventTypeIdsRequested) {
              //   return f.event; // Force return for Basket (Nba) Events (or Tennis)*
              // }
            }

            return f.event; // All Events
          });
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
              'FIRST_HALF_GOALS_05', // common & soccer
              'FIRST_HALF_GOALS_15',
              'FIRST_HALF_GOALS_25',
              'OVER_UNDER_05',
              'OVER_UNDER_15',
              'OVER_UNDER_25',
              'OVER_UNDER_35',
              'OVER_UNDER_45',
              'OVER_UNDER_55',
              'OVER_UNDER_65',
              'BOTH_TEAMS_TO_SCORE',
              'MATCH_ODDS',
              'HALF_TIME',
              // 'CORRECT_SCORE',

              'SET_BETTING', // tennis
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

    return this.httpCustomService
      .post<any, bf<MarketDTO>>(this.configService.basePath, request, {}, req)
      .pipe(
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
    return this.httpCustomService
      .post<any, bf<MarketPriceDTO>>(
        this.configService.basePath,
        request,
        {},
        req,
      )
      .pipe(
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

  competitions(req: Request, types: string[], inPlay: boolean | undefined) {
    const filters: any = {};

    if (inPlay ?? false) {
      filters.inPlayOnly = inPlay;
    }

    if (types && types.length > 0 && types[0] !== undefined) {
      filters.eventTypeIds = [...types];
    }

    console.log('🚀 ~ listCompetitions', filters);

    const request = [
      {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/listCompetitions',
        params: {
          filter: { ...filters },
          // filter: {
          //   eventTypeIds: [...types],
          // },
        },
        id: 1,
      },
    ];

    return this.httpCustomService
      .post<any, bf<EventsResponseDTO>>(
        this.configService.basePath,
        request,
        {},
        req,
      )
      .pipe(
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
    return this.httpCustomService
      .post<any, bf<EventTypeResponse>>(
        this.configService.basePath,
        request,
        {},
        req,
      )
      .pipe(map((f) => f));
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
    return this.httpCustomService
      .post<any, bfSingle<BetResponse>[]>(
        this.configService.basePath,
        requestBfair,
        {},
        request,
      )
      .pipe(
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
    return this.httpCustomService
      .post<any, any>(this.configService.basePath, request, {}, req)
      .pipe(
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
    return this.httpCustomService
      .post<any, any>(this.configService.basePath, request, {}, req)
      .pipe(map((f) => f));
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
      await this.cancelOrder(
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
    return this.httpCustomService
      .post<any, bf<EventTypeResponse>>(
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

  async listClearedOrders(req: Request): Promise<any> {
    /**
     * listClearedOrders API call,
     *
     * Example payload: {
     *  "betStatus":"SETTLED",
     *  "settledDateRange": {
     *    "from":"2018-04-30T23:00:00Z",
     *    "to":"2018-05-31T23:00:00Z"
     *  },
     *  "groupBy":"MARKET"
     * }
     *
     */

    const date = new Date();

    const from = date.setDate(date.getDate() - 1);
    // from.setHours(0);
    // from.setMinutes(0);

    const to = new Date();
    to.setHours(23);
    to.setMinutes(59);

    const request = [
      {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/listClearedOrders',
        params: {
          betStatus: 'SETTLED',
          settledDateRange: {
            from,
            to,
          },
          groupBy: 'MARKET',
        },
        id: 1,
      },
    ];

    return this.httpCustomService
      .post<any, bf<EventTypeResponse>>(
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

  // TODO: Evaluate Improvements
  listRunners(req: Request, marketId: string) {
    const request = [
      {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/listMarketBook',
        params: {
          marketIds: [marketId], // [...f.map((f) => f.toString())]
          priceProjection: {
            priceData: ['EX_BEST_OFFERS'],
            virtualise: 'true',
          },
        },
        id: 1,
      },
    ];

    return this.httpCustomService
      .post<any, bf<MarketPriceDTO>>(
        this.configService.basePath,
        request,
        {},
        req,
      )
      .pipe(
        map((f) => {
          return f[0].result;
        }),
      );
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
