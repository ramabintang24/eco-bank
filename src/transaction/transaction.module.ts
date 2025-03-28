import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entities/transaction.entity';
import { DetailTransaction } from './entities/detail-transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { Item } from 'src/item/entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Transaction,
      DetailTransaction,
      Item,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
