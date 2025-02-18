import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Wallet } from './entities/wallet.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('wallet/:userId')
  async getWallet(@Param('userId', ParseIntPipe) userId: number): Promise<Wallet> {
    return this.transactionService.getWalletByUserId(userId);
  }
}
