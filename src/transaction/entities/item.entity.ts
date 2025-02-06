import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'transaction', name: 'eb_item' })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  item?: string;

  @Column({ nullable: true })
  product_photo?: string;

  @Column({ nullable: true, type: 'decimal' })
  purchase_price?: number;

  @Column({ nullable: true, type: 'decimal' })
  selling_price?: number;

  @Column({ nullable: true, type: 'int' })
  unit?: number;
}
