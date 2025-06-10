import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ethers,
  parseEther,
  formatEther,
  keccak256,
  toUtf8Bytes,
} from 'ethers';

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
    return account.getNonce('pending');
  }

  parseEther(data: string) {
    return parseEther(data);
  }

  formatEther(data: bigint) {
    return formatEther(data);
  }

  keccak256(data: string) {
    return keccak256(toUtf8Bytes(data));
  }

  getBalance(address: string) {
    return this.provider.getBalance(address);
  }

  async send1ETH(nonce: number) {
    const tx = await this.getAccount1().sendTransaction({
      to: this.getAccount2().address,
      value: parseEther('1'),
      nonce,
      gasLimit: 21000n,
    });
    await tx.wait();
  }

  async recoverBalance() {
    const gasLimit = 21000n;
    const gasPrice = BigInt(await this.provider.send('eth_gasPrice', []));
    const balance = await this.getBalance(this.getAccount2().address);
    const gasFee = gasPrice * gasLimit;
    if (balance <= gasFee) {
      throw new Error('잔액이 가스 수수료보다 적어 회수가 불가능합니다.');
    }

    const value = balance - gasFee;

    const tx = await this.getAccount2().sendTransaction({
      to: this.getAccount1().address,
      value,
      gasLimit,
      gasPrice,
    });
    await tx.wait();
  }
}
