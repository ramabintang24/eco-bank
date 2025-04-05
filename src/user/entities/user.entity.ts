// src/auth/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from 'src/transaction/entities/wallet.entity';

@Entity({ schema: 'auth', name: 'eb_user' })
export class User {
  @ApiProperty({
    description: 'ID unik pengguna',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @ApiProperty({ description: 'Nama pengguna', example: 'John Doe' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Alamat email pengguna',
    example: 'pengguna@contoh.com',
  })
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Exclude()
  @ApiProperty({
    description: 'Password pengguna',
    example: '********',
  })
  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: ['Admin', 'User'],
    nullable: false,
  })
  role: string;

  @ApiProperty({
    description: 'URL profil pengguna',
    example: 'https://contoh.com/profil/johndoe',
  })
  @Column({ type: 'text', nullable: false })
  @Transform(({ value }) =>
    value ? `${process.env.OBJECT_BASE_URL}/${value}` : null,
  )
  profile_url: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({
    type: 'enum',
    enum: ['Laki-Laki', 'Perempuan'],
    nullable: true,
  })
  gender: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone_number: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  last_active_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date | null;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;
}
