import { BetfairService } from "./betfair/betfair.service";
import { Inject, Injectable } from "@nestjs/common";
import { COMPETITION, EVENT, HISTORY, MARKET, ODD, SELECTION, SPORT, TEAM } from "../database2_0/provider";
import { Repository } from "typeorm";
import { BetfairEvent } from "../database2_0/entities/event";
import { Sport } from "../database2_0/entities/sport";
import { Competition } from "../database2_0/entities/competition";
import { Team } from "../database2_0/entities/team";
import { Market } from "../database2_0/entities/market";
import { Selection } from "../database2_0/entities/selection";
import { Odd } from "../database2_0/entities/odds";
import { HistoryOdd } from "../database2_0/entities/historyOdds";
import { connect, TLSSocket } from "tls";
import { HttpCustomService } from "./http-custom/http-custom.service";
import { Response } from "../new.controller";
import { Ex, IBetFairLiveResult, MarketDTO, MarketPriceDTO, Runner } from "../models/response.dto";
import { IStatsBetfair } from "../models/betfair";
import { EventsService } from "./events/events.service";
import { Subject } from "rxjs";

@Injectable()
export class BridgeService {

  oddChange$: Subject<Odd> = new Subject<Odd>();
  stream$: Subject<Response> = new Subject<Response>();
  eventInfo$: Subject<{
    stats: IStatsBetfair,
    live: IBetFairLiveResult
  }> = new Subject();

  private mappedEvents: any[] = [];
  private liveEvents;

  private interval: NodeJS.Timeout;
  private interval2: NodeJS.Timeout;
  private client: TLSSocket;

  constructor(private bFairService: BetfairService,
              @Inject(EVENT) public eventRepository: Repository<BetfairEvent>,
              @Inject(SPORT) public sportRepository: Repository<Sport>,
              @Inject(COMPETITION) public competitionRepository: Repository<Competition>,
              @Inject(TEAM) public teamRepository: Repository<Team>,
              @Inject(MARKET) public marketRepository: Repository<Market>,
              @Inject(SELECTION) public selectionsRepository: Repository<Selection>,
              @Inject(ODD) public oddRepository: Repository<Odd>,
              @Inject(HISTORY) public oddHistoryRepository: Repository<HistoryOdd>,
              private eventService: EventsService
  ) {
    this.connect();
  }

  connect() {
    const options = {
      host: "stream-api.betfair.com",
      port: 443
    };

    /*	Establish connection to the socket */

    const client = connect(options, function() {
      console.log("Connected");
    });
    this.client = client;
  }

  async events(request) {

    const competitions = await this.competitionRepository.find({
      collect: true
    });
    const events = await this.bFairService.events(request,
      ["1"],
      false,
      [...competitions.map(f => f.sourceId)],
      true
    ).toPromise();

    const eventsDb = await this.eventRepository
      .createQueryBuilder("events")
      .leftJoinAndSelect("events.competition", "competition")
      .leftJoinAndSelect("events.odds", "odds")
      .leftJoinAndSelect("odds.selection", "selection")
      .where("events.sourceId IN (:...ids)")
      .setParameter("ids", events.map(f => f.event.id)).getMany();
    //
    // eventsDb.forEach(
    //   item => {
    //     if (this.liveEvents[item.sourceId]) {
    //       item.stats = this.liveEvents[item.sourceId].stats;
    //       item.live = this.liveEvents[item.sourceId].live;
    //     }
    //   }
    // );
    return eventsDb;
  }

