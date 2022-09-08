import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EVENTS } from './app.controller';

config({ path: (process.env.NODE_ENV || '') + '.env' });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebSocketServer = require('websocket').server;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const http = require('http');

// eslint-disable-next-line @typescript-eslint/no-empty-function
const server = http.createServer(function (request, response) {});
// eslint-disable-next-line @typescript-eslint/no-empty-function
server.listen(1371, function () {});

export const wsServer = new WebSocketServer({
  httpServer: server,
});
const store: { [apiKey: string]: { [eventId: string]: boolean } } = {};
wsServer.on('request', async (request) => {
  const connection = request.accept(null, request.origin);

  connection.on('open', async (connection) => {
    console.log('connected');
    connection.send(JSON.stringify({ events: EVENTS || [] }));
  });

  connection.on('message', async (message) => {
    console.log('message', message);

    const data = JSON.parse(message.utf8Data);

    if (data.connect) {
      connection.key = data.apiKey;
    }

    if (data.watch) {
      if (!store[data.apiKey]) {
        store[data.apiKey] = {};
      }
      store[connection][data.watch] = !store[data.apiKey][data.watch];
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  connection.on('close', function (connection) {});
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .addApiKey({ type: 'apiKey' }, 'x-authorization')
    .addApiKey({ type: 'apiKey' }, 'x-application')
    .setTitle('Betfair API extension')
    .setDescription('BF')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(3001);
}

bootstrap();
