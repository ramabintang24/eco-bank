import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({
    example: 'Kardus',
    description: 'Nama barang yang dijual',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  file?: any[];

  @ApiProperty({
    example: 150,
    description: 'Harga beli barang dalam rupiah',
    required: false,
  })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'purchase_price harus berupa angka' })
  purchase_price: number;

  @ApiProperty({
    example: 200,
    description: 'Harga jual barang dalam rupiah',
    required: false,
  })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'selling_price harus berupa angka' })
  selling_price: number;

  // @ApiProperty({ example: 'https://example.com/laptop.jpg', description: 'URL foto produk', required: false })
  // @IsOptional()
  // @IsString()
  // product_photo?: string;
}
