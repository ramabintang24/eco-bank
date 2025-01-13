// src/auth/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
// import { Exclude } from 'class-transformer';

@Entity({ schema: 'auth', name: 'ct_users' })
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  role_id: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ length: 100 })
  name: string;

  // @Exclude()
  @Column({ type: 'text' })
  password: string;

  @Column({ length: 20 })
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;
}
