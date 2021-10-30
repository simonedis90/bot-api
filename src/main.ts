import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EVENTS } from './app.controller';

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
