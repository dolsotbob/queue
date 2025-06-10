import { Inject, Injectable, forwardRef, Logger } from '@nestjs/common';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { SqsService } from './sqs.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EthersService } from '../../ethers/ethers.service';

@Injectable()
export class SqsProducer {
  constructor(
    @Inject(forwardRef(() => SqsService))
    private readonly sqsService: SqsService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(Logger)
    private readonly logger = new Logger(SqsProducer.name),
    private readonly ethersService: EthersService
  ) {
    this.eventEmitter.setMaxListeners(20);
  }

  getRand10000() {
    return Math.floor(Math.random() * 10001);
  }

  async send(address: string): Promise<{ message: 'Task Sync Processing' }> {
    const now = new Date().toString().replace(/[^a-zA-Z0-9]/g, '');
    const rand = this.getRand10000();

    const uniqueId = this.ethersService.keccak256(now + rand);

    const sqs = this.sqsService.getSQSCliendt();

    const params = {
      MessageBody: address,
      QueueUrl: this.sqsService.getQueueUrl(),
      MessageGroupId: address,
      MessageDeduplicationId: `UniqueId_${uniqueId}`,
    };

    const command = new SendMessageCommand(params);

    try {
      const data = await sqs.send(command);
      this.logger.log(`[Send processing ${data.MessageId}] : ${address}`);
      this.eventEmitter.emit('receive');
      return { message: 'Task Sync Processing' };
    } catch (err) {
      this.logger.error(
        `[sqs - send] : {
          "input": {
            "options":"address"
          },
          "error":"${err.message}"
        }`
      );
      return { message: 'Task Sync Processing' };
    }
  }
}
