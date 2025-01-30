import {
  IsOptional,
  IsString,
  // IsUrl,
  IsDate,
  IsEnum,
  IsPhoneNumber,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

// Define Gender enum
export enum Gender {
  Laki = 'Laki-Laki',
  Perempuan = 'Perempuan',
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    required: false,
  })
  name?: string;

  // @IsOptional()
  // @IsString() // Assuming avatar IDs are UUIDs
  // @ApiProperty({
  //   description: 'ID of the selected default avatar',
  //   example: '550e8400-e29b-41d4-a716-446655440000',
  //   required: false,
  // })
  // defaultAvatarId?: string;

  @IsOptional()
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  file?: any[];

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({
    description: 'Birth date of the user',
    example: '1990-01-01',
    required: false,
  })
  birth_date?: Date;

  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty({
    description: 'Gender of the user',
    example: Gender.Perempuan,
    required: false,
  })
  gender?: Gender;

  @IsOptional()
  @IsPhoneNumber('ID')
  @ApiProperty({
    description: 'Phone number of the user',
    example: '+6281234567890',
    required: false,
  })
  phone_number?: string;
}