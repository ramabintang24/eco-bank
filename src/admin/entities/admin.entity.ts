import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string;

  @Column()
  barang: string;

  @Column('decimal', { precision: 10, scale: 2 })
  harga: number;

  @Column()
  stok: number;
}
