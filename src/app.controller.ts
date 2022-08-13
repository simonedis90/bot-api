import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { LoginResponse } from './models/betfair';
import { EventsResponseDTO, LoginResponseDTO } from './models/response.dto';
import { BetfairService } from './services/betfair/betfair.service';
import { EventsService } from './services/events/events.service';
import { match_game_new_ } from './services/helper';

class MatchingRequestDTO {
  lv_src: [][];
  h_src: string;
  a_src: string;
}

export let EVENTS;

@ApiHeader({ name: 'x-application', required: true })
@Controller()
export class AppController {
  pushEventsTimeout = 0;
  pushEventsResultTimeout = 0;

  constructor(
    private readonly appService: AppService,
    private readonly bFairService: BetfairService,
    private readonly eventsService: EventsService,
  ) {}

  @ApiResponse({
    type: LoginResponseDTO,
  })
  @ApiQuery({
    name: 'username',
  })
  @ApiQuery({
    name: 'password',
  })
  @Get('/login')
  async login(
    @Req() request,
    @Query('username') username,
    @Query('password') password,
  ): Promise<LoginResponse> {
    return await this.bFairService
      .login(username, password, request)
      .toPromise();
  }

  @ApiHeader({ name: 'x-authentication', required: true })
  @ApiQuery({
    name: 'pass',
  })
  @Get('/load-events')
  async loadAll(@Query('pass') pass, @Req() request) {
    if (pass !== 'P4ssw0rd@123') {
      throw new ForbiddenException();
    }
    await this.eventsService.loadAndPush(request, false, false, false);
  }

  @Post('matching')
  @ApiResponse({})
  @ApiBody({
    type: MatchingRequestDTO,
  })
  matching(
    @Body('lv_src') lv: string, // [][]
    @Body('h_src') h: string,
    @Body('a_src') a: string,
  ) {
    const result = match_game_new_(JSON.parse(lv), h, a);
    return result;
  }

  @ApiHeader({ name: 'x-authentication', required: true })
  @ApiQuery({
    name: 'sport',
    required: false,
    description: 'Sport id retrieve from sports',
  })
  @ApiQuery({
    name: 'live',
    required: false,
    type: Boolean,
    description: 'if tru only live events',
  })
  @ApiQuery({
    name: 'withOdds',
    required: false,
    type: Boolean,
    description: 'get odds',
  })
  @ApiQuery({
    name: 'today',
    required: false,
    type: Boolean,
    description: 'only today events, default true',
  })
  @ApiQuery({
    name: 'ids',
    required: false,
    type: String,
    description: 'eventId divided by , ',
  })
  @ApiQuery({
    name: 'competitions',
    required: false,
    type: String,
    description: 'eventId divided by , ',
  })
  @ApiResponse({
    type: EventsResponseDTO,
    isArray: true,
  })
  @Get('/events')
  async liveEvents(
    @Req() request,
    @Query('sport') sportId,
    @Query('live') live = false,
    @Query('withOdds') withOdds = false,
    @Query('today') today = true,
    @Query('ids') ids: string = null,
    @Query('competitions') competitions: string,
  ) {
    if ((withOdds as any) === 'true') {
      withOdds = Boolean(1);
    }
    if ((today as any) === 'true') {
      today = Boolean(1);
    }
    if ((live as any) === 'true') {
      live = Boolean(1);
    }
    if (withOdds === true) {
      const events = await this.eventsService.loadAndPush(
        request,
        false,
        false,
        today,
        ids,
        competitions?.split(','),
      );
      return events;
    }
    const events = await this.bFairService.events(
      request,
      [sportId],
      live,
      competitions?.split(','),
      today,
    );
    return events;
  }

  @ApiQuery({
    name: 'ids',
    required: false,
    type: String,
    description: 'eventId divided by , ',
  })
  @ApiResponse({
    type: EventsResponseDTO,
    isArray: true,
  })
  @Get('/live-result')
  async liveResult(@Query('ids') ids: string) {
    const idsArr = ids.split(',');

    return await Promise.all(
      idsArr.map((f: any) =>
        this.eventsService.liveResult(f as any).toPromise(),
      ),
    );
  }

  @ApiHeader({ name: 'x-authentication', required: true })
  @ApiResponse({
    type: EventsResponseDTO,
    isArray: true,
  })
  @Get('/ev')
  async ev(@Req() request) {
    const events = await this.eventsService.ev(request);
    return events;
  }

  @ApiHeader({ name: 'x-authentication', required: true })
  @ApiResponse({
    type: EventsResponseDTO,
    isArray: true,
  })
  @ApiQuery({ name: 'sportIds', isArray: false, required: false })
  @Get('/competitions')
  async competitions(@Req() request, @Query('sportIds') sportId) {
    const events = await this.bFairService.competitions(request, sportId || []);
    return events;
  }

  @ApiHeader({ name: 'x-authentication', required: true })
  @ApiResponse({
    type: EventsResponseDTO,
    isArray: true,
  })
  @Get('/sports')
  async eventTypes(@Req() request) {
    const events = await this.bFairService.eventTypes(request);
    return events;
  }

  @ApiHeader({ name: 'x-authentication', required: true })
  @ApiQuery({
    name: 'pass',
  })
  @Get('/load-push')
  async loadAndPush(@Query('pass') pass, @Req() request) {
    if (pass !== 'P4ssw0rd@123') {
      throw new ForbiddenException();
    }
    const fn = async () => {
      for (; true; ) {
        try {
          await new Promise((resolve) => {
            setTimeout(() => resolve(true), 7000);
          });
          const result = await this.eventsService.loadAndPush(request);
          EVENTS = result;
        } catch (e) {}
      }
    };

    fn().then();

    const take = async () => {
      for (; true; ) {
        await new Promise(async (resolve) => {
          setTimeout(() => resolve(true), 1000 * 60 * 5);
          await this.bFairService.keepAlive(request);
        });
      }
    };
    take().then();
  }

  @ApiHeader({ name: 'x-authentication', required: true })
  @ApiResponse({
    type: Boolean,
  })
  @Post('/place-bet')
  async placeBet(@Req() request, @Body() bets) {
    if (bets.size < 2) {
      return this.bFairService.betLessThan2(request, [bets]);
    }
    return await this.bFairService.placeBet(request, [bets]).toPromise();
  }

  @Get('/markets/:id')
  async markets(@Req() request, @Param('id') marketId) {
    return await this.bFairService.marketPrice(request, [marketId]).toPromise();
  }

  @ApiHeader({ name: 'x-authentication', required: true })
  @ApiParam({
    name: 'id',
  })
  @Get('/market-book/:id')
  async marketBook(@Req() request, @Param('id') marketId) {
    return await this.bFairService.listMarketBook(request, marketId);
  }

  @ApiHeader({ name: 'x-authentication', required: true })
  @ApiParam({
    name: 'id',
  })
  @Get('/market-book')
  async marketBooks(@Req() request) {
    return await this.bFairService.listMarketBook(request, null);
  }

  @Get('/get-placed-bets')
  async listPlacedBets(@Req() request) {
    return await this.bFairService.listClearedOrders(request);
  }

  @Get('/alive')
  async alive(@Req() request) {
    return await this.bFairService.keepAlive(request);
  }
}
