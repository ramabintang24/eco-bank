import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateItemDto {
  @ApiProperty({ example: 'Laptop', description: 'Nama barang yang dijual', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 10, description: 'Jumlah unit barang yang tersedia', required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'unit harus berupa angka'})
  unit?: number;

  @ApiProperty({ example: 5000, description: 'Harga beli barang dalam rupiah', required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'purchase_price harus berupa angka'})
  purchase_price?: number;

  @ApiProperty({ example: 5000, description: 'Harga jual barang dalam rupiah', required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'selling_price harus berupa angka'})
  selling_price?: number;

  // @ApiProperty({ example: 'https://example.com/laptop.jpg', description: 'foto produk', required: false })
  // @IsOptional()
  // @IsString()
  // product_photo?: string;
}
