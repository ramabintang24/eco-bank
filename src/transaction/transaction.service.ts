import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { DetailTransaction } from './entities/detail-transaction.entity';
import { CreateTransactionDto } from './dto/setor.dto';

@Injectable()
export class TransactionService {
    constructor (
     @InjectRepository(User) 
     private readonly userRepository: Repository<User>,
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

    // ===> GET ALL TRANSACTION <===
    async getAllTransaction(): Promise<Transaction[]> {
      return this.transactionRepository.find({
        relations: ['wallet', 'wallet.user'],
        order: { created_at: 'DESC' }
      });
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
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      const wallet = await this.walletRepository.findOne({
        where: { user_id: user.user_id },
      });
      const transaction = this.transactionRepository.create({
        wallet_id: wallet.wallet_id,
        total_amount: dto.total_amount,
        type: 'Deposit',
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

    async getDetailTransaction(transactionId: string) {
      const transaction = await this.transactionRepository.findOne({
        where: { transaction_id: transactionId },
        relations: ['details'], // Pastikan ada relasi dengan tabel detail transaksi
      });
  
      if (!transaction) {
        throw ('Transaction not found');
      }
  
      return transaction; // Pastikan entity Transaction memiliki properti `details`
    }
  }