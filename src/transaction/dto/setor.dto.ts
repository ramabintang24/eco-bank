import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TransactionType } from '../entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

class TransactionItemDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID unik dari barang',
  })
  @IsUUID()
  item_id: string;

  @ApiProperty({
    example: 2,
    description: 'Jumlah unit barang yang dibeli',
  })
  @IsNumber()
  unit: number;

  @ApiProperty({
    example: 400,
    description: 'Subtotal harga berdasarkan jumlah unit',
  })
  @IsNumber()
  sub_total: number;
}

export class CreateTransactionDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID dompet yang digunakan untuk transaksi',
  })
  @IsUUID()
  wallet_id: string;

  @ApiProperty({
    example: 1000,
    description: 'Total jumlah uang dalam transaksi',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  total_amount: number;

  @ApiProperty({
    example: TransactionType.Deposit,
    enum: TransactionType,
    description: 'Jenis transaksi (DEPOSIT atau WITHDRAW)',
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    type: [TransactionItemDto],
    description: 'Daftar barang dalam transaksi',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];
}