  async sync(request) {
    const mappedEvents = [];
    const liveEvents = [];
    const competitions = await this.competitionRepository.find({
      relations: ["sport"],
      where: {
        collect: true
      }
    });
    // let dbSelections = await this.selectionsRepository.find();

    const competitionBySport: { [sportSourceId: string]: Competition[] } = competitions.reduce(
      (dict, comp) => {
        dict[comp.sport.sourceId] = dict[comp.sport.sourceId] || [];
        dict[comp.sport.sourceId].push(comp);
        return dict;
      }, {}
    );

    for (const sportSourceId in competitionBySport) {
      const playOnly = await this.bFairService.events(request,
        [sportSourceId],
        true,
        [...competitionBySport[sportSourceId].map(f => f.sourceId)],
        true
      ).toPromise();
      const events = await this.bFairService.events(request,
        [sportSourceId],
        false,
        [...competitionBySport[sportSourceId].map(f => f.sourceId)],
        true
      ).toPromise();

      if (events.length === 0) {
        continue;
      }

      liveEvents.push(...playOnly.map(f => f.event.id));
      mappedEvents.push(...events.map(f => f.event.id));

      // const eventsDb = await this.eventRepository.createQueryBuilder("events").where("events.sourceId IN (:...ids)")
      //   .setParameter("ids", events.map(f => f.event.id)).getMany();
      //
      // const markets = await this.bFairService.markets(request, events.map(f => f.event.id)).toPromise();
      // const marketPrices = await this.bFairService.marketPrice(request, markets.map(f => f.marketId)).toPromise();
      // for (const event of events) {
      //   const dbEvent = eventsDb.find(f => f.sourceId === event.event.id);
      //   if (!dbEvent) {
      //     continue;
      //   }
      //   const eventMarkets = markets.filter(f => f.event.id === event.event.id);
      //
      //   for (const evMarket of eventMarkets) {
      //
      //     for (const selection of evMarket.runners) {
      //
      //       const price = marketPrices?.find(f => f.marketId === evMarket.marketId)
      //         ?.runners
      //         ?.find(f => f.selectionId === selection.selectionId)
      //         ?.ex;
      //       if (price) {
      //         let dbS = dbSelections.find(f => f.sourceName === selection.runnerName);
      //         const marketPrice = marketPrices.find(f => f.marketId === evMarket.marketId);
      //         this.asyncSave(selection, price, dbS, evMarket, dbEvent, marketPrice);
      //       }
      //     }
      //   }
      // }

    }

    this.mappedEvents = mappedEvents;
    this.liveEvents = liveEvents;

    // this.register(request).then();
  }

