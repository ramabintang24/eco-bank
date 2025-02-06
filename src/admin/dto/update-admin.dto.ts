import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty({ example: 'Botol Aqua', description: 'Nama barang yang dijual', required: false })
  @IsOptional()
  @IsString()
  item?: string;

  @ApiProperty({ example: 'https://example.com/laptop.jpg', description: 'URL foto produk', required: false })
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
