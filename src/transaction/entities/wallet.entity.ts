import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Transaction } from './transaction.entity';

@Entity({ schema: 'transaction', name: 'eb_wallet' })
export class Wallet {
  @PrimaryGeneratedColumn('uuid', { name: 'wallet_id' })
  wallet_id: string;

  @Column('uuid', { name: 'user_id' })
  user_id: string;

  @Column('bigint')
  balance: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date | null;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  @JoinColumn({ name: 'transaction_id' })
  transactions: Transaction[];

  @ManyToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