  async register(req) {

    await this.sync(req);

    this.connect();

    const client = this.client;

    /*	Send authentication message */

    const keys = HttpCustomService.GET_KEYS(req);

    client.write(`{"op": "authentication", "appKey": "${keys.xApp}", "session": "${keys.xAuth}"}\r\n`);

    clearInterval(this.interval);
    clearInterval(this.interval2);

    this.interval = setInterval(() => {
      console.log("updated client requests");
      this.sync(req).then(
        () => {
          // client.write(`{"op":"marketSubscription","id":3,"marketFilter":{"eventIds":[${this.mappedEvents.map(f => f.toString())}],"bettingTypes":["ODDS"],"marketTypes":[${markets.map(f => "\"" + f.marketIdentifier.toString() + "\"")}]},"marketDataFilter":{"ladderLevels": 1,"fields": ["EX_BEST_OFFERS", "EX_MARKET_DEF"]}}\r\n`);
        }
      );
    }, 5 * 60 * 1000);

    const get = async () => {
      for (const item of this.liveEvents) {
        const live = await this.eventService.liveResult(item).toPromise();
        const stats = await this.eventService.stats(item).toPromise();
        this.eventInfo$.next({
          live,
          stats
        });
      }
      // Promise.all(this.mappedEvents.map(f => this.eventService.liveResult(f).toPromise())).then(
      //   d => {
      //     d.forEach(
      //       item => {
      //         this.liveEvents[item.eventId] = this.liveEvents[item.eventId] || {
      //           stats: null,
      //           live: null
      //         };
      //         this.liveEvents[item.eventId].live = item;
      //         this;
      //       }
      //     );
      //   }
      // );
      // Promise.all(this.mappedEvents.map(f => this.eventService.stats(f).toPromise())).then(
      //   d => {
      //     d.forEach(
      //       item => {
      //         this.liveEvents[item.Id] = this.liveEvents[item.Id] || {
      //           stats: null,
      //           live: null
      //         };
      //         this.liveEvents[item.Id].stats = item;
      //       }
      //     );
      //   }
      // );
    };
    await get();
    this.interval2 = setInterval(async () => {
      await get();
    }, 10000);

    /*	Subscribe to order/market stream */
    client.write(`{"op":"orderSubscription", "id":1,"orderFilter":{},"segmentationEnabled":true}\r\n`);
    // client.write(`{"op":"orderSubscription", "id":2,"orderFilter":{},"segmentationEnabled":true}\r\n`);
    const markets = await this.marketRepository.find();

    // client.write(`{"op":"marketSubscription","id":2,"marketFilter":{"eventIds":[${[this.mappedEvents.pop()].map(f => f.toString()).join(",")}],"bettingTypes":["ODDS"],"marketTypes":["MATCH_ODDS", "CORRECT_SCORE"]},"marketDataFilter":{"ladderLevels": 2,"fields": ["EX_BEST_OFFERS"]}}\r\n`);
    client.write(`{"op":"marketSubscription","id":3,"marketFilter":{"eventIds":[${this.mappedEvents.map(f => f.toString())}],"bettingTypes":["ODDS"],"marketTypes":[${markets.map(f => "\"" + f.marketIdentifier.toString() + "\"")}]},"marketDataFilter":{"ladderLevels": 1,"fields": ["EX_BEST_OFFERS", "EX_MARKET_DEF"]}}\r\n`);
    let stream = "";
    client.on("data", async (data) => {
      let response: Response;
      try {
        response = null;
        response = JSON.parse(data.toString());
        stream = "";
      } catch (ex) {
        stream += data.toString();
        try {
          response = null;
          response = JSON.parse(stream.toString());
          this.stream$.next(response);
          stream = "";
        } catch (e) {

        }
      }

      if (response && Array.isArray(response.mc)) {
        for (const market of response.mc) {
          if(!Array.isArray(market.rc)){
            continue;
          }
          for (const runner of market.rc) {
            const def = market.marketDefinition?.runners?.find(f => f.id === runner.id);

            const odd = await this.oddRepository.findOne({
              marketSourceId: market.id,
              sourceSelectionId: runner.id.toString()
            });
            if (odd) {
              try {
                odd.lay = runner.batl[0][1];
                odd.back = runner.batb[0][1];
              } catch (e) {
              }


              if (market.marketDefinition)
                odd.inPlay = market.marketDefinition.inPlay;
              if (def)
                odd.active = def?.status === "ACTIVE";

              // console.log("process odd", JSON.stringify(odd));
              this.oddChange$.next(odd);
              this.oddRepository.save(odd).then();
            }
          }
        }
      } else if (response?.oc) {
        console.log(data.toString());
        console.log(response);
      }
    });

    client.on("close", (f) => {
      console.log("Connection closed", f);
      // this.connect();
    });

    client.on("error", (err) => {
      console.log("Error:" + err);
      // this.connect();
    });

  }

  asyncSave(selection: Runner, price: Ex, dbS: Selection, evMarket: MarketDTO, dbEvent: BetfairEvent, marketPrice: MarketPriceDTO) {
    const history = [];

    this.oddRepository.findOne({
      sourceSelectionId: selection.selectionId.toString()
    }).then(odd => {
      if (odd) {

        let back = Math.max(...price.availableToBack?.map(f => f.price) || [0]);
        let lay = Math.max(...price.availableToLay?.map(f => f.price) || [0]);
        back = Math.abs(back) === Infinity ? 0 : back;
        lay = Math.abs(lay) === Infinity ? 0 : lay;
        if (!odd) {
          this.oddRepository.insert({
            selection: dbS,
            marketSourceId: evMarket.marketId,
            sourceSelectionId: selection.selectionId.toString(),
            event: dbEvent,
            back,
            lay
          }).then();
        } else {

          this.oddHistoryRepository.insert({
            odd,
            oldBackValue: odd.back,
            oldLayValue: odd.lay,
            newBackValue: back,
            newLayValue: lay,
            timeStamp: new Date()
          }).then();
          odd.inPlay = marketPrice.inplay;
          odd.active = marketPrice.status === "OPEN";
          odd.lay = lay;
          odd.back = back;
          // console.log(dbEvent.name, odd);
          this.oddRepository.save(odd).then();
        }
      }
    });

  }

