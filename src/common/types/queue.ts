export type TQueueSend = {
  jobId: string;
};

export type TQueueFailed = {
  jobId: string;
  errorMessage: string;
};

export class QueueFailed {
  jobId: string;
  errorMessage: string;
}

export interface QueueMetrics {
  waiting: string;
  NumberOfMessagesDeleted: string;
  ApproximateNumberOfMessagesNotVisible: string;
}
