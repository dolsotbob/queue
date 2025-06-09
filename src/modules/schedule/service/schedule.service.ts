import { Injectable, Logger } from '@nestjs/common';
import { EthersService } from '../../ethers/ethers.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly ethersService: EthersService) {}

  async tenTimesOneEthTransfer() {
    const start = Date.now();
    const tenTime = 10;
    let result: boolean = false;

    try {
      for (let i = 0; i < tenTime; i++) {
        const nonce = await this.ethersService.getNonce(
          this.ethersService.getAccount1()
        );
        await this.ethersService.send1ETH(nonce);
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
