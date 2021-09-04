import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BetfairService } from './services/betfair/betfair.service';
import { ConfigService } from './services/config/config.service';
import { HttpCustomService } from './services/http-custom/http-custom.service';
import { EventsService } from './services/events/events.service';
import { DatabaseModule } from './database/database.module';
import { scraperRepository } from './database/repositories/scraper';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [AppController],
  providers: [
    AppService,
    BetfairService,
    ConfigService,
    HttpCustomService,
    EventsService,
    ...scraperRepository,
  ],
})
export class AppModule {

}
