import { Module } from '@nestjs/common';
import { ScheduleService } from './service/schedule.service';
import { ScheduleController } from './controller/schedule.controller';
import { EthersService } from '../ethers/ethers.service';
import { ScheduleModule as Schedule } from '@nestjs/schedule';
import { SqsModule } from '../sqs/sqs.module';

@Module({
  imports: [Schedule.forRoot(), SqsModule],
  controllers: [ScheduleController],
  providers: [ScheduleService, EthersService],
})
export class ScheduleModule {}
