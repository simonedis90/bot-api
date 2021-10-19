import { Controller, Get, Inject, Post, Req } from "@nestjs/common";
import { BetfairService } from "./services/betfair/betfair.service";
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Repository } from "typeorm";
import { EventEntity } from "./database/entities/events.entity";
import { COMPETITION, EVENT, HISTORY, MARKET, ODD, SELECTION, SPORT, TEAM } from "./database2_0/provider";
import { BetfairEvent } from "./database2_0/entities/event";
import { Sport } from "./database2_0/entities/sport";
import { Competition } from "./database2_0/entities/competition";
import { Team } from "./database2_0/entities/team";
import { chunkArrayInGroups } from "./models/betfair";
import { EventsResponseDTO, MarketDTO } from "./models/response.dto";
import { Market } from "./database2_0/entities/market";
import { Selection } from "./database2_0/entities/selection";
import { Odd } from "./database2_0/entities/odds";
import { HistoryOdd } from "./database2_0/entities/historyOdds";

@ApiHeader({ name: "x-application", required: true })
@ApiHeader({ name: "x-authentication", required: true })
@ApiTags("API")
@Controller()
export class NewController {
  constructor(private bFairService: BetfairService,
              @Inject(EVENT) public eventRepository: Repository<BetfairEvent>,
              @Inject(SPORT) public sportRepository: Repository<Sport>,
              @Inject(COMPETITION) public competitionRepository: Repository<Competition>,
              @Inject(TEAM) public teamRepository: Repository<Team>,
              @Inject(MARKET) public marketRepository: Repository<Market>,
              @Inject(SELECTION) public selectionsRepository: Repository<Selection>,
              @Inject(ODD) public oddRepository: Repository<Odd>,
              @Inject(HISTORY) public oddHistoryRepository: Repository<HistoryOdd>
  ) {
  }

  @ApiResponse({
    status: 200,
    isArray: true
  })
  @Get("/sports")
  async sports(@Req() request) {
    return await this.bFairService.eventTypes(request).toPromise();
  }

  @ApiParam({
    name: "id"
  })
  @ApiResponse({
    status: 200,
    isArray: true
  })
  @Post("/sports/:id/competitions")
  async competitions(@Req() request, competitions: string[]) {
    return await this.bFairService
      .competitions(request, competitions)
      .toPromise();
  }

  @Get("/map")
  async load(@Req() request) {
    debugger;
    const types = await this.bFairService.eventTypes(request).toPromise();
    const dbMarkets = await this.marketRepository.find();
    const dbSelections = await this.selectionsRepository.find();
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

        if(!oldComp.collect) continue;

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
                openDate: event.event.openDate,
                timeZone: event.event.timezone
              })).raw[0];
            }

            const eventMarkets = markets.filter(f => f.event.id === event.event.id);

            for (const evMarket of eventMarkets) {
              const dbMarket = dbMarkets.find(f => f.marketSourceName === evMarket.marketName);

              for (const selection of evMarket.runners) {
                let dbS = dbSelections.find(f => f.sourceName === selection.runnerName);
                if (!dbS) {
                  dbS = (await this.selectionsRepository.insert({
                    market: dbMarket,
                    sourceName: selection.runnerName,
                    name: ''
                  })).raw[0];
                }
                const price = marketPrices?.find(f => f.marketId === evMarket.marketId)
                  ?.runners
                  ?.find(f => f.selectionId === selection.selectionId)
                  ?.ex;
                if (price) {

                  const odd = await this.oddRepository.findOne({
                    sourceSelectionId: selection.selectionId.toString()
                  })
                  let back = Math.max(...price.availableToBack?.map(f => f.price) || [0]);
                  let lay = Math.max(...price.availableToLay?.map(f => f.price) || [0]);
                  back = Math.abs(back) === Infinity ? 0 : back;
                  lay = Math.abs(lay) === Infinity ? 0 : lay;
                  if(!odd){
                    this.oddRepository.insert({
                      selection: dbS,
                      marketSourceId: evMarket.marketId,
                      sourceSelectionId: selection.selectionId.toString(),
                      event: dbEv,
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
                    }).then()

                    odd.lay = lay;
                    odd.back = back;
                    this.oddRepository.save(odd).then();
                  }
                }
              }
            }

          }

          debugger
        }

      }
    }


  }
}