  async load(request) {
    const types = await this.bFairService.eventTypes(request).toPromise();
    const dbMarkets = await this.marketRepository.find();
    let dbSelections = await this.selectionsRepository.find({
      relations: ["market"]
    });
    for (const type of types) {
      let sport = await this.sportRepository.findOne({ sourceId: type.eventType.id });
      if (!sport) {
        const result = await this.sportRepository.insert({
          sourceId: type.eventType.id,
          name: type.eventType.name
        });
        sport = result.raw[0];
      }

      const competitions = await this.bFairService.competitions(request, [type.eventType.id]).toPromise();
      const history = [];
      for (const competition of competitions) {
        let oldComp = await this.competitionRepository.findOne({
          sourceId: competition.competition.id
        });
        if (!oldComp) {
          oldComp = (await this.competitionRepository.insert({
              sourceId: competition.competition.id,
              name: competition.competition.name,
              sport: sport
            }
          )).raw[0];
        }

        ///if (!oldComp.collect) continue;

        const events = await this.bFairService.events(request,
          [type.eventType.id],
          false,
          [competition.competition.id],
          true
        ).toPromise();

        if (events.length) {

          const markets = await this.bFairService.markets(request, events.map(f => f.event.id)).toPromise();
          const marketPrices = await this.bFairService.marketPrice(request, markets.map(f => f.marketId)).toPromise();

          for (const event of events) {
            let dbEv = await this.eventRepository.findOne({
              sourceId: event.event.id
            });
            if (!dbEv) {
              dbEv = (await this.eventRepository.insert({
                name: event.event.name,
                sourceId: event.event.id,
                competition: oldComp,
                countryCode: event.event.countryCode,
                openDate: new Date(event.event.openDate).toISOString(),
                timeZone: event.event.timezone
              })).raw[0];
            }

            const eventMarkets = markets.filter(f => f.event.id === event.event.id);

            for (const evMarket of eventMarkets) {
              const dbMarket = dbMarkets.find(f => f.marketSourceName === evMarket.marketName);

              for (const selection of evMarket.runners) {
                if (!dbMarket) {
                  console.log(evMarket, event, dbEv, selection);
                  continue;
                }
                if (dbMarket.marketIdentifier === "MATCH_ODDS") {
                  if (selection.sortPriority === 1) {
                    selection.runnerName = "1";
                  }
                  if (selection.sortPriority === 2) {
                    selection.runnerName = "2";
                  }
                  if (selection.sortPriority === 3) {
                    selection.runnerName = "x";
                  }
                }
                let dbS = dbSelections.find(f => f.sourceName === selection.runnerName && f.market.id === dbMarket.id);
                if (!dbS) {
                  dbS = (await this.selectionsRepository.insert({
                    market: dbMarket,
                    sourceName: selection.runnerName,
                    name: ""
                  })).raw[0];
                  dbSelections = await this.selectionsRepository.find(
                    {
                      relations: ["market"]
                    }
                  );
                }
                const marketPrice = marketPrices.find(f => f.marketId === evMarket.marketId);
                const runner = marketPrice
                  ?.runners
                  ?.find(f => f.selectionId === selection.selectionId);
                const price = runner
                  ?.ex;
                if (price) {

                  const odd = await this.oddRepository.findOne({
                    selection: dbS,
                    event: dbEv,
                    sourceSelectionId: selection.selectionId.toString()
                  });
                  let back = Math.max(...price.availableToBack?.map(f => f.price) || [0]);
                  let lay = Math.max(...price.availableToLay?.map(f => f.price) || [0]);
                  back = Math.abs(back) === Infinity ? 0 : back;
                  lay = Math.abs(lay) === Infinity ? 0 : lay;
                  debugger
                  if (!odd) {
                    await this.oddRepository.insert({
                      selection: dbS,
                      marketSourceId: evMarket.marketId,
                      sourceSelectionId: selection.selectionId.toString(),
                      event: dbEv,
                      back,
                      lay,
                      inPlay: marketPrice.inplay,
                      active: marketPrice.status === "OPEN"
                    });
                  } else {

                    history.push({
                      odd,
                      oldBackValue: odd.back,
                      oldLayValue: odd.lay,
                      newBackValue: back,
                      newLayValue: lay,
                      timeStamp: new Date()
                    });

                    odd.lay = lay;
                    odd.back = back;
                    odd.inPlay = marketPrice.inplay;
                    odd.active = marketPrice.status === "OPEN";
                    await this.oddRepository.save(odd);
                  }
                }
              }
            }
          }
        }
      }


      await this.oddHistoryRepository.insert(history);
    }


  }
}
