import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req
} from "@nestjs/common";
import { AppService } from "./app.service";
import { BetfairService } from "./services/betfair/betfair.service";
import { EventsService } from "./services/events/events.service";
import {
  ApiBody,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { LoginResponse } from "./models/betfair";
import {
  BetResponseDTO,
  CompetitionDTO,
  EventDTO,
  EventsResponseDTO,
  IBet,
  IBetDto,
  LoginResponseDTO
} from "./models/response.dto";
import { match_game_new_ } from "./services/helper";
import { EventTypeResponseDTO } from "../../scraper-database/src/models/response.dto";

class MatchingRequestDTO {
  lv_src: [][];
  h_src: string;
  a_src: string;
}

export let EVENTS;

@ApiHeader({ name: "x-application", required: true })
@ApiHeader({ name: "x-authentication", required: true })
@ApiTags("Events")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly bFairService: BetfairService,
    private readonly eventsService: EventsService
  ) {
  }

  @ApiQuery({
    name: "pass",
    type: String
  })
  @Get("/load-events")
  async loadAll(@Query("pass") pass, @Req() request) {
    if (pass !== "P4ssw0rd@123") {
      throw new ForbiddenException();
    }
    await this.eventsService.loadAndPush(request, false, false, false);
  }

  @Post("matching")
  @ApiResponse({
    status: 200
  })
  @ApiBody({
    type: MatchingRequestDTO
  })
  matching(
    @Body("lv_src") lv: string, // [][]
    @Body("h_src") h: string,
    @Body("a_src") a: string
  ) {
    const result = match_game_new_(JSON.parse(lv), h, a);
    return result;
  }

  @ApiQuery({
    name: "sport",
    required: false,
    description: "Sport id retrieve from sports",
    type: Number
  })
  @ApiQuery({
    name: "live",
    required: false,
    type: Boolean,
    description: "if tru only live events"
  })
  @ApiQuery({
    name: "withOdds",
    required: false,
    type: Boolean,
    description: "get odds"
  })
  @ApiQuery({
    name: "today",
    required: false,
    type: Boolean,
    description: "only today events, default true"
  })
  @ApiQuery({
    name: "ids",
    required: false,
    type: String,
    description: "eventId divided by , "
  })
  @ApiQuery({
    name: "competitions",
    required: false,
    type: String,
    description: "eventId divided by , "
  })
  @ApiResponse({
    type: EventsResponseDTO,
    isArray: true,
    status: 200
  })
  @Get("/events")
  async liveEvents(
    @Req() request,
    @Query("sport") sportId,
    @Query("live") live = false,
    @Query("withOdds") withOdds = false,
    @Query("today") today = true,
    @Query("ids") ids: string = null,
    @Query("competitions") competitions: string
  ) {
    if ((withOdds as any) === "true") {
      withOdds = Boolean(1);
    }
    if ((today as any) === "true") {
      today = Boolean(1);
    }
    if ((live as any) === "true") {
      live = Boolean(1);
    }
    if (withOdds === true) {
      const events = await this.eventsService.loadAndPush(
        request,
        false,
        false,
        today,
        ids,
        competitions?.split(",")
      );
      return events;
    }
    const events = await this.bFairService.events(
      request,
      [sportId],
      live,
      competitions?.split(","),
      today
    );
    return events;
  }

  @ApiQuery({
    name: "ids",
    required: false,
    type: String,
    description: "eventId divided by , "
  })
  @ApiResponse({
    type: EventsResponseDTO,
    isArray: true,
    status: 200
  })
  @Get("/live-result")
  async liveResult(@Query("ids") ids: string) {
    const idsArr = ids.split(",");

    return await Promise.all(
      idsArr.map((f: any) =>
        this.eventsService.liveResult(f as any).toPromise()
      )
    );
  }

  @ApiResponse({
    type: EventsResponseDTO,
    isArray: true,
    status: 200
  })
  @Get("/ev")
  async ev(@Req() request) {
    const events = await this.eventsService.ev(request);
    return events;
  }

  @ApiResponse({
    type: CompetitionDTO,
    isArray: true,
    status: 200
  })
  @ApiQuery({ name: "sportIds", isArray: false, required: false, type: String })
  @Get("/competitions")
  async competitions(@Req() request, @Query("sportIds") sportId) {
    const events = await this.bFairService.competitions(request, sportId || []);
    return events;
  }

  @ApiResponse({
    type: EventsResponseDTO,
    isArray: true,
    status: 200
  })
  @Get("/sports")
  async eventTypes(@Req() request) {
    const events = await this.bFairService.eventTypes(request);
    return events;
  }

  @ApiQuery({
    name: "pass",
    type: String
  })
  @Get("/load-push")
  async loadAndPush(@Query("pass") pass, @Req() request) {
    if (pass !== "P4ssw0rd@123") {
      throw new ForbiddenException();
    }
    const fn = async () => {
      for (; true;) {
        try {
          await new Promise((resolve) => {
            setTimeout(() => resolve(true), 7000);
          });
          const result = await this.eventsService.loadAndPush(request);
          EVENTS = result;
        } catch (e) {
        }
      }
    };

    fn().then();

    const take = async () => {
      for (; true;) {
        await new Promise(async (resolve) => {
          setTimeout(() => resolve(true), 1000 * 60 * 5);
          await this.bFairService.keepAlive(request);
        });
      }
    };
    take().then();
  }

  @ApiResponse({
    type: BetResponseDTO,
    isArray: true,
    status: 200
  })
  @ApiBody({
    type: IBetDto,
    isArray: true
  })
  @Post("/place-bet")
  async placeBet(@Req() request, @Body() bets: IBet[]) {
    const normalBets = bets.filter((f) => f.size >= 2);
    const lessThan = bets.filter((f) => f.size < 2);
    let nBets = [];
    if (normalBets.length) {
      nBets = await this.bFairService
        .placeBet(request, normalBets)
        .toPromise();
    }
    let lBets = [];
    if (lessThan.length) {
      lBets = await this.bFairService.betLessThan2(request, lessThan);
    }
    return nBets.concat(lBets);
  }

  @ApiResponse({
    type: BetResponseDTO,
    isArray: true,
    status: 200
  })
  @ApiBody({
    type: IBetDto,
    isArray: true
  })
  @Post("/place-bet2")
  async placeBetProfit(@Req() request, @Body() bets: IBet[]) {
    return await this.bFairService.betProfit(request, bets).toPromise();
  }

  @ApiParam({
    name: "id",
    type: String
  })
  @Get("/markets/:id")
  async markets(@Req() request, @Param("id") marketId) {
    return await this.bFairService.marketPrice(request, [marketId]).toPromise();
  }

  @ApiParam({
    name: "id",
    type: String
  })
  @Get("/market-book/:id")
  async marketBook(@Req() request, @Param("id") marketId) {
    return await this.bFairService.listMarketBook(request, marketId, null);
  }

  @Get("/market-book")
  async marketBooks(@Req() request, @Query("st") st: string) {
    const strategies = st ? (st).split(",") : [];
    return await this.bFairService.listMarketBook(request, null, strategies);
  }

  @Get("/cleared-orders")
  async clearedOrders(@Req() request, @Query("day") day: string, @Query("st") st: string) {
    const strategies = st ? (st).split(",") : [];
    return await this.bFairService.listClearedOrders(request, day, strategies);
  }

  @Get("/alive")
  async alive(@Req() request) {
    return await this.bFairService.keepAlive(request);
  }

  @ApiResponse({
    type: EventTypeResponseDTO,
    status: 200
  })
  @Get("/sports2")
  async sports(@Req() request) {
    return await this.bFairService.eventTypes(request).toPromise();
  }
}
