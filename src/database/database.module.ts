import { Module } from '@nestjs/common';
import { DatabaseProviders } from './providers/provider';

@Module({
  imports: [],
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders]
})
export class DatabaseModule {
}
