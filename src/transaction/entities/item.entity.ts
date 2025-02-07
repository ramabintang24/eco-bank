import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ schema: 'transaction', name: 'eb_item' })
export class Item {
  @PrimaryGeneratedColumn()
  item_id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  unit?: number;

  @Column({ nullable: true, type: 'decimal' })
  purchase_price?: number;

  @Column({ nullable: true, type: 'decimal' })
  selling_price?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date | null;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

}
