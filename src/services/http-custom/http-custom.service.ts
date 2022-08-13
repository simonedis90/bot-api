import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';

@Injectable()
export class HttpCustomService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private buildHeaders(config: any = {}, req: Request) {
    let headers = config.headers;
    headers = {
      ...headers,
      'X-Application': req.headers['x-application'],
      'X-Authentication': req.headers['x-authentication'] || '',
    };
    config.headers = headers;
    return config;
  }

  get<T>(url: string, config: AxiosRequestConfig, req: Request): Observable<T> {
    return this.httpService
      .get<T>(url, this.buildHeaders(config, req))
      .pipe(map((f) => f.data));
  }

  post<body, response>(
    url: string,
    body: body,
    config: AxiosRequestConfig,
    req: Request,
  ): Observable<response> {
    return this.httpService
      .post<response>(url, body, this.buildHeaders(config, req))
      .pipe(map((f) => f.data));
  }
}
