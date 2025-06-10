import { Controller, Get } from '@nestjs/common';
import { SqsService } from '../services/sqs.service';

@Controller('sqs')
export class SqsController {
  constructor(private readonly sqsService: SqsService) {}
}
