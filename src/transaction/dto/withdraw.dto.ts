import { IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class WithdrawDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(5000, { message: 'Minimal tarik tunai adalah Rp5.000' })
  amount: number;

  @ApiProperty({
    example: 'Min Eco',
    description: 'Nama Admin yang Bertugas',
  })
  @IsString()
  admin_name: string;
}
