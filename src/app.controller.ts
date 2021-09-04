import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { BetfairService } from './services/betfair/betfair.service';
import { EventsService } from './services/events/events.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginResponse } from './models/betfair';
import {
  EventDTO,
  EventsResponseDTO,
  LoginResponseDTO,
} from './models/response.dto';

@ApiHeader({ name: 'x-application', required: true })
@Controller()
export class AppController {
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
    await this.eventsService.load(request);
  }

  @ApiResponse({
    type: EventsResponseDTO,
    isArray: true,
  })
  @Get('/events')
  async events() {
    return await this.eventsService.events();
  }

  @ApiHeader({ name: 'x-authentication', required: true })
  @ApiResponse({
    type: EventsResponseDTO,
    isArray: true,
  })
  @Get('/live-events')
  async liveEvents(@Req() request) {
    const events = await this.eventsService.loadAndPush(request);
    return events.filter(
      (f) => f.marketPrices.filter((f) => f.inplay).length > 0,
    );
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
        await this.eventsService.loadAndPush(request);
        await new Promise((resolve) => {
          setTimeout(() => resolve(true), 5000);
        });
      }
    };
    fn().then();
  }
}
