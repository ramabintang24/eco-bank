import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class TransactionService {
    constructor (
     @InjectRepository(Wallet) 
     private readonly walletRepository: Repository<Wallet>,
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
}