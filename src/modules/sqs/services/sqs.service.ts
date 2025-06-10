import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  SQSClient,
  QueueAttributeName,
  GetQueueAttributesCommand,
} from '@aws-sdk/client-sqs';
import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
  Statistic,
} from '@aws-sdk/client-cloudwatch';
import { QueueMetrics } from '../../../common/types/queue';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqsService {
  private readonly sqs: SQSClient;
  private readonly queueUrl: string;
  private readonly cloudWatchClient: CloudWatchClient;

  constructor(
    private configService: ConfigService,
    @Inject(Logger)
    private readonly logger = new Logger(SqsService.name)
  ) {
    this.sqs = new SQSClient({
      region: this.configService.get('REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
    this.queueUrl = this.configService.get('QUEUE_URL') || '';
    this.cloudWatchClient = new CloudWatchClient({
      region: this.configService.get('REGION'),
    });
  }

  getSQSCliendt() {
    return this.sqs;
  }

  getQueueUrl() {
    return this.queueUrl;
  }

  async getNumberOfMessages(): Promise<QueueMetrics> {
    const results: Partial<QueueMetrics> = {};
    const queueName = this.queueUrl.split('/').pop();
    const statistics: Statistic[] = ['SampleCount'];

    const waitPrams = {
      QueueUrl: this.queueUrl,
      AttributeNames: [QueueAttributeName.ApproximateNumberOfMessages],
    };
    const waitCommand = new GetQueueAttributesCommand(waitPrams);
    const { Attributes } = await this.sqs.send(waitCommand); // waiting
    if (!Attributes) {
      throw new Error('SQS queue attributes are undefined');
    }

    const metrics = [
      'NumberOfMessagesDeleted', // processed
      'ApproximateNumberOfMessagesNotVisible', // failed
    ];

    results.waiting =
      Attributes[QueueAttributeName.ApproximateNumberOfMessages];

    for (const metricName of metrics) {
      const key =
        metricName === 'NumberOfMessagesDeleted' ? 'processed' : 'failed';
      const params = {
        EndTime: new Date(),
        MetricName: metricName,
        Namespace: 'AWS/SQS',
        Period: 86400,
        StartTime: new Date('2025-06-10'),
        Dimensions: [
          {
            Name: 'QueueName',
            Value: queueName!,
          },
        ],
        Statistics: key === 'processed' ? (['Sum'] as Statistic[]) : statistics,
      };

      const command = new GetMetricStatisticsCommand(params);

      try {
        const data = await this.cloudWatchClient.send(command);
        results[key] =
          data.Datapoints && data.Datapoints.length > 0
            ? key === 'processed'
              ? `${data.Datapoints[0].Sum}` || '0'
              : key === 'failed'
                ? `${data.Datapoints[0].SampleCount}` || '0'
                : '0'
            : '0';
      } catch (error) {
        this.logger.error(
          `[sqs - getNumberOfMessages] : {
            "error":"Error fetching SQS metric (${metricName}) ${error.message}"
          }`
        );
        throw error;
      }
    }

    return results as QueueMetrics;
  }
}
