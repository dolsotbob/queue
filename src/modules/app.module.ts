import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ScheduleModule } from './schedule/schedule.module';
import { EthersService } from './ethers/ethers.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, EthersService],
  exports: [EthersService],
})
export class AppModule {}
