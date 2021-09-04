import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

wsServer.on('request', async (request) => {
  const connection = request.accept(null, request.origin);

  connection.on('message', async (message) => {});
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
