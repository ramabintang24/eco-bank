// detail-transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity({ schema: 'transaction', name: 'eb_detail_transaction' })
export class DetailTransaction {
  @PrimaryGeneratedColumn('uuid')
  detail_id: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' }) // Sesuaikan nama kolomnya
  transaction: Transaction;

  @Column('uuid', { name: 'transaction_id' })
  transaction_id: string;

  @Column({ type: 'uuid' })
  item_id: string;

  @Column({ type: 'bigint', default: 0 })
  unit: number;

  @Column({ type: 'bigint', default: 0 })
  sub_total: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
