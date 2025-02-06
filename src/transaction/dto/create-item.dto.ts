import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ example: 'Laptop', description: 'Nama barang yang dijual', required: false })
  @IsOptional()
  @IsString()
  item?: string;

  @ApiProperty({ example: 'https://example.com/laptop.jpg', description: 'foto produk', required: false })
  @IsOptional()
  @IsString()
  product_photo?: string;

  @ApiProperty({ example: 5000, description: 'Harga beli barang dalam rupiah', required: false })
  @IsOptional()
  @IsNumber()
  purchase_price?: number;

  @ApiProperty({ example: 5000, description: 'Harga jual barang dalam rupiah', required: false })
  @IsOptional()
  @IsNumber()
  selling_price?: number;

  @ApiProperty({ example: 10, description: 'Jumlah unit barang yang tersedia', required: false })
  @IsOptional()
  @IsNumber()
  unit?: number;
}
