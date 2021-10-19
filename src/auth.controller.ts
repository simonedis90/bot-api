import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { BetfairService } from './services/betfair/betfair.service';
import {
  ApiBody,
  ApiHeader,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginRequestDTO, LoginResponseDTO } from './models/response.dto';
import { LoginResponse } from './models/betfair';

@ApiHeader({
  name: 'x-application',
  required: true,
})
@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly appService: AppService,
    private readonly bFairService: BetfairService,
  ) {}

  @ApiResponse({
    type: LoginResponseDTO,
    status: 200,
  })
  @ApiBody({
    type: LoginRequestDTO,
  })
  @Post('/login')
  async login(
    @Req() request,
    @Body() body: LoginRequestDTO,
  ): Promise<LoginResponse> {
    return await this.bFairService
      .login(body.username, body.password, request)
      .toPromise();
  }
}
