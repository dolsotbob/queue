import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ScheduleService } from '../service/schedule.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  tenTimesOneEthTransfer() {
    this.scheduleService.tenTimesOneEthTransfer();
  }
}
