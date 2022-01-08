import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BetfairService } from './services/betfair/betfair.service';
import { ConfigService } from './services/config/config.service';
import { HttpCustomService } from './services/http-custom/http-custom.service';
import { EventsService } from './services/events/events.service';
import { DatabaseModule } from './database/database.module';
import { scraperRepository } from './database/repositories/scraper';
import { AuthController } from './auth.controller';
import { NewController } from "./new.controller";
import { botRepository } from "./database2_0/provider";
import { DatabaseBotModule } from "./database2_0/database.module";
import { MoneyController } from "./money.controller";
import { WebsocketService } from "./services/websocket.service";
import { BridgeService } from "./services/bridge";
import { TelegramService } from "./services/telegram";

@Module({
  imports: [HttpModule, DatabaseModule, DatabaseBotModule],
  controllers: [AppController, AuthController, NewController, MoneyController],
  providers: [
    AppService,
    BetfairService,
    ConfigService,
    HttpCustomService,
    EventsService,
    WebsocketService,
    TelegramService,
    BridgeService,
    ...scraperRepository,
    ...botRepository
  ],
})
export class AppModule {
  constructor(ws: WebsocketService, te: TelegramService) {
    te.init();
  }
}
