import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangeNewPasswordDto {
  @ApiProperty({
    description: 'oldPassword',
  })
  @IsNotEmpty()
  @MinLength(8)
  oldPassword: string;

  @ApiProperty({
    description: 'newPassword',
  })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
