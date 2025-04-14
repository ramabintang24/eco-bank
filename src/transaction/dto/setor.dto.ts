import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEmail,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class TransactionItemDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID unik dari barang',
  })
  @IsUUID()
  item_id: string;

  @ApiProperty({
    example: 'Pensil',
    description: 'Nama barang yang dibeli',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 200,
    description: 'Harga beli barang per unit',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  purchase_price: number;

  @ApiProperty({
    example: 2,
    description: 'Jumlah unit barang yang dibeli',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  unit: number;

  @ApiProperty({
    example: 400,
    description: 'Subtotal harga berdasarkan jumlah unit',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  sub_total: number;
}

export class CreateTransactionDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 1000,
    description: 'Total jumlah uang dalam transaksi',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  total_amount: number;

  @ApiProperty({
    example: 'Min Eco',
    description: 'Nama Admin yang Bertugas',
  })
  @IsString()
  admin_name: string;

  @ApiProperty({
    type: [TransactionItemDto],
    description: 'Daftar barang dalam transaksi',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];
}
