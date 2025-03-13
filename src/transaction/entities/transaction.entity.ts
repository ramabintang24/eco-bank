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
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum TransactionType {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}

@Entity({ schema: 'transaction', name: 'eb_transaction' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'transaction_id' })
  transaction_id: string;

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
  @Transform(
    ({ value }) => {
      if (value) {
        return value
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      return value;
    },
    { toPlainOnly: true },
  ) // Hanya ketika diserialisasi
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ type: () => [Wallet] })
  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @ApiProperty({
    description: 'Tag-tag terkait catatan',
    type: () => [User],
  })
  @ManyToMany(() => User)
  @JoinTable({
    name: 'eb_wallet',
    joinColumn: {
      name: 'wallet_id',
      referencedColumnName: 'wallet_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'user_id',
    },
  })
  user: User[];
}
