import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'error_log' })
export class ErrorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  app: string;

  @Column()
  body: string;

  @Column()
  method: string;

  @Column()
  ip: string;

  @Column('json', { nullable: true })
  query: Record<string, any>;

  @Column('json', { nullable: true })
  headers: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  id_user?: string;

  @Column()
  responseTime: number;

  @Column()
  errorMessage: string;

  @Column()
  errorStack: string;
}
