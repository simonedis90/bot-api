import { HttpService, Inject, Injectable } from '@nestjs/common';
import { BetfairService } from '../betfair/betfair.service';
import { chunkArrayInGroups, IBetFairLiveResult } from '../../models/betfair';
import {
  EventsResponseDTO,
  MarketDTO,
  MarketPriceDTO,
} from '../../models/response.dto';
import { EVENT_REPOSITORY } from '../../database/repositories/scraper';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { EventEntity } from '../../database/entities/events.entity';
import { wsServer } from '../../main';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

let EVENTS;

@Injectable()
export class EventsService {
  constructor(
    private betfairService: BetfairService,
    @Inject(EVENT_REPOSITORY) public eventRepository: Repository<EventEntity>,
    private httpClient: HttpService,
  ) {}

  async load(request) {
    /**
     * lista eventi betfair
     */
    const events_ = await this.betfairService
      .events(request, ['1'])
      .toPromise();

    const tennis = await this.betfairService.events(request, ['2']).toPromise();

    const tennis_ = tennis
      .sort(
        (a, b) =>
          (new Date(a.event.openDate) as any) -
          (new Date(b.event.openDate) as any),
      )
      .filter(
        (f) => new Date(f.event.openDate).getDate() === new Date().getDate(),
      );

    const chunkTennis = chunkArrayInGroups<EventsResponseDTO>(tennis, 100);
    for (const tennisGroup of chunkTennis) {
      const markets = await this.betfairService
        .markets(
          request,
          tennisGroup.map((f) => f.event.id),
        )
        .toPromise();
      for (const event of tennisGroup) {
        const oldEvent = await this.eventRepository.findOne({
          eventId: event.event.id as any,
        });
        if (oldEvent) {
          continue;
        }
        const founded = markets.find((f) => f.event.id === event.event.id);

        if (founded) {
          const prices = await this.betfairService
            .marketPrice(request, [founded.marketId])
            .toPromise();

          const eventEntity: Partial<EventEntity> = {
            eventId: event.event.id as any,
            event: event.event,
            marketPrices: prices,
            markets: [founded],
            home: event.event.name.split(' v ')[0],
            away: event.event.name.split(' v ')[1],
            matchDate: event.event.openDate,
            calc: {
              ft: null,
              ht: null,
              tennis: {
                odd1: prices[0]?.runners[0]?.ex?.availableToBack[0]?.price,
                odd2: prices[0]?.runners[1]?.ex?.availableToBack[0]?.price,
              },
            },
          };
          try {
            await this.eventRepository.insert(eventEntity);
          } catch (er) {
            console.log(er);
          }
        }
      }
    }

    const events = events_
      .sort(
        (a, b) =>
          (new Date(a.event.openDate) as any) -
          (new Date(b.event.openDate) as any),
      )
      .filter(
        (f) => new Date(f.event.openDate).getDate() === new Date().getDate(),
      );

    const chunk = chunkArrayInGroups<EventsResponseDTO>(events, 100);
    for (const group of chunk) {
      const markets = await this.betfairService
        .markets(
          request,
          group.map((f) => f.event.id),
        )
        .toPromise();

      for (const event of group) {
        try {
          console.log('start %s', event.event.name);
          const [hn, an] = event.event.name.split(' v ');
          const homeTeam = hn;
          const awayTeam = an;

          // prende i market di un evento
          const founded = markets.filter((f) => f.event.id === event.event.id);

          if (!founded || founded.length === 0) {
            continue;
          }

          // prende i prezzi per i market dell'evento
          const prices = await this.betfairService
            .marketPrice(
              request,
              founded.map((f) => f.marketId),
            )
            .toPromise();

          /**
           * check per vedere se l'evento é stato giá processato
           */
          const oldEvent = await this.eventRepository.findOne({
            eventId: event.event.id as any,
          });

          const eventEntity: Partial<EventEntity> = {
            eventId: event.event.id as any,
            event: event.event,
            marketPrices: prices,
            markets: founded,
            home: homeTeam,
            away: awayTeam,
            matchDate: event.event.openDate,
            calc: {
              ft: null,
              ht: null,
            },
          };
          if (!oldEvent) await this.eventRepository.insert(eventEntity);
        } catch (ex) {
          console.log(ex);
        }

        console.log('end %s', event.event.name);
      }
    }

    return null;
  }

