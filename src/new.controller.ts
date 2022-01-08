import { Body, Controller, Get, Inject, Injectable, Param, Patch, Post, Req } from "@nestjs/common";
import { BetfairService } from "./services/betfair/betfair.service";
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Repository } from "typeorm";
import { COMPETITION, EVENT, HISTORY, MARKET, ODD, SELECTION, SPORT, TEAM } from "./database2_0/provider";
import { BetfairEvent } from "./database2_0/entities/event";
import { Sport } from "./database2_0/entities/sport";
import { Competition } from "./database2_0/entities/competition";
import { Team } from "./database2_0/entities/team";
import {
  CompetitionDTO,
  EventTypeResponseDTO,
  Ex,
  IBetFairLiveResult,
  MarketDTO,
  MarketPriceDTO,
  Runner
} from "./models/response.dto";
import { Market } from "./database2_0/entities/market";
import { Selection } from "./database2_0/entities/selection";
import { Odd } from "./database2_0/entities/odds";
import { HistoryOdd } from "./database2_0/entities/historyOdds";
import { IStatsBetfair } from "./models/betfair";
import { EventsService } from "./services/events/events.service";
import { connect } from "tls";
import { HttpCustomService } from "./services/http-custom/http-custom.service";
import { WebsocketService } from "./services/websocket.service";
import { BridgeService } from "./services/bridge";

export interface Rc {
  batb: number[][];
  batl: number[][];
  id: number;
}

export interface RootObject {
  id: string;
  rc: Rc[];
  img: boolean;
  marketDefinition: {
    bspMarket: boolean;
    turnInPlayEnabled: boolean;
    persistenceEnabled: boolean;
    marketBaseRate: number;
    eventId: string;
    eventTypeId: string;
    numberOfWinners: number;
    bettingType: string;
    marketType: string;
    marketTime: Date;
    suspendTime: Date;
    bspReconciled: boolean;
    complete: boolean;
    inPlay: boolean;
    crossMatching: boolean;
    runnersVoidable: boolean;
    numberOfActiveRunners: number;
    betDelay: number;
    status: string;
    runners: Array<{
      status: string;
      sortPriority: number;
      id: number;
    }>;
    regulators: string[];
    countryCode: string;
    discountAllowed: boolean;
    timezone: string;
    openDate: Date;
    version: number;
    priceLadderDefinition: any;
  };
}

export interface Response {
  oc: any;
  mc: Array<RootObject>;

}


@ApiHeader({ name: "x-application", required: true })
@ApiHeader({ name: "x-authentication", required: true })
@ApiTags("API")
@Injectable()
@Controller("API")
export class NewController {


  constructor(private bFairService: BetfairService,
              @Inject(EVENT) public eventRepository: Repository<BetfairEvent>,
              @Inject(SPORT) public sportRepository: Repository<Sport>,
              @Inject(COMPETITION) public competitionRepository: Repository<Competition>,
              @Inject(TEAM) public teamRepository: Repository<Team>,
              @Inject(MARKET) public marketRepository: Repository<Market>,
              @Inject(SELECTION) public selectionsRepository: Repository<Selection>,
              @Inject(ODD) public oddRepository: Repository<Odd>,
              @Inject(HISTORY) public oddHistoryRepository: Repository<HistoryOdd>,
              private eventService: EventsService,
              private webSocketService: WebsocketService,
              private bridge: BridgeService
  ) {
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: EventTypeResponseDTO
  })
  @Get("/sports")
  async sports(@Req() request) {
    const eventTypesDb = await this.sportRepository.find();
    const eventTypes = await this.bFairService.eventTypes(request).toPromise();
    return eventTypesDb.filter(f => eventTypes.find(s => s.eventType.id === f.sourceId));
  }

  @ApiParam({
    name: "id",
    type: "string"
  })
  @ApiResponse({
    status: 200,
    isArray: true,
    type: Competition
  })
  @Post("/sports/:id/competitions")
  async competitions(@Req() request, competitions: string[]) {
    return await this.competitionRepository.find(
      {
        order: {
          order: "ASC"
        },
        relations: ["sport"]
      }
    );
  }

  @Get("/sync")
  async sync(@Req() request) {
    return await this.bridge.sync(request);
  }

  @Get("/map")
  async load(@Req() request) {
    return await this.bridge.load(request);
  }

  @ApiResponse({
    status: 200,
    type: BetfairEvent,
    isArray: true
  })
  @Get("/events")
  async events(@Req() request) {
    return await this.bridge.events(request);
  }

  @ApiResponse({
    status: 200,
    type: Market,
    isArray: true
  })
  @Get("/markets")
  async markets() {
    return await this.marketRepository.find({
      relations: ["selections"],
      order: {
        order: "ASC"
      }
    });
  }

  @ApiResponse({
    status: 200,
    type: Selection,
    isArray: true
  })
  @Get("/selections")
  async selections() {
    return await this.selectionsRepository.find({
      relations: ["market"],
      order: {
        order: "ASC"
      }
    });
  }

  @ApiResponse({
    status: 200,
    type: Competition,
    isArray: true
  })
  @Patch("competitions")
  async updateCompetitions(@Body() competitions: Competition[]) {
    const c = competitions.map(item => this.competitionRepository.save(item));
    return await Promise.all(c);
  }

  @ApiResponse({
    status: 200,
    type: Sport,
    isArray: true
  })
  @Patch("sports")
  async updateSports(@Body() competitions: Sport[]) {
    const c = competitions.map(item => this.sportRepository.save(item));
    return await Promise.all(c);
  }

  @ApiResponse({
    status: 200,
    type: Market,
    isArray: true
  })
  @Patch("markets")
  async updateMarket(@Body() competitions: Market[]) {
    const c = competitions.map(item => this.marketRepository.save(item));
    return await Promise.all(c);
  }

  @ApiResponse({
    status: 200,
    type: Market,
    isArray: true
  })
  @Patch("selections")
  async updateSelections(@Body() competitions: Selection[]) {
    const c = competitions.map(item => this.selectionsRepository.save(item));
    return await Promise.all(c);
  }


  @Post("register")
  async register(@Req() req) {
    await this.bridge.register(req);
  }
}

