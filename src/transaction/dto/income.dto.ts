import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEmail,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class IncomeDto {
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

export class CreateIncomeDto {
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
    type: [IncomeDto],
    description: 'Daftar barang dalam transaksi',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomeDto)
  items: IncomeDto[];
}