  events(): Promise<EventEntity[]> {
    const from = new Date();
    const to = new Date();
    from.setHours(0);
    from.setMinutes(0);
    to.setHours(23);
    to.setMinutes(59);
    return this.eventRepository.find({
      where: [
        {
          matchDate: MoreThan(from),
        },
        {
          matchDate: LessThan(to),
        },
      ],
    });
  }

  async loadAndPush(
    request: Request,
    push = true,
    inPlayOnly = true,
    today = true,
    ids: string = null,
    competitions: string[] = null
  ): Promise<Partial<EventEntity>[]> {
    const result: Partial<EventEntity>[] = [];

    try {
      const events_ = await this.betfairService
        .events(request, ['1'], inPlayOnly, competitions, today)
        .toPromise();

      const idsArr = (ids || '').split(',');
      if(ids){
        today = false;
      }
      const events = events_
        .filter((item) => {
          if (ids) {
            return idsArr.find((f) => item.event.id === f);
          }
          return true;
        })
        .sort(
          (a, b) =>
            (new Date(a.event.openDate) as any) -
            (new Date(b.event.openDate) as any),
        );

      const chunk = chunkArrayInGroups<EventsResponseDTO>(events, 100);
      for (const group of chunk) {
        const markets = await this.betfairService
          .markets(
            request,
            group.map((f) => f.event.id),
          )
          .toPromise();

        const marketChunk = chunkArrayInGroups<MarketDTO>(markets, 100);

        const dict: { [event: number]: MarketPriceDTO[] } = {};

        group.forEach((f) => {
          dict[f.event.id] = [];
        });

        for (const market of marketChunk) {
          const marketPrices = await this.betfairService
            .marketPrice(
              request,
              market.map((f) => f.marketId),
            )
            .toPromise();

          marketPrices.forEach((marketPrice) => {
            const marketParent = market.find(
              (f) => f.marketId === marketPrice.marketId,
            );
            dict[marketParent.event.id].push(marketPrice);
          });
        }

        for (const event of group) {
          try {
            const [hn, an] = event.event.name.split(' v ');
            const homeTeam = hn;
            const awayTeam = an;

            // prende i market di un evento
            const founded = markets.filter(
              (f) => f.event.id === event.event.id,
            );

            if (!founded || founded.length === 0) {
              continue;
            }

            // prende i prezzi per i market dell'evento
            const prices = dict[event.event.id];

            /**
             * check per vedere se l'evento é stato giá processato
             */
            const oldEvent = await this.eventRepository.findOne({
              eventId: event.event.id as any,
            });

            const isLive = new Date(event.event.openDate) <= new Date();

            const eventEntity: Partial<EventEntity> = {
              eventId: event.event.id as any,
              event: event.event,
              marketPrices: prices,
              startMarketPrices: isLive ? oldEvent?.startMarketPrices : prices,
              markets: founded,
              home: homeTeam,
              away: awayTeam,
              matchDate: event.event.openDate,
              calc: {
                ft: null,
                ht: null,
              },
            };
            if (!oldEvent) this.eventRepository.insert(eventEntity).then();
            else {
              oldEvent.marketPrices = prices;
              this.eventRepository.save(oldEvent).then();
            }

            result.push(eventEntity);
          } catch (ex) {
            console.log(ex);
          }
        }
      }
    } catch (er) {
      console.log('cannot get events', er);
    }

    if (push) {
      wsServer.connections.forEach((f) => {
        f.send(JSON.stringify({ events: result }));
      });

      result.forEach((item) => {
        try {
          this.liveResult(item.eventId)
            .toPromise()
            .then((value) => {
              wsServer.connections.forEach((f) => {
                f.send(
                  JSON.stringify({
                    [item.eventId]: value,
                  }),
                );
              });
            });
        } catch (er) {
          console.log('cannot load ' + item.eventId);
        }
      });
    }

    EVENTS = result;

    return Promise.resolve(result);
  }

  async ev(request: Request) {
    return this.betfairService.events(request, ['1']).toPromise();
  }

  liveResult(eventId: number): Observable<IBetFairLiveResult> {
    const path = `https://ips.betfair.it/inplayservice/v1/eventTimeline?alt=json&eventId=${eventId}&locale=it&productType=EXCHANGE&regionCode=UK`;
    return this.httpClient
      .get<IBetFairLiveResult>(path)
      .pipe(map((d) => d.data));
  }
}
