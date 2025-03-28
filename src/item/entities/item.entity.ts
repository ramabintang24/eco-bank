import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { DetailTransaction } from 'src/transaction/entities/detail-transaction.entity';

@Entity({ schema: 'transaction', name: 'eb_item' })
export class Item {
  @PrimaryGeneratedColumn('uuid')
  item_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'bigint', default: 0 })
  unit: number;

  @Column({ type: 'bigint', default: 0 })
  purchase_price: number;

  @Column({ type: 'bigint', default: 0 })
  selling_price: number;

  // @OneToMany(
  //   () => DetailTransaction,
  //   (detailTransaction) => detailTransaction.item,
  // )
  // details: DetailTransaction[];

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Exclude()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  deleted_at: Date | null;
}
