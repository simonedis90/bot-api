import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  betFairApi: string;
  production: boolean;
  login: string;
  basePath: string;
  keepAlive: string;
  SCRAPER_PARSER: string;
  SCRAPER_DATABASE: string;
  constructor() {
    const env = process.env;
    this.betFairApi = env.betFairApi;
    this.login = env.login;
    this.production = Boolean(env.production);
    this.basePath = env.api + '/exchange/betting/json-rpc/v1'; // + env.path;
    this.keepAlive = env.keepAlive;
    this.SCRAPER_PARSER = env.SCRAPER_PARSER;
    this.SCRAPER_DATABASE = env.SCRAPER_DATABASE;
  }
}
