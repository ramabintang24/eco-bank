import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { DetailTransaction } from './entities/detail-transaction.entity';
import { CreateTransactionDto } from './dto/setor.dto';

@Injectable()
export class TransactionService {
    constructor (
     @InjectRepository(Wallet) 
     private readonly walletRepository: Repository<Wallet>,
     @InjectRepository(Transaction) 
     private readonly transactionRepository: Repository<Transaction>,
     @InjectRepository(DetailTransaction)
    private detailTransactionRepository: Repository<DetailTransaction>,
    ) {}

    async getBalance(userId: string) {
      const wallet = await this.walletRepository.findOne({
        where: { user_id: userId }, // Use user_id directly
      });
    
      if (!wallet) {
        throw new Error('Wallet not found');
      }
    
      return wallet.balance;  
    }

    async getUserTransaction(userId: string) {
      const wallet = await this.walletRepository.findOne({
        where: { user_id: userId },
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const transaction = await this.transactionRepository.find({
        where: { wallet_id: wallet.wallet_id },
        order: { created_at: 'DESC' }
        // Use user_id directly
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }
    
      return transaction;  
    }

    async createTransaction(dto: CreateTransactionDto) {
      const transaction = this.transactionRepository.create({
        wallet_id: dto.wallet_id,
        total_amount: dto.total_amount,
        type: dto.type,
      });
      
      const savedTransaction = await this.transactionRepository.save(transaction);
      
      const detailTransactions = dto.items.map(item => 
        this.detailTransactionRepository.create({
          transaction_id: savedTransaction.transaction_id, // Ambil UUID-nya
          item_id: item.item_id,
          unit: item.unit,
          sub_total: item.sub_total,
        })
      );
      
      await this.detailTransactionRepository.save(detailTransactions);
      
      return {
        transaction: savedTransaction,
        details: detailTransactions,
      };
    }
}