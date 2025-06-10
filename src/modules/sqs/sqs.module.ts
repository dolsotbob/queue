import { Module, forwardRef, Logger } from '@nestjs/common';
import { SqsService } from '../sqs/services/sqs.service';
import { SqsEvent } from './event/sqs.event';
import { SqsController } from './controller/sqs.controller';
import { SqsProducer } from '../sqs/services/sqs.producer';
import { SqsConsumer } from '../sqs/services/sqs.consumer';
import { EthersService } from '../ethers/ethers.service';

@Module({
  imports: [],
  providers: [
    SqsService,
    SqsEvent,
    Logger,
    SqsProducer,
    SqsConsumer,
    EthersService,
  ],
  controllers: [SqsController],
  exports: [SqsService, SqsEvent, SqsProducer, SqsConsumer],
})
export class SqsModule {}
