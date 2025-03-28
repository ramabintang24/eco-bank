import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { DetailTransaction } from './entities/detail-transaction.entity';
import { CreateTransactionDto } from './dto/setor.dto';
import { CreateIncomeDto } from './dto/income.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { Item } from 'src/item/entities/item.entity';

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
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
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
    async getAllTransaction(): Promise<any[]> {
      const transactions = await this.transactionRepository.find({
        relations: ['wallet', 'wallet.user'],
        where: { type: In(['Deposit', 'Withdraw']) },
        order: { created_at: 'DESC' }
      });
    
      return transactions.map(transaction => ({
        transaction_id: transaction.transaction_id,
        total_amount: transaction.total_amount,
        type: transaction.type,
        created_at: transaction.created_at,
        wallet_id: transaction.wallet.wallet_id,
        balance: transaction.current_balance,
        user_id: transaction.wallet.user.user_id,
        name: transaction.wallet.user.name,
        email: transaction.wallet.user.email,
      }));
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
          item_name: item.name,
          unit: item.unit,
          purchase_price: item.purchase_price,
          sub_total: item.sub_total,
        })
      );
      
      const savedDetailTransaction = await this.detailTransactionRepository.save(detailTransactions);
      
      // Update jumlah unit di tabel item
      for (const item of dto.items) {
        const existingItem = await this.itemRepository.findOne({ where: { item_id: item.item_id } });
        if (existingItem) {
          existingItem.unit = Number(existingItem.unit) + Number(item.unit);
          await this.itemRepository.save(existingItem);
        }
      }
      
      return {
        transaction: savedTransaction,
        details: savedDetailTransaction,
      };
    }


    async getDetailTransaction(transactionId: string) {
      const transaction = await this.transactionRepository.find({
        where: { transaction_id: transactionId },
        relations: [ 'details', 'user' ],
      });
  
      if (!transaction) {
        throw ('Transaction not found');
      }
  
      return transaction.map(transaction => ({
        transaction_id: transaction.transaction_id,
        user: transaction.user,
        details: transaction.details,
        total_amount: transaction.total_amount,
        created_at: transaction.created_at,
      }));    }

    async createIncome(dto: CreateIncomeDto) {
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

     // ===> GET ALL TRANSACTION <===
     async getAllFinance(): Promise<Transaction[]> {
      return this.transactionRepository.find({
        relations: ['wallet', 'wallet.user'],
        where: { type: 'Withdraw'},
        order: { created_at: 'DESC' }
      });
    }
    
    async withdraw(userId: string, withdrawDto: WithdrawDto): Promise<string> {
      const { amount } = withdrawDto;
      
      if (amount < 5000) {
        throw new BadRequestException('Minimal tarik tunai adalah Rp5.000');
      }
  
      const wallet = await this.walletRepository.findOne({ where: { user_id: userId } });
      if (!wallet) {
        throw new NotFoundException('Dompet tidak ditemukan');
      }
  
      if (wallet.balance < amount) {
        throw new BadRequestException('Saldo tidak mencukupi');
      }
  
      console.log ('saldo', amount)
      // Simpan transaksi
      const transaction = this.transactionRepository.create({
        wallet_id: wallet.wallet_id,
        total_amount: amount,
        type: 'Withdraw',
        created_at: new Date(),
      });
      await this.transactionRepository.save(transaction);
  
      return `Tarik tunai sebesar Rp${amount} berhasil.`;
    }
  }