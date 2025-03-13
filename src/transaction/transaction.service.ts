import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
    constructor (
     @InjectRepository(Wallet) 
     private readonly walletRepository: Repository<Wallet>,
     @InjectRepository(Transaction) 
     private readonly transactionRepository: Repository<Transaction>,
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
        where: { user_id: userId }, // Use user_id directly
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const transaction = await this.transactionRepository.find({
        where: { wallet_id: wallet.wallet_id }, // Use user_id directly
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }
    
      return transaction;  
    }
}