import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EVENTS } from './app.controller';
const bodyParser = require('body-parser');

config({ path: (process.env.NODE_ENV || '') + '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .addApiKey({ type: 'apiKey' }, 'x-authorization')
    .addApiKey({ type: 'apiKey' }, 'x-application')
    .setTitle('Betfair API extension')
    .addTag('API')
    .addTag('money-management')
    .addTag('Auth')
    .addTag('Events')
    .setDescription('BF')
    .setVersion('1.0')
    .build();
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.enableCors();
  await app.listen(3001);
}

bootstrap();
