export interface SQSMessage {
  MessageId: string;
  ReceiptHandle: string;
  MD5OfBody: string;
  Body: string;
  Attributes: {
    SenderId: string;
    ApproximateFirstReceiveTimestamp: string;
    ApproximateReceiveCount: string;
    SentTimestamp: string;
    SequenceNumber: string;
    MessageDeduplicationId: string;
    MessageGroupId: string;
  };
}

export interface ReceivedMessage {
  MessageId: string;
  ReceiptHandle: string;
  MD5OfBody: string;
  Body: string;
  Attributes: {
    SenderId: string;
    ApproximateFirstReceiveTimestamp: string;
    ApproximateReceiveCount: string;
    SentTimestamp: string;
    SequenceNumber: string;
    MessageDeduplicationId: string;
    MessageGroupId: string;
  };
}
