
import { Injectable, Logger } from '@nestjs/common';
import { EthersService } from '../../ethers/ethers.service';
import { SqsProducer } from '../../sqs/services/sqs.producer';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private readonly ethersService: EthersService,
    private readonly sqsProducer: SqsProducer
  ) { }

  async tenTimesOneEthTransfer() {
    const start = Date.now();
    const tenTime = 10;
    let result: boolean = false;

    const balance = Number(
      this.ethersService.formatEther(
        await this.ethersService.getBalance(
          this.ethersService.getAccount1().address
        )
      )
    );
    if (balance < 10) {
      this.logger.warn(`[tenTimesOneEthTransfer] 잔액을 복구합니다.`);
      await this.ethersService.recoverBalance();
      return;
    }

    try {
      for (let i = 0; i < tenTime; i++) {
        await this.sqsProducer.send(this.ethersService.getAccount2().address);
      }
      result = true;
    } catch (error) {
      this.logger.error(`[tenTimesOneEthTransfer] 에러 발생: ${error.message}`);
    } finally {
      if (result) {
        const end = Date.now();
        this.logger.log(`[tenTimesOneEthTransfer] 실행 시간: ${end - start}ms`);
      }
    }
  }
}
