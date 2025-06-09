import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, parseEther, formatEther } from 'ethers';

@Injectable()
export class EthersService {
  private provider: ethers.JsonRpcProvider;
  private account1: ethers.Wallet;
  private account2: ethers.Wallet;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    const privateKey1 = this.configService.get<string>('ACCOUNT1_PRIVATE_KEY');
    const privateKey2 = this.configService.get<string>('ACCOUNT2_PRIVATE_KEY');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.account1 = new ethers.Wallet(privateKey1!, this.provider);
    this.account2 = new ethers.Wallet(privateKey2!, this.provider);
  }

  getAccount1() {
    return this.account1;
  }

  getAccount2() {
    return this.account2;
  }

  getNonce(account: ethers.Wallet) {
    return account.getNonce();
  }

  parseEther(data: string) {
    return parseEther(data);
  }

  formatEther(data: bigint) {
    return formatEther(data);
  }

  // 위 코드는 지우지 마세요.

  async send1ETH(nonce: number) {
    const tx = {
      to: this.getAccount2().address,
      value: parseEther('1'),
      nonce,
      gasLimit: 21000n,
    };
    await this.getAccount1().sendTransaction(tx);
  }
}
