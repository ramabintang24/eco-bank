import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsString()
  barang?: string;

  @IsOptional()
  @IsNumber()
  harga?: number;

  @IsOptional()
  @IsNumber()
  stok?: number;
}
