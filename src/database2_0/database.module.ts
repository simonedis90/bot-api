import { Module } from '@nestjs/common';
import { DatabaseBotProvider } from './provider';

@Module({
  imports: [],
  providers: [...DatabaseBotProvider],
  exports: [...DatabaseBotProvider],
})
export class DatabaseBotModule {}
