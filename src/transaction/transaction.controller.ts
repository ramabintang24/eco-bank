import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Wallet } from './entities/wallet.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';

@Controller('transaction') 
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @Get()
  // @UseGuards(AuthGuard('jwt'))
  // @ApiOperation({ summary: 'Get all wallet' })
  // getAll(): Promise<Wallet[]> {
  //   return this.transactionService.findAll();
  // }

  @Get(':userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get Wallet Balance by userId' })
  async getWalletByUserId(@Param('userId') userId: string): Promise<{ balance: number }> {
      return this.transactionService.getWalletByUserId(userId);
  }
  
}
