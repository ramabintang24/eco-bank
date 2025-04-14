import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { User } from 'src/user/entities/user.entity';
import { DetailTransaction } from './detail-transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { BankFinance } from './finance.entity';

export enum TransactionType {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  Income = 'Income',
}

@Entity({ schema: 'transaction', name: 'eb_transaction' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'transaction_id' })
  transaction_id: string;

  @Column('varchar', { length: 255, name: 'admin_name', nullable: true })
  admin_name: string;

  @Column('uuid', { name: 'wallet_id' })
  wallet_id: string;

  @Column('bigint')
  total_amount: number;

  @Column('bigint')
  current_balance: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: true,
  })
  @Transform(({ value }) => value, { toPlainOnly: true })
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @OneToMany(
    () => DetailTransaction,
    (detailTransaction) => detailTransaction.transaction,
    {
      cascade: true,
    },
  )
  details: DetailTransaction[];
}
