import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class TransactionService {
    constructor (
     @InjectRepository(Wallet) 
     private Walletrepository: Repository<Wallet>,
    ) {}

    async getWalletByUserId(userId:number):Promise<Wallet> {
        const Wallet = await this.Walletrepository.findOne({where:{userId} });
        if (!wallet) {
          throw new NotFoundException('wallet not ')
        }
    }
}