import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
