import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class TransactionService {
    constructor (
     @InjectRepository(Wallet) 
     private walletRepository: Repository<Wallet>,
    ) {}

    async getWalletByUserId(userId: string): Promise<{ balance: number }> {
      const wallet = await this.walletRepository.findOne({
          where: { user_id: userId },
          select: ['balance'], // Hanya mengambil balance
      });
  
      if (!wallet) {
          throw new NotFoundException('Wallet not found');
      }
  
      return { balance: wallet.balance };
  }  
}