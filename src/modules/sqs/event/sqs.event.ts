import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SqsConsumer } from '../services/sqs.consumer';

@Injectable()
export class SqsEvent {
  private isProcessing = false;

  constructor(private sqsConsumer: SqsConsumer) {}

  @OnEvent('receive')
  async onReceive() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    try {
      await this.sqsConsumer.excuteProcess();
    } finally {
      this.isProcessing = false;
    }
  }
}
