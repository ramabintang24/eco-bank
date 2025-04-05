import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

export enum FinanceType {
  INCOME = 'Income',
  EXPENSES = 'Expenses',
}

@Entity({ schema: 'transaction', name: 'eb_bank_finance' })
export class BankFinance {
  @PrimaryGeneratedColumn('uuid', { name: 'finance_id' })
  finance_id: string;

  @Column({ type: 'uuid', name: 'transaction_id' })
  transaction_id: string;

  @Column({ type: 'bigint', default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: FinanceType })
  type: FinanceType;

  @Column({ type: 'bigint', default: 0 })
  profit: number;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
